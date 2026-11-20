from pathlib import Path
import joblib
import pandas as pd
import numpy as np
import time
from typing import Dict, Any, List, Optional

try:
    from app.services.preprocessor import DataPreProcessor
except ImportError:
    from backend.app.services.preprocessor import DataPreProcessor


class MlSerivce:

    def __init__(self, artifact_dir):
        # Here I initialize the ML service with the artifact directory path.
        # I create an instance of DataPreProcessor so I can preprocess any incoming data.
        # I also set up placeholders for our trained models and call load_models() to load them into memory.
        self.arttifact_dir = Path(artifact_dir)
        self.preprocessor = DataPreProcessor(artifact_dir)
        self.data_preprocessor = self.preprocessor
        self.threshold = getattr(self.preprocessor, "decision_threshold", 0.50)

        self.lgb_model = None
        self.cat_model = None
        self.xgb_model = None
        self.meta_learner = None

        self.load_models()

    @staticmethod
    def assign_risk_level(prob: float) -> str:
        # Here I convert the numeric probability into a simple risk category.
        # Low is under 35%, Medium is between 35% and 65%, and High is above 65%.
        if prob < 0.35:
            return "Low"
        elif prob <= 0.65:
            return "Medium"
        else:
            return "High"

    def load_models(self):
        # In this function I load all our trained models from the artifacts folder.
        # I check for both .joblib and .pkl files for LightGBM, CatBoost, XGBoost, and the Meta Learner.
        models = ["lgb_model", "cat_model", "xgb_model", "meta_learner"]

        for name in models:
            joblib_path = self.arttifact_dir / f"{name}.joblib"
            pkl_path = self.arttifact_dir / f"{name}.pkl"
            target_path = joblib_path if joblib_path.exists() else (pkl_path if pkl_path.exists() else None)

            if target_path and target_path.exists():
                setattr(self, name, joblib.load(target_path))
                print(f"{name} loaded successfully from {target_path.name}")
            else:
                print(f"{name} not found in {self.arttifact_dir}.")

    def predict_probabilities(self, X_encoded: pd.DataFrame, X_cat: Optional[pd.DataFrame] = None) -> np.ndarray:
        # Here I collect delay predictions from our base models and blend them.
        # LightGBM and XGBoost use the encoded numbers, while CatBoost uses the raw categories.
        # Then I stack them together and pass them to the Meta Learner to get the final probability.
        base_prob = []

        if self.lgb_model is not None:
            lgb_prob = self.lgb_model.predict_proba(X_encoded)[:, 1]
            base_prob.append(lgb_prob)

        if self.cat_model is not None:
            cat_input = X_cat if X_cat is not None else X_encoded
            cat_prob = self.cat_model.predict_proba(cat_input)[:, 1]
            base_prob.append(cat_prob)

        if self.xgb_model is not None:
            xgb_prob = self.xgb_model.predict_proba(X_encoded)[:, 1]
            base_prob.append(xgb_prob)

        if not base_prob:
            return np.full(len(X_encoded), 0.50)

        X_meta = np.column_stack(base_prob)

        if self.meta_learner is not None and hasattr(self.meta_learner, "predict_proba"):
            final_probs = self.meta_learner.predict_proba(X_meta)[:, 1]
        else:
            final_probs = np.mean(X_meta, axis=1)

        return final_probs

    def predict_batch(self, raw_df: pd.DataFrame) -> Dict[str, Any]:
        # This is the main batch prediction function called by our API endpoint.
        # First I preprocess the raw uploaded csv to get feature matrices and order ids.
        # Then I get delay probabilities, apply our threshold to predict delay (0 or 1), and assign risk levels.
        # Finally I calculate total counts and delay rate to return a complete summary for the frontend.
        start_time = time.time()

        processed = self.preprocessor.transform(raw_df)
        X_encoded = processed["X_encoded"]
        X_cat = processed["X_cat"]
        order_ids = processed["order_ids"]

        probabilities = self.predict_probabilities(X_encoded, X_cat)

        records: List[Dict[str, Any]] = []
        delayed_count = 0

        for i, prob in enumerate(probabilities):
            prob_float = round(float(prob), 4)
            is_delayed = 1 if prob_float >= self.threshold else 0
            if is_delayed == 1:
                delayed_count += 1

            records.append({
                "order_id": int(order_ids[i]) if str(order_ids[i]).isdigit() else str(order_ids[i]),
                "is_delayed": is_delayed,
                "delay_probability": prob_float,
                "risk_level": self.assign_risk_level(prob_float)
            })

        total_orders = len(records)
        on_time_count = total_orders - delayed_count
        delay_rate = round((delayed_count / total_orders * 100), 2) if total_orders > 0 else 0.0
        elapsed_ms = round((time.time() - start_time) * 1000, 2)

        return {
            "summary": {
                "total_orders": total_orders,
                "delayed_count": delayed_count,
                "on_time_count": on_time_count,
                "delay_rate": delay_rate,
                "processing_time_ms": elapsed_ms
            },
            "columns": ["order_id", "is_delayed", "delay_probability", "risk_level"],
            "data": records
        }
