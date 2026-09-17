"""
MissionFlow AI - Astra AI operations agent.
"""

from typing import Any, Dict

from backend.app.ai.astra.tools.analytics_tools import (
    get_operations_summary,
)
from backend.app.ai.astra.tools.eta_tools import (
    predict_delivery_eta,
)
from backend.app.ai.astra.tools.route_tools import (
    optimize_routes,
)


class AstraAgent:
    """MissionFlow operations copilot."""

    def run(self, message: str) -> Dict[str, Any]:

        text = message.strip().lower()

        if not text:
            return {
                "message": "Tell me what you need help with.",
                "tool": None,
                "data": None,
            }

        # ETA
        if (
            "eta" in text
            or "arrival" in text
            or "how long" in text
        ):
            result = predict_delivery_eta()

            return {
                "message": (
                    "The current ETA model predicts approximately "
                    f"{result['predicted_eta_minutes']:.1f} "
                    "minutes for the demo mission."
                ),
                "tool": "predict_delivery_eta",
                "data": result,
            }

        # Route optimization
        if (
            "optimize" in text
            and ("route" in text or "routes" in text)
        ):
            result = optimize_routes()

            return {
                "message": (
                    "I optimized the demo routes. "
                    "Total planned distance is "
                    f"{result['total_distance_meters'] / 1000:.2f} km."
                ),
                "tool": "optimize_routes",
                "data": result,
            }

        # Fleet / mission
        if any(
            word in text
            for word in [
                "vehicle",
                "fleet",
                "delivery",
                "mission",
            ]
        ):
            result = get_operations_summary()

            return {
                "message": (
                    f"Mission status: "
                    f"{result['vehicle_count']} tracked vehicles, "
                    f"{result['active_vehicle_count']} currently active, "
                    f"and "
                    f"{result['active_delivery_count']} active deliveries."
                ),
                "tool": "get_operations_summary",
                "data": result,
            }

        return {
            "message": (
                "I can help with fleet status, deliveries, "
                "ETA predictions, route optimization, "
                "and mission analytics."
            ),
            "tool": None,
            "data": None,
        }


astra_agent = AstraAgent()
