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
      
      // Fetch Insights
      try {
        const insightsRes = await dataApi.getInsights(summaryData);
        if (insightsRes) {
          const formattedInsights = [
            { type: 'key', title: 'Dataset Overview', content: insightsRes.insights || "No overview available." },
            ...(insightsRes.strategic_roadmap || []).map((item, idx) => ({ 
              type: 'strategy', 
              title: `Strategic Opportunity ${idx + 1}`, 
              trend: item.trend, 
              action: item.action 
            }))
          ];
          setInsights(formattedInsights);

          // Fetch Explanation based on insights
          if (insightsRes.insights) {
             try {
               const explainRes = await dataApi.getExplanation(insightsRes.insights);
               setExplanation(explainRes.simplified_explanation);
             } catch (e) { console.error("Explanations failed", e); }
          }
        }
      } catch (e) {
        console.error("Insights failed", e);
        setInsights([{ type: 'key', title: 'Analysis Error', content: "Failed to generate AI insights. Standard analysis is still available." }]);
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

      // Fetch Anomalies
      try {
        const anomalyRes = await dataApi.getAnomalies();
        setAnomalies(anomalyRes.anomalies || []);
      } catch (e) { console.error("Anomalies failed", e); }
      
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
