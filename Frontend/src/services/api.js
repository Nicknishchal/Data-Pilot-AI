import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const dataApi = {
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getInsights: async (summary, metrics = null, anomalies = null) => {
    const response = await api.post('/insights', { summary, metrics, anomalies });
    return response.data;
  },

  getExplanation: async (insights_text) => {
    const response = await api.post('/explain', { insights_text });
    return response.data;
  },

  getCharts: async () => {
    const response = await api.post('/charts');
    return response.data;
  },

  getAnomalies: async () => {
    const response = await api.post('/anomaly');
    return response.data;
  },

  generateSql: async (question, schema_info) => {
    const response = await api.post('/generate-sql', { question, schema_info });
    return response.data;
  },

  getQuickActions: async (tableName, columns, dtypes, sampleRows) => {
    const response = await api.post('/quick-actions', {
      table_name: tableName,
      columns: columns,
      dtypes: dtypes,
      sample_rows: sampleRows
    });
    return response.data;
  },

  getSmartChart: async (userQuery) => {
    const response = await api.post('/smart-chart', {
      user_query: userQuery
    });
    return response.data;
  },
};

export default api;
