import pytest

from optimization.routing.distance_matrix import (
    build_distance_matrix,
    haversine_distance_km,
)


def test_haversine_distance_is_positive():
    distance = haversine_distance_km(
        (10.0, 10.0),
        (10.01, 10.01),
    )

    assert distance > 0


def test_haversine_distance_same_point_is_zero():
    distance = haversine_distance_km(
        (10.0, 10.0),
        (10.0, 10.0),
    )

    assert distance == 0


def test_build_distance_matrix_is_square():
    coordinates = [
        (10.0, 10.0),
        (10.01, 10.01),
        (10.02, 10.02),
    ]

    matrix = build_distance_matrix(coordinates)

    assert len(matrix) == 3
    assert all(len(row) == 3 for row in matrix)


def test_build_distance_matrix_has_zero_diagonal():
    coordinates = [
        (10.0, 10.0),
        (10.01, 10.01),
        (10.02, 10.02),
    ]

    matrix = build_distance_matrix(coordinates)

    assert matrix[0][0] == 0
    assert matrix[1][1] == 0
    assert matrix[2][2] == 0


def test_build_distance_matrix_is_symmetric():
    coordinates = [
        (10.0, 10.0),
        (10.01, 10.01),
        (10.02, 10.02),
    ]

    matrix = build_distance_matrix(coordinates)

    assert matrix[0][1] == matrix[1][0]
    assert matrix[0][2] == matrix[2][0]
    assert matrix[1][2] == matrix[2][1]