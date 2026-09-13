"""
MissionFlow AI
Fleet Tracking WebSocket

Handles live vehicle tracking state and WebSocket connections.
"""

from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from typing import Dict, List, Optional

from fastapi import WebSocket


# ============================================================
# LIVE VEHICLE STATE
# ============================================================

@dataclass
class VehicleTrackingState:
    """
    Current live tracking information for a vehicle.

    This is tracking state only.
    Vehicle master data / CRUD remains owned by the fleet module.
    """

    vehicle_id: int
    latitude: float
    longitude: float
    route_id: Optional[int] = None
    current_stop: Optional[int] = None
    status: str = "en_route"
    eta_minutes: Optional[float] = None
    timestamp: str = ""


# ============================================================
# TRACKING STORE
# ============================================================

class FleetTracker:
    """
    In-memory store for current vehicle tracking states.
    """

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
        """
        Create or update the live state of a vehicle.
        """

        state = VehicleTrackingState(
            vehicle_id=vehicle_id,
            latitude=latitude,
            longitude=longitude,
            route_id=route_id,
            current_stop=current_stop,
            status=status,
            eta_minutes=eta_minutes,
            timestamp=datetime.now(timezone.utc).isoformat(),
        )

        self._vehicles[vehicle_id] = state

        return state

    def get_vehicle(
        self,
        vehicle_id: int,
    ) -> Optional[VehicleTrackingState]:
        """
        Return the current state of one vehicle.
        """

        return self._vehicles.get(vehicle_id)

    def get_all_vehicles(self) -> List[VehicleTrackingState]:
        """
        Return the current state of all tracked vehicles.
        """

        return list(self._vehicles.values())

    def remove_vehicle(
        self,
        vehicle_id: int,
    ) -> None:
        """
        Remove a vehicle from the live tracking store.
        """

        self._vehicles.pop(vehicle_id, None)


# ============================================================
# SHARED TRACKER
# ============================================================

fleet_tracker = FleetTracker()


# ============================================================
# SERIALIZATION
# ============================================================

def build_vehicle_update(
    vehicle: VehicleTrackingState,
) -> dict:
    """
    Convert tracking state into a WebSocket-friendly payload.
    """

    return {
        "type": "vehicle_update",
        "vehicle": asdict(vehicle),
    }


# ============================================================
# WEBSOCKET HANDLER
# ============================================================

async def fleet_tracking_websocket(
    websocket: WebSocket,
) -> None:
    """
    Handle a fleet tracking WebSocket connection.
    """

    await websocket.accept()

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