"""
MissionFlow AI
Fleet Tracking WebSocket

Handles live vehicle tracking state and ML-based ETA updates.
"""

import asyncio
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from math import asin, cos, radians, sin, sqrt
from pathlib import Path
from typing import Dict, List, Optional

import joblib
import pandas as pd
from fastapi import WebSocket


# ---------------------------------------------------------------------------
# ETA MODEL
# ---------------------------------------------------------------------------

MODEL_PATH = (
    Path(__file__).resolve().parents[3]
    / "ml"
    / "artifacts"
    / "eta_model"
    / "eta_model.joblib"
)

eta_model = joblib.load(MODEL_PATH)


# ---------------------------------------------------------------------------
# TRACKING STATE
# ---------------------------------------------------------------------------

@dataclass
class VehicleTrackingState:
    vehicle_id: int
    latitude: float
    longitude: float
    route_id: Optional[int] = None
    current_stop: Optional[int] = None
    status: str = "en_route"
    eta_minutes: Optional[float] = None
    timestamp: str = ""


class FleetTracker:
    def __init__(self) -> None:
        self._vehicles: Dict[int, VehicleTrackingState] = {}

    def update_vehicle(
        self,
        vehicle_id: int,
        latitude: float,
        longitude: float,
        route_id: Optional[int] = None,
        current_stop: Optional[int] = None,
        status: str = "en_route",
        eta_minutes: Optional[float] = None,
    ) -> VehicleTrackingState:

        vehicle = VehicleTrackingState(
            vehicle_id=vehicle_id,
            latitude=latitude,
            longitude=longitude,
            route_id=route_id,
            current_stop=current_stop,
            status=status,
            eta_minutes=eta_minutes,
            timestamp=datetime.now(timezone.utc).isoformat(),
        )

        self._vehicles[vehicle_id] = vehicle

        return vehicle

    def get_vehicle(
        self,
        vehicle_id: int,
    ) -> Optional[VehicleTrackingState]:

        return self._vehicles.get(vehicle_id)

    def get_all_vehicles(self) -> List[VehicleTrackingState]:
        return list(self._vehicles.values())

    def remove_vehicle(self, vehicle_id: int) -> None:
        self._vehicles.pop(vehicle_id, None)


fleet_tracker = FleetTracker()


# ---------------------------------------------------------------------------
# CONNECTION MANAGER
# ---------------------------------------------------------------------------

class FleetConnectionManager:
    def __init__(self) -> None:
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket) -> None:
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict) -> None:

        disconnected: List[WebSocket] = []

        for websocket in self.active_connections:

            try:
                await websocket.send_json(message)

            except Exception:
                disconnected.append(websocket)

        for websocket in disconnected:
            self.disconnect(websocket)


fleet_connection_manager = FleetConnectionManager()


# ---------------------------------------------------------------------------
# DISTANCE / ETA HELPERS
# ---------------------------------------------------------------------------

def haversine_distance_km(
    origin_latitude: float,
    origin_longitude: float,
    destination_latitude: float,
    destination_longitude: float,
) -> float:

    lat1 = radians(origin_latitude)
    lon1 = radians(origin_longitude)

    lat2 = radians(destination_latitude)
    lon2 = radians(destination_longitude)

    delta_lat = lat2 - lat1
    delta_lon = lon2 - lon1

    a = (
        sin(delta_lat / 2) ** 2
        + cos(lat1)
        * cos(lat2)
        * sin(delta_lon / 2) ** 2
    )

    c = 2 * asin(sqrt(a))

    earth_radius_km = 6371.0088

    return earth_radius_km * c


def predict_eta(
    start_latitude: float,
    start_longitude: float,
    end_latitude: float,
    end_longitude: float,
) -> float:

    distance_km = haversine_distance_km(
        start_latitude,
        start_longitude,
        end_latitude,
        end_longitude,
    )

    now = datetime.now()

    hour = now.hour
    day_of_week = now.weekday()
    is_weekend = int(day_of_week >= 5)

    features = pd.DataFrame(
        [
            {
                "straight_line_distance_km": distance_km,
                "start_longitude": start_longitude,
                "start_latitude": start_latitude,
                "end_longitude": end_longitude,
                "end_latitude": end_latitude,
                "hour": hour,
                "day_of_week": day_of_week,
                "is_weekend": is_weekend,
                "CALL_TYPE": "Other",
                "ORIGIN_STAND": 0,
            }
        ]
    )

    prediction = eta_model.predict(features)[0]

    # Round ETA to one decimal place for clean dashboard display.
    return round(max(0.0, float(prediction)), 1)


# ---------------------------------------------------------------------------
# WEBSOCKET MESSAGE
# ---------------------------------------------------------------------------

def build_vehicle_update(
    vehicle: VehicleTrackingState,
) -> dict:

    return {
        "type": "vehicle_update",
        "vehicle": asdict(vehicle),
    }


async def update_vehicle_and_broadcast(
    vehicle_id: int,
    latitude: float,
    longitude: float,
    route_id: Optional[int] = None,
    current_stop: Optional[int] = None,
    status: str = "en_route",
    eta_minutes: Optional[float] = None,
) -> VehicleTrackingState:

    vehicle = fleet_tracker.update_vehicle(
        vehicle_id=vehicle_id,
        latitude=latitude,
        longitude=longitude,
        route_id=route_id,
        current_stop=current_stop,
        status=status,
        eta_minutes=eta_minutes,
    )

    message = build_vehicle_update(vehicle)

    await fleet_connection_manager.broadcast(message)

    return vehicle


# ---------------------------------------------------------------------------
# DEMO VEHICLE
# ---------------------------------------------------------------------------

async def demo_vehicle_broadcaster() -> None:
    """
    Simulates a vehicle moving toward a destination.

    The vehicle position is simulated, but ETA is calculated
    using the trained MissionFlow ETA model.
    """

    latitude = 10.8510
    longitude = 76.2720

    destination_latitude = 10.9010
    destination_longitude = 76.3220

    current_stop = 3

    while True:

        if fleet_connection_manager.active_connections:

            eta_minutes = predict_eta(
                start_latitude=latitude,
                start_longitude=longitude,
                end_latitude=destination_latitude,
                end_longitude=destination_longitude,
            )

            await update_vehicle_and_broadcast(
                vehicle_id=101,
                latitude=latitude,
                longitude=longitude,
                route_id=5,
                current_stop=current_stop,
                status="en_route",
                eta_minutes=eta_minutes,
            )

            # Move vehicle toward destination.
            latitude += 0.00025
            longitude += 0.00025

            # Once destination is reached, start a new stop.
            if (
                latitude >= destination_latitude
                or longitude >= destination_longitude
            ):
                latitude = 10.8510
                longitude = 76.2720
                current_stop += 1

                if current_stop > 6:
                    current_stop = 1

        await asyncio.sleep(3)


# ---------------------------------------------------------------------------
# WEBSOCKET ENDPOINT
# ---------------------------------------------------------------------------

async def fleet_tracking_websocket(
    websocket: WebSocket,
) -> None:

    await fleet_connection_manager.connect(websocket)

    try:

        await websocket.send_json(
            {
                "type": "connection",
                "status": "connected",
            }
        )

        while True:

            message = await websocket.receive_text()

            await websocket.send_json(
                {
                    "type": "ack",
                    "message": message,
                }
            )

    finally:

        fleet_connection_manager.disconnect(websocket)