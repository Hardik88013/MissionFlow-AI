from typing import Any, Dict

from backend.app.ai.astra.knowledge.missionflow_knowledge import (
    get_missionflow_knowledge,
)


def get_missionflow_info() -> Dict[str, Any]:
    k = get_missionflow_knowledge()

    return {
        "name": k["identity"]["name"],
        "description": k["identity"]["description"],
        "purpose": k["identity"]["purpose"],
        "features": k["features"],
        "technology": k["technology"],
    }


def get_astra_info() -> Dict[str, Any]:
    return get_missionflow_knowledge()["astra"]


def get_team_info() -> Dict[str, Any]:
    return get_missionflow_knowledge()["team"]
