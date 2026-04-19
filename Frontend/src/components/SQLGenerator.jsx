import React, { useState } from 'react';
import { FileCode, Search, Copy, Check, Terminal, Play, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SQLGenerator = ({ onGenerate }) => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    try {
      const data = await onGenerate(query);
      setResult(data.sql);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Terminal className="w-6 h-6 text-primary-500" />
          <h2 className="text-xl font-bold text-white tracking-tight">AI SQL Engine</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="relative group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe the data you need (e.g. 'Highest revenue products in Q3')"
            className="w-full bg-slate-900 border border-slate-700/50 text-white rounded-2xl py-5 pl-14 pr-36 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all placeholder:text-slate-600 text-base"
          />
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" />
          <button
            type="submit"
            disabled={loading || !query}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary-600 hover:bg-primary-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold py-2.5 px-6 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-primary-600/10"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            Generate SQL
          </button>
        </form>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {['Growth trend', 'Regional performance', 'Customer segmentation'].map((hint) => (
            <button 
              key={hint}
              onClick={() => setQuery(`Show me ${hint.toLowerCase()} summary`)}
              className="text-[10px] font-bold text-slate-500 hover:text-primary-400 border border-slate-800 hover:border-primary-500/30 px-3 py-1.5 rounded-lg transition-all bg-slate-900/50 uppercase tracking-widest"
            >
              {hint}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="bg-slate-800/50 px-6 py-4 flex justify-between items-center border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-slate-400 font-mono text-[11px] font-bold uppercase tracking-widest">Optimized Query Output</span>
              </div>
              <button 
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-800 text-[10px] font-bold text-slate-500 hover:text-white transition-all uppercase tracking-widest border border-transparent hover:border-slate-700"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    SQL Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy to Clipboard
                  </>
                )}
              </button>
            </div>
            <div className="p-8">
              <pre className="text-primary-400 font-mono text-base leading-relaxed whitespace-pre-wrap overflow-x-auto custom-scrollbar">
                <code>{result}</code>
              </pre>
            </div>
            <div className="px-6 py-3 bg-slate-800/30 border-t border-slate-800 flex items-center justify-between">
               <span className="text-[10px] text-slate-600 italic">Complexity: O(N) optimized</span>
               <span className="text-[10px] text-primary-500/50 font-bold uppercase tracking-widest">PostgreSQL Compliant</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SQLGenerator;
