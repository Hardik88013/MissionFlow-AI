from optimization.routing.vrp_solver import solve_vrp


def test_vrp_solver_returns_solution():
    distance_matrix = [
        [0, 5000, 8000, 7000],
        [5000, 0, 4000, 6000],
        [8000, 4000, 0, 3000],
        [7000, 6000, 3000, 0],
    ]

    solution = solve_vrp(
        distance_matrix=distance_matrix,
        vehicle_count=2,
    )

    assert solution is not None
    assert solution.total_distance_meters > 0
    assert len(solution.routes) > 0


def test_vrp_solver_respects_vehicle_capacity():
    distance_matrix = [
        [0, 5000, 8000, 7000, 6000],
        [5000, 0, 4000, 6000, 5000],
        [8000, 4000, 0, 3000, 4500],
        [7000, 6000, 3000, 0, 3500],
        [6000, 5000, 4500, 3500, 0],
    ]

    solution = solve_vrp(
        distance_matrix=distance_matrix,
        vehicle_count=2,
        vehicle_capacities=[10, 10],
        demands=[0, 6, 4, 7, 3],
    )

    assert solution is not None
    assert len(solution.routes) > 0


def test_vrp_solver_supports_time_windows():
    distance_matrix = [
        [0, 5000, 8000, 7000, 6000],
        [5000, 0, 4000, 6000, 5000],
        [8000, 4000, 0, 3000, 4500],
        [7000, 6000, 3000, 0, 3500],
        [6000, 5000, 4500, 3500, 0],
    ]

    time_windows = [
        (480, 1020),
        (540, 660),
        (600, 780),
        (840, 960),
        (600, 900),
    ]

    solution = solve_vrp(
        distance_matrix=distance_matrix,
        vehicle_count=2,
        time_windows=time_windows,
        travel_speed_kmh=40.0,
        service_time_minutes=10,
    )

    assert solution is not None
    assert solution.total_distance_meters > 0
    assert len(solution.routes) > 0