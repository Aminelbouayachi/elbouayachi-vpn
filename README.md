# 🇲🇦 Elbouayachi VPN - Moroccan High-Speed Tunnel & Proxy Suite

> تطبيق متطور لنفق شبكات الـ VPN والبروكسي والسيرفرات السريعة (V2Ray, SSH, VMess, Trojan) المخصص للشبكات المغربية مع أدوات فحص السرعة ومشاركة الإنترنت وحماية الخصوصية، مستوحى من تطبيق IzOne Max (`ma.izone.max`).

---

## 🚀 المميزات الرئيسية (Key Features)

- **لوحة تحكم تفاعلية (Tunnel Dashboard)**:
  - زر تشغيل تفاعلي مع تأثيرات ضوئية ومؤقت دقيق لمدة الجلسة.
  - عدادات حية لسرعة التنزيل والرفع واستهلاك البيانات والبينغ (RTT ms).
  - **مخطط Sparkline (Recharts)** تفاعلي يوضح تقلبات سرعة التحميل لحظياً لآخر 30 ثانية.
  
- **سيرفرات مخصصة للشبكات المغربية**:
  - خوادم وباقات مخصصة لشبكات:
    - **إنوي (Inwi 4G/5G)** لتجاوز خنق السرعة عبر Cloudflare CDN Fronting.
    - **أورنج المغرب (Orange Maroc)** عبر باقات Max-It و Direct SSL/TLS.
    - **اتصالات المغرب (Maroc Telecom - IAM)** للألعاب والاتصال المباشر.
  - خوادم أوروبية منخفضة زمن الاستجابة (فرنسا، إسبانيا 22ms للألعاب، ألمانيا، هولندا، أمريكا).

- **مولد البايلود و SNI Bug Host**:
  - تعديل وحقن الـ Headers (GET, POST, CONNECT, HEAD, Front/Back Inject, Keep-Alive).
  - فحص استجابة الـ HTTP Bug Host بنقرة واحدة (HTTP 200 OK).
  - تصدير واستيراد ملفات التهيئة (`.izone` / `.elbouayachi`).

- **بارطاجي النت (Share Net Hotspot Tethering)**:
  - مخدم بروكسي داخلي SOCKS5 (منفذ `10808`) و HTTP Proxy (منفذ `8080`).
  - مشاركة نفق الـ VPN المشفر مع أجهزة الكمبيوتر والتلفاز والهواتف عبر نقطة اتصال الـ Wi-Fi.

- **أدوات الشبكة والتشخيص**:
  - فحص السرعة المباشر (Speed Test) مع مقياس تفاعلي للتحميل والرفع.
  - فحص البينغ لبوابات المشغلين بالمغرب ومخدمات DNS العالمية.
  - مغير الـ DNS السريع (Cloudflare 1.1.1.1, Google 8.8.8.8, AdGuard AdBlock, Quad9).
  - كاشف تسريب الـ IP و WebRTC.

- **سجل الأحداث المباشر (Diagnostic Terminal Logs)**:
  - متابعة حية لمسارات V2Ray-Core ومصافحة SSH و Tun2Socks.

- **دعم 4 لغات**:
  - الدارجة المغربية 🇲🇦، العربية، الفرنسية، والإنجليزية.

---

## 🛠️ كيفية التثبيت والتشغيل محلياً (Run Locally)

1. **استنساخ المستودع (Clone Repo)**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/elbouayachi-vpn.git
   cd elbouayachi-vpn
   ```

2. **تثبيت الحزم (Install Dependencies)**:
   ```bash
   npm install
   ```

3. **تشغيل بيئة التطوير (Run Development Server)**:
   ```bash
   npm run dev
   ```
   سيتم تشغيل التطبيق على الرابط: `http://localhost:3000` أو `http://localhost:5173`.

4. **بناء النسخة النهائية للإنتاج (Build for Production)**:
   ```bash
   npm run build
   ```

---

## 📦 كيفية رفع المشروع على GitHub (Upload to GitHub)

إذا أردت إنشاء مستودع جديد على حسابك في GitHub ورفع هذا المشروع، نفذ الأوامر التالية في مجلد المشروع:

```bash
# 1. تهيئة مستودع Git محلي
git init

# 2. إضافة كافة الملفات
git add .

# 3. حفظ أول Commit
git commit -m "feat: Initial release of Elbouayachi VPN suite"

# 4. تغيير اسم الفرع إلى main
git branch -M main

# 5. ربط المشروع بمستودعك على GitHub (استبدل الرابط برابط مستودعك)
git remote add origin https://github.com/YOUR_USERNAME/elbouayachi-vpn.git

# 6. رفع الكود إلى GitHub
git push -u origin main
```

---

## 📄 الترخيص (License)
Apache-2.0 © Elbouayachi VPN
