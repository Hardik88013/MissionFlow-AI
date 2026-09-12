from fastapi import APIRouter
from typing import Dict, Any
import os
import pickle
import json
import numpy as np
import pandas as pd
from datetime import datetime
from app.db.mongodb import db

router = APIRouter(prefix="/predictions/maintenance", tags=["predictions"])

# Path for models
BASE_DIR = os.path.dirname(__file__)
OLD_MODEL_PATH = os.path.join(BASE_DIR, '..', '..', '..', 'ml', 'artifacts', 'maintenance_model', 'temporal_ev_model.pkl')
CMAPSS_MODEL_PATH = os.path.join(BASE_DIR, '..', '..', '..', 'ml', 'artifacts', 'maintenance_model', 'cmapss', 'cmapss_xgb_model.pkl')
CMAPSS_META_PATH = os.path.join(BASE_DIR, '..', '..', '..', 'ml', 'artifacts', 'maintenance_model', 'cmapss', 'cmapss_model_metadata.json')

models = {"ev": None, "cmapss": None}
cmapss_features = []

def load_models():
    if os.path.exists(OLD_MODEL_PATH):
        with open(OLD_MODEL_PATH, 'rb') as f:
            models["ev"] = pickle.load(f)
            
    if os.path.exists(CMAPSS_MODEL_PATH) and os.path.exists(CMAPSS_META_PATH):
        with open(CMAPSS_MODEL_PATH, 'rb') as f:
            models["cmapss"] = pickle.load(f)
        with open(CMAPSS_META_PATH, 'r') as f:
            meta = json.load(f)
            global cmapss_features
            cmapss_features = meta.get("features", [])

@router.post("/")
async def predict_maintenance(features: Dict[str, Any]):
    if models["ev"] is None or models["cmapss"] is None:
        load_models()
        
    mode = features.get("mode", "auto")
    
    # Auto-detect mode
    if mode == "auto":
        if "s2" in features or "setting1" in features:
            mode = "cmapss_benchmark"
        else:
            mode = "fleet_simulation"
            
    vehicle_id = features.get("vehicle_id", features.get("engine_id", "UNKNOWN"))
    
    if mode == "cmapss_benchmark":
        if models["cmapss"] is None:
            return {"error": "CMAPSS benchmark model not found."}
            
        record = {**features}
        record["timestamp"] = datetime.utcnow()
        record["engine_id"] = vehicle_id
        await db.cmapss_telemetry.insert_one(record)
        
        # Need up to 6 records for a 5-window lag and trend
        cursor = db.cmapss_telemetry.find({"engine_id": vehicle_id}).sort("timestamp", -1).limit(6)
        history = await cursor.to_list(length=6)
        history.reverse()
        df = pd.DataFrame(history)
        
        # Engineer CMAPSS features dynamically
        sensors = ['s2', 's3', 's4', 's7', 's8', 's9', 's11', 's12', 's13', 's14', 's15', 's17', 's20', 's21']
        for s in sensors:
            if s not in df.columns:
                df[s] = features.get(s, 0.0)
            df[f'{s}_lag1'] = df[s].shift(1).fillna(df[s])
            df[f'{s}_rmean5'] = df[s].rolling(window=5, min_periods=1).mean()
            df[f'{s}_rstd5'] = df[s].rolling(window=5, min_periods=1).std().fillna(0)
            df[f'{s}_trend5'] = df[s] - df[s].shift(5).fillna(df[s])
            
        latest_row = df.iloc[-1]
        input_data = np.array([[float(latest_row.get(f, 0.0)) for f in cmapss_features]])
        
        rul_pred = models["cmapss"].predict(input_data)[0]
        rul_pred = max(0.0, float(rul_pred))
        
        # Risk thresholds (30 was our trained classifier horizon)
        risk_level = "HEALTHY"
        if rul_pred <= 30:
            risk_level = "CRITICAL"
        elif rul_pred <= 50:
            risk_level = "HIGH RISK"
        elif rul_pred <= 80:
            risk_level = "ATTENTION"
            
        # Simulated health score 0-100 based on RUL capping at 150
        health_score = max(0.0, min(100.0, (rul_pred / 150.0) * 100))
        
        return {
            "asset_id": vehicle_id,
            "predicted_rul": float(rul_pred),
            "health_score": float(health_score),`n            "failure_probability": 1.0 - min(1.0, float(rul_pred)/100.0),`n            "prediction": int(rul_pred <= 30),
            "risk_level": risk_level,
            "model_version": "maintenance_cmapss_v3",
            "prediction_timestamp": datetime.utcnow().isoformat(),
            "domain_note": "Aero-engine benchmark (C-MAPSS)"
        }
    else:
        # Fallback to EVIoT simulated prediction (Retired model)
        if models["ev"] is None:
             return {"error": "Temporal EV model not found."}
             
        # ... logic for EV model (abbreviated for size, just returning a static fallback since it's retired)
        return {
            "asset_id": vehicle_id,
            "error": "The EVIoT dataset has been officially RETIRED due to lack of predictive signal. Please use mode='cmapss_benchmark' for valid predictive maintenance API calls, or await real fleet telemetry integration.",
            "health_score": 50,
            "risk_level": "UNKNOWN"
        }

