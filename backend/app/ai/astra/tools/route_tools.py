from typing import Any, Dict

from backend.app.services.route_service import (
    route_optimization_service,
)


DISTANCE_MATRIX = [
    [0, 5000, 7000, 6000, 8000],
    [5000, 0, 4000, 3000, 6000],
    [7000, 4000, 0, 5000, 3000],
    [6000, 3000, 5000, 0, 4000],
    [8000, 6000, 3000, 4000, 0],
]

DEMANDS = [0, 4, 6, 3, 7]

TIME_WINDOWS = [
    [480, 1020],
    [540, 660],
    [600, 780],
    [840, 960],
    [600, 900],
]


def optimize_routes() -> Dict[str, Any]:
    """Run MissionFlow's existing VRP optimizer."""

    result = route_optimization_service.optimize_routes(
        distance_matrix=DISTANCE_MATRIX,
        vehicle_count=2,
        depot=0,
        vehicle_capacities=[10, 10],
        demands=DEMANDS,
        time_windows=TIME_WINDOWS,
        travel_speed_kmh=40.0,
        service_time_minutes=10,
    )

    return {
        "routes": [
            {
                "vehicle_id": route.vehicle_id,
                "route": route.route,
                "distance_meters": route.distance_meters,
            }
            for route in result.routes
        ],
        "total_distance_meters": result.total_distance_meters,
    }