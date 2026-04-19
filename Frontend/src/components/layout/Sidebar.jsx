import React from 'react';
import { 
  BarChart3, 
  LayoutDashboard, 
  BrainCircuit, 
  Zap, 
  Terminal, 
  Database,
  CloudUpload,
  Settings,
  CircleHelp,
  PieChart
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, disabled }) => {
  const menuItems = [
    { id: 'upload', label: 'Upload Data', icon: CloudUpload },
    { id: 'summary', label: 'Data Overview', icon: LayoutDashboard },
    { id: 'insights', label: 'AI Insights', icon: BrainCircuit },
    { id: 'charts', label: 'Visualizations', icon: PieChart },
    { id: 'anomalies', label: 'Anomaly Report', icon: Zap },
    { id: 'sql', label: 'SQL Assistant', icon: Terminal },
  ];

  return (
    <aside className="w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col h-screen sticky top-0 z-40 hidden md:flex shrink-0">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10 group">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform">
            <Database className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Antigravity</h1>
            <p className="text-[10px] text-primary-400 font-bold uppercase tracking-widest leading-tight">Data Agent</p>
          </div>
        </div>

        <nav className="space-y-1.5 focus:outline-none">
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Main Menu</p>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => !disabled && setActiveTab(item.id)}
              disabled={disabled && item.id !== 'upload'}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeTab === item.id
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'stroke-[2.5px]' : 'text-slate-500 group-hover:text-slate-300'}`} />
              <span className="font-medium text-sm">{item.label}</span>
              {activeTab === item.id && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-4">
        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-xs font-semibold text-slate-200 uppercase tracking-wide">Analysis Ready</span>
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer group">
          <Settings className="w-4 h-4 group-hover:rotate-45 transition-transform duration-500" />
          <span className="text-xs font-medium uppercase tracking-widest">Settings</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
