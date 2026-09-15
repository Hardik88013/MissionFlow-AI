import asyncio
import websockets


async def handler(websocket):
    print("CLIENT CONNECTED")

    await websocket.send("hello from debug server")

    message = await websocket.recv()
    print("RECEIVED:", message)

    await websocket.send("ACK: " + message)


async def main():
    async with websockets.serve(handler, "127.0.0.1", 8765):
        print("DEBUG WS SERVER RUNNING ON 8765")
        await asyncio.Future()


asyncio.run(main())