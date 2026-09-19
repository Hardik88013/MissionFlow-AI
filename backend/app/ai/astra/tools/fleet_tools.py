"""Fleet live data tools for Astra AI."""

from typing import Any, Dict, List, Optional


# This would typically come from a shared state or database
# For now, we'll use a mock structure that can be replaced
# with real backend data access
_FLEET_STATE: Dict[str, Any] = {
    "vehicles": []
}


def set_fleet_state(vehicles: List[Dict[str, Any]]) -> None:
    """Update the fleet state with current vehicle data."""
    _FLEET_STATE["vehicles"] = vehicles


def get_live_fleet_state() -> Dict[str, Any]:
    """
    Get current fleet state with all vehicles.
    
    Returns:
        Dictionary with vehicles list containing:
        - vehicle_id: int
        - latitude: float
        - longitude: float
        - route_id: int or None
        - current_stop: int
        - status: str (en_route, at_base, delayed, etc)
        - eta_minutes: float or None
        - timestamp: str (ISO format)
    """
    return {
        "vehicles": _FLEET_STATE.get("vehicles", []),
        "count": len(_FLEET_STATE.get("vehicles", [])),
    }


def get_vehicle_location(vehicle_id: int) -> Optional[Dict[str, Any]]:
    """Get current location of a specific vehicle."""
    for vehicle in _FLEET_STATE.get("vehicles", []):
        if vehicle.get("vehicle_id") == vehicle_id:
            return {
                "vehicle_id": vehicle_id,
                "latitude": vehicle.get("latitude"),
                "longitude": vehicle.get("longitude"),
                "timestamp": vehicle.get("timestamp"),
            }
    return None


def get_vehicle_status(vehicle_id: int) -> Optional[Dict[str, Any]]:
    """Get current status and operational info for a vehicle."""
    for vehicle in _FLEET_STATE.get("vehicles", []):
        if vehicle.get("vehicle_id") == vehicle_id:
            return {
                "vehicle_id": vehicle_id,
                "status": vehicle.get("status"),
                "route_id": vehicle.get("route_id"),
                "current_stop": vehicle.get("current_stop"),
                "eta_minutes": vehicle.get("eta_minutes"),
                "latitude": vehicle.get("latitude"),
                "longitude": vehicle.get("longitude"),
            }
    return None


def get_vehicle_eta(vehicle_id: int) -> Optional[Dict[str, Any]]:
    """Get ETA information for a specific vehicle."""
    for vehicle in _FLEET_STATE.get("vehicles", []):
        if vehicle.get("vehicle_id") == vehicle_id:
            return {
                "vehicle_id": vehicle_id,
                "eta_minutes": vehicle.get("eta_minutes"),
                "status": vehicle.get("status"),
            }
    return None


def get_vehicle_route(vehicle_id: int) -> Optional[Dict[str, Any]]:
    """Get route information for a specific vehicle."""
    for vehicle in _FLEET_STATE.get("vehicles", []):
        if vehicle.get("vehicle_id") == vehicle_id:
            return {
                "vehicle_id": vehicle_id,
                "route_id": vehicle.get("route_id"),
                "current_stop": vehicle.get("current_stop"),
            }
    return None


def get_vehicle_stops(vehicle_id: int) -> Optional[Dict[str, Any]]:
    """Get remaining stops for a specific vehicle."""
    for vehicle in _FLEET_STATE.get("vehicles", []):
        if vehicle.get("vehicle_id") == vehicle_id:
            return {
                "vehicle_id": vehicle_id,
                "current_stop": vehicle.get("current_stop"),
                # Actual stop details would come from route service
            }
    return None


def get_vehicle_by_name(vehicle_name: str) -> Optional[int]:
    """
    Resolve vehicle name/ID from natural language.
    
    Examples:
        "TRK-01" -> 101
        "truck 2" -> 102
        "second truck" -> 102
    """
    name_lower = vehicle_name.lower()
    
    # Try direct TRK-XX format
    if name_lower.startswith("trk-"):
        try:
            number = int(name_lower.split("-")[1])
            vehicle_id = 100 + number
            # Verify vehicle exists
            for v in _FLEET_STATE.get("vehicles", []):
                if v.get("vehicle_id") == vehicle_id:
                    return vehicle_id
        except (ValueError, IndexError):
            pass
    
    # Try number words
    number_words = {
        "one": 1, "two": 2, "three": 3, "four": 4, "five": 5,
        "first": 1, "second": 2, "third": 3, "fourth": 4, "fifth": 5,
    }
    
    for word, number in number_words.items():
        if word in name_lower:
            vehicle_id = 100 + number
            for v in _FLEET_STATE.get("vehicles", []):
                if v.get("vehicle_id") == vehicle_id:
                    return vehicle_id
    
    return None


def get_vehicle_by_location(location: str) -> Optional[List[int]]:
    """
    Find vehicles near a specific location.
    
    This is a placeholder for reverse geocoding capability.
    """
    # Would implement reverse geocoding here
    return None


def get_delayed_vehicles() -> List[Dict[str, Any]]:
    """Get list of all delayed vehicles."""
    delayed = []
    for vehicle in _FLEET_STATE.get("vehicles", []):
        if vehicle.get("status") == "delayed":
            delayed.append({
                "vehicle_id": vehicle.get("vehicle_id"),
                "eta_minutes": vehicle.get("eta_minutes"),
                "route_id": vehicle.get("route_id"),
            })
    return delayed


def get_en_route_count() -> int:
    """Get count of vehicles currently en route."""
    return sum(
        1 for v in _FLEET_STATE.get("vehicles", [])
        if v.get("status") == "en_route"
    )


def get_at_base_count() -> int:
    """Get count of vehicles at base."""
    return sum(
        1 for v in _FLEET_STATE.get("vehicles", [])
        if v.get("status") == "at_base"
    )
