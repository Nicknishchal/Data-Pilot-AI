import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, AlertCircle, BarChart, Lightbulb, ClipboardList, Info } from 'lucide-react';

const InsightListCard = ({ title, items, icon: Icon, colorClass, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="bg-[#0b1120]/60 backdrop-blur-md border border-white/5 rounded-3xl p-8 h-full shadow-xl"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className={`w-12 h-12 rounded-2xl ${colorClass.bg} flex items-center justify-center ${colorClass.text} border border-white/5 shadow-inner`}>
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-white font-bold text-xl tracking-tight">{title}</h3>
      </div>
      
      <ul className="space-y-4">
        {items?.map((item, idx) => (
          <li key={idx} className="flex gap-4 group">
            <div className={`mt-2 w-1.5 h-1.5 rounded-full ${colorClass.bullet} shrink-0 group-hover:scale-150 transition-transform`} />
            <p className="text-slate-300 text-sm leading-relaxed">{item}</p>
          </li>
        ))}
        {(!items || items.length === 0) && (
          <p className="text-slate-500 text-sm italic">Detailed metrics currently processing...</p>
        )}
      </ul>
    </motion.div>
  );
};

const AIInsights = ({ insights, explanation }) => {
  if (!insights) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      {/* 1. Dataset Context & Overview */}
      <section className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5">
           <Info className="w-24 h-24 text-white" />
        </div>
        <div className="flex items-center gap-3 mb-6">
          <ClipboardList className="w-5 h-5 text-primary-400" />
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Contextual Overview</h3>
        </div>
        <p className="text-slate-200 text-lg font-light leading-relaxed max-w-4xl">
           {insights.overview}
        </p>
      </section>

      {/* 2. Executive Business Summary */}
      <section className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-[3rem] blur-xl opacity-30 group-hover:opacity-50 transition duration-500"></div>
        <div className="relative bg-[#064e3b]/10 border border-emerald-500/20 p-10 lg:p-12 rounded-[3.5rem] backdrop-blur-2xl">
           <div className="flex items-center gap-4 mb-6">
              <BarChart className="w-7 h-7 text-emerald-400" />
              <h3 className="text-2xl font-bold text-white tracking-tight">Key Performance Summary</h3>
           </div>
           <p className="text-slate-100 text-lg leading-relaxed font-medium border-l-2 border-emerald-500/30 pl-8">
             {insights.business_summary}
           </p>
        </div>
      </section>

      {/* 3. Universal Insights & Recommendations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <InsightListCard 
          title="Analytical Insights"
          items={insights.key_insights}
          icon={TrendingUp}
          delay={0.2}
          colorClass={{
            text: "text-blue-400",
            bg: "bg-blue-500/10",
            bullet: "bg-blue-500"
          }}
        />
        <InsightListCard 
          title="Strategic Recommendations"
          items={insights.strategic_recommendations}
          icon={Lightbulb}
          delay={0.4}
          colorClass={{
            text: "text-amber-400",
            bg: "bg-amber-500/10",
            bullet: "bg-amber-500"
          }}
        />
      </div>

      {/* 4. Anomaly Insights Section */}
      <section className="bg-rose-500/[0.03] border border-rose-500/10 p-10 rounded-[3rem]">
        <div className="flex items-center gap-3 mb-6 text-rose-400">
          <AlertCircle className="w-5 h-5" />
          <h3 className="text-xs font-black uppercase tracking-[0.2em]">Statistical Anomaly Report</h3>
        </div>
        <p className="text-slate-300 text-sm italic leading-relaxed pl-8 border-l border-rose-500/30">
          {insights.anomaly_insights}
        </p>
      </section>

      {/* 5. Simplified Manager Narrative */}
      {explanation && (
        <section className="pt-8">
          <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-white/5 p-12 lg:p-16 rounded-[4rem] relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <Sparkles className="w-64 h-64 text-white" />
            </div>
            <h2 className="text-xs font-black text-primary-400 uppercase tracking-[0.4em] mb-8">Lead Analyst Narrative</h2>
            <p className="text-slate-100 text-2xl lg:text-3xl leading-snug font-light italic border-l-4 border-primary-500/40 pl-10">
              &quot;{explanation}&quot;
            </p>
            <div className="mt-12 flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center text-xs font-bold text-white shadow-2xl shadow-primary-600/30">DS</div>
              <div>
                <p className="text-base font-bold text-white tracking-tight">Lead AI Analyst</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">DataPilot Intelligence Core</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default AIInsights;
