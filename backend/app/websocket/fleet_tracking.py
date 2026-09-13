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

        return self._vehicles.get(vehicle_id)

    def get_all_vehicles(
        self,
    ) -> List[VehicleTrackingState]:

        return list(self._vehicles.values())

    def remove_vehicle(
        self,
        vehicle_id: int,
    ) -> None:

        self._vehicles.pop(vehicle_id, None)


# ============================================================
# SHARED TRACKER
# ============================================================

fleet_tracker = FleetTracker()


# ============================================================
# WEBSOCKET CONNECTION MANAGER
# ============================================================

class FleetConnectionManager:
    """
    Manages all currently connected fleet tracking clients.
    """

    def __init__(self) -> None:
        self.active_connections: List[WebSocket] = []

    async def connect(
        self,
        websocket: WebSocket,
    ) -> None:

        await websocket.accept()

        self.active_connections.append(websocket)

    def disconnect(
        self,
        websocket: WebSocket,
    ) -> None:

        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(
        self,
        message: dict,
    ) -> None:

        disconnected_connections = []

        for websocket in self.active_connections:
            try:
                await websocket.send_json(message)
            except Exception:
                disconnected_connections.append(websocket)

        for websocket in disconnected_connections:
            self.disconnect(websocket)


# ============================================================
# SHARED CONNECTION MANAGER
# ============================================================

fleet_connection_manager = FleetConnectionManager()


# ============================================================
# SERIALIZATION
# ============================================================

def build_vehicle_update(
    vehicle: VehicleTrackingState,
) -> dict:
    """
    Convert tracking state into a WebSocket payload.
    """

    return {
        "type": "vehicle_update",
        "vehicle": asdict(vehicle),
    }


# ============================================================
# UPDATE + BROADCAST
# ============================================================

async def update_vehicle_and_broadcast(
    vehicle_id: int,
    latitude: float,
    longitude: float,
    route_id: Optional[int] = None,
    current_stop: Optional[int] = None,
    status: str = "en_route",
    eta_minutes: Optional[float] = None,
) -> VehicleTrackingState:
    """
    Update a vehicle's live state and broadcast it
    to all connected fleet tracking clients.
    """

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


# ============================================================
# WEBSOCKET HANDLER
# ============================================================

async def fleet_tracking_websocket(
    websocket: WebSocket,
) -> None:
    """
    Handle a fleet tracking WebSocket connection.
    """

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