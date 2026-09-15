"""
MissionFlow AI
Route Optimization Service
"""

from typing import Optional, Sequence, Tuple

from optimization.routing.vrp_solver import (
    VRPSolution,
    solve_vrp,
)


class RouteOptimizationService:
    """Service responsible for optimizing delivery routes."""

    def optimize_routes(
        self,
        distance_matrix: Sequence[Sequence[int]],
        vehicle_count: int,
        depot: int = 0,
        vehicle_capacities: Optional[Sequence[int]] = None,
        demands: Optional[Sequence[int]] = None,
        time_windows: Optional[Sequence[Tuple[int, int]]] = None,
        travel_speed_kmh: float = 40.0,
        service_time_minutes: int = 10,
    ) -> VRPSolution:
        """Run the vehicle routing optimizer."""

        return solve_vrp(
            distance_matrix=distance_matrix,
            vehicle_count=vehicle_count,
            depot=depot,
            vehicle_capacities=vehicle_capacities,
            demands=demands,
            time_windows=time_windows,
            travel_speed_kmh=travel_speed_kmh,
            service_time_minutes=service_time_minutes,
        )


route_optimization_service = RouteOptimizationService()