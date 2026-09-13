"""
MissionFlow AI
Route Optimization API Schemas
"""

from typing import List, Optional, Tuple

from pydantic import BaseModel, Field


class RouteOptimizeRequest(BaseModel):
    """Input required to optimize delivery routes."""

    distance_matrix: List[List[int]] = Field(
        ...,
        description="Distance matrix in meters.",
    )

    vehicle_count: int = Field(
        ...,
        gt=0,
        description="Number of available vehicles.",
    )

    depot: int = Field(
        default=0,
        ge=0,
        description="Depot node index.",
    )

    vehicle_capacities: Optional[List[int]] = Field(
        default=None,
        description="Vehicle capacities.",
    )

    demands: Optional[List[int]] = Field(
        default=None,
        description="Delivery demand for each node.",
    )

    time_windows: Optional[List[Tuple[int, int]]] = Field(
        default=None,
        description="Delivery time windows in minutes from midnight.",
    )

    travel_speed_kmh: float = Field(
        default=40.0,
        gt=0,
        description="Average vehicle travel speed.",
    )

    service_time_minutes: int = Field(
        default=10,
        ge=0,
        description="Service time at each delivery stop.",
    )


class OptimizedRoute(BaseModel):
    """Route assigned to one vehicle."""

    vehicle_id: int
    route: List[int]
    distance_meters: int


class RouteOptimizeResponse(BaseModel):
    """Optimized route response."""

    routes: List[OptimizedRoute]
    total_distance_meters: int