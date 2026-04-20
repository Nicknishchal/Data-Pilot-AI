import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UploadCard from '../components/dashboard/UploadCard';
import StatsCard from '../components/StatsCard'; 
import DataTable from '../components/DataTable';
import AIInsights from '../components/AIInsights';
import ChartsDashboard from '../components/ChartsDashboard';
import SQLGenerator from '../components/SQLGenerator';
import Card from '../components/common/Card';
import DashboardLayout from '../components/layout/DashboardLayout';
import { 
  Rows, 
  Columns, 
  AlertCircle, 
  FileType, 
  Loader2,
  Sparkles,
  Database,
  ArrowRight
} from 'lucide-react';

const Dashboard = ({ 
  activeTab, 
  setActiveTab, 
  filename, 
  loading, 
  error, 
  summary, 
  insights, 
  explanation, 
  charts, 
  base64Charts, 
  anomalies, 
  quickActions,
  handleUploadSuccess,
  generateSql,
  generateSmartChart
}) => {

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[500px] gap-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-primary-500/10 border-t-primary-500 animate-spin" />
            <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-primary-400 animate-pulse" />
          </div>
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold text-white tracking-tight">Synthesizing Dataset</h2>
            <p className="text-slate-400 max-w-sm text-sm leading-relaxed">We&apos;re applying statistical models and AI heuristics to generate deep insights from your data.</p>
          </div>
        </div>
      );
    }

    if (!filename && activeTab !== 'upload') {
      return (
        <div className="flex flex-col items-center justify-center min-h-[500px] gap-10 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-28 h-28 bg-slate-800 rounded-[2.5rem] flex items-center justify-center relative shadow-2xl border border-slate-700">
            <Database className="w-12 h-12 text-slate-600" />
            <div className="absolute top-0 right-0 w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center -translate-y-1/3 translate-x-1/3 shadow-xl shadow-primary-600/30 border-4 border-[#0b1121]">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-extrabold text-white tracking-tight">No Active Workspace</h2>
            <p className="text-slate-500 max-w-md mx-auto text-base leading-relaxed">
              Start your automated analysis by importing a CSV dataset in the upload section.
            </p>
            <button 
              onClick={() => setActiveTab('upload')}
              className="mt-6 px-10 py-4 bg-primary-600 text-white rounded-2xl hover:bg-primary-500 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto font-bold shadow-lg shadow-primary-600/20"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'upload':
        return <UploadCard onUploadSuccess={handleUploadSuccess} />;
      
      case 'summary':
        return (
          <div className="space-y-10">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard title="Total Observations" value={summary?.rows || 0} icon={Rows} color="blue" />
              <StatsCard title="Feature Count" value={summary?.columns || 0} icon={Columns} color="purple" />
              <StatsCard title="Missing Datapoints" value={summary?.missing_values || 0} icon={AlertCircle} color="rose" />
              <StatsCard title="Unique Features" value={summary?.column_names?.length || 0} icon={FileType} color="emerald" />
            </div>
            
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-xl overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Dataset Snapshot</h3>
                  <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold font-mono">Top 5 Records Synchronized</p>
                </div>
                <div className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-[10px] font-bold text-slate-500 font-mono">
                  READ_ONLY_BUFFER
                </div>
              </div>
              <DataTable 
                data={summary?.sample_data} 
                columns={summary?.column_names || []} 
              />
            </div>
          </div>
        );

      case 'insights':
        return (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-xl">
             <AIInsights insights={insights} explanation={explanation} />
          </div>
        );

      case 'charts':
        return (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-xl">
             <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Diagnostic Visualizations</h3>
                  <p className="text-sm text-slate-500 mt-1">Multi-variate distributions and trend analysis.</p>
                </div>
             </div>
             <ChartsDashboard 
               chartData={charts} 
               base64Images={base64Charts} 
               onGenerateSmartChart={generateSmartChart}
             />
          </div>
        );

      case 'anomalies':
        return (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-xl">
             <div className="flex items-start gap-4 mb-10 pb-8 border-b border-slate-700">
               <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center justify-center text-rose-500">
                  <AlertCircle className="w-6 h-6" />
               </div>
               <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Anomaly Detection Report</h3>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed max-w-3xl">
                     Isolated forest algorithms have flagged the following observations as statistically significant deviations. 
                     These records may require human verification for data cleaning or edge-case discovery.
                  </p>
               </div>
             </div>
             <DataTable 
                data={anomalies} 
                columns={summary?.column_names || []} 
                highlightIndices={anomalies?.map((_, i) => i)}
              />
          </div>
        );

      case 'sql':
        return (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-xl">
            <SQLGenerator 
              onGenerate={(query) => generateSql(filename, query)} 
              quickActions={quickActions}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout 
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      filename={filename}
      error={error}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab + (loading ? '-loading' : '')}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default Dashboard;
