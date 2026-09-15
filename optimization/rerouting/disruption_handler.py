"""
MissionFlow AI
Disruption Handler

Detects route disruptions and identifies affected vehicles,
routes, and delivery stops.
"""

from dataclasses import dataclass
from typing import List, Sequence


@dataclass
class Disruption:
    """Represents an operational disruption."""

    disruption_id: int
    disruption_type: str
    affected_location: int
    severity: int = 1
    active: bool = True


@dataclass
class RouteImpact:
    """Represents the impact of a disruption on a route."""

    vehicle_id: int
    affected_stops: List[int]
    requires_rerouting: bool


def validate_disruption(
    disruption: Disruption,
) -> None:
    """Validate disruption information."""

    if disruption.disruption_id < 0:
        raise ValueError(
            "disruption_id cannot be negative."
        )

    if not disruption.disruption_type.strip():
        raise ValueError(
            "disruption_type cannot be empty."
        )

    if disruption.affected_location < 0:
        raise ValueError(
            "affected_location cannot be negative."
        )

    if not 1 <= disruption.severity <= 5:
        raise ValueError(
            "severity must be between 1 and 5."
        )


def detect_route_impacts(
    routes: Sequence[tuple[int, Sequence[int]]],
    disruptions: Sequence[Disruption],
) -> List[RouteImpact]:
    """
    Identify routes affected by active disruptions.

    Parameters
    ----------
    routes:
        Sequence of:
            (vehicle_id, route)

        Example:
            (1, [0, 2, 4, 0])

    disruptions:
        Active or inactive operational disruptions.

    Returns
    -------
    list[RouteImpact]
        Impact information for affected routes.
    """

    if not routes:
        raise ValueError("routes cannot be empty.")

    if not disruptions:
        return []

    active_disruptions = [
        disruption
        for disruption in disruptions
        if disruption.active
    ]

    impacts: List[RouteImpact] = []

    for vehicle_id, route in routes:

        affected_stops: List[int] = []

        for disruption in active_disruptions:

            if disruption.affected_location in route:
                affected_stops.append(
                    disruption.affected_location
                )

        if affected_stops:

            # Remove duplicates while preserving order.
            affected_stops = list(
                dict.fromkeys(affected_stops)
            )

            impacts.append(
                RouteImpact(
                    vehicle_id=vehicle_id,
                    affected_stops=affected_stops,
                    requires_rerouting=True,
                )
            )

    return impacts


def get_active_disruptions(
    disruptions: Sequence[Disruption],
) -> List[Disruption]:
    """
    Return only currently active disruptions.
    """

    return [
        disruption
        for disruption in disruptions
        if disruption.active
    ]


def deactivate_disruption(
    disruption: Disruption,
) -> Disruption:
    """
    Mark a disruption as resolved.
    """

    disruption.active = False

    return disruption