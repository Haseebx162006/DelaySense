from pathlib import Path 
from backend.app.services.preprocessor import DataPreProcessor
import joblib
import pandas as pd 
import numpy as np
class MlSerivce:

    # here am going to initialize the constructuctor with artifact dir and it is 
    # compulsory to add the directory path 
    # i will also initilaize the data preprocessor object here so that i can use it in the ml service class


    def __init__(self, artifact_dir):
        self.arttifact_dir= Path(artifact_dir)
        self.data_preprocessor = DataPreProcessor(artifact_dir)
        self.threshold = getattr(self.preprocessor, "decision_threshold", 0.50)

        self.lgb_model = None
        self.cat_model = None
        self.xgb_model = None
        self.meta_learner = None
    
        self.load_models()


    @staticmethod
    def assign_risk_level(prob:float)-> str:
        if prob < 0.35:
            return "Low"
        elif prob <= 0.65:
            return "Medium"
        else:
            return "High"


    def load_models(self):

        models = {
            "lgb_model": self.arttifact_dir / "lgb_model.pkl",
            "cat_model": self.arttifact_dir / "cat_model.pkl",
            "xgb_model": self.arttifact_dir / "xgb_model.pkl",
            "meta_learner": self.arttifact_dir / "meta_learner.pkl"
        }


        for model_name, model_path in models.items():
            if model_path.exists():
                setattr(self,model_name, joblib.load(model_path))
                print(f"{model_name} loaded successfully from {model_path}")
            else:
                print(f"{model_name} not found at {model_path}. Please ensure the model file exists.")




    def predict_probabilities(self, X_encoded : pd)-> np.ndarray:
        # This function will take all probabilites from the models 

        base_prob=[]
        if self.lgb_model is not None:
            lgb_prob = self.lgb_model.predict_proba(X_encoded)[:, 1]
            base_prob.append(lgb_prob)

        if self.cat_model is not None:
            cat_prob = self.cat_model.predict_proba(X_encoded)[:, 1]
            base_prob.append(cat_prob)

        if self.xgb_model is not None:
            xgb_prob = self.xgb_model.predict_proba(X_encoded)[:, 1]
            base_prob.append(xgb_prob)



        X_meta = np.column_stack(base_prob)


        if self.meta_learner is not None and hasattr(self.meta_learner, "predict_proba"):
            final_probs = self.meta_learner.predict_proba(X_meta)[:, 1]
        else:
            
            final_probs = np.mean(X_meta, axis=1)



        return final_probs




