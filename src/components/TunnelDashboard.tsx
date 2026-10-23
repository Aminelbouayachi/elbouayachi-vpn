import React from 'react';
import {
  Power,
  Server as ServerIcon,
  Zap,
  ArrowDown,
  ArrowUp,
  Clock,
  Radio,
  ShieldCheck,
  ShieldAlert,
  ChevronRight,
  Wifi,
  Sliders,
  Sparkles,
  Layers
} from 'lucide-react';
import { Server, CarrierTweak, ConnectionStatus, ConnectionStats, AppSettings } from '../types';
import { getTranslation } from '../utils/translations';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  YAxis,
  XAxis,
} from 'recharts';

interface TunnelDashboardProps {
  status: ConnectionStatus;
  server: Server;
  tweak: CarrierTweak;
  stats: ConnectionStats;
  settings: AppSettings;
  onToggleConnection: () => void;
  onOpenServerList: () => void;
  onOpenPayloadEditor: () => void;
  onOpenShareNet: () => void;
  onOpenTools: () => void;
}

export const TunnelDashboard: React.FC<TunnelDashboardProps> = ({
  status,
  server,
  tweak,
  stats,
  settings,
  onToggleConnection,
  onOpenServerList,
  onOpenPayloadEditor,
  onOpenShareNet,
  onOpenTools,
}) => {
  const t = getTranslation(settings.language);

  // Format bytes to readable speed (KB/s or MB/s)
  const formatSpeed = (bytes: number) => {
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB/s`;
    }
    return `${Math.round(bytes / 1024)} KB/s`;
  };

  // Format total bytes
  const formatData = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Format duration into HH:MM:SS
  const formatDuration = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const isConnected = status === 'connected';
  const isConnecting = status === 'connecting';

  // Last 30 seconds chart data from speedHistory
  const chartData =
    stats.speedHistory && stats.speedHistory.length > 0
      ? stats.speedHistory
      : Array.from({ length: 30 }, (_, i) => ({ time: `-${30 - i}s`, speedMB: 0 }));

  const peakSpeedMB = Math.max(...chartData.map((d) => d.speedMB), 0);
  const avgSpeedMB =
    chartData.length > 0
      ? (chartData.reduce((acc, curr) => acc + curr.speedMB, 0) / chartData.length).toFixed(2)
      : '0.00';

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* Top Hero Card with Cyber Network Mesh Backdrop */}
      <div className="w-full relative overflow-hidden rounded-3xl border border-slate-800 bg-[#0c121e] shadow-2xl p-6 sm:p-8 mb-6">
        {/* Ambient Network Background Image with dark gradient overlay */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <img
            src="/src/assets/images/izone_network_mesh_1792774416082.jpg"
            alt="Elbouayachi VPN Global Mesh"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0c121e]/80 via-[#0c121e]/90 to-[#0c121e]" />
        </div>

        {/* Content inside Hero */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Status Indicator Banner */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 text-xs font-medium mb-6">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected
                  ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]'
                  : isConnecting
                  ? 'bg-amber-400 animate-ping'
                  : 'bg-rose-500'
              }`}
            />
            <span className="text-slate-300">
              {isConnected
                ? t.connected
                : isConnecting
                ? t.connecting
                : t.disconnected}
            </span>
            {isConnected && (
              <>
                <span className="text-slate-600">·</span>
                <span className="font-mono text-emerald-400 font-semibold">
                  IP: {stats.virtualIp}
                </span>
              </>
            )}
          </div>

          {/* Central Circular Interactive Connect Button */}
          <div className="relative my-4 flex items-center justify-center">
            {/* Outer animated ripple waves when connected */}
            {isConnected && (
              <>
                <div className="absolute w-56 h-56 rounded-full bg-emerald-500/10 animate-ring-pulse pointer-events-none" />
                <div className="absolute w-68 h-68 rounded-full border border-emerald-500/20 pointer-events-none animate-pulse" />
              </>
            )}

            {isConnecting && (
              <div className="absolute w-52 h-52 rounded-full border-2 border-dashed border-amber-400/50 animate-spin pointer-events-none" />
            )}

            <button
              onClick={onToggleConnection}
              disabled={isConnecting}
              className={`relative z-10 w-40 h-40 sm:w-44 sm:h-44 rounded-full flex flex-col items-center justify-center transition-all duration-300 transform active:scale-95 shadow-2xl focus:outline-none focus:ring-4 ${
                isConnected
                  ? 'bg-gradient-to-b from-emerald-500 to-teal-700 text-white shadow-emerald-500/30 focus:ring-emerald-400/30'
                  : isConnecting
                  ? 'bg-gradient-to-b from-amber-500 to-amber-700 text-white shadow-amber-500/30 focus:ring-amber-400/30'
                  : 'bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-slate-700/80 text-slate-300 hover:text-white hover:border-emerald-500/50 shadow-black/60 focus:ring-slate-600/30'
              }`}
              aria-label={isConnected ? t.disconnect : t.connect}
            >
              <Power
                className={`w-14 h-14 sm:w-16 sm:h-16 transition-transform duration-300 ${
                  isConnected
                    ? 'text-white scale-110 drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]'
                    : isConnecting
                    ? 'animate-spin text-amber-200'
                    : 'text-slate-400 group-hover:text-emerald-400'
                }`}
              />
              <span className="mt-2 text-xs font-bold tracking-wider uppercase font-mono">
                {isConnected
                  ? t.disconnect
                  : isConnecting
                  ? 'CONNECTING'
                  : t.connect}
              </span>
            </button>
          </div>

          {/* Session Timer */}
          <div className="mt-4 flex items-center gap-2 text-slate-400 text-xs font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.duration}:</span>
            <span className="text-white font-bold text-sm tracking-wider tabular-nums">
              {formatDuration(stats.durationSeconds)}
            </span>
          </div>

          {/* Live Telemetry KPI Cards */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            {/* Download Speed with embedded mini sparkline */}
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-3.5 flex flex-col justify-between overflow-hidden">
              <div>
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span className="flex items-center gap-1">
                    <ArrowDown className="w-3.5 h-3.5 text-emerald-400" />
                    {t.downloadSpeed}
                  </span>
                  <span className="text-[10px] text-emerald-400/80 font-mono">30s</span>
                </div>
                <div className="text-base sm:text-lg font-bold font-mono text-emerald-400 tabular-nums">
                  {isConnected ? formatSpeed(stats.downloadSpeedBytes) : '0 KB/s'}
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  {formatData(stats.totalDownloadBytes)}
                </div>
              </div>

              {/* In-Card Mini Sparkline */}
              <div className="h-8 w-full mt-2 -mb-1 min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="cardMiniGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="speedMB"
                      stroke="#34d399"
                      strokeWidth={1.5}
                      fill="url(#cardMiniGrad)"
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Upload Speed */}
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-3.5 flex flex-col">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span className="flex items-center gap-1">
                  <ArrowUp className="w-3.5 h-3.5 text-cyan-400" />
                  {t.uploadSpeed}
                </span>
              </div>
              <div className="text-base sm:text-lg font-bold font-mono text-cyan-400 tabular-nums">
                {isConnected ? formatSpeed(stats.uploadSpeedBytes) : '0 KB/s'}
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                {formatData(stats.totalUploadBytes)}
              </div>
            </div>

            {/* Ping Latency */}
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-3.5 flex flex-col">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span className="flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5 text-amber-400" />
                  {t.currentPing}
                </span>
              </div>
              <div className="text-base sm:text-lg font-bold font-mono text-amber-400 tabular-nums">
                {stats.currentPing} ms
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                RTT / Jitter: 2.1ms
              </div>
            </div>

            {/* Tunnel Protocol */}
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-3.5 flex flex-col">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  {t.protocol}
                </span>
              </div>
              <div className="text-sm font-bold font-mono text-indigo-300 truncate">
                {server.protocol.toUpperCase()} TLS
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                Port {tweak.port} / AES-256
              </div>
            </div>
          </div>

          {/* Live Download Speed Fluctuations Sparkline (Last 30 Seconds) */}
          <div className="w-full mt-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-slate-600'
                  }`}
                />
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ArrowDown className="w-3.5 h-3.5 text-emerald-400" />
                  <span>مخطط تقلبات سرعة التحميل (آخر 30 ثانية)</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono hidden md:inline">
                  Download Fluctuations · Last 30s
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-slate-400">
                  الذروة:{' '}
                  <span className="text-emerald-400 font-bold tabular-nums">
                    {peakSpeedMB.toFixed(2)} MB/s
                  </span>
                </span>
                <span className="text-slate-700">·</span>
                <span className="text-slate-400">
                  المعدل:{' '}
                  <span className="text-cyan-400 font-bold tabular-nums">
                    {avgSpeedMB} MB/s
                  </span>
                </span>
              </div>
            </div>

            {/* Recharts Area Sparkline */}
            <div className="h-20 w-full min-w-0 mt-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 4, right: 6, left: 6, bottom: 0 }}>
                  <defs>
                    <linearGradient id="downloadFullGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900/95 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-mono shadow-2xl">
                            <div className="text-emerald-400 font-bold">
                              {payload[0].value} MB/s
                            </div>
                            <div className="text-[10px] text-slate-400">
                              الوقت: {payload[0].payload.time}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <YAxis hide domain={[0, 'auto']} />
                  <Area
                    type="monotone"
                    dataKey="speedMB"
                    stroke="#34d399"
                    strokeWidth={2}
                    fill="url(#downloadFullGrad)"
                    dot={false}
                    activeDot={{ r: 4, fill: '#34d399', stroke: '#022c22', strokeWidth: 2 }}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-1 px-1">
              <span>-30s</span>
              <span>-20s</span>
              <span>-10s</span>
              <span className="text-emerald-400 font-semibold">الآن (0s)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Configuration Cards: Server & Carrier Tweak */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Selected Server Card */}
        <button
          onClick={onOpenServerList}
          className="w-full text-right p-4 rounded-2xl bg-[#0c121e] border border-slate-800 hover:border-slate-700 transition-all group flex items-center justify-between shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
              {server.flag}
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">
                {t.selectedServer}
              </div>
              <div className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                {server.name}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5 font-mono">
                <span>{server.city}</span>
                <span>·</span>
                <span className="text-emerald-400">{server.pingMs} ms</span>
                <span>·</span>
                <span>حمولة {server.loadPercent}%</span>
              </div>
            </div>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/60 text-slate-400 group-hover:text-white transition-colors">
            <ChevronRight className="w-5 h-5 rtl:rotate-180" />
          </div>
        </button>

        {/* Selected Carrier Tweak / Bug Host Card */}
        <button
          onClick={onOpenPayloadEditor}
          className="w-full text-right p-4 rounded-2xl bg-[#0c121e] border border-slate-800 hover:border-slate-700 transition-all group flex items-center justify-between shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">
                {t.carrierTweak}
              </div>
              <div className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                {tweak.name}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5 font-mono">
                <span className="text-cyan-400 font-semibold">{tweak.carrierLabel}</span>
                <span>·</span>
                <span className="truncate max-w-[120px]">{tweak.sniHost}</span>
              </div>
            </div>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/60 text-slate-400 group-hover:text-white transition-colors">
            <ChevronRight className="w-5 h-5 rtl:rotate-180" />
          </div>
        </button>
      </div>

      {/* Moroccan Feature Strip: Quick Actions */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={onOpenShareNet}
          className="p-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col items-center text-center group"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Wifi className="w-5 h-5 text-teal-400" />
          </div>
          <span className="text-xs font-bold text-white">Share Net</span>
          <span className="text-[10px] text-slate-400 mt-0.5">بارطاجي هوتسبوت</span>
        </button>

        <button
          onClick={onOpenPayloadEditor}
          className="p-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col items-center text-center group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Sliders className="w-5 h-5 text-indigo-400" />
          </div>
          <span className="text-xs font-bold text-white">مولد البايلود</span>
          <span className="text-[10px] text-slate-400 mt-0.5">SNI & Bug Host</span>
        </button>

        <button
          onClick={onOpenTools}
          className="p-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col items-center text-center group"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </div>
          <span className="text-xs font-bold text-white">فحص السرعة</span>
          <span className="text-[10px] text-slate-400 mt-0.5">Speedtest & DNS</span>
        </button>

        <button
          onClick={onOpenServerList}
          className="p-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col items-center text-center group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Layers className="w-5 h-5 text-amber-400" />
          </div>
          <span className="text-xs font-bold text-white">خوادم المشغلين</span>
          <span className="text-[10px] text-slate-400 mt-0.5">إنوي · أورنج · IAM</span>
        </button>
      </div>
    </div>
  );
};
