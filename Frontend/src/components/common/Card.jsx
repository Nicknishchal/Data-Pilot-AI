import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ title, subtitle, icon: Icon, children, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`bg-[#1e293b]/40 backdrop-blur-sm border border-white/5 rounded-2xl p-6 shadow-lg hover:border-primary-500/20 transition-colors ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          {title && <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>}
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="p-2.5 bg-primary-500/10 rounded-xl">
            <Icon className="w-5 h-5 text-primary-500" />
          </div>
        )}
      </div>
      {children}
    </motion.div>
  );
};

export default Card;
