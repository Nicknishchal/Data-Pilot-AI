import google.generativeai as genai
from app.config import settings
import json

class LLMService:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-pro')

    async def generate_insights(self, summary_json: str):
        prompt = f"""
        Act as a data analyst. Analyze the following dataset summary and provide:
        1. Key Insights
        2. Trends
        3. Business Recommendations

        Return the response in JSON format with keys: 'insights', 'trends' (list), and 'recommendations' (list).
        If you are unsure or the data is insufficient, say 'not enough data'.

        Dataset Summary:
        {summary_json}
        """
        try:
            response = self.model.generate_content(prompt)
            # Clean up potential markdown formatting in response
            if not response.parts:
                return {
                    "insights": "I couldn't generate insights for this data. It might be too complex or triggered a safety filter.",
                    "trends": [],
                    "recommendations": []
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
                "trends": [],
                "recommendations": []
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
        response = self.model.generate_content(prompt)
        return response.text.replace("```sql", "").replace("```", "").strip()

llm_service = LLMService()
