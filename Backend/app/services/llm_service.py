import google.generativeai as genai
import json
import logging
from typing import Dict, List, Any, Optional
from app.config import settings

# Configure specialized logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("LLMService")

class LLMService:
    def __init__(self):
        """Initialize Gemini with the configured API key and model."""
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-2.5-flash')

    def _build_universal_prompt(self, summary: str, metrics: str, anomalies: str) -> str:
        """Constructs a domain-agnostic, high-fidelity analysis prompt."""
        return f"""
        ROLES & CONTEXT:
        You are a Universal Senior Data Analyst. You excel at interpreting ANY dataset by inferring context from column names and statistical distributions.

        INFERENCE TASK:
        First, identify the domain of the dataset (e.g., Healthcare, Sales, HR, Education, Finance) based on the provided column names and metrics.

        STRICT ANALYTICAL RULES:
        1. NO DOMAIN ASSUMPTIONS: Do not mention 'Sales' or 'Revenue' unless the data specifically includes them. Use terms like 'Key Performance Indicators (KPIs)', 'Primary Entities', and 'Significant Segments'.
        2. NUMERIC ENFORCEMENT: Every insight MUST contain specific numbers, percentages, or growth comparisons found in the data.
        3. ABSOLUTE CERTAINTY: Forbid vague language. Remove words like "likely", "may", "could", "appears". Use "is", "indicates", "demonstrates".
        4. DATA EXCLUSIVITY: Use only the provided metrics and summaries. If a metric is missing, use available ones to derive the best possible conclusion.
        5. ACTIONABLE STRATEGY: Recommendations must be specific implementation steps tailored to the inferred domain.

        INPUT DATA STREAMS:
        ---
        DATASET OVERVIEW & SCHEMA: 
        {summary}

        COMPUTED STATISTICAL METRICS: 
        {metrics}

        DETECTED ANOMALIES/OUTLIERS: 
        {anomalies}
        ---

        TASK:
        Generate a comprehensive, domain-relevant strategic report in JSON format.

        REQUIRED OUTPUT FORMAT (STRICT JSON ONLY):
        Return a valid JSON object with EXACTLY these keys:
        - "overview": Statement of dataset context, inferred domain, volume, and data health.
        - "business_summary": A high-level executive report focusing on the 3 most critical KPIs identified.
        - "key_insights": A list of at least 5 strings. Each string MUST be a numeric observation.
        - "strategic_recommendations": A list of at least 5 strings. Each string MUST be a specific business action.
        - "anomaly_insights": Factual breakdown of unusual activity or "No significant anomalies detected."
        - "manager_explanation": 2-3 lines of high-level business meaning using simplified language.

        DO NOT use objects/dictionaries for the lists. Use ONLY flat strings.
        Return ONLY the JSON. No markdown formatting.
        """

    def _safe_json_parser(self, raw_text: str) -> Dict[str, Any]:
        """Technically robust JSON extractor that handles markdown and malformed output."""
        try:
            clean_text = raw_text.strip()
            if "```json" in clean_text:
                clean_text = clean_text.split("```json")[-1].split("```")[0].strip()
            elif "```" in clean_text:
                clean_text = clean_text.split("```")[-1].split("```")[0].strip()
            
            parsed_data = json.loads(clean_text)
            
            # Key verification and normalization for structural stability
            required_keys = ["overview", "business_summary", "key_insights", "strategic_recommendations", "anomaly_insights", "manager_explanation"]
            for key in required_keys:
                if key not in parsed_data:
                    parsed_data[key] = [] if "list" in key or "insights" in key or "recommendations" in key else "Data not available."
                
                # NORMALIZE: If the model returned objects instead of strings for lists (a common failure)
                if key in ["key_insights", "strategic_recommendations"] and isinstance(parsed_data[key], list):
                    normalized_list = []
                    for item in parsed_data[key]:
                        if isinstance(item, dict):
                            # Extract the text value from the dict (handles 'observation', 'action', 'trend', etc.)
                            text_val = item.get("observation") or item.get("action") or item.get("trend") or str(list(item.values())[-1])
                            normalized_list.append(text_val)
                        else:
                            normalized_list.append(str(item))
                    parsed_data[key] = normalized_list
            
            return parsed_data
            
        except (json.JSONDecodeError, ValueError) as e:
            logger.error(f"JSON Parsing Error: {str(e)}")
            return self._get_fallback_data()

    def _get_fallback_data(self) -> Dict[str, Any]:
        """Agnostic fallback response."""
        return {
            "overview": "Dataset context identified, but strategic report formatting failed.",
            "business_summary": "High-level metrics were identified. Please review the raw statistics.",
            "key_insights": ["High data variance detected in primary columns."],
            "strategic_recommendations": ["Conduct manual segment analysis for deeper verification."],
            "anomaly_insights": "No significant anomalies could be definitively mapped.",
            "manager_explanation": "The analysis engine completed the sweep but encountered a formatting error during reporting."
        }

    async def generate_insights(self, summary: str, metrics: Optional[Dict[str, Any]] = None, anomalies: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
        """Dynamic entry point for domain-agnostic analysis."""
        metrics_json = json.dumps(metrics if metrics else {}, indent=2)
        anomalies_json = json.dumps(anomalies if anomalies else [], indent=2)
        
        prompt = self._build_universal_prompt(summary, metrics_json, anomalies_json)
        
        try:
            response = self.model.generate_content(prompt)
            if not response.parts: return self._get_fallback_data()
            return self._safe_json_parser(response.text)
        except Exception as e:
            logger.error(f"AI Generation Error: {str(e)}")
            return self._get_fallback_data()

    async def explain_for_manager(self, insights_text: str) -> str:
        prompt = f"Summarize this data report for a CEO in 2 sentences: {insights_text}"
        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except: return "Summary unavailable."

    async def generate_sql(self, question: str, schema_info: str) -> str:
        prompt = f"Schema: {schema_info}\nQuestion: {question}\nReturn ONLY the SQL query."
        try:
            response = self.model.generate_content(prompt)
            return response.text.replace("```sql", "").replace("```", "").strip()
        except: return "-- SQL Error"

llm_service = LLMService()
