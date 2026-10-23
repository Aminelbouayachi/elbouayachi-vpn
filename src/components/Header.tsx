import React from 'react';
import { Shield, Globe, Wifi, Cpu, Settings, Terminal, Activity, Download } from 'lucide-react';
import { ConnectionStatus, Language, AppSettings } from '../types';
import { getTranslation } from '../utils/translations';

interface HeaderProps {
  status: ConnectionStatus;
  settings: AppSettings;
  onOpenShareNet: () => void;
  onOpenTools: () => void;
  onOpenLogs: () => void;
  onOpenSettings: () => void;
  onLanguageChange: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({
  status,
  settings,
  onOpenShareNet,
  onOpenTools,
  onOpenLogs,
  onOpenSettings,
  onLanguageChange,
}) => {
  const t = getTranslation(settings.language);

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return t.connected;
      case 'connecting':
        return t.connecting;
      case 'disconnecting':
        return t.disconnecting;
      default:
        return t.disconnected;
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-800/80 bg-[#090d16]/90 backdrop-blur-md px-4 sm:px-6 py-3.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-[1.5px] shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-[#0b101b] rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            {status === 'connected' && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#090d16] animate-ping" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>{settings.appName || 'Elbouayachi VPN'}</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  PRO
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5 hidden sm:flex">
              <span>🇲🇦 {t.tagline}</span>
              <span>·</span>
              <span className="font-mono text-emerald-400">{getStatusText()}</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Share Net Hotspot Button */}
          <button
            onClick={onOpenShareNet}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-xl transition-all"
            title={t.shareNetTitle}
          >
            <Wifi className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline">{t.shareNetTitle.split(' ')[0]} Net</span>
          </button>

          {/* Network Tools */}
          <button
            onClick={onOpenTools}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-xl transition-all"
            title={t.networkTools}
          >
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline">{t.networkTools.split(' ')[0]}</span>
          </button>

          {/* Logs Console */}
          <button
            onClick={onOpenLogs}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-xl transition-all"
            title={t.liveLogs}
          >
            <Terminal className="w-4 h-4 text-amber-400" />
            <span className="hidden lg:inline">Logs</span>
          </button>

          {/* Download for GitHub ZIP Button */}
          <a
            href="/elbouayachi-vpn-source.zip"
            download="elbouayachi-vpn-source.zip"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl transition-all shadow-md shadow-emerald-600/20"
            title="تحميل سورس كود المشروع كاملاً (ZIP) لرفعه على GitHub"
          >
            <Download className="w-4 h-4 text-white" />
            <span className="hidden sm:inline">تحميل لـ GitHub</span>
          </a>

          {/* Language Switcher */}
          <div className="relative">
            <select
              value={settings.language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="appearance-none bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-200 cursor-pointer focus:outline-none focus:border-emerald-500/50"
            >
              <option value="darija">🇲🇦 الدارجة</option>
              <option value="ar">العربية</option>
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-xl transition-all"
            title={t.settings}
            aria-label={t.settings}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
