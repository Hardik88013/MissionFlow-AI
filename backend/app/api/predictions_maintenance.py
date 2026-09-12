from fastapi import APIRouter
from typing import Dict, Any
import os
import pickle
import numpy as np

router = APIRouter(prefix="/predictions/maintenance", tags=["predictions"])

MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'ml', 'artifacts', 'maintenance_model', 'ev_model.pkl')
model = None

def load_model():
    global model
    if os.path.exists(MODEL_PATH):
        with open(MODEL_PATH, 'rb') as f:
            model = pickle.load(f)

@router.post("/")
def predict_maintenance(features: Dict[str, float]):
    if model is None:
        load_model()
    
    if model is None:
        return {"error": "Model not found. Please train the model first.", "risk_level": "unknown", "health_score": 50}
    
    try:
        input_data = np.array([[
            features.get("SoC", 0.8),
            features.get("Battery_Voltage", 400.0),
            features.get("Battery_Temperature", 30.0),
            features.get("Motor_Temperature", 60.0),
            features.get("Motor_Vibration", 0.1),
            features.get("Motor_RPM", 2000.0),
            features.get("Tire_Pressure", 32.0),
            features.get("Driving_Speed", 60.0)
        ]])
        
        prob = model.predict_proba(input_data)[0]
        failure_risk = prob[1] # probability of class 1 (needs maintenance)
        health_score = 100 - (failure_risk * 100)
        
        status = "HEALTHY"
        if failure_risk > 0.6:
            status = "CRITICAL"
        elif failure_risk > 0.3:
            status = "ATTENTION"
        elif failure_risk > 0.15:
            status = "HIGH RISK"
            
        return {
            "vehicle_id": features.get("vehicle_id", "UNKNOWN"),
            "prediction": int(model.predict(input_data)[0]),
            "failure_probability": float(failure_risk),
            "health_score": float(health_score),
            "risk_level": status,
            "model_version": "v2.0-RF-EVIoT"
        }
    except Exception as e:
        return {"error": str(e), "risk_level": "unknown", "health_score": 50}
