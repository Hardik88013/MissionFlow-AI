from typing import Any, Dict

from backend.app.ai.astra.knowledge.codebase_retriever import (
    get_codebase_context,
)

from backend.app.ai.astra.tools.analytics_tools import get_operations_summary
from backend.app.ai.astra.tools.eta_tools import predict_delivery_eta
from backend.app.ai.astra.tools.route_tools import optimize_routes

from backend.app.ai.astra.tools.knowledge_tools import (
    get_astra_identity,
    get_astra_info,
    get_missionflow_info,
    get_team_info,
)

from backend.app.ai.astra.tools.time_tools import get_current_time
from backend.app.ai.astra.tools.fleet_tools import (
    get_live_fleet_state,
    get_vehicle_location,
    get_vehicle_status,
    get_vehicle_eta,
    get_vehicle_by_name,
    get_delayed_vehicles,
    get_en_route_count,
)

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

        # IDENTITY QUESTIONS
        # "Who made you?" "Who created you?" "Who developed you?"
        if any(phrase in lower for phrase in [
            "who made",
            "who created",
            "who developed",
            "who built",
            "who is your creator",
            "who is behind you",
            "who developed astra",
        ]):

            data = get_astra_identity()

            context = f"""
ASTRA IDENTITY - DO NOT VARY:

Creator: {data['creator']}
Name: {data['name']}
Role: {data['role']}

INSTRUCTION:
When asked who created you, answer naturally:
"I was created by Devraj Menon K."

Optionally add: "I'm Astra AI, the operations intelligence copilot for MissionFlow AI."
"""

            answer = ask_local_model(
                message,
                context=context,
            )

            return {
                "message": answer,
                "tool": "get_astra_identity",
                "data": data,
            }

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

        # LIVE FLEET LOCATION QUERIES
        # "Where is TRK-02?" "Where's truck 2?" "Show me TRK-01"
        if any(phrase in lower for phrase in [
            "where is",
            "where's",
            "location of",
            "find",
            "show me",
            "locate",
        ]):
            
            # Try to extract vehicle reference
            vehicle_id = None
            vehicle_name = None
            
            # Check for TRK-XX pattern
            import re
            trk_match = re.search(r'trk-?(\d+)', lower)
            if trk_match:
                try:
                    num = int(trk_match.group(1))
                    vehicle_id = 100 + num
                    vehicle_name = f"TRK-{num:02d}"
                except ValueError:
                    pass
            
            # Try to resolve from natural language
            if not vehicle_id:
                # Extract potential vehicle name
                words = message.split()
                for i, word in enumerate(words):
                    if word.lower().startswith("trk"):
                        if i + 1 < len(words):
                            vehicle_name = f"{words[i]} {words[i+1]}"
                            resolved_id = get_vehicle_by_name(vehicle_name)
                            if resolved_id:
                                vehicle_id = resolved_id
                                break
                
                # Try single word
                if not vehicle_id and len(words) > 0:
                    vehicle_name = words[-1]
                    resolved_id = get_vehicle_by_name(vehicle_name)
                    if resolved_id:
                        vehicle_id = resolved_id
            
            if vehicle_id:
                location_data = get_vehicle_location(vehicle_id)
                status_data = get_vehicle_status(vehicle_id)
                
                if location_data and status_data:
                    data = {
                        "vehicle_id": vehicle_id,
                        "vehicle_name": vehicle_name,
                        "location": location_data,
                        "status": status_data,
                    }
                    
                    context = f"""
LIVE VEHICLE LOCATION DATA:

Vehicle: {vehicle_name} (ID: {vehicle_id})
Current Location: {location_data['latitude']:.4f}° N, {location_data['longitude']:.4f}° E
Status: {status_data['status']}
Route: RT-{status_data['route_id']:02d}
Current Stop: {status_data['current_stop']}
ETA: {status_data['eta_minutes']:.1f} minutes if available

INSTRUCTION:
Provide the exact coordinates and status.
Keep the response concise and operational.
"""
                    
                    answer = ask_local_model(
                        message,
                        context=context,
                    )
                    
                    return {
                        "message": answer,
                        "tool": "get_vehicle_location",
                        "data": data,
                        "action": {
                            "type": "focus_vehicle",
                            "vehicle_id": vehicle_id,
                        }
                    }

        # VEHICLE ETA QUERIES
        # "What's TRK-02's ETA?" "When will TRK-03 arrive?"
        if any(phrase in lower for phrase in [
            "eta",
            "arrival time",
            "when",
            "how long",
            "arrive",
        ]):
            
            # Try to extract vehicle ID
            vehicle_id = None
            import re
            trk_match = re.search(r'trk-?(\d+)', lower)
            if trk_match:
                try:
                    num = int(trk_match.group(1))
                    vehicle_id = 100 + num
                except ValueError:
                    pass
            
            if vehicle_id:
                eta_data = get_vehicle_eta(vehicle_id)
                
                if eta_data:
                    data = eta_data
                    
                    context = f"""
LIVE VEHICLE ETA DATA:

Vehicle: TRK-{vehicle_id - 100:02d}
Current Status: {eta_data['status']}
ETA: {eta_data['eta_minutes']:.1f} minutes

INSTRUCTION:
Provide the ETA in a clear operational manner.
Keep response concise.
"""
                    
                    answer = ask_local_model(
                        message,
                        context=context,
                    )
                    
                    return {
                        "message": answer,
                        "tool": "get_vehicle_eta",
                        "data": data,
                    }

        # OPERATIONAL BRIEFING
        if any(phrase in lower for phrase in [
            "what needs",
            "urgent",
            "alert",
            "delayed",
            "any issues",
            "problems",
        ]):
            
            delayed = get_delayed_vehicles()
            en_route = get_en_route_count()
            
            data = {
                "delayed_vehicles": delayed,
                "en_route_count": en_route,
            }
            
            if delayed:
                delayed_info = ", ".join([
                    f"TRK-{v['vehicle_id']-100:02d}" 
                    for v in delayed
                ])
                context = f"""
OPERATIONAL BRIEFING:

Delayed Vehicles: {delayed_info}
En Route: {en_route} vehicles

INSTRUCTION:
Summarize operational status.
Flag delayed vehicles.
Keep response concise and actionable.
"""
            else:
                context = f"""
OPERATIONAL BRIEFING:

Delayed Vehicles: None
En Route: {en_route} vehicles
Status: All nominal

INSTRUCTION:
Provide a brief operational summary.
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

        # ETA
        if any(word in lower for word in [
            "eta prediction",
            "predict eta",
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
            "route optimization",
            "optimize route",
            "routing",
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
            "what is missionflow",
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
            "your capabilities",
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
