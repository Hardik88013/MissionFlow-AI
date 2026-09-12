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
    
    # Expected features: mileage, vehicle_age_years, service_history_count, engine_hours
    try:
        input_data = np.array([[
            features.get("mileage", 50000),
            features.get("vehicle_age_years", 3.5),
            features.get("service_history_count", 5),
            features.get("engine_hours", 1500)
        ]])
        
        prob = model.predict_proba(input_data)[0]
        failure_risk = prob[1] # probability of class 1 (needs maintenance)
        health_score = 100 - (failure_risk * 100)
        
        status = "healthy"
        if failure_risk > 0.6:
            status = "critical"
        elif failure_risk > 0.3:
            status = "attention"
            
        return {
            "prediction": int(model.predict(input_data)[0]),
            "failure_risk": float(failure_risk),
            "health_score": float(health_score),
            "status": status
        }
    except Exception as e:
        return {"error": str(e), "risk": "unknown", "health_score": 50}
