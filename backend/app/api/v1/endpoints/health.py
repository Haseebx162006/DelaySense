from pathlib import Path
from fastapi import APIRouter

try:
    from app.models.schemas import HealthResponse
except ImportError:
    from backend.app.models.schemas import HealthResponse

router = APIRouter()

ARTIFACTS_DIR = Path(__file__).resolve().parent.parent.parent.parent / "model_artifacts"


@router.get("/health", response_model=HealthResponse)
def check_health():
    # Here I provide a simple health check endpoint so the frontend or monitoring
    # can verify that our FastAPI backend is running and whether models are ready.
    model_exists = (
        (ARTIFACTS_DIR / "lgb_model.joblib").exists() or 
        (ARTIFACTS_DIR / "lgb_model.pkl").exists()
    )

    return HealthResponse(
        status="healthy",
        model_loaded=model_exists,
        version="0.1.0"
    )
