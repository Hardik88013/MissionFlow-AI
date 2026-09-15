"""
MissionFlow AI
Vehicle Assignment

Assigns delivery jobs to available vehicles based on capacity,
availability, and priority.
"""

from dataclasses import dataclass
from typing import List, Sequence


@dataclass
class Vehicle:
    """Represents an available delivery vehicle."""

    vehicle_id: int
    capacity: int
    available: bool = True


@dataclass
class DeliveryJob:
    """Represents a delivery requiring vehicle assignment."""

    delivery_id: int
    demand: int
    priority: int = 0


@dataclass
class VehicleAssignment:
    """Represents a delivery assigned to a vehicle."""

    delivery_id: int
    vehicle_id: int


def validate_vehicles(
    vehicles: Sequence[Vehicle],
) -> None:
    """Validate vehicle definitions."""

    if not vehicles:
        raise ValueError("vehicles cannot be empty.")

    for vehicle in vehicles:

        if vehicle.capacity < 0:
            raise ValueError(
                f"Vehicle {vehicle.vehicle_id} capacity cannot be negative."
            )


def validate_delivery_jobs(
    deliveries: Sequence[DeliveryJob],
) -> None:
    """Validate delivery jobs."""

    if not deliveries:
        raise ValueError("deliveries cannot be empty.")

    for delivery in deliveries:

        if delivery.demand < 0:
            raise ValueError(
                f"Delivery {delivery.delivery_id} demand cannot be negative."
            )

        if delivery.priority < 0:
            raise ValueError(
                f"Delivery {delivery.delivery_id} priority cannot be negative."
            )


def assign_vehicles(
    vehicles: Sequence[Vehicle],
    deliveries: Sequence[DeliveryJob],
) -> List[VehicleAssignment]:
    """
    Assign available vehicles to delivery jobs.

    Deliveries are processed from highest priority to lowest priority.
    For each delivery, the smallest available vehicle capable of
    carrying the delivery is selected.

    Parameters
    ----------
    vehicles:
        Available vehicle definitions.

    deliveries:
        Delivery jobs requiring assignment.

    Returns
    -------
    list[VehicleAssignment]
        Vehicle assignments for each delivery.

    Raises
    ------
    ValueError
        If a delivery cannot be assigned to a suitable vehicle.
    """

    validate_vehicles(vehicles)
    validate_delivery_jobs(deliveries)

    available_vehicles = [
        vehicle
        for vehicle in vehicles
        if vehicle.available
    ]

    if not available_vehicles:
        raise ValueError(
            "No vehicles are currently available."
        )

    # Highest priority deliveries are assigned first.
    sorted_deliveries = sorted(
        deliveries,
        key=lambda delivery: delivery.priority,
        reverse=True,
    )

    assignments: List[VehicleAssignment] = []

    # Track vehicles already assigned in this assignment batch.
    assigned_vehicle_ids = set()

    for delivery in sorted_deliveries:

        suitable_vehicles = [
            vehicle
            for vehicle in available_vehicles
            if (
                vehicle.vehicle_id not in assigned_vehicle_ids
                and vehicle.capacity >= delivery.demand
            )
        ]

        if not suitable_vehicles:
            raise ValueError(
                f"No available vehicle can carry delivery "
                f"{delivery.delivery_id} with demand "
                f"{delivery.demand}."
            )

        # Prefer the smallest vehicle that can handle the load.
        selected_vehicle = min(
            suitable_vehicles,
            key=lambda vehicle: vehicle.capacity,
        )

        assignments.append(
            VehicleAssignment(
                delivery_id=delivery.delivery_id,
                vehicle_id=selected_vehicle.vehicle_id,
            )
        )

        assigned_vehicle_ids.add(
            selected_vehicle.vehicle_id
        )

    return assignments