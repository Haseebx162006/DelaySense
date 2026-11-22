from fastapi import FastAPI, APIRouter
from app.api.v1.api import api_router
from fastapi.middleware.cors import CORSMiddleware


origin_api_router = APIRouter()


app = FastAPI(title="ML Model API", version="1.0.0")

origin_api_router.include_router(api_router, prefix="/api/v1")
app.include_router(origin_api_router)


origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://localhost",
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")
def root():
    return {"message": "Welcome to the ML Model API. Visit /docs for API documentation."}
