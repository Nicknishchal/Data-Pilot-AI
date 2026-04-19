import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Zap, Target, Lightbulb } from 'lucide-react';

const StrategicPairCard = ({ trend, action, title, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500/20 to-blue-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
      <div className="relative bg-[#1e293b]/40 backdrop-blur-xl border border-white/5 p-8 rounded-3xl h-full shadow-2xl flex flex-col">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-400 border border-primary-500/20 shadow-inner">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-white font-bold text-lg leading-tight">{title}</h4>
            <div className="flex items-center gap-2 mt-1">
               <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
               <p className="text-[10px] text-primary-400 font-black uppercase tracking-[0.2em]">Strategy Segment</p>
            </div>
          </div>
        </div>

        <div className="space-y-6 flex-1">
          {/* Trend Section */}
          <div className="relative pl-6 border-l-2 border-slate-700/50">
            <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-slate-700"></div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">The Observation</p>
            <p className="text-slate-300 text-[13px] leading-relaxed italic">"{trend}"</p>
          </div>

          {/* Action Section */}
          <div className="relative pl-6 border-l-2 border-primary-500/40 bg-primary-500/[0.03] p-4 rounded-r-2xl">
            <div className="absolute -left-[5px] top-4 w-2 h-2 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
            <p className="text-[10px] font-bold text-primary-400 uppercase tracking-widest mb-2">The Strategic Move</p>
            <p className="text-white text-sm font-semibold leading-relaxed">{action}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AIInsights = ({ insights, explanation }) => {
  const overview = insights?.find(i => i.type === 'key');
  const strategies = insights?.filter(i => i.type === 'strategy');

  return (
    <div className="max-w-6xl mx-auto space-y-16 py-4">
      {/* Narrative Section - Higher focus */}
      {explanation && (
        <section>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-600/10 to-blue-600/10 rounded-[3rem] blur-xl opacity-50"></div>
            <div className="relative bg-[#0f172a]/60 border border-white/5 p-12 lg:p-16 rounded-[3rem] shadow-2xl backdrop-blur-2xl overflow-hidden">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl"></div>
              
              <div className="flex flex-col gap-10">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center text-white shadow-xl shadow-primary-500/20">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-xs font-black text-primary-400 uppercase tracking-[0.4em] mb-1">Executive Summary</h2>
                    <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Heuristic AI Narrative Analysis</p>
                  </div>
                </div>
                
                <p className="text-slate-100 text-xl lg:text-2xl leading-normal font-light italic border-l-4 border-primary-500/30 pl-8 lg:pl-12 py-2">
                  "{explanation}"
                </p>

                <div className="flex items-center gap-4 pt-4">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold text-white">AI</div>
                    <div>
                        <p className="text-sm font-bold text-white tracking-tight">Antigravity Analyst</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Lead Intelligence Model</p>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Dataset Characterization */}
      {overview && (
        <section className="bg-slate-900/30 border border-white/5 p-10 rounded-[2.5rem] relative overflow-hidden">
          <div className="flex items-center gap-4 mb-6">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Baseline Characterization</h3>
          </div>
          <p className="text-slate-400 text-[15px] leading-relaxed whitespace-pre-wrap max-w-4xl">{overview.content}</p>
        </section>
      )}

      {/* Strategic Roadmap - Main Focus */}
      <section className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-primary-500 rounded-full"></div>
                <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Strategic Roadmap</h3>
            </div>
            <p className="text-slate-500 text-sm max-w-md font-medium">Coupling deep data observations with high-leverage business actions.</p>
          </div>
          <div className="px-5 py-2.5 bg-slate-800/50 rounded-2xl border border-white/5 flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Confidence Score: 98.4%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {strategies?.map((item, idx) => (
            <StrategicPairCard 
              key={idx} 
              index={idx} 
              title={item.title} 
              trend={item.trend} 
              action={item.action} 
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default AIInsights;
