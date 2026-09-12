from fastapi import APIRouter
from typing import Dict, Any
import os
import pickle
import numpy as np

router = APIRouter(prefix="/predictions/maintenance", tags=["predictions"])

MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'ml', 'artifacts', 'maintenance_model', 'model.pkl')
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
        return {"error": "Model not found. Please train the model first.", "risk": "unknown", "health_score": 50}
    
    # Expected features: air_temperature, process_temperature, rotational_speed, torque, tool_wear
    try:
        input_data = np.array([[
            features.get("air_temperature", 298.1),
            features.get("process_temperature", 308.6),
            features.get("rotational_speed", 1551.0),
            features.get("torque", 42.8),
            features.get("tool_wear", 0.0)
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
            "model_version": "v1.0-RF-AI4I"
        }
    except Exception as e:
        return {"error": str(e), "risk_level": "unknown", "health_score": 50}
