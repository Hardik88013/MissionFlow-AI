from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any

router = APIRouter(prefix="/alerts", tags=["alerts"])

mock_alerts = {
    "A-001": {"alert_id": "A-001", "vehicle_id": "V-123", "type": "critical", "message": "Engine overheating"},
    "A-002": {"alert_id": "A-002", "vehicle_id": "V-124", "type": "warning", "message": "Maintenance required soon"}
}

@router.get("/")
def get_alerts():
    return list(mock_alerts.values())

@router.get("/{alert_id}")
def get_alert(alert_id: str):
    if alert_id not in mock_alerts:
        raise HTTPException(status_code=404, detail="Alert not found")
    return mock_alerts[alert_id]
