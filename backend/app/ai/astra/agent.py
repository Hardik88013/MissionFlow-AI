from typing import Any, Dict

from backend.app.ai.astra.knowledge.codebase_retriever import (
    get_codebase_context,
)

from backend.app.ai.astra.tools.analytics_tools import get_operations_summary
from backend.app.ai.astra.tools.eta_tools import predict_delivery_eta
from backend.app.ai.astra.tools.route_tools import optimize_routes

from backend.app.ai.astra.tools.knowledge_tools import (
    get_astra_info,
    get_missionflow_info,
    get_team_info,
)

from backend.app.ai.astra.tools.time_tools import get_current_time

from backend.app.ai.astra.local_model import ask_local_model


class AstraAgent:

    def run(self, text: str) -> Dict[str, Any]:

        message = text.strip()

        if not message:
            return {
                "message": "Please provide a mission request.",
                "tool": None,
                "data": None,
            }

        lower = message.lower()

        # TIME
        if any(word in lower for word in [
            "what time",
            "current time",
            "today's date",
            "date today",
            "what date",
        ]):

            data = get_current_time()

            context = f"""
VERIFIED MISSIONFLOW TIME DATA:

{data}
"""

            answer = ask_local_model(
                message,
                context=context,
            )

            return {
                "message": answer,
                "tool": "get_current_time",
                "data": data,
            }

        # ETA
        if any(word in lower for word in [
            "eta",
            "arrival time",
            "delivery time",
            "how long",
            "arrive",
        ]):

            data = predict_delivery_eta()

            code_context = get_codebase_context(
                "ETA prediction predict_eta fleet tracking",
                max_results=3,
            )

            context = f"""
VERIFIED ETA RESULT:

{data}

RELEVANT MISSIONFLOW SOURCE:

{code_context}

Use the verified ETA result.
Do not invent another ETA.
"""

            answer = ask_local_model(
                message,
                context=context,
            )

            return {
                "message": answer,
                "tool": "predict_delivery_eta",
                "data": data,
            }

        # ROUTING
        if any(word in lower for word in [
            "route",
            "routing",
            "reroute",
            "optimize route",
            "optimization",
        ]):

            data = optimize_routes()

            code_context = get_codebase_context(
                "route optimization VRP vehicle capacity time windows",
                max_results=3,
            )

            context = f"""
VERIFIED ROUTE OPTIMIZATION RESULT:

{data}

RELEVANT MISSIONFLOW SOURCE:

{code_context}

Do not invent route results.
"""

            answer = ask_local_model(
                message,
                context=context,
            )

            return {
                "message": answer,
                "tool": "optimize_routes",
                "data": data,
            }

        # OPERATIONS
        if any(word in lower for word in [
            "fleet",
            "vehicles",
            "operations",
            "operational status",
            "mission status",
            "delivery status",
        ]):

            data = get_operations_summary()

            code_context = get_codebase_context(
                "fleet tracking vehicles operations delivery websocket",
                max_results=3,
            )

            context = f"""
MISSIONFLOW OPERATIONS DATA:

{data}

IMPORTANT:
The current operations summary is demo data.
Do not describe these numbers as confirmed live production data.

RELEVANT SOURCE:

{code_context}
"""

            answer = ask_local_model(
                message,
                context=context,
            )

            return {
                "message": answer,
                "tool": "get_operations_summary",
                "data": data,
            }

        # MISSIONFLOW
        if any(word in lower for word in [
            "missionflow",
            "features",
            "technology",
            "tech stack",
        ]):

            data = get_missionflow_info()

            code_context = get_codebase_context(
                message,
                max_results=5,
            )

            context = f"""
MISSIONFLOW DOCUMENTATION:

{data}

RELEVANT SOURCE CODE:

{code_context}
"""

            answer = ask_local_model(
                message,
                context=context,
            )

            return {
                "message": answer,
                "tool": "get_missionflow_info",
                "data": data,
            }

        # ASTRA
        if any(word in lower for word in [
            "who are you",
            "what are you",
            "what is astra",
            "astra ai",
            "your role",
        ]):

            data = get_astra_info()

            code_context = get_codebase_context(
                message,
                max_results=3,
            )

            context = f"""
ASTRA SYSTEM INFORMATION:

{data}

RELEVANT MISSIONFLOW SOURCE:

{code_context}
"""

            answer = ask_local_model(
                message,
                context=context,
            )

            return {
                "message": answer,
                "tool": "get_astra_info",
                "data": data,
            }

        # TEAM
        if any(word in lower for word in [
            "founder",
            "developer",
            "team",
            "creator",
        ]):

            data = get_team_info()

            answer = ask_local_model(
                message,
                context=f"MISSIONFLOW TEAM DATA:\n{data}",
            )

            return {
                "message": answer,
                "tool": "get_team_info",
                "data": data,
            }

        # GENERAL RAG
        code_context = get_codebase_context(
            message,
            max_results=5,
        )

        context = f"""
RELEVANT MISSIONFLOW SOURCE CODE:

{code_context}

GROUNDING RULES:

- Use the supplied MissionFlow source when answering.
- Do not invent MissionFlow functionality.
- If the source does not contain enough information, say so.
- You are Astra, MissionFlow's local AI operations copilot.
- Keep answers concise and useful.
"""

        answer = ask_local_model(
            message,
            context=context,
        )

        return {
            "message": answer,
            "tool": None,
            "data": None,
        }


astra_agent = AstraAgent()
