import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Lightbulb, CheckCircle } from 'lucide-react';

const InsightCard = ({ type, title, text, index }) => {
  const configs = {
    trend: { icon: TrendingUp, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    recommendation: { icon: Lightbulb, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    key: { icon: Sparkles, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    success: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" }
  };

  const config = configs[type] || configs.key;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`p-6 rounded-2xl bg-slate-900/40 border ${config.border} flex gap-5 shadow-lg group hover:bg-slate-900/60 transition-all`}
    >
      <div className={`shrink-0 w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center ${config.color} border border-white/5`}>
        <config.icon className="w-5 h-5" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-white mb-1.5 group-hover:text-primary-400 transition-colors">{title}</h4>
        <p className="text-xs text-slate-400 leading-relaxed">{text}</p>
      </div>
    </motion.div>
  );
};

const AIInsights = ({ insights, explanation }) => {
  return (
    <div className="space-y-10">
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">AI Insights Engine</h2>
            <p className="text-xs text-slate-500 mt-1">Deep analysis results based on statistical patterns and LLM processing.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/10 rounded-full border border-purple-500/20">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Experimental AI</span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {insights?.map((insight, idx) => (
            <InsightCard 
              key={idx}
              index={idx}
              type={insight.type}
              title={insight.title}
              text={insight.content}
            />
          ))}
        </div>
      </section>

      {explanation && (
        <section>
          <div className="bg-gradient-to-br from-slate-900/80 to-[#0f172a] border border-white/5 p-8 rounded-2xl relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Sparkles className="w-32 h-32 text-white" />
            </div>
            <h2 className="text-sm font-bold text-primary-400 uppercase tracking-[0.2em] mb-4">Executive Narrative</h2>
            <p className="text-slate-300 text-lg leading-relaxed font-light italic">
              "{explanation}"
            </p>
            <div className="mt-8 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-[10px] font-bold text-white">AI</div>
              <div>
                <p className="text-xs font-bold text-white">Antigravity Analyst</p>
                <p className="text-[10px] text-slate-500">Principal Insight Generator</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default AIInsights;
