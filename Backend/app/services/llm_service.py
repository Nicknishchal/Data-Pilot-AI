import google.generativeai as genai
from app.config import settings
import json

class LLMService:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-2.5-flash')

    async def generate_insights(self, summary_json: str):
        prompt = f"""
        Act as a senior data analyst. Analyze the following dataset summary and provide:
        1. Executive Summary (2-3 sentences)
        2. Strategic Roadmap: A list of 4-5 strategic items. Each item must have:
           - "trend": A specific observation or trend discovered in the data.
           - "action": A direct business action or recommendation based on that trend.

        Return the response in JSON format with keys: 
        'insights' (string), 
        'strategic_roadmap' (list of objects with 'trend' and 'action' keys).
        
        Example structure:
        {{
            "insights": "Executive summary here...",
            "strategic_roadmap": [
                {{"trend": "High seasonal demand in Q4", "action": "Increase inventory buffer by 20% in September"}},
                ...
            ]
        }}

        Dataset Summary:
        {summary_json}
        """
        try:
            response = self.model.generate_content(prompt)
            # Clean up potential markdown formatting in response
            if not response.parts:
                return {
                    "insights": "I couldn't generate insights for this data. It might be too complex or triggered a safety filter.",
                    "strategic_roadmap": []
                }
            
            text = response.text.strip()
            if text.startswith("```json"):
                text = text[7:-3].strip()
            return json.loads(text)
        except Exception as e:
            print(f"LLM Error: {str(e)}")
            try:
                # Try to get whatever text is available
                fallback_text = response.text if 'response' in locals() and response.parts else "Error generating insights."
            except:
                fallback_text = "Analysis engine is currently unavailable."
                
            return {
                "insights": fallback_text,
                "strategic_roadmap": []
            }

    async def explain_for_manager(self, insights_text: str):
        prompt = f"""
        Act as a senior data analyst. Simplify the following technical insights for a non-technical manager/stakeholder.
        Focus on high-level impact and ease of understanding.

        Insights:
        {insights_text}
        """
        try:
            response = self.model.generate_content(prompt)
            if not response.parts:
                return "The insights are straightforward: your data is now processed and ready for review."
            return response.text
        except Exception as e:
            print(f"Explanation Error: {str(e)}")
            return "Unable to generate a simplified explanation at this time."

    async def generate_sql(self, question: str, schema_info: str):
        prompt = f"""
        Act as a SQL expert. Based on the following table schema, generate a SQL query for the user's question.
        Use SQLite syntax. Return ONLY the SQL query.

        Schema:
        {schema_info}

        Question:
        {question}
        """
        try:
            response = self.model.generate_content(prompt)
            if not response.parts:
                return "-- Unable to generate SQL: Response blocked or empty."
            
            sql = response.text.replace("```sql", "").replace("```", "").strip()
            return sql
        except Exception as e:
            print(f"SQL Generation Error: {str(e)}")
            return f"-- Error: {str(e)}"

llm_service = LLMService()
