import os
from fastapi import APIRouter, UploadFile, File, HTTPException
from pathlib import Path
from app.models.schemas import BatchPredictionResponse, SingleOrderRequest, SingleOrderResponse
from app.services.ml_service import MlSerivce
import pandas as pd
import io
import numpy as np

router = APIRouter()

# Search for model_artifacts in backend/ or backend/app/
_base_path = Path(__file__).resolve()
_env_artifacts = os.getenv("MODEL_ARTIFACTS_DIR")
if _env_artifacts and Path(_env_artifacts).exists():
    ARTIFACTS_DIR = Path(_env_artifacts)
else:
    ARTIFACTS_DIR = (
        _base_path.parents[4] / "model_artifacts"
        if (_base_path.parents[4] / "model_artifacts").exists()
        else _base_path.parent.parent.parent.parent / "model_artifacts"
    )
ml_service = MlSerivce(artifact_dir=ARTIFACTS_DIR)


@router.post("/predict", response_model=BatchPredictionResponse)
async def predict_batch(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload a CSV file.")

    try:
        content = await file.read()
        df = pd.read_csv(io.BytesIO(content))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading CSV file: {str(e)}")

    try:
        results = ml_service.predict_batch(df)
        return results
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))


@router.post("/predict/single", response_model=SingleOrderResponse)
async def predict_single(order: SingleOrderRequest):
    """
    Evaluates instant ML prediction for an individual order with default parameters
    for missing operational features.
    """
    try:
        mode = order.shipping_mode or "Standard Class"
        scheduled_days = 4 if "Standard" in mode else (2 if "Second" in mode else (1 if "First" in mode else 0))

        single_row = {
            "Order Id": [int(order.order_id)],
            "order date (DateOrders)": [str(order.order_date or "1/1/2018 00:00")],
            "Shipping Mode": [mode],
            "Customer City": [str(order.customer_city or "Unknown")],
            "Days for shipment (scheduled)": [scheduled_days],
            "Type": ["DEBIT"],
            "Benefit per order": [50.0],
            "Order Item Quantity": [1],
            "Order Item Total": [150.0],
            "Order Item Discount": [0.0],
            "Order Item Discount Rate": [0.0],
            "Order Item Product Price": [150.0],
            "Order Item Profit Ratio": [0.2],
            "Latitude": [18.25],
            "Longitude": [-66.03],
            "Order Status": ["COMPLETE"],
            "Category Name": ["Sporting Goods"],
            "Customer Segment": ["Consumer"],
            "Market": ["Pacific Asia"],
            "Order Region": ["South Asia"],
            "Order Country": ["India"],
            "Department Name": ["Fitness"],
            "Customer Country": ["EE. UU."],
            "Customer State": ["CA"],
            "Product Card Id": [1360],
        }

        df = pd.DataFrame(single_row)
        batch_results = ml_service.predict_batch(df)

        if batch_results and batch_results.get("data"):
            first = batch_results["data"][0]
            return SingleOrderResponse(
                order_id=first["order_id"],
                is_delayed=first["is_delayed"],
                delay_probability=first["delay_probability"],
                risk_level=first["risk_level"],
            )

        raise HTTPException(status_code=500, detail="Failed to compute single order prediction.")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
