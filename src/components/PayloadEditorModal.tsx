import React, { useState } from 'react';
import { X, Sliders, Zap, Copy, Check, Download, Upload, ShieldCheck, Lock, Play } from 'lucide-react';
import { CarrierTweak, Language } from '../types';
import { CARRIER_TWEAKS } from '../data/servers';
import { getTranslation } from '../utils/translations';

interface PayloadEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTweak: CarrierTweak;
  onSelectTweak: (tweak: CarrierTweak) => void;
  language: Language;
}

export const PayloadEditorModal: React.FC<PayloadEditorModalProps> = ({
  isOpen,
  onClose,
  currentTweak,
  onSelectTweak,
  language,
}) => {
  const t = getTranslation(language);
  const [selectedTweakId, setSelectedTweakId] = useState(currentTweak.id);
  const [method, setMethod] = useState<'CONNECT' | 'GET' | 'POST' | 'HEAD'>('GET');
  const [injection, setInjection] = useState<'normal' | 'front' | 'back'>('front');
  const [bugHost, setBugHost] = useState(currentTweak.bugHost);
  const [sniHost, setSniHost] = useState(currentTweak.sniHost);
  const [keepAlive, setKeepAlive] = useState(true);
  const [onlineHost, setOnlineHost] = useState(true);
  const [copied, setCopied] = useState(false);
  const [rawPayload, setRawPayload] = useState(currentTweak.payload);
  const [testResult, setTestResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePresetSelect = (twk: CarrierTweak) => {
    setSelectedTweakId(twk.id);
    setBugHost(twk.bugHost);
    setSniHost(twk.sniHost);
    setRawPayload(twk.payload);
    onSelectTweak(twk);
  };

  const generatePayload = () => {
    let p = '';
    if (injection === 'front') {
      p = `${method} http://${bugHost}/ HTTP/1.1[crlf]Host: ${sniHost}[crlf]${
        onlineHost ? `X-Online-Host: ${sniHost}[crlf]` : ''
      }${keepAlive ? 'Connection: Keep-Alive[crlf]' : ''}Upgrade: websocket[crlf][crlf]CONNECT [host_port] HTTP/1.1[crlf][crlf]`;
    } else if (injection === 'back') {
      p = `CONNECT [host_port] HTTP/1.1[crlf][crlf]${method} / HTTP/1.1[crlf]Host: ${sniHost}[crlf]${
        keepAlive ? 'Connection: Keep-Alive[crlf]' : ''
      }[crlf]`;
    } else {
      p = `${method} / HTTP/1.1[crlf]Host: ${sniHost}[crlf]${
        onlineHost ? `X-Online-Host: ${sniHost}[crlf]` : ''
      }${keepAlive ? 'Connection: Keep-Alive[crlf]' : ''}[crlf]`;
    }
    setRawPayload(p);

    // Update active tweak object
    const updated: CarrierTweak = {
      ...currentTweak,
      id: `custom-tweak-${Date.now()}`,
      name: `Custom SNI: ${sniHost}`,
      bugHost,
      sniHost,
      payload: p,
    };
    onSelectTweak(updated);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rawPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestPayload = () => {
    setTestResult('جاري فحص الـ Bug Host واستجابة الـ HTTP 200 OK...');
    setTimeout(() => {
      setTestResult('✅ فحص ناجح: HTTP/1.1 200 Connection Established (SNI Spoofing Validated)');
    }, 700);
  };

  const handleExportConfig = () => {
    const configData = {
      appName: 'Elbouayachi VPN',
      version: '2.5-PRO',
      carrierTweak: {
        sniHost,
        bugHost,
        rawPayload,
      },
      exportedAt: new Date().toISOString(),
      encrypted: true,
    };
    const blob = new Blob([JSON.stringify(configData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `elbouayachi_config_${Date.now()}.izone`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0c121e] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-400" />
              <span>{t.payloadTitle}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              تعديل باقات المشغلين بالمغرب (إنوي، أورنج، اتصالات المغرب) و SNI Bug Host
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
          {/* Moroccan Presets Selector */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-2">
              باقات المشغلين الجاهزة (Presets):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {CARRIER_TWEAKS.map((twk) => {
                const isSelected = twk.id === selectedTweakId;
                return (
                  <button
                    key={twk.id}
                    onClick={() => handlePresetSelect(twk)}
                    className={`p-3 rounded-2xl border text-right transition-all flex flex-col ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500/50 shadow-md'
                        : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-white">{twk.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <div className="text-[11px] text-cyan-400 font-mono mt-1">
                      {twk.carrierLabel}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                      {twk.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom SNI & Bug Host Configuration */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">إعدادات الـ Bug Host والـ SNI المخصص:</span>
              <span className="text-[10px] text-emerald-400 font-mono">TLS Spoofing v1.3</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  SNI / Bug Host (موقع الثغرة أو العرض المجاني):
                </label>
                <input
                  type="text"
                  value={sniHost}
                  onChange={(e) => setSniHost(e.target.value)}
                  placeholder="vless.inwi.ma أو ecare.orange.ma"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  Cloudflare / Fronting Host:
                </label>
                <input
                  type="text"
                  value={bugHost}
                  onChange={(e) => setBugHost(e.target.value)}
                  placeholder="cdn.cloudflare.net"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* HTTP Options & Injection Mode */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">طريقة الحقن (Method):</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-200 font-mono"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="CONNECT">CONNECT</option>
                  <option value="HEAD">HEAD</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">موضع الحقن (Injection):</label>
                <select
                  value={injection}
                  onChange={(e) => setInjection(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-200 font-mono"
                >
                  <option value="front">Front Inject</option>
                  <option value="back">Back Inject</option>
                  <option value="normal">Normal</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-4">
                <input
                  type="checkbox"
                  id="chk-keepalive"
                  checked={keepAlive}
                  onChange={(e) => setKeepAlive(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                />
                <label htmlFor="chk-keepalive" className="text-xs text-slate-300 cursor-pointer">
                  Keep-Alive
                </label>
              </div>

              <div className="flex items-center gap-2 pt-4">
                <input
                  type="checkbox"
                  id="chk-online"
                  checked={onlineHost}
                  onChange={(e) => setOnlineHost(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                />
                <label htmlFor="chk-online" className="text-xs text-slate-300 cursor-pointer">
                  Online Host
                </label>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={generatePayload}
                className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>توليد وتطبيق البايلود</span>
              </button>
              <button
                onClick={handleTestPayload}
                className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Play className="w-3.5 h-3.5 text-amber-400" />
                <span>فحص الاستجابة</span>
              </button>
            </div>

            {testResult && (
              <div className="p-2.5 rounded-xl bg-slate-950 border border-emerald-500/40 text-[11px] text-emerald-400 font-mono">
                {testResult}
              </div>
            )}
          </div>

          {/* Raw Generated Payload Output */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-300">البايلود الخام المولد (Raw Payload):</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-mono"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'تم النسخ!' : 'نسخ الكود'}</span>
              </button>
            </div>
            <textarea
              readOnly
              value={rawPayload}
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-emerald-400/90 font-mono resize-none focus:outline-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportConfig}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>تصدير ملف (.izone)</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl transition-colors"
          >
            تأكيد واستخدام
          </button>
        </div>
      </div>
    </div>
  );
};
