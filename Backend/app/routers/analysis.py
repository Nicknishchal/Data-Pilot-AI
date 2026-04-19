from fastapi import APIRouter, UploadFile, File, HTTPException
from app.utils.data_processing import process_csv, get_dataset_summary
from app.services.anomaly_service import anomaly_service
from app.services.chart_service import chart_service
from app.models.schemas import DatasetSummary, AnomalyResponse, ChartResponse
import pandas as pd
import io

router = APIRouter(prefix="", tags=["Analysis"])

# Temporary in-memory storage for the current session dataframe
# In production, use Redis or a DB with file IDs
_current_df = None

@router.post("/upload", response_model=DatasetSummary)
async def upload_csv(file: UploadFile = File(...)):
    global _current_df
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a CSV.")
    
    try:
        content = await file.read()
        _current_df = process_csv(content)
        summary = get_dataset_summary(_current_df)
        return summary
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing CSV: {str(e)}")

@router.post("/anomaly", response_model=AnomalyResponse)
async def get_anomalies():
    global _current_df
    if _current_df is None:
        raise HTTPException(status_code=400, detail="No dataset uploaded.")
    
    anomalies = anomaly_service.detect_anomalies(_current_df)
    return {
        "num_anomalies": len(anomalies),
        "anomalies": anomalies
    }

@router.post("/charts", response_model=ChartResponse)
async def get_charts():
    global _current_df
    if _current_df is None:
        raise HTTPException(status_code=400, detail="No dataset uploaded.")
    
    hist = chart_service.generate_histogram(_current_df)
    heatmap = chart_service.generate_heatmap(_current_df)
    
    return {
        "histogram_base64": hist,
        "correlation_base64": heatmap
    }
