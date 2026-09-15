import pytest

from optimization.routing.time_windows import (
    minutes_from_midnight,
    time_window_from_clock,
    validate_time_window,
    validate_time_windows,
)


def test_validate_time_window_accepts_valid_window():
    assert validate_time_window(540, 660) is True


def test_validate_time_window_rejects_negative_earliest_time():
    with pytest.raises(ValueError):
        validate_time_window(-1, 660)


def test_validate_time_window_rejects_negative_latest_time():
    with pytest.raises(ValueError):
        validate_time_window(540, -1)


def test_validate_time_window_rejects_reversed_window():
    with pytest.raises(ValueError):
        validate_time_window(660, 540)


def test_validate_time_windows_accepts_multiple_windows():
    validate_time_windows(
        [
            (540, 660),
            (600, 780),
            (840, 960),
        ]
    )


def test_minutes_from_midnight():
    assert minutes_from_midnight(9, 30) == 570


def test_minutes_from_midnight_rejects_invalid_hour():
    with pytest.raises(ValueError):
        minutes_from_midnight(24, 0)


def test_minutes_from_midnight_rejects_invalid_minute():
    with pytest.raises(ValueError):
        minutes_from_midnight(10, 60)


def test_time_window_from_clock():
    assert time_window_from_clock(
        9,
        0,
        11,
        0,
    ) == (540, 660)