from fastapi import APIRouter, HTTPException
from app.services.llm_service import llm_service
from app.models.schemas import (
    InsightsRequest, InsightsResponse, 
    ExplanationRequest, ExplanationResponse,
    SQLRequest, SQLResponse,
    QuickActionRequest, QuickActionResponse,
    ChartConfigRequest, ChartConfigResponse
)
import json

router = APIRouter(prefix="", tags=["AI Agent"])

@router.post("/insights", response_model=InsightsResponse)
async def get_insights(request: InsightsRequest):
    try:
        # Pass the structured data directly to the refactored LLM service
        result = await llm_service.generate_insights(
            summary=json.dumps(request.summary.dict()),
            metrics=request.metrics,
            anomalies=request.anomalies
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/explain", response_model=ExplanationResponse)
async def explain_insights(request: ExplanationRequest):
    explanation = await llm_service.explain_for_manager(request.insights_text)
    return {"simplified_explanation": explanation}

@router.post("/generate-sql", response_model=SQLResponse)
async def generate_sql(request: SQLRequest):
    try:
        sql = await llm_service.generate_sql(request.question, request.schema_info)
        return {"sql_query": sql}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/quick-actions", response_model=QuickActionResponse)
async def get_quick_actions(request: QuickActionRequest):
    try:
        result = await llm_service.generate_quick_actions(
            table_name=request.table_name,
            columns=request.columns,
            dtypes=request.dtypes,
            sample_rows=request.sample_rows
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-chart", response_model=ChartConfigResponse)
async def generate_chart_config(request: ChartConfigRequest):
    try:
        result = await llm_service.generate_chart_config(
            user_query=request.user_query,
            columns=request.columns,
            dtypes=request.dtypes
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
