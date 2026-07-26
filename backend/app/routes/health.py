from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter(tags=["Health"])


class HealthResponse(BaseModel):
    status: str = Field(
        ...,
        examples=["healthy"],
        description="Current health status of the API.",
    )


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Health check",
    description="Returns the current health status of the HTE Compass backend.",
)
async def health_check() -> HealthResponse:
    return HealthResponse(status="healthy")
