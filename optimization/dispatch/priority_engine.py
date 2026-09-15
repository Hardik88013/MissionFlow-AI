"""
MissionFlow AI
Delivery Priority Engine

Calculates delivery priority scores and determines the order
in which delivery jobs should be dispatched.
"""

from dataclasses import dataclass
from typing import List, Sequence


@dataclass
class PriorityDelivery:
    """Delivery information used for priority calculation."""

    delivery_id: int
    priority: int
    urgency: int = 0
    remaining_minutes: int = 1440


@dataclass
class PriorityResult:
    """Calculated priority result for a delivery."""

    delivery_id: int
    priority_score: float


def validate_delivery_priority(
    delivery: PriorityDelivery,
) -> None:
    """Validate priority-related delivery data."""

    if delivery.priority < 0:
        raise ValueError(
            f"Delivery {delivery.delivery_id} priority cannot be negative."
        )

    if delivery.urgency < 0:
        raise ValueError(
            f"Delivery {delivery.delivery_id} urgency cannot be negative."
        )

    if delivery.remaining_minutes < 0:
        raise ValueError(
            f"Delivery {delivery.delivery_id} remaining_minutes "
            "cannot be negative."
        )


def calculate_priority_score(
    delivery: PriorityDelivery,
) -> float:
    """
    Calculate a dispatch priority score.

    Higher scores indicate deliveries that should be handled sooner.

    Score components:
        - Base priority: 60%
        - Urgency: 30%
        - Time pressure: 10%
    """

    validate_delivery_priority(delivery)

    base_priority = min(delivery.priority, 10) / 10
    urgency = min(delivery.urgency, 10) / 10

    # More time pressure means a higher score.
    time_pressure = max(
        0.0,
        min(
            1.0,
            1.0 - (delivery.remaining_minutes / 1440),
        ),
    )

    score = (
        (base_priority * 0.60)
        + (urgency * 0.30)
        + (time_pressure * 0.10)
    )

    return round(score * 100, 2)


def rank_deliveries(
    deliveries: Sequence[PriorityDelivery],
) -> List[PriorityResult]:
    """
    Rank deliveries from highest to lowest dispatch priority.

    Parameters
    ----------
    deliveries:
        Delivery jobs requiring prioritization.

    Returns
    -------
    list[PriorityResult]
        Deliveries ordered by descending priority score.
    """

    if not deliveries:
        raise ValueError("deliveries cannot be empty.")

    results = [
        PriorityResult(
            delivery_id=delivery.delivery_id,
            priority_score=calculate_priority_score(delivery),
        )
        for delivery in deliveries
    ]

    results.sort(
        key=lambda result: result.priority_score,
        reverse=True,
    )

    return results