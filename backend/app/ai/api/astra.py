from fastapi import APIRouter
from pydantic import BaseModel, Field

from backend.app.ai.astra.agent import astra_agent


router = APIRouter(
    prefix="/ai/astra",
    tags=["Astra AI"],
)


class AstraRequest(BaseModel):
    message: str = Field(
        ...,
        min_length=1,
        max_length=2000,
    )


class AstraResponse(BaseModel):
    message: str
    tool: str | None = None
    data: dict | None = None


@router.get("/health")
def astra_health() -> dict:
    return {
        "status": "online",
        "name": "Astra AI",
        "version": "1.0",
    }


@router.post("/chat", response_model=AstraResponse)
def astra_chat(
    request: AstraRequest,
) -> AstraResponse:

    result = astra_agent.run(request.message)

    return AstraResponse(**result)
