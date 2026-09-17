"""
MissionFlow AI
Vehicle Routing Time Windows

Utilities for validating delivery time windows and applying
time-window constraints to OR-Tools routing problems.
"""

from typing import Sequence, Tuple


TimeWindow = Tuple[int, int]


def validate_time_windows(
    time_windows: Sequence[TimeWindow],
) -> None:
    """
    Validate delivery time windows.

    Each time window is represented as:
        (earliest_time, latest_time)

    Time values can be represented in minutes from the start
    of the operating day.

    Examples
    --------
    (540, 660)  -> 09:00 to 11:00
    (600, 780)  -> 10:00 to 13:00
    """

    if not time_windows:
        raise ValueError("time_windows cannot be empty.")

    for index, window in enumerate(time_windows):

        if len(window) != 2:
            raise ValueError(
                f"Time window at index {index} must contain "
                "exactly two values."
            )

        earliest, latest = window

        if earliest < 0:
            raise ValueError(
                f"Earliest time at index {index} cannot be negative."
            )

        if latest < 0:
            raise ValueError(
                f"Latest time at index {index} cannot be negative."
            )

        if earliest > latest:
            raise ValueError(
                f"Earliest time cannot be greater than latest time "
                f"at index {index}."
            )


def validate_time_window(
    earliest_time: int,
    latest_time: int,
) -> bool:
    """
    Validate a single time window.

    Returns
    -------
    bool
        True when the time window is valid.
    """

    if earliest_time < 0:
        raise ValueError("earliest_time cannot be negative.")

    if latest_time < 0:
        raise ValueError("latest_time cannot be negative.")

    if earliest_time > latest_time:
        raise ValueError(
            "earliest_time cannot be greater than latest_time."
        )

    return True


def minutes_from_midnight(
    hour: int,
    minute: int = 0,
) -> int:
    """
    Convert a clock time into minutes from midnight.

    Example
    -------
    09:30 -> 570
    """

    if not 0 <= hour <= 23:
        raise ValueError("hour must be between 0 and 23.")

    if not 0 <= minute <= 59:
        raise ValueError("minute must be between 0 and 59.")

    return hour * 60 + minute


def time_window_from_clock(
    start_hour: int,
    start_minute: int,
    end_hour: int,
    end_minute: int,
) -> TimeWindow:
    """
    Create a time window using normal clock times.

    Example
    -------
    09:00 to 11:00
    -> (540, 660)
    """

    start_time = minutes_from_midnight(
        start_hour,
        start_minute,
    )

    end_time = minutes_from_midnight(
        end_hour,
        end_minute,
    )

    validate_time_window(
        start_time,
        end_time,
    )

    return start_time, end_time