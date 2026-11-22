# DelaySense

> **AI-powered supply-chain delay prediction and risk intelligence**

DelaySense helps logistics teams identify shipment-delay risk before it becomes an operational problem. Upload a shipment manifest, inspect per-order probabilities and risk levels, or simulate a single order through an interactive prediction workbench.

The project is organized as a full-stack application:

- **Frontend:** Next.js 14, React, TypeScript, and Tailwind CSS
- **Backend:** FastAPI with a versioned REST API
- **ML service:** Ensemble inference using LightGBM, CatBoost, XGBoost, and a meta-learner
- **Data science:** Jupyter notebook and the DataCo Supply Chain dataset

## Features

- Batch prediction from a CSV shipment manifest
- Single-order prediction simulator
- Delay probability, binary delay prediction, and Low/Medium/High risk classification
- Summary metrics for total orders, delayed orders, on-time orders, delay rate, and processing time
- Searchable and exportable prediction results in the web interface
- Backend/model health status indicator
- Sample manifests for trying the application without preparing a dataset
- FastAPI Swagger documentation at `/docs`
- Graceful frontend fallback behavior when the API is unavailable

## How it works

1. The frontend submits a CSV file to `POST /api/v1/predict`.
2. The backend validates the manifest against the saved feature configuration.
3. The preprocessing pipeline engineers date, order, route, deadline, and financial features.
4. Categorical values are encoded using the persisted ordinal encoder.
5. The LightGBM, CatBoost, and XGBoost models generate base probabilities.
6. The meta-learner combines those probabilities into the final delay probability.
7. The API returns per-order predictions and aggregate summary metrics.

The bundled model artifacts are located in [`backend/model_artifacts/`](./backend/model_artifacts/).

## Project structure

```text
DelaySense/
├── backend/
│   ├── app/
│   │   ├── api/v1/endpoints/       # Health and prediction routes
│   │   ├── models/                 # Pydantic request/response schemas
│   │   └── services/               # Preprocessing and ML inference
│   ├── model_artifacts/            # Persisted models, encoders, and feature config
│   ├── tests/                      # Backend tests
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/app/                    # Next.js App Router entry points
│   ├── src/components/             # UI sections and workbench components
│   ├── src/lib/api.ts              # Backend client and sample-data handling
│   ├── public/                     # Sample CSV files
│   └── package.json
├── notebook/
│   └── Data_Supply_Chain.ipynb     # Exploration and model-development notebook
├── DataCoSupplyChainDataset.csv    # Root dataset
└── test_orders.csv                 # Example input manifest
```

## Prerequisites

- Node.js 18 or newer
- npm
- Python version specified in [`.python-version`](./.python-version), or a compatible Python 3.12+ environment
- The model artifact files tracked in `backend/model_artifacts/`

## Quick start

Clone the repository and create separate environments for the backend and frontend.

### 1. Start the FastAPI backend

```bash
cd backend
python -m venv .venv

# Linux/macOS
source .venv/bin/activate

# Windows PowerShell
# .venv\Scripts\Activate.ps1

python -m pip install --upgrade pip
pip install -r requirements.txt
cp .env.example .env

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend is available at:

- API root: http://localhost:8000/
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- Health check: http://localhost:8000/api/v1/health

### 2. Start the Next.js frontend

In a second terminal:

```bash
cd frontend
npm install
printf "NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1\n" > .env.local
npm run dev
```

Open http://localhost:3000 in your browser.

`NEXT_PUBLIC_API_URL` is optional; the frontend defaults to `http://localhost:8000/api/v1`.

## Using the application

### Batch prediction

1. Open the **Batch Manifest** tab.
2. Drop a UTF-8 CSV file into the upload area, or load the built-in sample dataset.
3. Review the prediction summary and per-order results.
4. Filter or export the result table as needed.

The repository includes ready-to-use examples:

- [`test_orders.csv`](./test_orders.csv)
- [`frontend/public/sample_orders.csv`](./frontend/public/sample_orders.csv)
- [`backend/model_artifacts/sample_orders.csv`](./backend/model_artifacts/sample_orders.csv)

### Single-order simulation

Open the **Single Order Simulator** tab and provide the order ID, customer city, shipping mode, and order date. The backend supplies sensible defaults for the remaining model features and returns an immediate risk assessment.

## CSV input requirements

The production model was trained on the DataCo Supply Chain schema. For the most reliable predictions, provide the same columns as [`DataCoSupplyChainDataset.csv`](./DataCoSupplyChainDataset.csv), including:

- `Order Id`
- `order date (DateOrders)`
- `Shipping Mode`
- `Customer City`
- `Customer Country`
- `Customer State`
- `Market`
- `Order Region`
- `Order Country`
- `Order State`
- `Order Status`
- `Days for shipment (scheduled)`
- `Order Item Quantity`
- `Order Item Total`
- `Order Item Discount`
- `Order Item Discount Rate`
- `Order Item Product Price`
- `Order Item Profit Ratio`
- `Product Card Id`

The exact required feature set is stored in [`backend/model_artifacts/feature_config.json`](./backend/model_artifacts/feature_config.json). Column names are case-sensitive. `Order Id` must be present and cannot be entirely null.

## API reference

### `GET /api/v1/health`

Returns service and model readiness:

```json
{
  "status": "healthy",
  "model_loaded": true,
  "version": "0.1.0"
}
```

### `POST /api/v1/predict`

Accepts a CSV file as multipart form data:

```bash
curl -X POST http://localhost:8000/api/v1/predict \
  -F "file=@test_orders.csv"
```

Response shape:

```json
{
  "summary": {
    "total_orders": 100,
    "delayed_count": 38,
    "on_time_count": 62,
    "delay_rate": 38.0,
    "processing_time_ms": 142.5
  },
  "columns": [
    "order_id",
    "is_delayed",
    "delay_probability",
    "risk_level"
  ],
  "data": [
    {
      "order_id": 75939,
      "is_delayed": 1,
      "delay_probability": 0.84,
      "risk_level": "High"
    }
  ]
}
```

### `POST /api/v1/predict/single`

Request:

```json
{
  "order_id": 75939,
  "customer_city": "Bikaner",
  "shipping_mode": "Standard Class",
  "order_date": "1/13/2018 12:27"
}
```

The response contains the same risk fields for one order.

## Configuration

Backend settings can be placed in [`backend/.env`](./backend/.env), using [`backend/.env.example`](./backend/.env.example) as a template:

| Variable | Default | Description |
| --- | --- | --- |
| `ENVIRONMENT` | `development` | Runtime environment name |
| `HOST` | `0.0.0.0` | Backend bind host |
| `PORT` | `8000` | Backend port |
| `CORS_ORIGINS` | `http://localhost:3000` | Allowed frontend origins |
| `LOG_LEVEL` | `INFO` | Application log level |

The current FastAPI application also includes common localhost origins for local development.

## Development commands

### Frontend

```bash
cd frontend
npm run dev       # Start development server
npm run build     # Create a production build
npm run start     # Serve the production build
npm run lint      # Run Next.js linting
```

### Backend

```bash
cd backend
pytest
```

The backend tests cover API behavior and inference. If your environment does not have `pytest`, install it in the backend virtual environment before running the suite.

## Notebook and model artifacts

The notebook in [`notebook/Data_Supply_Chain.ipynb`](./notebook/Data_Supply_Chain.ipynb) contains the data-science workflow for exploring the supply-chain dataset and developing models. Its dependencies are listed separately in [`notebook/requirements.txt`](./notebook/requirements.txt).

The API does not train models at request time. It loads the persisted artifacts at startup:

- LightGBM model
- CatBoost model
- XGBoost model
- Meta-learner
- Ordinal encoder
- Feature configuration and preprocessing metadata

If artifacts are regenerated, keep the filenames and feature configuration compatible with `backend/app/services/ml_service.py` and `backend/app/services/preprocessor.py`.

## Troubleshooting

### The frontend reports that the backend is offline

Verify that the backend is running on port 8000 and that `frontend/.env.local` contains:

```text
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

Restart the Next.js development server after changing environment variables.

### The API rejects a CSV

Check that:

- The file extension is `.csv`.
- The file is not empty.
- Required column names match the training schema exactly.
- `Order Id` exists and contains at least one value.
- The file is encoded as UTF-8.

### Predictions are unavailable

Confirm that the model files exist in `backend/model_artifacts/`, especially `lgb_model.joblib`, `cat_model.joblib`, `xgb_model.joblib`, `meta_learner.joblib`, `ordinal_encoder.joblib`, and `feature_config.json`.

## License

No license file is currently included in this repository. Add a license before distributing DelaySense outside the project or using it as a third-party dependency.
