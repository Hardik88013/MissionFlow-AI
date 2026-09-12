import pytest

from optimization.routing.capacity_constraints import (
    validate_capacities,
    validate_demand_capacity,
)


def test_validate_capacities_accepts_valid_values():
    validate_capacities(
        vehicle_capacities=[10, 15],
        demands=[0, 5, 8, 7],
    )


def test_validate_capacities_rejects_negative_capacity():
    with pytest.raises(ValueError):
        validate_capacities(
            vehicle_capacities=[10, -5],
            demands=[0, 5],
        )


def test_validate_capacities_rejects_negative_demand():
    with pytest.raises(ValueError):
        validate_capacities(
            vehicle_capacities=[10, 10],
            demands=[0, -5],
        )


def test_validate_capacities_rejects_insufficient_total_capacity():
    with pytest.raises(ValueError):
        validate_capacities(
            vehicle_capacities=[5, 5],
            demands=[0, 6, 6],
        )


def test_validate_demand_capacity_returns_true_when_delivery_fits():
    assert validate_demand_capacity(
        vehicle_capacity=10,
        delivery_demand=8,
    ) is True


def test_validate_demand_capacity_returns_false_when_delivery_does_not_fit():
    assert validate_demand_capacity(
        vehicle_capacity=10,
        delivery_demand=12,
    ) is False