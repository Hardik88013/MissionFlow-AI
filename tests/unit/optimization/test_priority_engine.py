import pytest

from optimization.dispatch.priority_engine import (
    PriorityDelivery,
    calculate_priority_score,
    rank_deliveries,
    validate_delivery_priority,
)


def test_calculate_priority_score_returns_valid_score():
    delivery = PriorityDelivery(
        delivery_id=101,
        priority=5,
        urgency=5,
        remaining_minutes=720,
    )

    score = calculate_priority_score(delivery)

    assert 0 <= score <= 100


def test_higher_priority_produces_higher_score():
    low_priority = PriorityDelivery(
        delivery_id=101,
        priority=2,
        urgency=5,
        remaining_minutes=720,
    )

    high_priority = PriorityDelivery(
        delivery_id=102,
        priority=9,
        urgency=5,
        remaining_minutes=720,
    )

    assert calculate_priority_score(high_priority) > calculate_priority_score(
        low_priority
    )


def test_higher_urgency_produces_higher_score():
    low_urgency = PriorityDelivery(
        delivery_id=101,
        priority=5,
        urgency=2,
        remaining_minutes=720,
    )

    high_urgency = PriorityDelivery(
        delivery_id=102,
        priority=5,
        urgency=9,
        remaining_minutes=720,
    )

    assert calculate_priority_score(high_urgency) > calculate_priority_score(
        low_urgency
    )


def test_less_remaining_time_increases_score():
    more_time = PriorityDelivery(
        delivery_id=101,
        priority=5,
        urgency=5,
        remaining_minutes=1000,
    )

    less_time = PriorityDelivery(
        delivery_id=102,
        priority=5,
        urgency=5,
        remaining_minutes=100,
    )

    assert calculate_priority_score(less_time) > calculate_priority_score(
        more_time
    )


def test_rank_deliveries_returns_highest_priority_first():
    deliveries = [
        PriorityDelivery(
            delivery_id=101,
            priority=2,
            urgency=2,
            remaining_minutes=1000,
        ),
        PriorityDelivery(
            delivery_id=102,
            priority=9,
            urgency=9,
            remaining_minutes=100,
        ),
        PriorityDelivery(
            delivery_id=103,
            priority=5,
            urgency=5,
            remaining_minutes=500,
        ),
    ]

    ranked = rank_deliveries(deliveries)

    assert ranked[0].delivery_id == 102
    assert ranked[0].priority_score > ranked[1].priority_score
    assert ranked[1].priority_score > ranked[2].priority_score


def test_validate_priority_rejects_negative_priority():
    delivery = PriorityDelivery(
        delivery_id=101,
        priority=-1,
    )

    with pytest.raises(ValueError):
        validate_delivery_priority(delivery)


def test_validate_priority_rejects_negative_urgency():
    delivery = PriorityDelivery(
        delivery_id=101,
        priority=5,
        urgency=-1,
    )

    with pytest.raises(ValueError):
        validate_delivery_priority(delivery)


def test_validate_priority_rejects_negative_remaining_time():
    delivery = PriorityDelivery(
        delivery_id=101,
        priority=5,
        remaining_minutes=-1,
    )

    with pytest.raises(ValueError):
        validate_delivery_priority(delivery)