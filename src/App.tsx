import React, { useState, useEffect, useRef } from 'react';
import { SERVERS_LIST, CARRIER_TWEAKS, DNS_SERVERS } from './data/servers';
import {
  Server,
  CarrierTweak,
  ConnectionStatus,
  ConnectionStats,
  LogEntry,
  ProxyConfig,
  AppSettings,
  Language,
} from './types';
import { Header } from './components/Header';
import { TunnelDashboard } from './components/TunnelDashboard';
import { ServerListModal } from './components/ServerListModal';
import { PayloadEditorModal } from './components/PayloadEditorModal';
import { ShareNetModal } from './components/ShareNetModal';
import { NetworkToolsModal } from './components/NetworkToolsModal';
import { LiveLogsConsole } from './components/LiveLogsConsole';
import { SettingsModal } from './components/SettingsModal';
import { ShieldCheck, Zap, Lock, Terminal, Radio } from 'lucide-react';

export default function App() {
  // App Settings with user's desired name: "Elbouayachi VPN"
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('elbouayachi_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      appName: 'Elbouayachi VPN',
      appSubtitle: 'Moroccan High-Speed Tunnel & Proxy',
      accentColor: 'emerald',
      killSwitch: true,
      bypassLan: true,
      dnsOverHttps: true,
      autoReconnect: true,
      selectedDns: 'Cloudflare Fast DNS',
      language: 'darija',
    };
  });

  // Servers List (allows custom servers)
  const [servers, setServers] = useState<Server[]>(() => {
    const saved = localStorage.getItem('elbouayachi_servers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return SERVERS_LIST;
  });

  const [selectedServer, setSelectedServer] = useState<Server>(servers[0]);
  const [selectedTweak, setSelectedTweak] = useState<CarrierTweak>(CARRIER_TWEAKS[0]);
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');

  // Live Stats
  const [stats, setStats] = useState<ConnectionStats>(() => {
    const initialHistory = Array.from({ length: 30 }, (_, i) => ({
      time: `-${30 - i}s`,
      speedMB: 0,
    }));
    return {
      durationSeconds: 0,
      downloadSpeedBytes: 0,
      uploadSpeedBytes: 0,
      totalDownloadBytes: 42 * 1024 * 1024,
      totalUploadBytes: 12 * 1024 * 1024,
      currentPing: 16,
      virtualIp: '51.83.104.218',
      speedHistory: initialHistory,
    };
  });

  // Proxy Share Net
  const [proxyConfig, setProxyConfig] = useState<ProxyConfig>({
    isEnabled: true,
    socksPort: 10808,
    httpPort: 8080,
    localIp: '192.168.43.1',
    activeClientsCount: 2,
  });

  // Diagnostic Logs
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'log-1',
      timestamp: '09:54:12',
      level: 'info',
      message: 'نواة Elbouayachi VPN جاهزة للعمل على شبكات 4G و 5G (Inwi / Orange / IAM)',
    },
    {
      id: 'log-2',
      timestamp: '09:54:14',
      level: 'info',
      message: 'محرك V2Ray-Core v5.14.1 و SSH Engine مهيأ وجاهز للتشفير',
    },
  ]);

  // Modal Visibility States
  const [isServerModalOpen, setIsServerModalOpen] = useState(false);
  const [isPayloadModalOpen, setIsPayloadModalOpen] = useState(false);
  const [isShareNetOpen, setIsShareNetOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync document direction and title with settings
  useEffect(() => {
    const isRtl = settings.language === 'darija' || settings.language === 'ar';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = isRtl ? 'ar' : settings.language;
    document.title = `${settings.appName} - Moroccan High-Speed Tunnel & Proxy`;
  }, [settings.language, settings.appName]);

  // Save settings in local storage
  useEffect(() => {
    localStorage.setItem('elbouayachi_settings', JSON.stringify(settings));
  }, [settings]);

  // Save servers in local storage
  useEffect(() => {
    localStorage.setItem('elbouayachi_servers', JSON.stringify(servers));
  }, [servers]);

  const addLog = (level: LogEntry['level'], message: string) => {
    const time = new Date().toLocaleTimeString('fr-FR', { hour12: false });
    setLogs((prev) => [
      {
        id: `log-${Date.now()}-${Math.random()}`,
        timestamp: time,
        level,
        message,
      },
      ...prev.slice(0, 150),
    ]);
  };

  // Connection Handler
  const handleToggleConnection = () => {
    if (status === 'disconnected') {
      setStatus('connecting');
      addLog('info', `بدء الاتصال بالسيرفر: ${selectedServer.name} (${selectedServer.ip})...`);
      addLog('debug', `إعداد المسار وحقن الـ SNI: ${selectedTweak.sniHost}`);

      setTimeout(() => {
        addLog('info', `مصافحة TLS 1.3 مع المنفذ ${selectedTweak.port} عبر بروتوكول ${selectedServer.protocol.toUpperCase()}`);
      }, 500);

      setTimeout(() => {
        setStatus('connected');
        addLog('success', `تم الاتصال بنجاح بالنفق! الـ IP الافتراضي الجديد: ${selectedServer.ip}`);
        addLog('success', 'حماية الخصوصية نشطة، تم توجيه كافة حزم البيانات (0.0.0.0/0 -> tun0)');
      }, 1100);
    } else if (status === 'connected') {
      setStatus('disconnecting');
      addLog('warn', 'جاري إغلاق نفق التشفير وفصل الاتصال...');
      setTimeout(() => {
        setStatus('disconnected');
        setStats((prev) => ({
          ...prev,
          downloadSpeedBytes: 0,
          uploadSpeedBytes: 0,
          speedHistory: (prev.speedHistory || []).map((pt) => ({ ...pt, speedMB: 0 })),
        }));
        addLog('info', 'تم قطع الاتصال بالنفق بأمان.');
      }, 600);
    }
  };

  // Background Telemetry Interval when Connected (Tracks last 30 seconds)
  useEffect(() => {
    let interval: any = null;
    if (status === 'connected') {
      interval = setInterval(() => {
        setStats((prev) => {
          // Dynamic simulated speed between 1.5 MB/s and 5.2 MB/s
          const dlSpeed = Math.floor(Math.random() * (4500000 - 1500000) + 1500000);
          const ulSpeed = Math.floor(Math.random() * (1200000 - 300000) + 300000);
          const dlSpeedMB = parseFloat((dlSpeed / (1024 * 1024)).toFixed(2));

          const existingHistory =
            prev.speedHistory && prev.speedHistory.length > 0
              ? prev.speedHistory
              : Array.from({ length: 30 }, (_, i) => ({ time: `-${30 - i}s`, speedMB: 0 }));

          const nextHistory = [
            ...existingHistory.slice(existingHistory.length >= 30 ? 1 : 0),
            {
              time: `${(prev.durationSeconds + 1) % 60}s`,
              speedMB: dlSpeedMB,
            },
          ];

          return {
            ...prev,
            durationSeconds: prev.durationSeconds + 1,
            downloadSpeedBytes: dlSpeed,
            uploadSpeedBytes: ulSpeed,
            totalDownloadBytes: prev.totalDownloadBytes + dlSpeed,
            totalUploadBytes: prev.totalUploadBytes + ulSpeed,
            currentPing: Math.max(12, selectedServer.pingMs + Math.floor(Math.random() * 5 - 2)),
            virtualIp: selectedServer.ip,
            speedHistory: nextHistory,
          };
        });
      }, 1000);
    } else {
      setStats((prev) => ({
        ...prev,
        downloadSpeedBytes: 0,
        uploadSpeedBytes: 0,
      }));
    }
    return () => clearInterval(interval);
  }, [status, selectedServer]);

  const handleAddCustomServer = (newServer: Server) => {
    setServers((prev) => [newServer, ...prev]);
    addLog('success', `تمت إضافة الخادم المخصص بنجاح: ${newServer.name}`);
  };

  const handleToggleProxy = () => {
    setProxyConfig((prev) => {
      const next = !prev.isEnabled;
      if (next) {
        addLog('success', `تم تفعيل مخدم الهوتسبوت SOCKS5 على المنفذ ${prev.socksPort} و HTTP ${prev.httpPort}`);
      } else {
        addLog('warn', 'تم تعطيل مخدم الهوتسبوت');
      }
      return {
        ...prev,
        isEnabled: next,
      };
    });
  };

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Header */}
      <Header
        status={status}
        settings={settings}
        onOpenShareNet={() => setIsShareNetOpen(true)}
        onOpenTools={() => setIsToolsOpen(true)}
        onOpenLogs={() => setIsLogsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLanguageChange={(lang: Language) => setSettings({ ...settings, language: lang })}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col items-center">
        {/* Main Dashboard Widget */}
        <TunnelDashboard
          status={status}
          server={selectedServer}
          tweak={selectedTweak}
          stats={stats}
          settings={settings}
          onToggleConnection={handleToggleConnection}
          onOpenServerList={() => setIsServerModalOpen(true)}
          onOpenPayloadEditor={() => setIsPayloadModalOpen(true)}
          onOpenShareNet={() => setIsShareNetOpen(true)}
          onOpenTools={() => setIsToolsOpen(true)}
        />

        {/* Informational Moroccan Carrier Compatibility Showcase Strip */}
        <section className="w-full max-w-4xl mt-8 pt-8 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>دعم كامل لجميع شبكات الاتصال بالمغرب 🇲🇦</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                تطوير مخصص لتخطي قيود السرعة وخنق البيانات على باقات إنوي، أورنج، واتصالات المغرب
              </p>
            </div>
            <span className="text-[11px] text-emerald-400 font-mono px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
              100% Anti-Throttle
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Inwi Card */}
            <div className="p-4 rounded-2xl bg-[#0c121e] border border-slate-800/80 hover:border-purple-500/40 transition-colors">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span className="text-xs font-bold text-white">إنوي (Inwi 4G / 5G)</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                تجاوز خنق السرعة لبطاقات i-dar وعروض مواقع التواصل مع Cloudflare CDN Fronting.
              </p>
            </div>

            {/* Orange Maroc Card */}
            <div className="p-4 rounded-2xl bg-[#0c121e] border border-slate-800/80 hover:border-orange-500/40 transition-colors">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                <span className="text-xs font-bold text-white">أورنج (Orange Maroc)</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                توافق مع عروض Max-It وباقات Dar Box مع تشفير مباشر SSL 443 عبر WebSocket.
              </p>
            </div>

            {/* Maroc Telecom (IAM) Card */}
            <div className="p-4 rounded-2xl bg-[#0c121e] border border-slate-800/80 hover:border-blue-500/40 transition-colors">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-xs font-bold text-white">اتصالات المغرب (IAM)</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                استجابة فائقة السرعة للألعاب (Free Fire / PUBG) على بطاقات جوال مع خوادم الدار البيضاء.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-[#060910] py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">{settings.appName}</span>
            <span>·</span>
            <span>الإصدار 2.5-PRO (مستوحى من ma.izone.max)</span>
          </div>
          <div>
            تشفير عالي الأمان بنواة V2Ray و SSH مع حماية الهوية والخصوصية
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ServerListModal
        isOpen={isServerModalOpen}
        onClose={() => setIsServerModalOpen(false)}
        servers={servers}
        selectedServerId={selectedServer.id}
        onSelectServer={(srv) => {
          setSelectedServer(srv);
          addLog('info', `تم اختيار الخادم: ${srv.name}`);
        }}
        onAddCustomServer={handleAddCustomServer}
        language={settings.language}
      />

      <PayloadEditorModal
        isOpen={isPayloadModalOpen}
        onClose={() => setIsPayloadModalOpen(false)}
        currentTweak={selectedTweak}
        onSelectTweak={(twk) => {
          setSelectedTweak(twk);
          addLog('info', `تم تطبيق بايلود: ${twk.name} (SNI: ${twk.sniHost})`);
        }}
        language={settings.language}
      />

      <ShareNetModal
        isOpen={isShareNetOpen}
        onClose={() => setIsShareNetOpen(false)}
        proxyConfig={proxyConfig}
        onToggleProxy={handleToggleProxy}
        language={settings.language}
      />

      <NetworkToolsModal
        isOpen={isToolsOpen}
        onClose={() => setIsToolsOpen(false)}
        status={status}
        selectedDns={settings.selectedDns}
        onSelectDns={(dns) => {
          setSettings({ ...settings, selectedDns: dns });
          addLog('success', `تم تفعيل الـ DNS المشفر: ${dns}`);
        }}
        language={settings.language}
      />

      <LiveLogsConsole
        isOpen={isLogsOpen}
        onClose={() => setIsLogsOpen(false)}
        logs={logs}
        onClearLogs={() => setLogs([])}
        language={settings.language}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newSettings) => {
          setSettings(newSettings);
          addLog('success', 'تم حفظ وتطبيق إعدادات التطبيق بنجاح.');
        }}
        language={settings.language}
      />
    </div>
  );
}
