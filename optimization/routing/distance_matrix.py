"""
MissionFlow AI
Distance Matrix Utilities

Calculates geographic distance matrices from latitude/longitude
coordinates using the Haversine formula.
"""

from math import asin, cos, radians, sin, sqrt
from typing import List, Sequence, Tuple


Coordinate = Tuple[float, float]


def haversine_distance_km(
    origin: Coordinate,
    destination: Coordinate,
) -> float:
    """
    Calculate the great-circle distance between two coordinates.

    Parameters
    ----------
    origin:
        (latitude, longitude)

    destination:
        (latitude, longitude)

    Returns
    -------
    float
        Distance in kilometers.
    """

    origin_lat, origin_lon = origin
    destination_lat, destination_lon = destination

    lat1 = radians(origin_lat)
    lon1 = radians(origin_lon)
    lat2 = radians(destination_lat)
    lon2 = radians(destination_lon)

    delta_lat = lat2 - lat1
    delta_lon = lon2 - lon1

    a = (
        sin(delta_lat / 2) ** 2
        + cos(lat1)
        * cos(lat2)
        * sin(delta_lon / 2) ** 2
    )

    c = 2 * asin(sqrt(a))

    earth_radius_km = 6371.0088

    return earth_radius_km * c


def build_distance_matrix(
    coordinates: Sequence[Coordinate],
) -> List[List[int]]:
    """
    Build a symmetric integer distance matrix.

    OR-Tools works best with integer costs, so distances are
    converted from kilometers to meters and rounded.

    Parameters
    ----------
    coordinates:
        Sequence of (latitude, longitude) coordinates.

    Returns
    -------
    list[list[int]]
        Distance matrix in meters.
    """

    number_of_locations = len(coordinates)

    matrix = [
        [0] * number_of_locations
        for _ in range(number_of_locations)
    ]

    for i in range(number_of_locations):
        for j in range(i + 1, number_of_locations):
            distance_km = haversine_distance_km(
                coordinates[i],
                coordinates[j],
            )

            distance_m = int(round(distance_km * 1000))

            matrix[i][j] = distance_m
            matrix[j][i] = distance_m

    return matrix