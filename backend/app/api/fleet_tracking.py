"""
MissionFlow AI
Fleet Tracking API
"""

from typing import Optional

from fastapi import APIRouter
from pydantic import BaseModel, Field

from backend.app.websocket.fleet_tracking import (
    update_vehicle_and_broadcast,
)


router = APIRouter(
    prefix="/fleet/tracking",
    tags=["Fleet Tracking"],
)


class VehicleTrackingUpdate(BaseModel):
    vehicle_id: int = Field(..., gt=0)
    latitude: float
    longitude: float
    route_id: Optional[int] = None
    current_stop: Optional[int] = None
    status: str = "en_route"
    eta_minutes: Optional[float] = None


@router.post("/update")
async def update_vehicle_tracking(
    update: VehicleTrackingUpdate,
):
    vehicle = await update_vehicle_and_broadcast(
        vehicle_id=update.vehicle_id,
        latitude=update.latitude,
        longitude=update.longitude,
        route_id=update.route_id,
        current_stop=update.current_stop,
        status=update.status,
        eta_minutes=update.eta_minutes,
    )

    return {
        "status": "updated",
        "vehicle": {
            "vehicle_id": vehicle.vehicle_id,
            "latitude": vehicle.latitude,
            "longitude": vehicle.longitude,
            "route_id": vehicle.route_id,
            "current_stop": vehicle.current_stop,
            "status": vehicle.status,
            "eta_minutes": vehicle.eta_minutes,
            "timestamp": vehicle.timestamp,
        },
    }