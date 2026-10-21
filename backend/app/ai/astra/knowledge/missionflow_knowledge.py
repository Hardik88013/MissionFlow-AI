MISSIONFLOW_KNOWLEDGE = {
    "product": {
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
        "tagline": "Mission Ready. Always Ahead.",
    },

    "astra": {
        "name": "Astra AI",
        "creator": "Devraj Menon K",
        "role": (
            "MissionFlow's operations intelligence copilot. Astra interprets "
            "questions, retrieves operational data, invokes ETA and routing "
            "capabilities, and synthesizes concise operational briefings."
        ),
        "capabilities": [
            "Live fleet position and status queries",
            "Vehicle location and ETA information",
            "Route and stop tracking",
            "Operational briefings and alerts",
            "Mission context understanding",
            "Quick operational answers",
        ],
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

    "dashboard": {
        "sections": [
            "Live Mission Network Map",
            "Active Vehicles Panel",
            "Vehicle Details",
            "KPI Cards",
            "AI Insights",
            "Recent Alerts",
            "Analytics",
        ],
    },

    "fleet": {
        "vehicles": [
            {"id": 101, "name": "TRK-01"},
            {"id": 102, "name": "TRK-02"},
            {"id": 103, "name": "TRK-03"},
            {"id": 104, "name": "TRK-04"},
            {"id": 105, "name": "TRK-05"},
        ],
        "statuses": ["en_route", "at_base", "delayed", "idle", "delivered"],
    },

    "team": {
        "founders": ["Devraj Menon K"],
        "developers": ["Devraj Menon K"],
    },
}


def get_missionflow_knowledge():
    return MISSIONFLOW_KNOWLEDGE
