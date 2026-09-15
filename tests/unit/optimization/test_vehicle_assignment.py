import pytest

from optimization.dispatch.vehicle_assignment import (
    DeliveryJob,
    Vehicle,
    assign_vehicles,
    validate_delivery_jobs,
    validate_vehicles,
)


def test_assign_vehicles_prioritizes_high_priority_deliveries():
    vehicles = [
        Vehicle(vehicle_id=1, capacity=10),
        Vehicle(vehicle_id=2, capacity=20),
    ]

    deliveries = [
        DeliveryJob(delivery_id=101, demand=5, priority=1),
        DeliveryJob(delivery_id=102, demand=15, priority=10),
    ]

    assignments = assign_vehicles(vehicles, deliveries)

    assert assignments[0].delivery_id == 102
    assert assignments[0].vehicle_id == 2


def test_assign_vehicles_selects_smallest_suitable_vehicle():
    vehicles = [
        Vehicle(vehicle_id=1, capacity=10),
        Vehicle(vehicle_id=2, capacity=20),
        Vehicle(vehicle_id=3, capacity=30),
    ]

    deliveries = [
        DeliveryJob(delivery_id=101, demand=8, priority=5),
    ]

    assignments = assign_vehicles(vehicles, deliveries)

    assert assignments[0].vehicle_id == 1


def test_unavailable_vehicle_is_not_assigned():
    vehicles = [
        Vehicle(vehicle_id=1, capacity=10, available=False),
        Vehicle(vehicle_id=2, capacity=20, available=True),
    ]

    deliveries = [
        DeliveryJob(delivery_id=101, demand=8),
    ]

    assignments = assign_vehicles(vehicles, deliveries)

    assert assignments[0].vehicle_id == 2


def test_assignment_fails_when_no_vehicle_can_carry_delivery():
    vehicles = [
        Vehicle(vehicle_id=1, capacity=10),
        Vehicle(vehicle_id=2, capacity=15),
    ]

    deliveries = [
        DeliveryJob(delivery_id=101, demand=20),
    ]

    with pytest.raises(ValueError):
        assign_vehicles(vehicles, deliveries)


def test_validate_vehicles_rejects_negative_capacity():
    with pytest.raises(ValueError):
        validate_vehicles(
            [Vehicle(vehicle_id=1, capacity=-1)]
        )


def test_validate_delivery_jobs_rejects_negative_demand():
    with pytest.raises(ValueError):
        validate_delivery_jobs(
            [DeliveryJob(delivery_id=101, demand=-1)]
        )


def test_validate_delivery_jobs_rejects_negative_priority():
    with pytest.raises(ValueError):
        validate_delivery_jobs(
            [DeliveryJob(delivery_id=101, demand=5, priority=-1)]
        )