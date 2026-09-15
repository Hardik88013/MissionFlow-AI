import ast
import math
from typing import Any

import pandas as pd


GPS_INTERVAL_SECONDS = 15


def parse_polyline(polyline: Any) -> list[list[float]]:
    """Convert the POLYLINE string into [[longitude, latitude], ...]."""
    if pd.isna(polyline):
        return []

    try:
        points = ast.literal_eval(polyline)

        if not isinstance(points, list):
            return []

        return [
            [float(point[0]), float(point[1])]
            for point in points
            if isinstance(point, (list, tuple)) and len(point) >= 2
        ]

    except (ValueError, SyntaxError, TypeError):
        return []


def haversine_distance_km(
    lon1: float,
    lat1: float,
    lon2: float,
    lat2: float,
) -> float:
    """Calculate distance between two GPS coordinates in kilometers."""
    earth_radius_km = 6371.0

    lon1_rad = math.radians(lon1)
    lat1_rad = math.radians(lat1)
    lon2_rad = math.radians(lon2)
    lat2_rad = math.radians(lat2)

    delta_lon = lon2_rad - lon1_rad
    delta_lat = lat2_rad - lat1_rad

    a = (
        math.sin(delta_lat / 2) ** 2
        + math.cos(lat1_rad)
        * math.cos(lat2_rad)
        * math.sin(delta_lon / 2) ** 2
    )

    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return earth_radius_km * c


def calculate_route_distance(points: list[list[float]]) -> float:
    """Calculate total route distance from consecutive GPS points."""
    if len(points) < 2:
        return 0.0

    distance = 0.0

    for index in range(1, len(points)):
        previous = points[index - 1]
        current = points[index]

        distance += haversine_distance_km(
            previous[0],
            previous[1],
            current[0],
            current[1],
        )

    return distance


def calculate_trip_duration_minutes(points: list[list[float]]) -> float:
    """Calculate trip duration from the number of GPS observations."""
    if len(points) < 2:
        return 0.0

    return ((len(points) - 1) * GPS_INTERVAL_SECONDS) / 60.0


def extract_route_features(row: pd.Series) -> dict[str, Any]:
    """Extract route-based features from one trip."""
    points = parse_polyline(row["POLYLINE"])

    distance_km = calculate_route_distance(points)
    duration_minutes = calculate_trip_duration_minutes(points)

    if duration_minutes > 0:
        average_speed_kmh = distance_km / (duration_minutes / 60.0)
    else:
        average_speed_kmh = 0.0

    if points:
        start_longitude = points[0][0]
        start_latitude = points[0][1]
        end_longitude = points[-1][0]
        end_latitude = points[-1][1]
    else:
        start_longitude = None
        start_latitude = None
        end_longitude = None
        end_latitude = None

    return {
        "distance_km": distance_km,
        "trip_duration_minutes": duration_minutes,
        "average_speed_kmh": average_speed_kmh,
        "start_longitude": start_longitude,
        "start_latitude": start_latitude,
        "end_longitude": end_longitude,
        "end_latitude": end_latitude,
        "trajectory_points": len(points),
    }


def build_eta_features(df: pd.DataFrame) -> pd.DataFrame:
    """Build ETA features from the Porto taxi trajectory dataset."""
    data = df.copy()

    timestamp = pd.to_datetime(data["TIMESTAMP"], unit="s")

    data["hour"] = timestamp.dt.hour
    data["day_of_week"] = timestamp.dt.dayofweek
    data["month"] = timestamp.dt.month

    data["is_weekend"] = (data["day_of_week"] >= 5).astype(int)

    route_features = data.apply(extract_route_features, axis=1)

    route_features_df = pd.DataFrame(
        route_features.tolist(),
        index=data.index,
    )

    data = pd.concat([data, route_features_df], axis=1)

    data["call_type"] = data["CALL_TYPE"].astype(str)
    data["day_type"] = data["DAY_TYPE"].astype(str)

    data["origin_call_known"] = data["ORIGIN_CALL"].notna().astype(int)
    data["origin_stand_known"] = data["ORIGIN_STAND"].notna().astype(int)

    return data


def get_eta_feature_columns() -> list[str]:
    """Return numerical features used by the ETA model."""
    return [
        "distance_km",
        "average_speed_kmh",
        "trajectory_points",
        "hour",
        "day_of_week",
        "month",
        "is_weekend",
        "origin_call_known",
        "origin_stand_known",
    ]


def prepare_eta_dataset(
    df: pd.DataFrame,
    minimum_duration_minutes: float = 1.0,
    maximum_duration_minutes: float = 180.0,
) -> pd.DataFrame:
    """Create a cleaned dataset suitable for ETA model training."""
    data = build_eta_features(df)

    data = data[
        (data["trip_duration_minutes"] >= minimum_duration_minutes)
        & (data["trip_duration_minutes"] <= maximum_duration_minutes)
        & (data["distance_km"] > 0)
        & (data["trajectory_points"] >= 2)
    ].copy()

    data = data.drop_duplicates(subset=["TRIP_ID"])

    return data.reset_index(drop=True)