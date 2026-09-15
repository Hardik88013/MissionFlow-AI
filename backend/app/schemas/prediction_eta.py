"""
MissionFlow AI
ETA Prediction API Schemas
"""

from typing import Optional

from pydantic import BaseModel, Field


class ETAPredictionRequest(BaseModel):
    """Input features required for ETA prediction."""

    straight_line_distance_km: float = Field(
        ...,
        ge=0,
        description="Straight-line distance between origin and destination.",
    )

    start_longitude: float
    start_latitude: float

    end_longitude: float
    end_latitude: float

    hour: int = Field(
        ...,
        ge=0,
        le=23,
    )

    day_of_week: int = Field(
        ...,
        ge=0,
        le=6,
    )

    is_weekend: int = Field(
        ...,
        ge=0,
        le=1,
    )

    CALL_TYPE: str

    ORIGIN_STAND: Optional[float] = None


class ETAPredictionResponse(BaseModel):
    """ETA prediction returned by the API."""

    predicted_eta_minutes: float
