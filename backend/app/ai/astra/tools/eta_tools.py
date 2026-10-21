from typing import Any, Dict

from backend.app.websocket.fleet_tracking import predict_eta


def predict_delivery_eta() -> Dict[str, Any]:
    """Run the existing MissionFlow ETA model."""
    eta = predict_eta(
        10.8510,
        76.2720,
        10.9010,
        76.3220,
    )

    return {
        "predicted_eta_minutes": round(float(eta), 1)
    }
