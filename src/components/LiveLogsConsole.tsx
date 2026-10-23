import React, { useState } from 'react';
import { X, Terminal, Trash2, Copy, Check, Filter } from 'lucide-react';
import { LogEntry, Language } from '../types';
import { getTranslation } from '../utils/translations';

interface LiveLogsConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  logs: LogEntry[];
  onClearLogs: () => void;
  language: Language;
}

export const LiveLogsConsole: React.FC<LiveLogsConsoleProps> = ({
  isOpen,
  onClose,
  logs,
  onClearLogs,
  language,
}) => {
  const t = getTranslation(language);
  const [filter, setFilter] = useState<'all' | 'info' | 'warn' | 'success'>('all');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLogs = () => {
    const text = logs.map((l) => `[${l.timestamp}] [${l.level.toUpperCase()}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredLogs = logs.filter((l) => {
    if (filter === 'all') return true;
    return l.level === filter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#090d16] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold text-white font-mono">
                Elbouayachi Tunnel Engine Logs (سجل الأحداث)
              </h2>
              <p className="text-[11px] text-slate-500 font-mono">
                V2Ray-Core v5.14.1 · SSH Tunnel · Tun2Socks Packet Driver
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLogs}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              title="نسخ السجل"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={onClearLogs}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors"
              title="مسح السجل"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-2 border-b border-slate-800/80 bg-slate-900/40 flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-500 text-[11px]">فلترة:</span>
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-lg ${
              filter === 'all' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            الكل ({logs.length})
          </button>
          <button
            onClick={() => setFilter('success')}
            className={`px-2.5 py-1 rounded-lg ${
              filter === 'success' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            نجاح (Success)
          </button>
          <button
            onClick={() => setFilter('info')}
            className={`px-2.5 py-1 rounded-lg ${
              filter === 'info' ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            معلومات (Info)
          </button>
          <button
            onClick={() => setFilter('warn')}
            className={`px-2.5 py-1 rounded-lg ${
              filter === 'warn' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            تحذيرات (Warn)
          </button>
        </div>

        {/* Terminal Log Screen */}
        <div className="flex-1 overflow-y-auto p-5 font-mono text-xs space-y-1.5 bg-[#070b13] select-text">
          {filteredLogs.length === 0 ? (
            <div className="text-slate-600 text-center py-10">السجل فارغ حالياً.</div>
          ) : (
            filteredLogs.map((log) => {
              let color = 'text-slate-300';
              if (log.level === 'success') color = 'text-emerald-400';
              if (log.level === 'warn') color = 'text-amber-400';
              if (log.level === 'info') color = 'text-cyan-300';

              return (
                <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-slate-600 text-[10px] shrink-0 pt-0.5">
                    {log.timestamp}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase shrink-0 px-1 py-0.2 rounded ${
                      log.level === 'success'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : log.level === 'warn'
                        ? 'bg-amber-500/10 text-amber-400'
                        : 'bg-cyan-500/10 text-cyan-400'
                    }`}
                  >
                    {log.level}
                  </span>
                  <span className={`${color} break-all`}>{log.message}</span>
                </div>
              );
            })
          )}
        </div>

        {/* Terminal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs font-mono text-slate-500">
          <span>Auto-Scroll: Enabled · Buffer: 100 lines</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors font-sans font-medium"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
