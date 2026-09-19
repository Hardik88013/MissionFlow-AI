from typing import Any, Dict

from backend.app.ai.astra.knowledge.missionflow_knowledge import (
    get_missionflow_knowledge,
)


def get_astra_identity() -> Dict[str, Any]:
    """Get Astra's identity and creator information."""
    k = get_missionflow_knowledge()
    return {
        "name": k["astra"]["name"],
        "creator": k["astra"]["creator"],
        "role": k["astra"]["role"],
        "capabilities": k["astra"]["capabilities"],
    }


def get_missionflow_info() -> Dict[str, Any]:
    k = get_missionflow_knowledge()

    return {
        "name": k["product"]["name"],
        "description": k["product"]["description"],
        "purpose": k["product"]["purpose"],
        "tagline": k["product"]["tagline"],
        "features": k["features"],
        "technology": k["technology"],
    }


def get_astra_info() -> Dict[str, Any]:
    return get_missionflow_knowledge()["astra"]


def get_team_info() -> Dict[str, Any]:
    return get_missionflow_knowledge()["team"]

