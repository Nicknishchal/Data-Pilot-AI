from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class DatasetSummary(BaseModel):
    rows: int
    columns: int
    column_names: List[str]
    data_types: Dict[str, str]
    missing_values: int
    sample_data: List[Dict[str, Any]]

class InsightsRequest(BaseModel):
    summary: DatasetSummary
    additional_context: Optional[str] = None

class StrategicItem(BaseModel):
    trend: str
    action: str

class InsightsResponse(BaseModel):
    insights: str
    strategic_roadmap: List[StrategicItem]

class ExplanationRequest(BaseModel):
    insights_text: str

class ExplanationResponse(BaseModel):
    simplified_explanation: str

class SQLRequest(BaseModel):
    question: str
    schema_info: str

class SQLResponse(BaseModel):
    sql_query: str

class AnomalyResponse(BaseModel):
    num_anomalies: int
    anomalies: List[Dict[str, Any]]

class ChartResponse(BaseModel):
    histogram_base64: str
    correlation_base64: str
