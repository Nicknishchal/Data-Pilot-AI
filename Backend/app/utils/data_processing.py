import pandas as pd
import io
from typing import Dict, Any

def process_csv(content: bytes) -> pd.DataFrame:
    """Read CSV bytes into a pandas DataFrame."""
    return pd.read_csv(io.BytesIO(content))

def get_dataset_summary(df: pd.DataFrame) -> Dict[str, Any]:
    """Generate basic dataset summary."""
    summary = {
        "rows": len(df),
        "columns": len(df.columns),
        "column_names": list(df.columns),
        "data_types": df.dtypes.apply(lambda x: str(x)).to_dict(),
        "missing_values": int(df.isnull().sum().sum()),
        "sample_data": df.head(5).to_dict(orient="records")
    }
    return summary
