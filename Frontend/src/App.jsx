import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import { dataApi } from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const [filename, setFilename] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Data States
  const [summary, setSummary] = useState(null);
  const [insights, setInsights] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [charts, setCharts] = useState(null);
  const [base64Charts, setBase64Charts] = useState(null);
  const [anomalies, setAnomalies] = useState(null);

  const handleUploadSuccess = async (file) => {
    setLoading(true);
    setError(null);
    try {
      const summaryData = await dataApi.uploadFile(file);
      setFilename(file.name);
      setSummary(summaryData);
      setActiveTab('summary');
      
      // Prefetch analytics
      await fetchAllData(summaryData);
    } catch (err) {
      setError("Analysis failed. Backend unreachable?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async (summaryData) => {
    try {
      // Step 1: Sequential but resilient fetching
      
      // Fetch Anomalies FIRST so we can pass them to Insights
      let anomalyData = null;
      try {
        const anomalyRes = await dataApi.getAnomalies();
        anomalyData = anomalyRes.anomalies || [];
        setAnomalies(anomalyData);
      } catch (e) { console.error("Anomalies failed", e); }

      // Fetch Insights
      try {
        // We pass the summary and any anomalies we found
        const insightsRes = await dataApi.getInsights(summaryData, null, anomalyData);
        if (insightsRes) {
          setInsights(insightsRes);
          setExplanation(insightsRes.manager_explanation);
        }
      } catch (e) {
        console.error("Insights failed", e);
        setInsights({ 
          overview: "Analysis engine encountered an error.", 
          business_summary: "Real-time metrics unavailable.",
          key_insights: [],
          strategic_recommendations: [],
          anomaly_insights: "Data processing failed.",
          manager_explanation: "The AI analyst is temporarily offline."
        });
      }
      
      // Fetch Charts
      try {
        const chartsRes = await dataApi.getCharts();
        setCharts([]); 
        setBase64Charts([
          { title: "Feature Distribution", data: chartsRes.histogram_base64 },
          { title: "Correlation Heatmap", data: chartsRes.correlation_base64 }
        ]);
      } catch (e) { console.error("Charts failed", e); }
      
    } catch (err) {
      console.error("General failure during data acquisition:", err);
    }
  };

  const generateSql = async (fname, query) => {
    const schemaInfo = summary ? JSON.stringify(summary.data_types) : "";
    return await dataApi.generateSql(query, schemaInfo);
  };

  return (
    <Dashboard 
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      filename={filename}
      loading={loading}
      error={error}
      summary={summary}
      insights={insights}
      explanation={explanation}
      charts={charts}
      base64Charts={base64Charts}
      anomalies={anomalies}
      handleUploadSuccess={handleUploadSuccess}
      generateSql={generateSql}
    />
  );
}

export default App;
