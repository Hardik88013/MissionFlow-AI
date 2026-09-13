"""
MissionFlow AI
Route Optimization API
"""

from fastapi import APIRouter, HTTPException

from backend.app.schemas.route import (
    OptimizedRoute,
    RouteOptimizeRequest,
    RouteOptimizeResponse,
)
from backend.app.services.route_service import (
    route_optimization_service,
)


router = APIRouter(
    prefix="/routes",
    tags=["Route Optimization"],
)


@router.post(
    "/optimize",
    response_model=RouteOptimizeResponse,
)
def optimize_routes(
    request: RouteOptimizeRequest,
) -> RouteOptimizeResponse:
    """Optimize delivery routes."""

    try:
        solution = route_optimization_service.optimize_routes(
            distance_matrix=request.distance_matrix,
            vehicle_count=request.vehicle_count,
            depot=request.depot,
            vehicle_capacities=request.vehicle_capacities,
            demands=request.demands,
            time_windows=request.time_windows,
            travel_speed_kmh=request.travel_speed_kmh,
            service_time_minutes=request.service_time_minutes,
        )

        routes = [
            OptimizedRoute(
                vehicle_id=vehicle_route.vehicle_id,
                route=vehicle_route.route,
                distance_meters=vehicle_route.distance_meters,
            )
            for vehicle_route in solution.routes
        ]

        return RouteOptimizeResponse(
            routes=routes,
            total_distance_meters=solution.total_distance_meters,
        )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Route optimization failed: {str(exc)}",
        )