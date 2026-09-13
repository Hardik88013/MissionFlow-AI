import asyncio
import websockets


async def test():
    async with websockets.connect(
        "ws://127.0.0.1:8000/ws/fleet",
        origin="http://localhost:5174",
    ) as websocket:
        print("CONNECTED TO FLEET TRACKING")

        connection_message = await websocket.recv()
        print("SERVER:")
        print(connection_message)

        await websocket.send("ping")

        response = await websocket.recv()
        print("SERVER RESPONSE:")
        print(response)


asyncio.run(test())