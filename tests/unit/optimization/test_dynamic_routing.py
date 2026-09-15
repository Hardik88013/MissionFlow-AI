import pytest

from optimization.rerouting.disruption_handler import Disruption
from optimization.rerouting.dynamic_routing import reroute_after_disruption


DISTANCE_MATRIX = [
    [0, 1000, 2000, 3000, 4000],
    [1000, 0, 1000, 2000, 3000],
    [2000, 1000, 0, 1000, 2000],
    [3000, 2000, 1000, 0, 1000],
    [4000, 3000, 2000, 1000, 0],
]


def test_reroutes_when_active_disruption_exists():
    disruptions = [
        Disruption(
            disruption_id=101,
            disruption_type="road_closure",
            affected_location=2,
            severity=5,
            active=True,
        )
    ]

    result = reroute_after_disruption(
        distance_matrix=DISTANCE_MATRIX,
        vehicle_count=1,
        disruptions=disruptions,
        depot=0,
    )

    assert result.rerouted is True
    assert result.removed_stops == [2]


def test_rerouting_removes_disrupted_stop():
    disruptions = [
        Disruption(
            disruption_id=101,
            disruption_type="flood",
            affected_location=2,
            severity=4,
            active=True,
        )
    ]

    result = reroute_after_disruption(
        distance_matrix=DISTANCE_MATRIX,
        vehicle_count=1,
        disruptions=disruptions,
        depot=0,
    )

    all_stops = [
        stop
        for route in result.solution.routes
        for stop in route.route
    ]

    assert 2 not in all_stops


def test_no_active_disruption_keeps_original_nodes():
    disruptions = [
        Disruption(
            disruption_id=101,
            disruption_type="road_closure",
            affected_location=2,
            severity=5,
            active=False,
        )
    ]

    result = reroute_after_disruption(
        distance_matrix=DISTANCE_MATRIX,
        vehicle_count=1,
        disruptions=disruptions,
        depot=0,
    )

    assert result.rerouted is False
    assert result.removed_stops == []


def test_empty_disruption_list_does_not_reroute():
    result = reroute_after_disruption(
        distance_matrix=DISTANCE_MATRIX,
        vehicle_count=1,
        disruptions=[],
        depot=0,
    )

    assert result.rerouted is False
    assert result.removed_stops == []


def test_invalid_distance_matrix_is_rejected():
    invalid_matrix = [
        [0, 1000],
        [1000],
    ]

    with pytest.raises(ValueError):
        reroute_after_disruption(
            distance_matrix=invalid_matrix,
            vehicle_count=1,
            disruptions=[],
            depot=0,
        )


def test_invalid_vehicle_count_is_rejected():
    with pytest.raises(ValueError):
        reroute_after_disruption(
            distance_matrix=DISTANCE_MATRIX,
            vehicle_count=0,
            disruptions=[],
            depot=0,
        )


def test_invalid_demands_length_is_rejected():
    disruptions = [
        Disruption(
            disruption_id=101,
            disruption_type="road_closure",
            affected_location=2,
            severity=5,
        )
    ]

    with pytest.raises(ValueError):
        reroute_after_disruption(
            distance_matrix=DISTANCE_MATRIX,
            vehicle_count=1,
            disruptions=disruptions,
            depot=0,
            demands=[0, 5, 5],
        )


def test_invalid_time_windows_length_is_rejected():
    disruptions = [
        Disruption(
            disruption_id=101,
            disruption_type="road_closure",
            affected_location=2,
            severity=5,
        )
    ]

    with pytest.raises(ValueError):
        reroute_after_disruption(
            distance_matrix=DISTANCE_MATRIX,
            vehicle_count=1,
            disruptions=disruptions,
            depot=0,
            time_windows=[(0, 100), (0, 100)],
        )