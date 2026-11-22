from pathlib import Path
import json
import joblib
import pandas as pd


class DataPreProcessor:

    def __init__(self, artifact_dir):
        # Here I initialize the preprocessor class with the artifact directory path.
        # I load the feature config file to get the list of required columns and features.
        # I also load the saved ordinal encoder if it exists so we can encode categories later.
        self.artifact_dir = Path(artifact_dir)
        self.config_path = self.artifact_dir / "feature_config.json"

        encoder_path = self.artifact_dir / "ordinal_encoder.joblib"
        if not encoder_path.exists():
            encoder_path = self.artifact_dir / "ordinal_encoder.pkl"
        self.encoder = joblib.load(encoder_path) if encoder_path.exists() else None

        if self.config_path.exists():
            with open(self.config_path) as f:
                config = json.load(f)
                self.raw_required_columns = config.get("raw_required_columns", [])
                self.numerical_features = config.get("numerical_features", [])
                self.categorical_features = config.get("categorical_features", [])
                self.decision_threshold = config.get("decision_threshold", 0.5)
        else:
            print(f"Config file not found at {self.config_path}. Using default values.")
            self.raw_required_columns = []
            self.numerical_features = []
            self.categorical_features = []
            self.decision_threshold = 0.5

    def validate_raw_csv_features(self, df: pd.DataFrame):
        # Here I validate the incoming csv dataframe before doing any processing.
        # I check if the file is empty and verify that all mandatory raw columns exist.
        # I also check that Order Id is present and not completely null.
        if df is None or df.empty:
            raise ValueError("Input DataFrame is empty or None.")

        if self.raw_required_columns:
            uploaded_columns = set(df.columns)
            required_columns = set(self.raw_required_columns)
            missing_columns = required_columns - uploaded_columns

            if missing_columns:
                raise ValueError(f"Missing required columns: {', '.join(missing_columns)}")

            if "Order Id" in df.columns:
                if df["Order Id"].isnull().all():
                    raise ValueError("Column 'Order Id' cannot be null for all rows.")

            print(f"CSV validation is passed. df length: {len(df)} and Columns number: {len(df.columns)}")

    def engineer_features(self, df: pd.DataFrame) -> pd.DataFrame:
        # In this function I create all the engineered features from raw order data.
        # I extract calendar parts from order date, calculate total items and amounts per order,
        # compute financial ratios like discount per unit, and build route/deadline flags.
        df = df.copy()

        if "order date (DateOrders)" in df.columns:
            date_col = pd.to_datetime(df["order date (DateOrders)"], errors="coerce")
            df["order_hour"] = date_col.dt.hour.fillna(12).astype(int)
            df["order_dayofweek"] = date_col.dt.dayofweek.fillna(0).astype(int)
            df["order_day"] = date_col.dt.day.fillna(1).astype(int)
            df["order_month"] = date_col.dt.month.fillna(1).astype(int)
            df["order_year"] = date_col.dt.year.fillna(2018).astype(int)
            df["order_quarter"] = date_col.dt.quarter.fillna(1).astype(int)
            df["is_weekend"] = df["order_dayofweek"].isin([5, 6]).astype(int)
            df["is_month_end"] = date_col.dt.is_month_end.astype(int)

        if "Order Id" in df.columns:
            if "Order Item Quantity" in df.columns:
                df["order_total_items"] = df.groupby("Order Id")["Order Item Quantity"].transform("sum")

            if "Order Item Total" in df.columns:
                df["order_total_amount"] = df.groupby("Order Id")["Order Item Total"].transform("sum")

            if "Product Card Id" in df.columns:
                df["order_unique_products"] = df.groupby("Order Id")["Product Card Id"].transform("nunique")

        if "Order Item Total" in df.columns and "order_total_amount" in df.columns:
            df["item_share_of_order"] = df["Order Item Total"] / (df["order_total_amount"] + 1e-6)

        if "Order Item Discount" in df.columns and "Order Item Quantity" in df.columns:
            df["discount_per_unit"] = df["Order Item Discount"] / (df["Order Item Quantity"] + 1e-6)

        if "Order Item Product Price" in df.columns and "Order Item Discount Rate" in df.columns:
            df["effective_unit_price"] = df["Order Item Product Price"] * (1 - df["Order Item Discount Rate"])

        if "Order Item Profit Ratio" in df.columns:
            df["order_item_profit_ratio"] = df["Order Item Profit Ratio"]
        elif "order_item_profit_ratio" not in df.columns:
            df["order_item_profit_ratio"] = 0.0

        market = df["Market"].astype(str) if "Market" in df.columns else "Unknown"
        region = df["Order Region"].astype(str) if "Order Region" in df.columns else "Unknown"
        df["shipping_route"] = market + " -> " + region

        if "Customer Country" in df.columns and "Order Country" in df.columns:
            df["is_international"] = (df["Customer Country"] != df["Order Country"]).astype(int)
        else:
            df["is_international"] = 0

        if "Customer State" in df.columns and "Order State" in df.columns:
            df["is_same_state"] = (df["Customer State"] == df["Order State"]).astype(int)
        else:
            df["is_same_state"] = 0

        if "Shipping Mode" in df.columns:
            df["is_tight_deadline"] = df["Shipping Mode"].isin(["Same Day", "First Class"]).astype(int)
        else:
            df["is_tight_deadline"] = 0

        return df

    def handle_missing_values(self, df: pd.DataFrame) -> pd.DataFrame:
        # Here I handle missing values so our models don't get NaN values.
        # For numerical features I fill missing values with the median of that column.
        # For categorical features I replace missing values with the string 'Unknown'.
        df = df.copy()

        for column in self.numerical_features:
            if column in df.columns:
                median_value = df[column].median()
                df[column] = df[column].fillna(median_value)

        for column in self.categorical_features:
            if column in df.columns:
                df[column] = df[column].fillna("Unknown")

        return df

    def encode_categorical_features(self, df: pd.DataFrame):
        # Here I prepare two copies of the data for our models.
        # CatBoost can take raw string categories directly so I keep df_cat as strings.
        # For LightGBM and XGBoost I encode the categorical columns into numbers using the saved encoder.
        df_cat = df.copy()
        df_encoded = df.copy()

        if self.categorical_features:
            if self.encoder is not None:
                try:
                    encoded_values = self.encoder.transform(df[self.categorical_features])
                    df_encoded[self.categorical_features] = encoded_values
                except Exception:
                    # Safe category mapping compatible with all NumPy and scikit-learn versions
                    for i, col in enumerate(self.categorical_features):
                        if col in df_encoded.columns:
                            cat_map = {cat: idx for idx, cat in enumerate(self.encoder.categories_[i])}
                            df_encoded[col] = df_encoded[col].map(lambda x: cat_map.get(x, -1))
            else:
                for col in self.categorical_features:
                    if col in df_encoded.columns:
                        df_encoded[col] = pd.Categorical(df_encoded[col]).codes

        return df_encoded, df_cat

    def transform(self, df: pd.DataFrame):
        # This is the main function that runs the complete preprocessing pipeline.
        # First I validate the csv, then I extract order ids for tracking.
        # Next I create engineered features and fill any missing values.
        # Finally I select only the training features and encode them for our models.
        self.validate_raw_csv_features(df)

        order_ids = df["Order Id"].tolist() if "Order Id" in df.columns else list(range(len(df)))

        df_engineered = self.engineer_features(df)
        df_filled = self.handle_missing_values(df_engineered)

        feature_columns = self.numerical_features + self.categorical_features
        for col in feature_columns:
            if col not in df_filled.columns:
                df_filled[col] = 0

        df_selected = df_filled[feature_columns].copy() if feature_columns else df_filled.copy()
        df_encoded, df_cat = self.encode_categorical_features(df_selected)

        return {
            "X_encoded": df_encoded,
            "X_cat": df_cat,
            "order_ids": order_ids
        }
