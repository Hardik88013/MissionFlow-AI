from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from app.db.mongodb import get_db

router = APIRouter(prefix="/fleet", tags=["fleet"])

@router.get("/")
async def get_fleet(db=Depends(get_db)):
    cursor = db.fleet.find({}, {"_id": 0})
    fleet = await cursor.to_list(length=1000)
    return fleet

@router.get("/{vehicle_id}")
async def get_vehicle(vehicle_id: str, db=Depends(get_db)):
    vehicle = await db.fleet.find_one({"vehicle_id": vehicle_id}, {"_id": 0})
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return vehicle

@router.post("/")
async def create_vehicle(vehicle: Dict[str, Any], db=Depends(get_db)):
    if "vehicle_id" not in vehicle:
        count = await db.fleet.count_documents({})
        vehicle["vehicle_id"] = f"TRK-{count+1:03d}"
    
    # Check if exists
    existing = await db.fleet.find_one({"vehicle_id": vehicle["vehicle_id"]})
    if existing:
        raise HTTPException(status_code=400, detail="Vehicle already exists")
        
    # Default stats
    if "status" not in vehicle:
        vehicle["status"] = "healthy"
    if "health_score" not in vehicle:
        vehicle["health_score"] = 100.0
        
    await db.fleet.insert_one(vehicle.copy())
    return vehicle

@router.put("/{vehicle_id}")
async def update_vehicle(vehicle_id: str, vehicle: Dict[str, Any], db=Depends(get_db)):
    result = await db.fleet.update_one(
        {"vehicle_id": vehicle_id},
        {"$set": vehicle}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Vehicle not found")
        
    updated = await db.fleet.find_one({"vehicle_id": vehicle_id}, {"_id": 0})
    return updated

@router.delete("/{vehicle_id}")
async def delete_vehicle(vehicle_id: str, db=Depends(get_db)):
    result = await db.fleet.delete_one({"vehicle_id": vehicle_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return {"status": "deleted"}

@router.post("/seed")
async def seed_demo_fleet(db=Depends(get_db)):
    demo_fleet = [
        {"vehicle_id": "TRK-001", "type": "Electric Truck", "mileage": 12050, "status": "healthy", "health_score": 98},
        {"vehicle_id": "TRK-002", "type": "Electric Truck", "mileage": 48200, "status": "attention", "health_score": 76},
        {"vehicle_id": "TRK-003", "type": "Electric Truck", "mileage": 89000, "status": "critical", "health_score": 42},
        {"vehicle_id": "EV-104", "type": "Delivery Van", "mileage": 5200, "status": "healthy", "health_score": 100},
    ]
    
    await db.fleet.delete_many({}) # Clear old demo data
    await db.fleet.insert_many(demo_fleet)
    return {"message": "Demo fleet seeded successfully", "count": len(demo_fleet)}
