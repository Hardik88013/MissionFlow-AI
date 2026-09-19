"""
MissionFlow AI
FastAPI Application
"""

import asyncio
from backend.app.ai.api.astra import router as astra_router
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api.fleet_tracking import router as fleet_tracking_router
from backend.app.api.predictions_eta import router as eta_router
from backend.app.api.routes import router as routes_router
from backend.app.api.auth import router as auth_router
from backend.app.websocket.fleet_tracking import (
    demo_vehicle_broadcaster,
    fleet_tracking_websocket,
)

from fastapi import Request, status
from fastapi.responses import JSONResponse
import traceback

app = FastAPI(
    title="MissionFlow AI API",
    description="Mission-critical logistics API",
    version="1.0.0",
)


@app.on_event("startup")
async def start_fleet_broadcaster():
    asyncio.create_task(demo_vehicle_broadcaster())


# Allow the Vite frontend during local development.
# This covers localhost/127.0.0.1 on any development port.
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(eta_router)
app.include_router(routes_router)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print("GLOBAL ERROR:", exc)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal Server Error"}
    )

app.include_router(fleet_tracking_router)
app.include_router(auth_router)
app.include_router(astra_router)


@app.websocket("/ws/fleet")
async def fleet_tracking_endpoint(websocket: WebSocket):
    await fleet_tracking_websocket(websocket)


@app.get("/")
def root():
    return {
        "message": "MissionFlow AI API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }
