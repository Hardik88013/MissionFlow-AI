from fastapi import FastAPI, WebSocket

app = FastAPI()


@app.websocket("/test")
async def websocket_test(websocket: WebSocket):
    await websocket.accept()

    await websocket.send_text("hello from FastAPI")

    message = await websocket.receive_text()

    await websocket.send_text("ACK: " + message)