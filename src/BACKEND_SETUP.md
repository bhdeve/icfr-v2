# Backend Setup Instructions

## ⚠️ هام: هذا التطبيق يتطلب Backend API

Frontend التطبيق **لا يعمل بدون Backend** - يجب تشغيل Backend Server أولاً.

---

## 🚀 Quick Backend Setup

### 1. تشغيل Backend Server

تأكد من تشغيل Backend على المنفذ الافتراضي:

```bash
cd ../backend  # أو مسار مشروع Backend
npm install
npm run dev
```

**Backend يجب أن يعمل على:** `http://localhost:3001`

---

### 2. تكوين Frontend

أنشئ ملف `.env` في جذر مشروع Frontend:

```env
VITE_BACKEND_BASE_URL=http://localhost:3001/api/v1
VITE_API_TIMEOUT=30000
VITE_ENABLE_DEBUG_LOGS=false
```

---

### 3. تشغيل Frontend

```bash
npm run dev
```

Frontend يعمل على: `http://localhost:5173`

---

## ✅ التحقق من الاتصال

### الطريقة 1: من المتصفح

افتح: `http://localhost:3001/api/v1/health`

يجب أن ترى:
```json
{
  "status": "ok",
  "message": "Backend is running"
}
```

### الطريقة 2: من Frontend

1. افتح `http://localhost:5173`
2. إذا ظهرت رسالة "لا يمكن الاتصال بالخادم"، تأكد من تشغيل Backend

---

## 🔧 استكشاف الأخطاء

### Network Error عند تسجيل الدخول

**السبب:** Backend غير متصل أو غير مكوّن بشكل صحيح

**الحل:**
1. تحقق من تشغيل Backend: `npm run dev` في مجلد Backend
2. تحقق من URL في `.env`: `VITE_BACKEND_BASE_URL=http://localhost:3001/api/v1`
3. تحقق من CORS في Backend - يجب السماح بـ `http://localhost:5173`

### CORS Error

**السبب:** Backend لا يسمح بطلبات من Frontend

**الحل:** تأكد من إعدادات CORS في Backend:

```typescript
// backend/src/server.ts
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### Connection Refused

**السبب:** Backend غير مشغّل أو يعمل على منفذ مختلف

**الحل:**
1. تشغيل Backend
2. تحقق من المنفذ في Backend config
3. تحديث `.env` إذا لزم الأمر

---

## 📋 Checklist قبل التشغيل

- [ ] Backend server قيد التشغيل على `http://localhost:3001`
- [ ] ملف `.env` موجود في Frontend بالقيم الصحيحة
- [ ] قاعدة البيانات متصلة ومكونة
- [ ] إعدادات CORS صحيحة في Backend
- [ ] اتصال الإنترنت نشط (إذا كان Backend على سيرفر خارجي)

---

## 🌐 Production Deployment

### Backend
1. Deploy Backend إلى السيرفر (Heroku, AWS, DigitalOcean, etc.)
2. احصل على URL الإنتاج مثل: `https://api.impactcloud.com`

### Frontend
1. حدّث `.env.production`:
```env
VITE_BACKEND_BASE_URL=https://api.impactcloud.com/api/v1
```

2. Build Frontend:
```bash
npm run build
```

3. Deploy `dist/` folder إلى Vercel, Netlify, أو أي static hosting

---

## 📞 الدعم

إذا واجهت مشاكل:

1. تحقق من Console في المتصفح (F12)
2. تحقق من Backend logs
3. تأكد من صحة متغيرات البيئة
4. راجع `/docs/API_INTEGRATION_GUIDE.md`

---

**ملاحظة:** هذا Frontend مصمم للعمل فقط مع Backend API المخصص - لا يوجد وضع Demo أو Offline.
