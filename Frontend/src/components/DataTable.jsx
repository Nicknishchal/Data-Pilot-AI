import React from 'react';

const DataTable = ({ data, columns, highlightIndices = [] }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full rounded-xl overflow-hidden border border-white/5 bg-slate-900/20">
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-white/10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/5">
              {columns.map((col) => (
                <th key={col} className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em] whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map((row, idx) => (
              <tr
                key={idx}
                className={`transition-colors hover:bg-white/[0.02] ${
                  highlightIndices.includes(idx) ? 'bg-rose-500/10' : ''
                }`}
              >
                {columns.map((col) => (
                  <td key={`${idx}-${col}`} className="px-6 py-3.5 text-sm">
                    <span className={highlightIndices.includes(idx) ? 'text-rose-300 font-medium' : 'text-slate-300'}>
                      {typeof row[col] === 'number' 
                        ? Number.isInteger(row[col]) ? row[col] : row[col].toFixed(2)
                        : String(row[col])}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
