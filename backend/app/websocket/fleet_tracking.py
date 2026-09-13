"""
MissionFlow AI
Fleet Tracking WebSocket
"""

from fastapi import WebSocket


async def fleet_tracking_websocket(websocket: WebSocket):
    """
    Handle live fleet tracking WebSocket connections.
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