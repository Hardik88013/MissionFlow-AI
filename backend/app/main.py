"""
MissionFlow AI
FastAPI Application
"""
from backend.app.api.fleet_tracking import router as fleet_tracking_router
from backend.app.websocket.fleet_tracking import (
    fleet_tracking_websocket,
)
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api.predictions_eta import router as eta_router
from backend.app.api.routes import router as routes_router


app = FastAPI(
    title="MissionFlow AI API",
    description="Mission-critical logistics API",
    version="1.0.0",
)


# ============================================================
# CORS CONFIGURATION
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        # Vite development server
        "http://localhost:5173",
        "http://127.0.0.1:5173",

        # Current frontend port
        "http://localhost:5174",
        "http://127.0.0.1:5174",

        # Vite preview server
        "http://localhost:4173",
        "http://127.0.0.1:4173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# API ROUTES
# ============================================================

# ETA Prediction API
app.include_router(eta_router)

# Route Optimization API
app.include_router(routes_router)
app.include_router(fleet_tracking_router)

# ============================================================
# FLEET TRACKING WEBSOCKET
# ============================================================

@app.websocket("/ws/fleet")
async def fleet_tracking_endpoint(websocket: WebSocket):
    await fleet_tracking_websocket(websocket)


# ============================================================
# ROOT ENDPOINT
# ============================================================

@app.get("/")
def root():
    return {
        "message": "MissionFlow AI API is running"
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }