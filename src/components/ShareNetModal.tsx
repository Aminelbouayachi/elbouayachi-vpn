import React, { useState } from 'react';
import { X, Wifi, Radio, Copy, Check, Laptop, Smartphone, Tv, ShieldCheck } from 'lucide-react';
import { Language, ProxyConfig } from '../types';
import { getTranslation } from '../utils/translations';

interface ShareNetModalProps {
  isOpen: boolean;
  onClose: () => void;
  proxyConfig: ProxyConfig;
  onToggleProxy: () => void;
  language: Language;
}

export const ShareNetModal: React.FC<ShareNetModalProps> = ({
  isOpen,
  onClose,
  proxyConfig,
  onToggleProxy,
  language,
}) => {
  const t = getTranslation(language);
  const [activeTab, setActiveTab] = useState<'windows' | 'android' | 'tv'>('windows');
  const [copiedIp, setCopiedIp] = useState(false);
  const [copiedSocks, setCopiedSocks] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, type: 'ip' | 'socks') => {
    navigator.clipboard.writeText(text);
    if (type === 'ip') {
      setCopiedIp(true);
      setTimeout(() => setCopiedIp(false), 2000);
    } else {
      setCopiedSocks(true);
      setTimeout(() => setCopiedSocks(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0c121e] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Wifi className="w-5 h-5 text-emerald-400" />
              <span>{t.shareNetTitle}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              مشاركة اتصال النفق المشفر عبر نقطة اتصال الهوتسبوت مع أجهزتك الأخرى
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Proxy Server State Toggle */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  proxyConfig.isEnabled
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-500 border border-slate-700/60'
                }`}
              >
                <Radio className={`w-6 h-6 ${proxyConfig.isEnabled ? 'animate-pulse' : ''}`} />
              </div>
              <div>
                <div className="text-sm font-bold text-white">
                  {proxyConfig.isEnabled ? 'مخدم البروكسي الداخلي (SOCKS5/HTTP) شغال' : 'المخدم متوقف'}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {proxyConfig.isEnabled
                    ? `مستعد لاستقبال اتصالات الهوتسبوت (${proxyConfig.activeClientsCount} أجهزة متصلة)`
                    : 'اضغط لتفعيل المخدم ومشاركة الإنترنت'}
                </div>
              </div>
            </div>

            <button
              onClick={onToggleProxy}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                proxyConfig.isEnabled
                  ? 'bg-rose-500 hover:bg-rose-600 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-black'
              }`}
            >
              {proxyConfig.isEnabled ? 'إيقاف البروكسي' : 'تشغيل الآن'}
            </button>
          </div>

          {/* Proxy Network Credentials */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* IP Card */}
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
              <span className="text-[11px] text-slate-400 font-medium">عنوان الهوتسبوت (IP):</span>
              <div className="text-sm font-bold font-mono text-white mt-1">
                {proxyConfig.localIp}
              </div>
              <button
                onClick={() => copyToClipboard(proxyConfig.localIp, 'ip')}
                className="mt-2 text-[10px] text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1"
              >
                {copiedIp ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedIp ? 'تم النسخ' : 'نسخ IP'}</span>
              </button>
            </div>

            {/* SOCKS5 Port Card */}
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
              <span className="text-[11px] text-slate-400 font-medium">منفذ SOCKS5 Port:</span>
              <div className="text-sm font-bold font-mono text-cyan-400 mt-1">
                {proxyConfig.socksPort}
              </div>
              <button
                onClick={() => copyToClipboard(proxyConfig.socksPort.toString(), 'socks')}
                className="mt-2 text-[10px] text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
              >
                {copiedSocks ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSocks ? 'تم النسخ' : 'نسخ Port'}</span>
              </button>
            </div>

            {/* HTTP Port Card */}
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
              <span className="text-[11px] text-slate-400 font-medium">منفذ HTTP Proxy Port:</span>
              <div className="text-sm font-bold font-mono text-amber-400 mt-1">
                {proxyConfig.httpPort}
              </div>
              <span className="mt-2 text-[10px] text-slate-500 font-mono">
                للمتصفحات والـ Smart TV
              </span>
            </div>
          </div>

          {/* Setup Guide by Device */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-white block">
              طريقة التوصيل حسب نوع الجهاز:
            </span>

            {/* Device tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <button
                onClick={() => setActiveTab('windows')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                  activeTab === 'windows'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>حاسوب Windows / Mac</span>
              </button>
              <button
                onClick={() => setActiveTab('android')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                  activeTab === 'android'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>هاتف آخر / آيفون</span>
              </button>
              <button
                onClick={() => setActiveTab('tv')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                  activeTab === 'tv'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>Smart TV / Box</span>
              </button>
            </div>

            {/* Instruction text */}
            <div className="text-xs text-slate-300 space-y-2 pt-1 font-sans leading-relaxed">
              {activeTab === 'windows' && (
                <>
                  <p>1. شعل نقطة اتصال الهوتسبوت (Hotspot) فالتيليفون وربط البيسي ديالك بالـ Wi-Fi ديال التيليفون.</p>
                  <p>2. فالبيسي دخل لـ: <strong>Settings &gt; Network &amp; Internet &gt; Proxy</strong>.</p>
                  <p>3. فعل الخيار <strong>Use a proxy server</strong> واكتب:</p>
                  <p className="font-mono bg-slate-950 p-2 rounded-lg text-emerald-400 text-[11px]">
                    Address: {proxyConfig.localIp} &nbsp;|&nbsp; Port: {proxyConfig.httpPort}
                  </p>
                  <p>4. دير Save ومبروك عليك الإنترنت المشفرة خدامة على البيسي كامل!</p>
                </>
              )}

              {activeTab === 'android' && (
                <>
                  <p>1. ربط التيليفون الثاني بشبكة الـ Wi-Fi هوتسبوت ديال التيليفون الأول.</p>
                  <p>2. اضغط مطولا على اسم شبكة الـ Wi-Fi ودخل لـ <strong>إعدادات متقدمة (Advanced Options)</strong>.</p>
                  <p>3. فالبروكسي (Proxy) بدل من None لـ <strong>Manual</strong> واكتب:</p>
                  <p className="font-mono bg-slate-950 p-2 rounded-lg text-emerald-400 text-[11px]">
                    Proxy hostname: {proxyConfig.localIp} &nbsp;|&nbsp; Proxy port: {proxyConfig.httpPort}
                  </p>
                  <p>4. دير حفظ، والإنترنت غادي تخدم ديريكت.</p>
                </>
              )}

              {activeTab === 'tv' && (
                <>
                  <p>1. ربط جهاز التلفاز الذكي (Android TV / FireStick) بنفس شبكة الهوتسبوت.</p>
                  <p>2. دخل لـ <strong>Network Settings &gt; Wi-Fi &gt; Advanced &gt; Proxy Setup</strong>.</p>
                  <p>3. دخل عنوان البروكسي {proxyConfig.localIp} والمنفذ {proxyConfig.httpPort}.</p>
                  <p>4. تصفح يوتيوب، نتفليكس أو IPTV بلا انقطاع وبسرعة النفق.</p>
                </>
              )}
            </div>
          </div>

          {/* Active Connected Clients Simulation */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 block">
              الأجهزة المتصلة حالياً بالبروكسي ({proxyConfig.activeClientsCount}):
            </span>
            <div className="space-y-1.5">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-emerald-400" />
                  <span className="text-white font-medium">Windows 11 Laptop</span>
                  <span className="text-slate-500 font-mono text-[10px]">192.168.43.45</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">1.2 MB/s · نشط</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                  <span className="text-white font-medium">Samsung Galaxy A54</span>
                  <span className="text-slate-500 font-mono text-[10px]">192.168.43.89</span>
                </div>
                <span className="text-[10px] text-cyan-400 font-mono">420 KB/s · نشط</span>
              </div>
            </div>
          </div>
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
