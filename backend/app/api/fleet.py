from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any

router = APIRouter(prefix="/fleet", tags=["fleet"])

# Mock DB for now, since we need to write the service layer next
mock_fleet = {}

@router.get("/")
def get_fleet():
    return list(mock_fleet.values())

@router.get("/{vehicle_id}")
def get_vehicle(vehicle_id: str):
    if vehicle_id not in mock_fleet:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return mock_fleet[vehicle_id]

@router.post("/")
def create_vehicle(vehicle: Dict[str, Any]):
    vid = vehicle.get("vehicle_id", f"V-{len(mock_fleet)+1}")
    vehicle["vehicle_id"] = vid
    mock_fleet[vid] = vehicle
    return vehicle

@router.put("/{vehicle_id}")
def update_vehicle(vehicle_id: str, vehicle: Dict[str, Any]):
    if vehicle_id not in mock_fleet:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    mock_fleet[vehicle_id].update(vehicle)
    return mock_fleet[vehicle_id]

@router.delete("/{vehicle_id}")
def delete_vehicle(vehicle_id: str):
    if vehicle_id in mock_fleet:
        del mock_fleet[vehicle_id]
        return {"status": "deleted"}
    raise HTTPException(status_code=404, detail="Vehicle not found")
