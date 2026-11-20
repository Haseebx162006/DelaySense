from fastapi import FastAPI, APIRouter
from backend.app.api.v1.api import api_router
from fastapi.middleware.cors import CORSMiddleware


origin_api_router = APIRouter()


app = FastAPI(title="ML Model API", version="1.0.0")

origin_api_router.include_router(api_router, prefix="/api/v1")


origins=[
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:3000",
    "*"
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
