import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudUpload, FileSpreadsheet, X, CheckCircle2, Loader2, Info, ChevronRight, Sparkles, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UploadCard = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      setError(null);
    } else {
      setError("Please upload a valid CSV file.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    multiple: false
  });

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    
    try {
      await onUploadSuccess(file);
    } catch (err) {
      setError(err.message || "Failed to upload file. Make sure backend is running.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Import Data</h2>
          <p className="text-sm text-slate-400 mt-1">Select a CSV dataset to perform statistical and AI analysis.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
           Step 01 <ChevronRight className="w-3 h-3" /> Initialization
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-xl">
        <div 
          {...getRootProps()}
          className={`relative cursor-pointer border-2 border-dashed rounded-2xl py-12 px-6 transition-all duration-300 flex flex-col items-center gap-4 ${
            isDragActive 
              ? 'border-primary-500 bg-primary-500/5' 
              : 'border-slate-700 hover:border-slate-500 hover:bg-slate-700/30'
          }`}
        >
          <input {...getInputProps()} />
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
            isDragActive 
              ? 'bg-primary-500 text-white translate-y-[-4px] shadow-lg shadow-primary-500/20' 
              : 'bg-slate-900 text-slate-500'
          }`}>
            <CloudUpload className="w-8 h-8" />
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-white">
              {isDragActive ? "Drop the file here" : "Click to select or drag and drop CSV"}
            </p>
            <p className="text-sm text-slate-500 mt-1.5">Maximum file size: 50MB</p>
          </div>
        </div>

        <AnimatePresence>
          {file && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-6 bg-slate-900 border border-slate-700 rounded-xl p-5 flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400 border border-primary-500/20">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-white font-bold truncate max-w-[250px]">{file.name}</p>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!uploading && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="p-2 hover:bg-rose-500/10 text-slate-500 hover:text-rose-500 rounded-lg transition-colors"
                    title="Remove file"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold text-sm rounded-lg transition-all shadow-lg shadow-primary-600/10 flex items-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analysing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Run Analysis
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl flex items-start gap-4"
            >
              <div className="shrink-0 w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-rose-400">Upload Restriction</p>
                <p className="text-xs text-rose-400/70 mt-0.5 leading-relaxed">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Standard CSV", desc: "Supports comma-separated files with UTF-8 encoding.", icon: FileSpreadsheet },
          { title: "AI-Powered", desc: "Automated feature detection and statistical insights.", icon: Sparkles },
          { title: "Real-time", desc: "Instant visualization and anomaly detection report.", icon: Zap },
        ].map((item, i) => (
          <div key={i} className="p-5 bg-slate-800/40 border border-slate-700/50 rounded-2xl hover:border-slate-600 transition-colors">
            <item.icon className="w-6 h-6 text-primary-500 mb-4" />
            <h4 className="text-sm font-bold text-white mb-2">{item.title}</h4>
            <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadCard;
