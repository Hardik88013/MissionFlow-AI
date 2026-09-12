"""
MissionFlow AI
Vehicle Routing Problem Solver

Uses Google OR-Tools to optimize multi-vehicle delivery routes
with vehicle capacity and delivery time-window constraints.
"""

from dataclasses import dataclass
from typing import List, Sequence

from ortools.constraint_solver import pywrapcp
from ortools.constraint_solver import routing_enums_pb2

from optimization.routing.capacity_constraints import (
    validate_capacities,
)
from optimization.routing.time_windows import (
    validate_time_windows,
)


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
    vehicle_capacities: Sequence[int] | None = None,
    demands: Sequence[int] | None = None,
    time_windows: Sequence[tuple[int, int]] | None = None,
    travel_speed_kmh: float = 40.0,
    service_time_minutes: int = 10,
) -> VRPSolution:
    """
    Solve a multi-vehicle capacitated routing problem
    with optional delivery time windows.

    Parameters
    ----------
    distance_matrix:
        Square distance matrix in meters.

    vehicle_count:
        Number of vehicles available.

    depot:
        Index of the depot/start location.

    vehicle_capacities:
        Maximum load capacity of each vehicle.

    demands:
        Delivery demand at each location.
        Depot demand should normally be 0.

    time_windows:
        Delivery time windows in minutes from midnight.
        Example:
            (540, 660) -> 09:00 to 11:00

    travel_speed_kmh:
        Average vehicle travel speed used to convert distance
        into travel time.

    service_time_minutes:
        Time spent servicing each delivery location.

    Returns
    -------
    VRPSolution
        Optimized routes and total distance.

    Raises
    ------
    ValueError
        If routing inputs are invalid.
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

    if travel_speed_kmh <= 0:
        raise ValueError("travel_speed_kmh must be greater than 0.")

    if service_time_minutes < 0:
        raise ValueError("service_time_minutes cannot be negative.")

    # ---------------------------------------------------------
    # Validate capacity constraints
    # ---------------------------------------------------------

    if vehicle_capacities is not None or demands is not None:

        if vehicle_capacities is None:
            raise ValueError(
                "vehicle_capacities must be provided when demands are provided."
            )

        if demands is None:
            raise ValueError(
                "demands must be provided when vehicle capacities are provided."
            )

        if len(vehicle_capacities) != vehicle_count:
            raise ValueError(
                "Number of vehicle capacities must match vehicle_count."
            )

        if len(demands) != location_count:
            raise ValueError(
                "Number of demands must match the number of locations."
            )

        validate_capacities(
            vehicle_capacities,
            demands,
        )

    # ---------------------------------------------------------
    # Validate time windows
    # ---------------------------------------------------------

    if time_windows is not None:

        if len(time_windows) != location_count:
            raise ValueError(
                "Number of time windows must match the number of locations."
            )

        validate_time_windows(time_windows)

    # ---------------------------------------------------------
    # Create OR-Tools routing model
    # ---------------------------------------------------------

    manager = pywrapcp.RoutingIndexManager(
        location_count,
        vehicle_count,
        depot,
    )

    routing = pywrapcp.RoutingModel(manager)

    # ---------------------------------------------------------
    # Distance callback
    # ---------------------------------------------------------

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

    # ---------------------------------------------------------
    # Vehicle capacity constraint
    # ---------------------------------------------------------

    if vehicle_capacities is not None and demands is not None:

        def demand_callback(from_index: int) -> int:
            """Return delivery demand at a routing node."""

            from_node = manager.IndexToNode(from_index)

            return int(demands[from_node])

        demand_callback_index = routing.RegisterUnaryTransitCallback(
            demand_callback
        )

        routing.AddDimensionWithVehicleCapacity(
            demand_callback_index,
            0,
            list(vehicle_capacities),
            True,
            "Capacity",
        )

    # ---------------------------------------------------------
    # Time window constraint
    # ---------------------------------------------------------

    if time_windows is not None:

        def travel_time_callback(
            from_index: int,
            to_index: int,
        ) -> int:
            """
            Return travel time in minutes.

            Distance is converted from meters to minutes
            using the configured average vehicle speed.
            """

            from_node = manager.IndexToNode(from_index)
            to_node = manager.IndexToNode(to_index)

            distance_meters = distance_matrix[from_node][to_node]

            distance_km = distance_meters / 1000.0

            travel_time_hours = (
                distance_km / travel_speed_kmh
            )

            travel_time_minutes = (
                travel_time_hours * 60
            )

            return max(1, int(round(travel_time_minutes)))

        time_callback_index = routing.RegisterTransitCallback(
            travel_time_callback
        )

        routing.AddDimension(
            time_callback_index,
            1440,
            1440,
            False,
            "Time",
        )

        time_dimension = routing.GetDimensionOrDie("Time")

        # Apply delivery time windows.
        for location_index, (
            earliest_time,
            latest_time,
        ) in enumerate(time_windows):

            index = manager.NodeToIndex(location_index)

            time_dimension.CumulVar(index).SetRange(
                earliest_time,
                latest_time,
            )

        # Add service time to every non-depot location.
        for location_index in range(location_count):

            if location_index == depot:
                continue

            index = manager.NodeToIndex(location_index)

            time_dimension.SlackVar(index).SetValue(
                service_time_minutes
            )

        # Vehicles start from the depot at the beginning
        # of the operating day.
        for vehicle_id in range(vehicle_count):

            start_index = routing.Start(vehicle_id)

            time_dimension.CumulVar(start_index).SetRange(
                0,
                1440,
            )

    # ---------------------------------------------------------
    # Search configuration
    # ---------------------------------------------------------

    search_parameters = pywrapcp.DefaultRoutingSearchParameters()

    search_parameters.first_solution_strategy = (
        routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
    )

    search_parameters.local_search_metaheuristic = (
        routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
    )

    search_parameters.time_limit.seconds = 5

    # ---------------------------------------------------------
    # Solve
    # ---------------------------------------------------------

    solution = routing.SolveWithParameters(
        search_parameters
    )

    if solution is None:
        raise RuntimeError(
            "OR-Tools could not find a feasible routing solution."
        )

    # ---------------------------------------------------------
    # Extract routes
    # ---------------------------------------------------------

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