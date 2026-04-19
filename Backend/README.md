# AI-Powered Data Analyst Backend

A production-ready FastAPI backend for an AI-powered Data Analyst Agent.

## Features
- **CSV Upload & Analysis**: Summary of statistics and sample preview.
- **AI Insights**: Automated trends and business recommendations via Google Gemini.
- **Manager Explainer**: Technical insights simplified for stakeholders.
- **Anomaly Detection**: Uses IsolationForest to catch data outliers.
- **NL to SQL**: Natural language questions converted to optimized SQL.
- **Automated Visualization**: Generates histograms and correlation heatmaps as base64 images.

## Tech Stack
- **FastAPI**: High-performance web framework.
- **Pandas**: Data manipulation and analysis.
- **Scikit-learn**: Machine learning (IsolationForest).
- **Google Generative AI**: Gemini 1.5 Flash for intelligent processing.
- **Matplotlib/Seaborn**: Visual data representations.

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Environment Variables**:
   Create a `.env` file in the root directory (already provided):
   ```
   GEMINI_API_KEY=your_api_key_here
   PORT=8000
   DEBUG=True
   ```

3. **Run the Server**:
   ```bash
   python -m app.main
   ```
   OR
   ```bash
   uvicorn app.main:app --reload
   ```

4. **API Documentation**:
   Once running, access the Interactive Swagger docs at:
   `http://localhost:8000/docs`

## Project Structure
- `app/routers/`: API endpoint definitions.
- `app/services/`: Business logic for AI, anomalies, and charts.
- `app/utils/`: Data processing and CSV helpers.
- `app/models/`: Pydantic schemas for request/response validation.
