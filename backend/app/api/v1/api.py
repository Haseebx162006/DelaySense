from fastapi import APIRouter

try:
    from app.api.v1.endpoints import predict, health
except ImportError:
    from backend.app.api.v1.endpoints import predict, health

# Here I create the master API router for version 1 of our application.
# I combine our prediction and health endpoints with tags so they are organized neatly in Swagger docs.
api_router = APIRouter()

api_router.include_router(predict.router, tags=["Predictions"])
api_router.include_router(health.router, tags=["Health"])
