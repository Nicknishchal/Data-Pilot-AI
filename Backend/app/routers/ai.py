from fastapi import APIRouter, HTTPException
from app.services.llm_service import llm_service
from app.models.schemas import (
    InsightsRequest, InsightsResponse, 
    ExplanationRequest, ExplanationResponse,
    SQLRequest, SQLResponse
)
import json

router = APIRouter(prefix="", tags=["AI Agent"])

@router.post("/insights", response_model=InsightsResponse)
async def get_insights(request: InsightsRequest):
    try:
        summary_json = json.dumps(request.summary.dict())
        result = await llm_service.generate_insights(summary_json)
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
