# DataPilot AI - Frontend

Modern, production-ready React dashboard for scanning CSV files, generating AI insights, detecting anomalies, and converting natural language to SQL.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Backend running at `http://localhost:8000`

### Installation

1. Copy the `.env` file and set your backend URL:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## 🛠 Tech Stack
- **React + Vite**: Fast, modern frontend framework.
- **Tailwind CSS**: Premium styling with glassmorphism and custom theme.
- **Framer Motion**: Smooth micro-animations and page transitions.
- **Chart.js**: Interactive data visualizations.
- **Lucide React**: Beautiful iconography.
- **Axios**: Robust API communication.
- **React Dropzone**: Drag-and-drop file handling.

## 📁 Key Components
- `Sidebar.jsx`: Modern glassmorphism navigation.
- `FileUpload.jsx`: Animated CSV upload zone.
- `AIInsights.jsx`: Themed cards for AI analysis.
- `ChartsDashboard.jsx`: Mixed mode visualization (JS + Base64).
- `SQLGenerator.jsx`: Natural language query interface.
- `DataTable.jsx`: High-performance data grid with anomaly highlighting.

## 📡 API Endpoints Used
| Feature | Endpoint | Method |
|---------|----------|--------|
| Upload | `/upload` | POST |
| Insights | `/insights` | POST |
| Explain | `/explain` | POST |
| Charts | `/charts` | POST |
| Anomalies | `/anomaly` | POST |
| SQL Gen | `/generate-sql` | POST |
