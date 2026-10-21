from typing import Any, Dict


def get_operations_summary() -> Dict[str, Any]:
    """
    Safe Astra v1 operations snapshot.

    This will later consume the real fleet and delivery services.
    """

    return {
        "vehicle_count": 4,
        "active_vehicle_count": 3,
        "active_delivery_count": 5,
        "source": "demo",
    }
