import React, { useState } from 'react';
import { X, Settings, ShieldAlert, Wifi, Globe, Smartphone, Save, Check, Download, Copy } from 'lucide-react';
import { AppSettings, Language } from '../types';
import { getTranslation } from '../utils/translations';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  language: Language;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  language,
}) => {
  const t = getTranslation(language);
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateSettings(formData);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#0c121e] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-emerald-400" />
              <span>{t.settings}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              تخصيص اسم التطبيق، الأمان، والشبكة المتقدمة
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
          {/* Custom Branding & App Title */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-white block">
              تخصيص اسم التطبيق وهوية النفق:
            </span>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">اسم التطبيق:</label>
              <input
                type="text"
                value={formData.appName}
                onChange={(e) => setFormData({ ...formData, appName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                placeholder="Elbouayachi VPN"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">الوصف الفرعي:</label>
              <input
                type="text"
                value={formData.appSubtitle}
                onChange={(e) => setFormData({ ...formData, appSubtitle: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
                placeholder="Moroccan High-Speed Tunnel & Proxy"
              />
            </div>
          </div>

          {/* Security & Tunnel Toggles */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <span className="text-xs font-bold text-white block">
              الأمان والتشفير المتقدم:
            </span>

            {/* Kill Switch */}
            <div className="flex items-center justify-between">
              <div className="pr-2">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  <span>{t.killSwitch}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {t.killSwitchDesc}
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.killSwitch}
                onChange={(e) => setFormData({ ...formData, killSwitch: e.target.checked })}
                className="w-5 h-5 rounded border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
              />
            </div>

            {/* Bypass LAN */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-3">
              <div className="pr-2">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t.bypassLan}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  السماح بالوصول إلى الراوتر وأجهزة الشبكة المحلية (192.168.1.1)
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.bypassLan}
                onChange={(e) => setFormData({ ...formData, bypassLan: e.target.checked })}
                className="w-5 h-5 rounded border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
              />
            </div>

            {/* DNS over HTTPS */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-3">
              <div className="pr-2">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.dnsOverHttps}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  تشفير استعلامات أسماء المواقع عبر بروتوكول HTTPS لمنع تتبع المزود
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.dnsOverHttps}
                onChange={(e) => setFormData({ ...formData, dnsOverHttps: e.target.checked })}
                className="w-5 h-5 rounded border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
              />
            </div>

            {/* Auto Reconnect */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-3">
              <div className="pr-2">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                  <span>إعادة الاتصال التلقائي (Auto Reconnect)</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  إعادة تشغيل النفق فورياً عند التبديل بين Wi-Fi و 4G/5G
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.autoReconnect}
                onChange={(e) => setFormData({ ...formData, autoReconnect: e.target.checked })}
                className="w-5 h-5 rounded border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
              />
            </div>
          </div>

          {/* GitHub Project Export & Upload Guide */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Download className="w-4 h-4 text-emerald-400" />
                <span>تحميل المشروع لرفعه على GitHub:</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono px-2 py-0.5 rounded bg-emerald-500/10">
                Ready .ZIP
              </span>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed">
              تم تجهيز ملف أرشيف كامل للمشروع خالٍ من الملفات الزائدة وجاهز للاستخراج والرفع الفوري على GitHub:
            </p>

            <a
              href="/elbouayachi-vpn-source.zip"
              download="elbouayachi-vpn-source.zip"
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>تحميل سورس كود Elbouayachi VPN (.ZIP)</span>
            </a>

            {/* Quick Git Commands */}
            <div className="pt-2">
              <span className="text-[10px] text-slate-400 block mb-1">
                أوامر Git للرفع على حسابك في GitHub بعد فك الضغط:
              </span>
              <pre className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-mono text-emerald-400/90 overflow-x-auto leading-relaxed select-all">
                git init{'\n'}
                git add .{'\n'}
                git commit -m "feat: Initial release"{'\n'}
                git branch -M main{'\n'}
                git remote add origin https://github.com/USERNAME/elbouayachi-vpn.git{'\n'}
                git push -u origin main
              </pre>
            </div>
          </div>

          {/* Version & Technical Architecture Details */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 space-y-1 font-mono">
            <div className="text-white font-bold font-sans">معلومات نواة التطبيق (Kernel Engine):</div>
            <div>Core Engine: Xray/V2Ray v5.14.1 + OpenSSL 3.2 FIPS</div>
            <div>Package: ma.elbouayachi.vpn (Inspired by ma.izone.max)</div>
            <div>Protocols: V2Ray, VMess, VLESS, Trojan, SSH Direct, WebSocket TLS</div>
            <div>Developer: Dedicated Edition for Elbouayachi</div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs text-slate-400 hover:text-white"
          >
            إلغاء
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl transition-all"
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{saved ? 'تم الحفظ!' : t.saveChanges}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
