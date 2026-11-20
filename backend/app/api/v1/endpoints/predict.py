from fastapi import APIRouter, UploadFile,File, HTTPException
from pathlib import Path
from backend.app.models.schemas import BatchPredictionResponse
from backend.app.services.ml_service import MlSerivce
import pandas as pd
import io
import numpy as np

router = APIRouter()



ARTIFACTS_DIR = Path(__file__).resolve().parent.parent.parent.parent / "model_artifacts"
ml_service = MlSerivce(artifact_dir=ARTIFACTS_DIR)



@router.post("/predict",response_model= BatchPredictionResponse)
async def predict_batch(file:UploadFile=File(...)):


    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload a CSV file.")


    try:
        content = await file.read()

        df= pd.read_csv(io.BytesIO(content))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading CSV file: {str(e)}")


    try:
        results=ml_service.predict_batch(df)

        return results

    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))

    