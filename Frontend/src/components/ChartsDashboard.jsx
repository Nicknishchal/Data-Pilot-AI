import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ScatterController,
  ArcElement
} from 'chart.js';
import { Bar, Line, Scatter, Pie } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { Sparkles, Search, Loader2 } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ScatterController,
  ArcElement
);

const ChartCard = ({ title, reason, children, error }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/5 p-6 rounded-2xl shadow-lg flex flex-col"
  >
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-sm font-bold text-white tracking-tight uppercase tracking-[0.1em]">{title}</h3>
      <div className="w-2 h-2 rounded-full bg-primary-500/50 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
    </div>
    
    {reason && (
      <p className="text-[10px] text-slate-500 mb-6 font-medium italic leading-tight">
        {reason}
      </p>
    )}

    <div className="h-[300px] w-full flex items-center justify-center overflow-hidden">
      {error ? (
        <div className="text-center p-6 bg-rose-500/5 rounded-xl border border-rose-500/10">
          <p className="text-rose-400 text-xs font-semibold">{error}</p>
        </div>
      ) : children}
    </div>
  </motion.div>
);

const ChartsDashboard = ({ chartData, base64Images, onGenerateSmartChart }) => {
  const [query, setQuery] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleGenerate = async () => {
    if (!query.trim()) return;
    setIsGenerating(true);
    try {
      await onGenerateSmartChart(query);
      setQuery('');
    } finally {
      setIsGenerating(false);
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#94a3b8', font: { family: 'Inter', size: 10 }, usePointStyle: true, padding: 20 },
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#fff',
        bodyColor: '#94a3b8',
        padding: 12,
        cornerRadius: 8,
      }
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b', font: { size: 10 } } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b', font: { size: 10 } } }
    }
  };

  return (
    <div className="space-y-6">
      {/* Smart Chart Input */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-purple-600 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
        <div className="relative flex items-center gap-2 bg-[#0b1121] border border-white/5 p-2 rounded-2xl">
          <div className="pl-4 flex items-center justify-center text-slate-500">
             <Sparkles className="w-5 h-5" />
          </div>
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder="Ask AI to generate a custom chart from any dataset..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-slate-600 text-sm py-3"
          />
          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !query.trim()}
            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {isGenerating ? 'Generating...' : 'Generate Chart'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Dynamic JS Charts */}
      {chartData?.map((chart, idx) => {
        const isPie = chart.type === 'pie' || chart.chart_type === 'pie';
        const isHorizontal = chart.type === 'horizontal_bar' || chart.chart_type === 'horizontal_bar';
        
        const specificOptions = {
          ...chartOptions,
          indexAxis: isHorizontal ? 'y' : 'x',
          scales: isPie ? {} : chartOptions.scales,
          plugins: {
            ...chartOptions.plugins,
            legend: {
              ...chartOptions.plugins.legend,
              display: isPie || isHorizontal,
            }
          }
        };

        return (
          <ChartCard key={idx} title={chart.title} reason={chart.reason} error={chart.data?.error}>
            {(chart.type === 'bar' || chart.chart_type === 'bar' || isHorizontal) && <Bar options={specificOptions} data={chart.data} />}
            {(chart.type === 'line' || chart.chart_type === 'line') && <Line options={specificOptions} data={chart.data} />}
            {(chart.type === 'scatter' || chart.chart_type === 'scatter') && <Scatter options={specificOptions} data={chart.data} />}
            {isPie && <Pie options={specificOptions} data={chart.data} />}
          </ChartCard>
        );
      })}

      {/* Backend Rendered Base64 Images (e.g. Seaborn Heatmaps) */}
      {base64Images?.map((img, idx) => (
        <ChartCard key={`img-${idx}`} title={img.title}>
          {img.data ? (
            <img 
              src={`data:image/png;base64,${img.data}`} 
              alt={img.title} 
              className="max-w-full max-h-[280px] object-contain rounded-lg"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 bg-slate-800/20 rounded-xl border border-white/5 w-full h-full">
               <p className="text-slate-500 text-xs font-medium max-w-[200px]">Insufficient numeric features to generate correlation analysis.</p>
            </div>
          )}
        </ChartCard>
      ))}
    </div>
  </div>
  );
};

export default ChartsDashboard;
