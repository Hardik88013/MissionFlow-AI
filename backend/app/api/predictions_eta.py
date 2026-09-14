"""
MissionFlow AI
ETA Prediction API
"""

from fastapi import APIRouter, HTTPException

from backend.app.schemas.prediction_eta import (
    ETAPredictionRequest,
    ETAPredictionResponse,
)
from backend.app.services.eta_prediction_service import (
    eta_prediction_service,
)


router = APIRouter(
    prefix="/predictions",
    tags=["ETA Predictions"],
)


@router.post(
    "/eta",
    response_model=ETAPredictionResponse,
)
def predict_eta(
    request: ETAPredictionRequest,
) -> ETAPredictionResponse:
    """Predict ETA for a trip."""

    try:
        features = request.model_dump()

        predicted_eta = (
            eta_prediction_service.predict_eta(features)
        )

        return ETAPredictionResponse(
            predicted_eta_minutes=round(
                predicted_eta,
                2,
            )
        )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"ETA prediction failed: {str(exc)}",
        )
