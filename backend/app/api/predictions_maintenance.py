from fastapi import APIRouter
from typing import Dict, Any
import os
import pickle
import numpy as np
import pandas as pd
from datetime import datetime
from app.db.mongodb import db

router = APIRouter(prefix="/predictions/maintenance", tags=["predictions"])

# Use the temporal model
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'ml', 'artifacts', 'maintenance_model', 'temporal_ev_model.pkl')
model = None

# Features required by the temporal model
EXPECTED_FEATURES = [
    "SoC", "SoH", "Battery_Voltage", "Battery_Current", "Battery_Temperature", 
    "Charge_Cycles", "Motor_Temperature", "Motor_Vibration", "Motor_Torque", 
    "Motor_RPM", "Power_Consumption", "Brake_Pad_Wear", "Brake_Pressure", 
    "Reg_Brake_Efficiency", "Tire_Pressure", "Tire_Temperature", "Suspension_Load", 
    "Ambient_Temperature", "Ambient_Humidity", "Load_Weight", "Driving_Speed", 
    "Distance_Traveled", "Idle_Time", "Route_Roughness", "Temp_Ratio", 
    "Power_Demand", "Vibration_RPM", 
    "Tire_Pressure_rolling_mean_1h", "Tire_Pressure_rolling_std_1h", "Tire_Pressure_trend_2h", "Tire_Pressure_lag_1", "Tire_Pressure_lag_4", 
    "Battery_Temperature_rolling_mean_1h", "Battery_Temperature_rolling_std_1h", "Battery_Temperature_trend_2h", "Battery_Temperature_lag_1", "Battery_Temperature_lag_4", 
    "Motor_Temperature_rolling_mean_1h", "Motor_Temperature_rolling_std_1h", "Motor_Temperature_trend_2h", "Motor_Temperature_lag_1", "Motor_Temperature_lag_4", 
    "Motor_Vibration_rolling_mean_1h", "Motor_Vibration_rolling_std_1h", "Motor_Vibration_trend_2h", "Motor_Vibration_lag_1", "Motor_Vibration_lag_4"
]

def load_model():
    global model
    if os.path.exists(MODEL_PATH):
        with open(MODEL_PATH, 'rb') as f:
            model = pickle.load(f)

@router.post("/")
async def predict_maintenance(features: Dict[str, Any]):
    if model is None:
        load_model()
    
    if model is None:
        return {"error": "Temporal model not found.", "risk_level": "unknown", "health_score": 50}
    
    try:
        vehicle_id = features.get("vehicle_id", "UNKNOWN_VEHICLE")
        
        # 1. Prepare Telemetry Record
        record = {**features}
        record["timestamp"] = datetime.utcnow()
        record["vehicle_id"] = vehicle_id
        
        # Insert into MongoDB
        await db.telemetry.insert_one(record)
        
        # 2. Fetch Historical Telemetry (Last 8 records for 2h trend / lag 4 / window 4)
        # We need up to 9 records actually to get a lag of 8 if we were doing lag 8, but we only need lag 4 and shift 8.
        # Wait, trend_2h is shift(8), so we need the last 9 records (current + 8 historical).
        cursor = db.telemetry.find({"vehicle_id": vehicle_id}).sort("timestamp", -1).limit(9)
        history = await cursor.to_list(length=9)
        
        # Sort chronologically (oldest to newest)
        history.reverse()
        
        # Convert to DataFrame to calculate pandas rolling/shift features easily
        df = pd.DataFrame(history)
        
        # Ensure base columns exist
        base_cols = [
            "SoC", "SoH", "Battery_Voltage", "Battery_Current", "Battery_Temperature", 
            "Charge_Cycles", "Motor_Temperature", "Motor_Vibration", "Motor_Torque", 
            "Motor_RPM", "Power_Consumption", "Brake_Pad_Wear", "Brake_Pressure", 
            "Reg_Brake_Efficiency", "Tire_Pressure", "Tire_Temperature", "Suspension_Load", 
            "Ambient_Temperature", "Ambient_Humidity", "Load_Weight", "Driving_Speed", 
            "Distance_Traveled", "Idle_Time", "Route_Roughness"
        ]
        
        for c in base_cols:
            if c not in df.columns:
                df[c] = features.get(c, 0.0)
                
        # 3. Base Engineered Features
        df['Temp_Ratio'] = df['Motor_Temperature'] / (df['Battery_Temperature'] + 1e-5)
        df['Power_Demand'] = df['Driving_Speed'] * df['SoC']
        df['Vibration_RPM'] = df['Motor_Vibration'] * df['Motor_RPM']
        
        # 4. Temporal Engineered Features
        rolling_vars = ['Tire_Pressure', 'Battery_Temperature', 'Motor_Temperature', 'Motor_Vibration']
        for var in rolling_vars:
            df[f'{var}_rolling_mean_1h'] = df[var].rolling(window=4, min_periods=1).mean()
            df[f'{var}_rolling_std_1h'] = df[var].rolling(window=4, min_periods=1).std().fillna(0)
            df[f'{var}_trend_2h'] = df[var] - df[var].shift(8).fillna(df[var])
            df[f'{var}_lag_1'] = df[var].shift(1).fillna(df[var])
            df[f'{var}_lag_4'] = df[var].shift(4).fillna(df[var])
            
        # Get the latest row for inference
        latest_row = df.iloc[-1]
        
        # Construct feature array in exact order
        input_data = np.array([[float(latest_row.get(f, 0.0)) for f in EXPECTED_FEATURES]])
        
        # 5. Prediction
        prob = model.predict_proba(input_data)[0]
        failure_risk = prob[1]
        health_score = max(0, min(100, 100 - (failure_risk * 100)))
        
        # Our optimal threshold from Phase 3 was 0.10
        status = "HEALTHY"
        if failure_risk >= 0.10:
            status = "CRITICAL"
        elif failure_risk >= 0.07:
            status = "HIGH RISK"
        elif failure_risk >= 0.04:
            status = "ATTENTION"
            
        return {
            "vehicle_id": vehicle_id,
            "prediction": int(failure_risk >= 0.10),
            "failure_probability": float(failure_risk),
            "health_score": float(health_score),
            "risk_level": status,
            "model_version": "v3.0-Temporal",
            "historical_data_points_used": len(df)
        }
    except Exception as e:
        return {"error": str(e), "risk_level": "unknown", "health_score": 50}
