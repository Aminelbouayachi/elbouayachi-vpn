import React, { useState } from 'react';
import { X, Search, RefreshCw, Zap, Shield, Plus, Check } from 'lucide-react';
import { Server, Language } from '../types';
import { getTranslation } from '../utils/translations';

interface ServerListModalProps {
  isOpen: boolean;
  onClose: () => void;
  servers: Server[];
  selectedServerId: string;
  onSelectServer: (server: Server) => void;
  onAddCustomServer: (newServer: Server) => void;
  language: Language;
}

export const ServerListModal: React.FC<ServerListModalProps> = ({
  isOpen,
  onClose,
  servers,
  selectedServerId,
  onSelectServer,
  onAddCustomServer,
  language,
}) => {
  const t = getTranslation(language);
  const [filter, setFilter] = useState<'all' | 'morocco' | 'gaming' | 'vip'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshingPing, setIsRefreshingPing] = useState(false);
  const [customLink, setCustomLink] = useState('');
  const [showAddCustom, setShowAddCustom] = useState(false);

  if (!isOpen) return null;

  const handleRefreshPing = () => {
    setIsRefreshingPing(true);
    setTimeout(() => {
      setIsRefreshingPing(false);
    }, 800);
  };

  const handleImportCustom = () => {
    if (!customLink.trim()) return;
    const customServer: Server = {
      id: `custom-${Date.now()}`,
      name: 'Custom Server (الخادم الخاص بك)',
      country: 'مخصص',
      countryCode: 'XX',
      city: 'Custom Endpoint',
      flag: '⚡',
      carrier: 'global',
      protocol: customLink.startsWith('vmess://') ? 'vmess' : 'v2ray',
      pingMs: 25,
      loadPercent: 18,
      ip: '10.0.0.1',
      isVip: true,
      features: ['Custom Config', 'Private Tunnel'],
    };
    onAddCustomServer(customServer);
    onSelectServer(customServer);
    setShowAddCustom(false);
    setCustomLink('');
  };

  const filteredServers = servers.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.carrier.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'morocco') {
      return s.carrier === 'inwi' || s.carrier === 'orange' || s.carrier === 'iam';
    }
    if (filter === 'gaming') {
      return s.pingMs <= 30;
    }
    if (filter === 'vip') {
      return s.isVip;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0c121e] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              <span>{t.allServers}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              اختر الخادم الأنسب لشبكتك (إنوي، أورنج، اتصالات المغرب) أو سيرفرات عالمية
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search and Action Bar */}
        <div className="p-4 border-b border-slate-800/60 bg-slate-900/40 space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ابحث عن دولة، مدينة أو شبكة (Inwi, Orange, IAM)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700/60 rounded-xl pr-9 pl-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 font-sans"
              />
            </div>
            <button
              onClick={handleRefreshPing}
              disabled={isRefreshingPing}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition-all shrink-0"
              title="تحديث زمن استجابة السيرفرات"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isRefreshingPing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">فحص البينغ</span>
            </button>
            <button
              onClick={() => setShowAddCustom(!showAddCustom)}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-xl transition-all shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة سيرفر</span>
            </button>
          </div>

          {/* Custom Server Importer Drawer */}
          {showAddCustom && (
            <div className="p-3 bg-slate-950/90 border border-emerald-500/30 rounded-2xl space-y-2">
              <label className="text-xs text-emerald-400 font-semibold block">
                استيراد رابط V2Ray / VMess / VLESS / SSH:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="vmess://eyJ2IjoiMiIsInBzIjoiTW9yb2Njb19WSSIsImFkZHIiOi... أو ssh://user:pass@host:443"
                  value={customLink}
                  onChange={(e) => setCustomLink(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={handleImportCustom}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl"
                >
                  استيراد
                </button>
              </div>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap shrink-0 ${
                filter === 'all'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              كافة السيرفرات ({servers.length})
            </button>
            <button
              onClick={() => setFilter('morocco')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap shrink-0 ${
                filter === 'morocco'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              🇲🇦 سيرفرات المشغلين (Inwi / Orange / IAM)
            </button>
            <button
              onClick={() => setFilter('gaming')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap shrink-0 ${
                filter === 'gaming'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              🎮 ألعاب وبينغ منخفض (Sub-30ms)
            </button>
            <button
              onClick={() => setFilter('vip')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap shrink-0 ${
                filter === 'vip'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              ⚡ سيرفرات VIP السريعة
            </button>
          </div>
        </div>

        {/* Server List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredServers.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              لم يتم العثور على خادم يطابق بحثك.
            </div>
          ) : (
            filteredServers.map((s) => {
              const isSelected = s.id === selectedServerId;
              return (
                <div
                  key={s.id}
                  onClick={() => {
                    onSelectServer(s);
                    onClose();
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                      : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                      {s.flag}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {s.name}
                        </span>
                        {s.isVip && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono">
                            VIP
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 font-mono">
                        <span>{s.city}</span>
                        <span>·</span>
                        <span className="text-indigo-400">{s.protocol.toUpperCase()}</span>
                        <span>·</span>
                        <span className="text-slate-500">حمولة {s.loadPercent}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Latency & Select Button */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div
                        className={`text-xs font-bold font-mono ${
                          s.pingMs < 30
                            ? 'text-emerald-400'
                            : s.pingMs < 60
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {s.pingMs} ms
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        استجابة
                      </div>
                    </div>

                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-emerald-500 text-black font-bold'
                          : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-white'
                      }`}
                    >
                      {isSelected ? <Check className="w-4 h-4" /> : <Shield className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
