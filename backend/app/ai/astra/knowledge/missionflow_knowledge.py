MISSIONFLOW_KNOWLEDGE = {
    "identity": {
        "name": "MissionFlow AI",
        "description": (
            "MissionFlow AI is an AI-powered mission-critical logistics "
            "platform for deliveries, fleet operations, ETA prediction, "
            "route optimization, live tracking, analytics, and operational intelligence."
        ),
        "purpose": (
            "It helps operations teams plan missions, monitor vehicles and deliveries, "
            "predict arrival times, optimize routes, respond to disruptions, and make "
            "data-driven operational decisions."
        ),
    },

    "features": [
        "AI-powered ETA prediction",
        "Vehicle routing and route optimization",
        "Live fleet and vehicle tracking",
        "Delivery monitoring",
        "Delivery priority analysis",
        "Vehicle assignment",
        "Route disruption detection",
        "Dynamic rerouting",
        "Operational analytics",
        "Astra AI operations copilot",
    ],

    "technology": [
        "Python",
        "FastAPI",
        "React",
        "TypeScript",
        "scikit-learn",
        "OR-Tools",
        "WebSockets",
        "Machine Learning",
    ],

    "team": {
        "founders": [],
        "developers": [],
    },

    "astra": {
        "name": "Astra AI",
        "role": (
            "MissionFlow's operations intelligence copilot. Astra interprets "
            "questions, retrieves operational data, invokes ETA and routing "
            "capabilities, and synthesizes concise operational briefings."
        ),
    },
}


def get_missionflow_knowledge():
    return MISSIONFLOW_KNOWLEDGE
