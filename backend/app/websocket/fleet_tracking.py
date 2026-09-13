"""
MissionFlow AI
Fleet Tracking WebSocket

Provides live vehicle and route updates to the frontend.
This layer consumes vehicle/route information and does not
manage vehicle master data or CRUD operations.
"""

from datetime import datetime, timezone
from typing import Dict, List

from fastapi import WebSocket, WebSocketDisconnect


class FleetTracker:
    """
    Manages active WebSocket connections and broadcasts
    live fleet tracking updates.
    """

    def __init__(self) -> None:
        self.connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        self.connections.append(websocket)

    def disconnect(self, websocket: WebSocket) -> None:
        if websocket in self.connections:
            self.connections.remove(websocket)

    async def broadcast(self, update: Dict) -> None:
        disconnected: List[WebSocket] = []

        for websocket in self.connections:
            try:
                await websocket.send_json(update)
            except Exception:
                disconnected.append(websocket)

        for websocket in disconnected:
            self.disconnect(websocket)


fleet_tracker = FleetTracker()


def build_vehicle_update(
    vehicle_id: int,
    latitude: float,
    longitude: float,
    route: List[int],
    current_stop: int | None,
    route_status: str,
    eta_minutes: float | None = None,
) -> Dict:
    """
    Build a standardized live vehicle tracking update.
    """

    return {
        "vehicle_id": vehicle_id,
        "position": {
            "latitude": latitude,
            "longitude": longitude,
        },
        "route": route,
        "current_stop": current_stop,
        "route_status": route_status,
        "eta_minutes": eta_minutes,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


async def fleet_tracking_websocket(websocket: WebSocket) -> None:
    """
    WebSocket endpoint for live fleet tracking updates.
    """

    await fleet_tracker.connect(websocket)

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

    except WebSocketDisconnect:
        pass

    finally:
        fleet_tracker.disconnect(websocket)