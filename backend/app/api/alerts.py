from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from backend.app.db.mongodb import get_db
import datetime

router = APIRouter(prefix="/alerts", tags=["alerts"])

@router.get("/")
async def get_alerts(db=Depends(get_db)):
    cursor = db.alerts.find({}, {"_id": 0}).sort("created_at", -1)
    alerts = await cursor.to_list(length=100)
    return alerts

@router.post("/")
async def create_alert(alert: Dict[str, Any], db=Depends(get_db)):
    alert["alert_id"] = f"ALT-{int(datetime.datetime.now().timestamp())}"
    if "created_at" not in alert:
        alert["created_at"] = datetime.datetime.now().isoformat()
    if "resolved" not in alert:
        alert["resolved"] = False
        
    await db.alerts.insert_one(alert.copy())
    return alert

@router.put("/{alert_id}/resolve")
async def resolve_alert(alert_id: str, db=Depends(get_db)):
    result = await db.alerts.update_one(
        {"alert_id": alert_id},
        {"$set": {"resolved": True, "resolved_at": datetime.datetime.now().isoformat()}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Alert not found")
    return {"status": "resolved"}

@router.post("/seed")
async def seed_demo_alerts(db=Depends(get_db)):
    demo_alerts = [
        {
            "alert_id": "ALT-1001",
            "vehicle_id": "TRK-003",
            "type": "critical",
            "message": "High Motor Temperature (>95C) detected. Immediate service required.",
            "created_at": datetime.datetime.now().isoformat(),
            "resolved": False
        },
        {
            "alert_id": "ALT-1002",
            "vehicle_id": "TRK-002",
            "type": "attention",
            "message": "Tire pressure low on rear-left.",
            "created_at": (datetime.datetime.now() - datetime.timedelta(hours=2)).isoformat(),
            "resolved": False
        }
    ]
    await db.alerts.delete_many({})
    await db.alerts.insert_many(demo_alerts)
    return {"message": "Demo alerts seeded successfully", "count": len(demo_alerts)}
