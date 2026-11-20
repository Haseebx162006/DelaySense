from pathlib import Path
import json
import pandas as pd
class DataPreProcessor:


    def __init__(self,artifact_dir):
        self.artifact_dir =  Path(artifact_dir)

        self.config_path = self.artifact_dir /"feature_config.json"


        if self.config_path.exists():
            with open(self.config_path) as f:

                config = json.load(f)

                self.raw_required_columns=  config.get("raw_required_columns",[])
                self.numerical_features = config.get("numerical_features",[])
                self.categorical_features = config.get("categorical_features",[])
                self.decision_threshold = config.get("decision_threshold",0.5)

        else:

            # initilize with default values if config file does not exist
            print(f"Config file not found at {self.config_path}. Using default values.")
            self.raw_required_features = []
            self.numerical_features = []
            self.categorical_features = []
            self.decision_threshold = 0.5
    

    def validate_raw_csv_features(self, df:pd.DataFrame):

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



            print(f"CSV validation is passwed. df length: {len(df)} and Columns number: {len(df.columns)}")



    def engineer_features(self, df: pd.DataFrame) -> pd.DataFrame:
        
        
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
            df["discount_per_unit"] = df["Order Item Dthe purpose of annotated in pythoniscount"] / (df["Order Item Quantity"] + 1e-6)

        if "Order Item Product Price" in df.columns and "Order Item Discount Rate" in df.columns:
            df["effective_unit_price"] = df["Order Item Product Price"] * (1 - df["Order Item Discount Rate"])

        
        if "Order Item Profit Ratio" in df.columns:
            df["order_item_profit_ratio"] = df["Order Item Profit Ratio"]
        elif "order_item_profit_ratio" not in df.columns:
            df["order_item_profit_ratio"] = 0.0

        
        cust_country = df["Customer Country"].astype(str) if "Customer Country" in df.columns else "Unknown"
        ord_country = df["Order Country"].astype(str) if "Order Country" in df.columns else "Unknown"
        df["shipping_route"] = cust_country + " -> " + ord_country

        
        if "Customer Country" in df.columns and "Order Country" in df.columns:
            df["is_international"] = (df["Customer Country"] != df["Order Country"]).astype(int)
        else:
            df["is_international"] = 0

        
        if "Customer State" in df.columns and "Order State" in df.columns:
            df["is_same_state"] = (df["Customer State"] == df["Order State"]).astype(int)
        else:
            df["is_same_state"] = 0

        
        if "Days for shipment (scheduled)" in df.columns:
            df["is_tight_deadline"] = (df["Days for shipment (scheduled)"] <= 2).astype(int)
        else:
            df["is_tight_deadline"] = 0

        return df  

    def handle_missing_values(self,df:pd.DataFrame)->pd.DataFrame:

        df = df.copy()

        for column in self.numerical_features:
            if column in df.columns:
                median_value = df[column].median()
                df[column].fillna(median_value, inplace=True)


        for column in self.categorical_features:
            if column in df.columns:
                df[column].fillna("Unknown", inplace=True)


        return df
    


    def encode_categorical_features(self, df: pd.DataFrame):
        
        df_cat = df.copy()

        df_encoded = df.copy()

        if self.categorical_features:
            if self.encoder is not None:
                encoded_values = self.encoder.transform(df[self.categorical_features])
                df_encoded[self.categorical_features] = encoded_values
            else:
                for col in self.categorical_features:
                    if col in df_encoded.columns:
                        df_encoded[col] = pd.Categorical(df_encoded[col]).codes

        return df_encoded, df_cat

    def transform(self, df:pd.DataFrame):
        # This functoin will run all the above functipns 
        # First the data is validated using validate_raw__function
        # Then i do feature engineering and the data_engineerd function transforms the dataframe
        # Then i use the missing values functions to fill the missing values in the dataframe
        # finally i used the encode categorical features function to enoode datframe for two models
        # for Numerical models lilke xgboost data is enocoded but for catboost i just passed the dataframe with categorical features as it is.
    

        self.validate_raw_csv_features(df)


        df_engineered = self.engineer_features(df)


        df_filled = self.handle_missing_values(df_engineered)

        df_encoded, df_cat = self.encode_categorical_features(df_filled)

        return df_encoded