import pytest
from httpx import AsyncClient, ASGITransport
from fastapi import FastAPI
from backend.app.api.fleet import router as fleet_router
from backend.app.api.alerts import router as alerts_router
from backend.app.api.predictions_maintenance import router as pred_router
from backend.app.db.mongodb import client, db

app = FastAPI()
app.include_router(fleet_router)
app.include_router(alerts_router)
app.include_router(pred_router)
transport = ASGITransport(app=app)

@pytest.mark.asyncio
async def test_fleet_crud():
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Create
        res = await ac.post("/fleet/", json={"type": "Electric Truck", "mileage": 100})
        assert res.status_code == 200
        data = res.json()
        assert "vehicle_id" in data
        vid = data["vehicle_id"]

        # Get
        res = await ac.get(f"/fleet/{vid}")
        assert res.status_code == 200
        assert res.json()["vehicle_id"] == vid

        # Get All
        res = await ac.get("/fleet/")
        assert res.status_code == 200
        assert len(res.json()) >= 1

        # Update
        res = await ac.put(f"/fleet/{vid}", json={"mileage": 500})
        assert res.status_code == 200
        assert res.json()["mileage"] == 500

        # Duplicate handling
        res = await ac.post("/fleet/", json={"vehicle_id": vid})
        assert res.status_code == 400

        # Delete
        res = await ac.delete(f"/fleet/{vid}")
        assert res.status_code == 200

        # Not found
        res = await ac.get(f"/fleet/{vid}")
        assert res.status_code == 404

@pytest.mark.asyncio
async def test_alerts():
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Create
        res = await ac.post("/alerts/", json={"vehicle_id": "TRK-001", "type": "critical", "message": "Test alert"})
        assert res.status_code == 200
        data = res.json()
        assert "alert_id" in data
        aid = data["alert_id"]
        assert data["resolved"] is False

        # Get All
        res = await ac.get("/alerts/")
        assert res.status_code == 200
        assert len(res.json()) >= 1

        # Resolve
        res = await ac.put(f"/alerts/{aid}/resolve")
        assert res.status_code == 200

@pytest.mark.asyncio
async def test_predictions():
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.post("/predictions/maintenance/", json={
            "SoC": 0.8,
            "Motor_Temperature": 95.0,
            "Motor_Vibration": 1.5,
        })
        assert res.status_code == 200
        data = res.json()
        assert "health_score" in data
        assert "failure_probability" in data
        assert "risk_level" in data
