import asyncio
import websockets


async def test():
    async with websockets.connect("ws://127.0.0.1:8765") as websocket:
        print("CONNECTED")

        message = await websocket.recv()
        print("SERVER:", message)

        await websocket.send("ping")

        response = await websocket.recv()
        print("SERVER:", response)


asyncio.run(test())