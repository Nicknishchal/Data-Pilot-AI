import React from 'react';
import { Sparkles, Bell, Search, User } from 'lucide-react';

const Navbar = ({ filename, error }) => {
  return (
    <header className="h-16 border-b border-slate-800 bg-[#0b1121]/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-8 shrink-0">
      <div className="flex items-center gap-6">
        <h1 className="text-lg font-bold text-white tracking-tight md:hidden">DataPilot AI</h1>
        
        {filename && (
          <div className="flex items-center gap-2 text-[10px] font-mono">
            <span className="text-slate-500 uppercase tracking-widest font-bold">Workspace</span>
            <span className="text-primary-400 bg-primary-500/10 px-2.5 py-1 rounded-md border border-primary-500/20">{filename}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-5">
        {error && (
          <div className="px-3 py-1 bg-rose-500/5 border border-rose-500/10 rounded-lg flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-rose-400 text-[10px] font-bold uppercase tracking-tight">{error}</span>
          </div>
        )}

        <div className="flex items-center gap-2 border-l border-slate-800 pl-5">
           <button className="p-2 text-slate-500 hover:text-white rounded-lg transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer group">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700 text-slate-400 group-hover:text-white group-hover:bg-primary-600 group-hover:border-primary-500 transition-all">
               <User className="w-4 h-4" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-[11px] font-bold text-slate-300 leading-none">DataPilot AI</p>
              
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
