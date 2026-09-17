"""
MissionFlow AI
Vehicle Capacity Constraints

Utilities for validating and applying vehicle capacity
constraints to routing problems.
"""

from typing import Sequence


def validate_capacities(
    vehicle_capacities: Sequence[int],
    demands: Sequence[int],
) -> None:
    """
    Validate vehicle capacities and delivery demands.

    Parameters
    ----------
    vehicle_capacities:
        Maximum load each vehicle can carry.

    demands:
        Delivery demand at each location.

    Raises
    ------
    ValueError
        If capacities or demands are invalid, or total capacity
        is insufficient for the total demand.
    """

    if not vehicle_capacities:
        raise ValueError("vehicle_capacities cannot be empty.")

    if any(capacity < 0 for capacity in vehicle_capacities):
        raise ValueError("Vehicle capacities cannot be negative.")

    if not demands:
        raise ValueError("demands cannot be empty.")

    if any(demand < 0 for demand in demands):
        raise ValueError("Delivery demands cannot be negative.")

    if sum(vehicle_capacities) < sum(demands):
        raise ValueError(
            "Total vehicle capacity is insufficient for "
            "the total delivery demand."
        )

    largest_demand = max(demands)

    if largest_demand > max(vehicle_capacities):
        raise ValueError(
            "At least one delivery exceeds the capacity "
            "of every available vehicle."
        )


def validate_demand_capacity(
    vehicle_capacity: int,
    delivery_demand: int,
) -> bool:
    """
    Check whether one delivery can fit in one vehicle.

    Returns
    -------
    bool
        True if the delivery fits within the vehicle capacity.
    """

    if vehicle_capacity < 0:
        raise ValueError("vehicle_capacity cannot be negative.")

    if delivery_demand < 0:
        raise ValueError("delivery_demand cannot be negative.")

    return delivery_demand <= vehicle_capacity