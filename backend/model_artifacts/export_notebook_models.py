"""
Export Helper Script: DelaySense
Run this script or paste these lines into the final cell of Data_Supply_Chain.ipynb
to export all trained model artifacts into backend/model_artifacts/
"""

import os
import joblib
from pathlib import Path

# Target destination folder
ARTIFACTS_DIR = Path(__file__).resolve().parent

def export_artifacts(lgb_clf, cat_clf, xgb_clf, meta_learner, encoder, medians):
    """
    Saves all ensemble components into backend/model_artifacts/
    """
    os.makedirs(ARTIFACTS_DIR, exist_ok=True)

    # 1. Base models
    joblib.dump(lgb_clf, ARTIFACTS_DIR / "lgb_model.joblib")
    print(f"Saved: {ARTIFACTS_DIR / 'lgb_model.joblib'}")

    joblib.dump(cat_clf, ARTIFACTS_DIR / "cat_model.joblib")
    print(f"Saved: {ARTIFACTS_DIR / 'cat_model.joblib'}")

    joblib.dump(xgb_clf, ARTIFACTS_DIR / "xgb_model.joblib")
    print(f"Saved: {ARTIFACTS_DIR / 'xgb_model.joblib'}")

    # 2. Meta-learner
    joblib.dump(meta_learner, ARTIFACTS_DIR / "meta_learner.joblib")
    print(f"Saved: {ARTIFACTS_DIR / 'meta_learner.joblib'}")

    # 3. Categorical Encoder
    joblib.dump(encoder, ARTIFACTS_DIR / "ordinal_encoder.joblib")
    print(f"Saved: {ARTIFACTS_DIR / 'ordinal_encoder.joblib'}")

    # 4. Numerical Medians dictionary
    joblib.dump(medians, ARTIFACTS_DIR / "numerical_medians.joblib")
    print(f"Saved: {ARTIFACTS_DIR / 'numerical_medians.joblib'}")

    print("\nAll model artifacts successfully exported to backend/model_artifacts!")


if __name__ == "__main__":
    print("To use this, pass your fitted models to export_artifacts(...) at the end of Data_Supply_Chain.ipynb.")
