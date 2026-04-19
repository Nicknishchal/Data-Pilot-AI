from sklearn.ensemble import IsolationForest
import pandas as pd
from typing import List, Dict, Any

class AnomalyService:
    def detect_anomalies(self, df: pd.DataFrame) -> List[Dict[str, Any]]:
        # Select numeric columns only
        numeric_df = df.select_dtypes(include=['number'])
        
        if numeric_df.empty:
            return []

        # Handle missing values for anomaly detection
        numeric_df = numeric_df.fillna(numeric_df.mean())

        model = IsolationForest(contamination=0.05, random_state=42)
        preds = model.fit_predict(numeric_df)

        # -1 indicates an anomaly
        anomalies = df[preds == -1]
        return anomalies.to_dict(orient="records")

anomaly_service = AnomalyService()
