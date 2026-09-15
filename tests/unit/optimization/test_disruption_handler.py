import pytest

from optimization.rerouting.disruption_handler import (
    Disruption,
    deactivate_disruption,
    detect_route_impacts,
    get_active_disruptions,
    validate_disruption,
)


def test_validate_disruption_accepts_valid_disruption():
    disruption = Disruption(
        disruption_id=101,
        disruption_type="road_closure",
        affected_location=4,
        severity=5,
    )

    validate_disruption(disruption)


def test_validate_disruption_rejects_negative_id():
    disruption = Disruption(
        disruption_id=-1,
        disruption_type="road_closure",
        affected_location=4,
    )

    with pytest.raises(ValueError):
        validate_disruption(disruption)


def test_validate_disruption_rejects_empty_type():
    disruption = Disruption(
        disruption_id=101,
        disruption_type="",
        affected_location=4,
    )

    with pytest.raises(ValueError):
        validate_disruption(disruption)


def test_validate_disruption_rejects_invalid_severity():
    disruption = Disruption(
        disruption_id=101,
        disruption_type="road_closure",
        affected_location=4,
        severity=6,
    )

    with pytest.raises(ValueError):
        validate_disruption(disruption)


def test_detect_route_impacts_finds_affected_routes():
    routes = [
        (1, [0, 1, 4, 3, 0]),
        (2, [0, 2, 5, 0]),
    ]

    disruptions = [
        Disruption(
            disruption_id=101,
            disruption_type="road_closure",
            affected_location=4,
            severity=5,
        ),
        Disruption(
            disruption_id=102,
            disruption_type="flood",
            affected_location=9,
            severity=3,
        ),
    ]

    impacts = detect_route_impacts(routes, disruptions)

    assert len(impacts) == 1
    assert impacts[0].vehicle_id == 1
    assert impacts[0].affected_stops == [4]
    assert impacts[0].requires_rerouting is True


def test_inactive_disruption_does_not_affect_route():
    routes = [
        (1, [0, 1, 4, 3, 0]),
    ]

    disruptions = [
        Disruption(
            disruption_id=101,
            disruption_type="road_closure",
            affected_location=4,
            severity=5,
            active=False,
        ),
    ]

    impacts = detect_route_impacts(routes, disruptions)

    assert impacts == []


def test_get_active_disruptions():
    disruptions = [
        Disruption(
            disruption_id=101,
            disruption_type="road_closure",
            affected_location=4,
            active=True,
        ),
        Disruption(
            disruption_id=102,
            disruption_type="flood",
            affected_location=5,
            active=False,
        ),
    ]

    active = get_active_disruptions(disruptions)

    assert len(active) == 1
    assert active[0].disruption_id == 101


def test_deactivate_disruption():
    disruption = Disruption(
        disruption_id=101,
        disruption_type="road_closure",
        affected_location=4,
        active=True,
    )

    result = deactivate_disruption(disruption)

    assert result.active is False