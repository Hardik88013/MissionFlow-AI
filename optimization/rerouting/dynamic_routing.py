"""
MissionFlow AI
Dynamic Routing

Re-optimizes delivery routes when active disruptions
make one or more delivery locations unavailable.
"""

from dataclasses import dataclass
from typing import List, Optional, Sequence, Tuple

from optimization.rerouting.disruption_handler import Disruption
from optimization.routing.vrp_solver import VRPSolution, solve_vrp


@dataclass
class DynamicRoutingResult:
    """Result of dynamic route recalculation."""

    solution: VRPSolution
    removed_stops: List[int]
    rerouted: bool


def validate_dynamic_routing_input(
    distance_matrix: Sequence[Sequence[int]],
    vehicle_count: int,
    depot: int,
) -> None:
    """Validate the basic dynamic routing input."""

    if not distance_matrix:
        raise ValueError("distance_matrix cannot be empty.")

    matrix_size = len(distance_matrix)

    for row in distance_matrix:
        if len(row) != matrix_size:
            raise ValueError("distance_matrix must be square.")

    if vehicle_count <= 0:
        raise ValueError(
            "vehicle_count must be greater than zero."
        )

    if not 0 <= depot < matrix_size:
        raise ValueError(
            "depot must be a valid matrix index."
        )


def reroute_after_disruption(
    distance_matrix: Sequence[Sequence[int]],
    vehicle_count: int,
    disruptions: Sequence[Disruption],
    depot: int = 0,
    vehicle_capacities: Optional[Sequence[int]] = None,
    demands: Optional[Sequence[int]] = None,
    time_windows: Optional[Sequence[Tuple[int, int]]] = None,
    travel_speed_kmh: float = 40.0,
    service_time_minutes: int = 10,
) -> DynamicRoutingResult:
    """
    Recalculate routes after disruptions.

    Active disrupted locations are removed from the routing
    problem and the remaining delivery locations are optimized
    again using the VRP solver.
    """

    validate_dynamic_routing_input(
        distance_matrix=distance_matrix,
        vehicle_count=vehicle_count,
        depot=depot,
    )

    matrix_size = len(distance_matrix)

    active_disruptions = [
        disruption
        for disruption in disruptions
        if disruption.active
    ]

    removed_stops = sorted(
        {
            disruption.affected_location
            for disruption in active_disruptions
            if (
                0 <= disruption.affected_location < matrix_size
                and disruption.affected_location != depot
            )
        }
    )

    if not removed_stops:
        solution = solve_vrp(
            distance_matrix=distance_matrix,
            vehicle_count=vehicle_count,
            depot=depot,
            vehicle_capacities=vehicle_capacities,
            demands=demands,
            time_windows=time_windows,
            travel_speed_kmh=travel_speed_kmh,
            service_time_minutes=service_time_minutes,
        )

        return DynamicRoutingResult(
            solution=solution,
            removed_stops=[],
            rerouted=False,
        )

    removed_set = set(removed_stops)

    remaining_nodes = [
        node
        for node in range(matrix_size)
        if node not in removed_set
    ]

    node_mapping = {
        original_node: new_node
        for new_node, original_node in enumerate(remaining_nodes)
    }

    filtered_matrix = [
        [
            int(distance_matrix[original_i][original_j])
            for original_j in remaining_nodes
        ]
        for original_i in remaining_nodes
    ]

    filtered_depot = node_mapping[depot]

    filtered_demands = None

    if demands is not None:
        if len(demands) != matrix_size:
            raise ValueError(
                "demands length must match distance_matrix size."
            )

        filtered_demands = [
            demands[node]
            for node in remaining_nodes
        ]

    filtered_time_windows = None

    if time_windows is not None:
        if len(time_windows) != matrix_size:
            raise ValueError(
                "time_windows length must match distance_matrix size."
            )

        filtered_time_windows = [
            time_windows[node]
            for node in remaining_nodes
        ]

    solution = solve_vrp(
        distance_matrix=filtered_matrix,
        vehicle_count=vehicle_count,
        depot=filtered_depot,
        vehicle_capacities=vehicle_capacities,
        demands=filtered_demands,
        time_windows=filtered_time_windows,
        travel_speed_kmh=travel_speed_kmh,
        service_time_minutes=service_time_minutes,
    )

    remapped_routes = []

    for vehicle_route in solution.routes:
        remapped_routes.append(
            type(vehicle_route)(
                vehicle_id=vehicle_route.vehicle_id,
                route=[
                    remaining_nodes[node]
                    for node in vehicle_route.route
                ],
                distance_meters=vehicle_route.distance_meters,
            )
        )

    remapped_solution = VRPSolution(
        routes=remapped_routes,
        total_distance_meters=solution.total_distance_meters,
    )

    return DynamicRoutingResult(
        solution=remapped_solution,
        removed_stops=removed_stops,
        rerouted=True,
    )