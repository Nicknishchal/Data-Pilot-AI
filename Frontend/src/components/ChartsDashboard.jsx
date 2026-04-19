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
} from 'chart.js';
import { Bar, Line, Scatter } from 'react-chartjs-2';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ScatterController
);

const ChartCard = ({ title, children }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/5 p-6 rounded-2xl shadow-lg"
  >
    <div className="flex items-center justify-between mb-8">
      <h3 className="text-sm font-bold text-white tracking-tight uppercase tracking-[0.1em]">{title}</h3>
      <div className="w-2 h-2 rounded-full bg-primary-500/50 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
    </div>
    <div className="h-[300px] w-full flex items-center justify-center overflow-hidden">
      {children}
    </div>
  </motion.div>
);

const ChartsDashboard = ({ chartData, base64Images }) => {
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Dynamic JS Charts */}
      {chartData?.map((chart, idx) => (
        <ChartCard key={idx} title={chart.title}>
          {chart.type === 'bar' && <Bar options={chartOptions} data={chart.data} />}
          {chart.type === 'line' && <Line options={chartOptions} data={chart.data} />}
          {chart.type === 'scatter' && <Scatter options={chartOptions} data={chart.data} />}
        </ChartCard>
      ))}

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
  );
};

export default ChartsDashboard;
