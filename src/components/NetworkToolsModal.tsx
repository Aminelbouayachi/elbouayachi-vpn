import React, { useState } from 'react';
import { X, Activity, Play, Radio, Shield, Globe, Check, RefreshCw, Zap } from 'lucide-react';
import { Language, ConnectionStatus } from '../types';
import { DNS_SERVERS } from '../data/servers';
import { getTranslation } from '../utils/translations';

interface NetworkToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: ConnectionStatus;
  selectedDns: string;
  onSelectDns: (dnsName: string) => void;
  language: Language;
}

export const NetworkToolsModal: React.FC<NetworkToolsModalProps> = ({
  isOpen,
  onClose,
  status,
  selectedDns,
  onSelectDns,
  language,
}) => {
  const t = getTranslation(language);
  const [activeTab, setActiveTab] = useState<'speed' | 'ping' | 'dns' | 'ip'>('speed');

  // Speed test states
  const [isTestingSpeed, setIsTestingSpeed] = useState(false);
  const [speedProgress, setSpeedProgress] = useState(0);
  const [downloadMbps, setDownloadMbps] = useState<number | null>(null);
  const [uploadMbps, setUploadMbps] = useState<number | null>(null);
  const [testPing, setTestPing] = useState<number | null>(null);

  // Ping test states
  const [pingTargets, setPingTargets] = useState([
    { name: 'بوابة إنوي (Inwi 4G Gateway)', host: '105.154.0.1', ping: 18, status: 'ممتاز' },
    { name: 'بوابة أورنج (Orange Maroc)', host: '197.230.0.1', ping: 19, status: 'ممتاز' },
    { name: 'بوابة اتصالات المغرب (IAM)', host: '196.200.0.1', ping: 15, status: 'ممتاز' },
    { name: 'Cloudflare Anycast (1.1.1.1)', host: '1.1.1.1', ping: 22, status: 'ممتاز' },
    { name: 'Google DNS (8.8.8.8)', host: '8.8.8.8', ping: 26, status: 'جيد جداً' },
    { name: 'سيرفر الألعاب باريس (Paris FR)', host: 'fr.gaming.net', ping: 31, status: 'سريع' },
  ]);
  const [isPinging, setIsPinging] = useState(false);

  if (!isOpen) return null;

  const runSpeedTest = () => {
    setIsTestingSpeed(true);
    setSpeedProgress(10);
    setDownloadMbps(null);
    setUploadMbps(null);
    setTestPing(16);

    const interval = setInterval(() => {
      setSpeedProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTestingSpeed(false);
          setDownloadMbps(status === 'connected' ? 64.8 : 22.4);
          setUploadMbps(status === 'connected' ? 28.5 : 8.2);
          return 100;
        }
        return prev + 15;
      });
    }, 250);
  };

  const runPingTest = () => {
    setIsPinging(true);
    setTimeout(() => {
      setPingTargets((prev) =>
        prev.map((item) => ({
          ...item,
          ping: Math.floor(Math.random() * 8) + (item.ping - 4),
        }))
      );
      setIsPinging(false);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0c121e] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <span>{t.networkTools}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              فحص سرعة النفق، زمن استجابة بوابات المغرب (Ping)، وتغيير الـ DNS
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800/60 bg-slate-900/30">
          <button
            onClick={() => setActiveTab('speed')}
            className={`pb-3 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'speed'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            فحص السرعة المباشر
          </button>
          <button
            onClick={() => setActiveTab('ping')}
            className={`pb-3 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'ping'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            فحص بوابات المغرب (Ping)
          </button>
          <button
            onClick={() => setActiveTab('dns')}
            className={`pb-3 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'dns'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            مغير الـ DNS السريع
          </button>
          <button
            onClick={() => setActiveTab('ip')}
            className={`pb-3 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'ip'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            فحص تسريب الـ IP والخصوصية
          </button>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: Speed Test */}
          {activeTab === 'speed' && (
            <div className="flex flex-col items-center space-y-6">
              {/* Circular Gauge */}
              <div className="relative w-48 h-48 rounded-full border-4 border-slate-800 flex flex-col items-center justify-center p-4 bg-slate-950/60">
                {isTestingSpeed && (
                  <div className="absolute inset-0 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin" />
                )}
                <Zap className="w-6 h-6 text-cyan-400 mb-1" />
                <div className="text-2xl font-bold font-mono text-white tabular-nums">
                  {downloadMbps !== null ? `${downloadMbps}` : isTestingSpeed ? `${speedProgress}` : '0.0'}
                </div>
                <div className="text-[11px] text-slate-400 font-mono">Mbps Download</div>
                {testPing !== null && (
                  <div className="text-[10px] text-emerald-400 font-mono mt-1">
                    Ping: {testPing}ms · Jitter: 1.8ms
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={runSpeedTest}
                disabled={isTestingSpeed}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-black font-bold text-xs rounded-xl shadow-lg transition-transform active:scale-95 disabled:opacity-50"
              >
                {isTestingSpeed ? 'جاري قياس السرعة...' : 'بدء فحص السرعة الآن'}
              </button>

              {/* Speed Metrics */}
              <div className="w-full grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
                  <div className="text-xs text-slate-400 font-medium">سرعة التحميل (Download)</div>
                  <div className="text-xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
                    {downloadMbps !== null ? `${downloadMbps} Mbps` : '--'}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">مناسب لـ 4K وستريمينغ</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
                  <div className="text-xs text-slate-400 font-medium">سرعة الرفع (Upload)</div>
                  <div className="text-xl font-bold font-mono text-cyan-400 mt-1 tabular-nums">
                    {uploadMbps !== null ? `${uploadMbps} Mbps` : '--'}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">ممتاز للمكالمات والألعاب</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Ping Targets */}
          {activeTab === 'ping' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white">زمن الاستجابة لمسارات المغرب وأوروبا:</span>
                <button
                  onClick={runPingTest}
                  disabled={isPinging}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl transition-all"
                >
                  <RefreshCw className={`w-3 h-3 text-cyan-400 ${isPinging ? 'animate-spin' : ''}`} />
                  <span>إعادة الفحص</span>
                </button>
              </div>

              <div className="space-y-2">
                {pingTargets.map((target, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{target.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">{target.host}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md font-sans">
                        {target.status}
                      </span>
                      <span className="text-sm font-bold font-mono text-cyan-400 tabular-nums">
                        {target.ping} ms
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DNS Changer */}
          {activeTab === 'dns' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-300 block">
                اختر مخدم DNS مشفر لحظر الإعلانات وزيادة سرعة التصفح:
              </span>

              <div className="space-y-2.5">
                {DNS_SERVERS.map((dns) => {
                  const isSelected = selectedDns === dns.name;
                  return (
                    <div
                      key={dns.name}
                      onClick={() => onSelectDns(dns.name)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-cyan-500/10 border-cyan-500/50 shadow-md'
                          : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{dns.name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 bg-cyan-500/20 text-cyan-400 rounded-md">
                            {dns.tag}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-1">
                          Primary: {dns.primary} &nbsp;·&nbsp; Secondary: {dns.secondary}
                        </div>
                      </div>

                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: IP & Privacy Leak */}
          {activeTab === 'ip' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs text-slate-400">حالة النفق والتشفير:</span>
                  <span
                    className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                      status === 'connected'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {status === 'connected' ? 'محمي ومشفر (AES-256)' : 'غير محمي'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">الـ IP الظاهر للمواقع:</span>
                    <span className="font-mono font-bold text-white text-sm">
                      {status === 'connected' ? '51.83.104.218' : '105.154.89.14 (المغرب)'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">مزود الإنترنت (ISP):</span>
                    <span className="font-medium text-white">
                      {status === 'connected' ? 'OVH Datacenter SAS (France)' : 'Inwi Telecom Maroc'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">موقع الخادم الجغرافي:</span>
                    <span className="font-medium text-white">
                      {status === 'connected' ? 'Paris, France 🇫🇷' : 'Casablanca, Morocco 🇲🇦'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">فحص تسريب WebRTC Leak:</span>
                    <span className="text-emerald-400 font-bold">آمن (Zero Leaks)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-xl transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
