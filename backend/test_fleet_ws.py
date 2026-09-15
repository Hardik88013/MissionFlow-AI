from fastapi.testclient import TestClient

from backend.app.main import app


client = TestClient(app)


def test_fleet_websocket():
    with client.websocket_connect("/ws/fleet") as websocket:
        print("CONNECTED TO FLEET TRACKING")

        message = websocket.receive_json()

        print("RECEIVED:")
        print(message)


if __name__ == "__main__":
    test_fleet_websocket()