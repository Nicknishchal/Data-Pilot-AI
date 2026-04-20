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

@router.post("/smart-chart")
async def get_smart_chart(request: dict):
    global _current_df
    if _current_df is None:
        raise HTTPException(status_code=400, detail="No dataset uploaded.")
    
    user_query = request.get("user_query")
    if not user_query:
        raise HTTPException(status_code=400, detail="User query is required.")

    from app.services.llm_service import llm_service
    
    # Task 1: Data Understanding
    profile = chart_service.profile_data(_current_df)
    
    # Task 3 & 7: Get Config from LLM with reasoning
    config_request_dtypes = {}
    for col, info in profile.items():
        # Combine type and a 'useless' flag if it looks like an ID
        tag = info['type']
        if info['is_useless']:
            tag += " (likely_id_avoid_this)"
        config_request_dtypes[col] = tag

    response = await llm_service.generate_chart_config(
        user_query=user_query,
        columns=_current_df.columns.tolist(),
        dtypes=config_request_dtypes
    )
    
    # Handle the restructured response
    charts_configs = response.get("charts", [])
    if not charts_configs and isinstance(response, list):
        charts_configs = response # Fallback if LLM returns direct list
    elif not charts_configs and "chart_type" in response:
        charts_configs = [response] # Fallback if LLM returns single object

    results = []
    for config in charts_configs:
        chart_data = chart_service.prepare_dynamic_data(_current_df, config)
        results.append({
            "config": config,
            "data": chart_data,
            "chart_type": config.get("chart_type"),
            "title": config.get("title"),
            "reason": config.get("reason")
        })
    
    return results
