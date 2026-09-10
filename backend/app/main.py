"""
MissionFlow AI
FastAPI Application
"""

from fastapi import FastAPI

from backend.app.api.predictions_eta import router as eta_router


app = FastAPI(
    title="MissionFlow AI API",
    description="Mission-critical logistics API",
    version="1.0.0",
)


# ETA Prediction API
app.include_router(eta_router)


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