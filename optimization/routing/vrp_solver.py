"""
MissionFlow AI
Vehicle Routing Problem Solver

Uses Google OR-Tools to optimize multi-vehicle delivery routes.
"""

from dataclasses import dataclass
from typing import List, Sequence, Tuple

from ortools.constraint_solver import pywrapcp
from ortools.constraint_solver import routing_enums_pb2


@dataclass
class VehicleRoute:
    """Optimized route assigned to one vehicle."""

    vehicle_id: int
    route: List[int]
    distance_meters: int


@dataclass
class VRPSolution:
    """Complete VRP optimization result."""

    routes: List[VehicleRoute]
    total_distance_meters: int


def solve_vrp(
    distance_matrix: Sequence[Sequence[int]],
    vehicle_count: int,
    depot: int = 0,
) -> VRPSolution:
    """
    Solve a capacitated-free multi-vehicle routing problem.

    Parameters
    ----------
    distance_matrix:
        Square distance matrix in meters.

    vehicle_count:
        Number of vehicles available.

    depot:
        Index of the depot/start location.

    Returns
    -------
    VRPSolution
        Optimized routes and total distance.

    Raises
    ------
    ValueError
        If the input matrix or vehicle count is invalid.
    """

    if not distance_matrix:
        raise ValueError("Distance matrix cannot be empty.")

    location_count = len(distance_matrix)

    if any(len(row) != location_count for row in distance_matrix):
        raise ValueError("Distance matrix must be square.")

    if vehicle_count < 1:
        raise ValueError("vehicle_count must be at least 1.")

    if not 0 <= depot < location_count:
        raise ValueError("Depot index is outside the distance matrix.")

    manager = pywrapcp.RoutingIndexManager(
        location_count,
        vehicle_count,
        depot,
    )

    routing = pywrapcp.RoutingModel(manager)

    def distance_callback(from_index: int, to_index: int) -> int:
        """Return travel distance between two routing nodes."""

        from_node = manager.IndexToNode(from_index)
        to_node = manager.IndexToNode(to_index)

        return int(distance_matrix[from_node][to_node])

    transit_callback_index = routing.RegisterTransitCallback(
        distance_callback
    )

    routing.SetArcCostEvaluatorOfAllVehicles(
        transit_callback_index
    )

    search_parameters = pywrapcp.DefaultRoutingSearchParameters()

    search_parameters.first_solution_strategy = (
        routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
    )

    search_parameters.local_search_metaheuristic = (
        routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
    )

    search_parameters.time_limit.seconds = 5

    solution = routing.SolveWithParameters(
        search_parameters
    )

    if solution is None:
        raise RuntimeError(
            "OR-Tools could not find a feasible routing solution."
        )

    routes: List[VehicleRoute] = []
    total_distance = 0

    for vehicle_id in range(vehicle_count):
        index = routing.Start(vehicle_id)

        route: List[int] = []
        route_distance = 0

        while not routing.IsEnd(index):
            node = manager.IndexToNode(index)
            route.append(node)

            previous_index = index
            index = solution.Value(
                routing.NextVar(index)
            )

            route_distance += routing.GetArcCostForVehicle(
                previous_index,
                index,
                vehicle_id,
            )

        route.append(manager.IndexToNode(index))

        if len(route) > 2:
            routes.append(
                VehicleRoute(
                    vehicle_id=vehicle_id,
                    route=route,
                    distance_meters=route_distance,
                )
            )

            total_distance += route_distance

    return VRPSolution(
        routes=routes,
        total_distance_meters=total_distance,
    )