# 🎯 رادار المخاطر — دليل النشر الكامل
# Radar Al-Makhater — Complete Deployment Guide

---

## للمستخدمين غير التقنيين — خطوة بخطوة
### Non-Technical User Deployment Guide (Step-by-Step)

---

## ✅ الخطوة 1: إنشاء قاعدة البيانات على Supabase
### Step 1: Set up your Supabase Database (FREE)

1. افتح المتصفح واذهب إلى: **https://supabase.com**
   Go to **https://supabase.com**

2. اضغط **"Start your project"** وأنشئ حساباً مجانياً
   Click **"Start your project"** → create a free account

3. اضغط **"New Project"** واختر:
   - اسم المشروع: `radar-al-makhater`
   - كلمة مرور قاعدة البيانات: احفظها في مكان آمن!
   - المنطقة: **Frankfurt (EU)** أو أي منطقة قريبة
   Click **"New Project"**, name it `radar-al-makhater`, pick Frankfurt region

4. انتظر دقيقتين حتى يكتمل إنشاء المشروع
   Wait ~2 minutes for the project to be ready

5. في القائمة اليسرى، اضغط على **SQL Editor** (أيقونة قاعدة البيانات)
   In the left sidebar, click **SQL Editor**

6. اضغط **"New Query"** ثم انسخ والصق كل محتوى الملف:
   Click **"New Query"**, paste the entire contents of:
   `supabase/migrations/001_schema.sql`

7. اضغط **"Run"** (أو Ctrl+Enter)
   Press **"Run"** — you should see "Success"

8. الآن احفظ بياناتك:
   Now save your credentials — click **Settings → API**:
   - `Project URL` → هذا هو `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → هذا هو `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → هذا هو `SUPABASE_SERVICE_ROLE_KEY` (اضغط Reveal)
   
   ⚠️ **مهم جداً**: احتفظ بـ `service_role` سرياً تماماً — لا تشاركه مع أحد!

---

## ✅ الخطوة 2: رفع الكود على GitHub
### Step 2: Upload Code to GitHub

1. اذهب إلى **https://github.com** وأنشئ حساباً مجانياً
   Go to **https://github.com** → create free account

2. اضغط **"New repository"**:
   - الاسم: `radar-al-makhater`
   - الخصوصية: **Private** (موصى به للبيانات البنكية)
   Click "New repository" → name: `radar-al-makhater` → **Private**

3. إذا كان عندك Git مثبت على جهازك:
   If you have Git installed, in the project folder run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit — Radar Al-Makhater"
   git remote add origin https://github.com/YOUR_USERNAME/radar-al-makhater.git
   git push -u origin main
   ```

   **بدون Git:** يمكنك رفع الملفات مباشرة من GitHub.com باستخدام زر "Upload files"
   **Without Git:** On GitHub.com, use the "Upload files" button to upload the project folder

---

## ✅ الخطوة 3: النشر على Vercel
### Step 3: Deploy to Vercel (FREE)

1. اذهب إلى **https://vercel.com** وسجل دخول بحساب GitHub
   Go to **https://vercel.com** → Sign in with GitHub

2. اضغط **"Add New Project"**
   Click **"Add New Project"**

3. اختر مستودع `radar-al-makhater` من قائمة GitHub
   Select the `radar-al-makhater` repository

4. **قبل الضغط على Deploy، أضف متغيرات البيئة:**
   **BEFORE clicking Deploy, add Environment Variables:**
   
   اضغط **"Environment Variables"** وأضف هذه المتغيرات واحداً تلو الآخر:
   Click **"Environment Variables"** and add each of these:

   | المتغير / Variable | القيمة / Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | رابط مشروعك من Supabase |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | مفتاح anon من Supabase |
   | `SUPABASE_SERVICE_ROLE_KEY` | مفتاح service_role من Supabase |
   | `NEXT_PUBLIC_APP_URL` | https://radar-al-makhater.vercel.app (أو اسم مخصص) |
   | `CRON_SECRET` | اكتب أي سلسلة عشوائية طويلة مثل: `xK9mP2qL7nR4sT8vW1` |
   | `NEXT_PUBLIC_SYNC_TRIGGER` | نفس قيمة `CRON_SECRET` |

5. اضغط **"Deploy"** وانتظر 2-3 دقائق
   Click **"Deploy"** and wait 2-3 minutes

6. 🎉 **تهانينا!** موقعك الآن حي على الإنترنت!
   🎉 **Congratulations!** Your site is now live!

---

## ✅ الخطوة 4: تفعيل Cron Job التلقائي
### Step 4: Enable Automatic Data Sync

الـ Cron Job يعمل تلقائياً على Vercel Pro.
**إذا كنت على الخطة المجانية (Hobby):**

1. في Vercel dashboard، اذهب إلى مشروعك
2. اضغط **Settings → Cron Jobs**
3. ستجد `/api/fetch-news` مضافاً تلقائياً من `vercel.json`
4. تأكد أنه مفعّل

**ملاحظة:** الخطة المجانية تسمح بـ cron job واحد. إذا أردت أكثر، ابدأ تجربة **Vercel Pro**.

---

## ✅ الخطوة 5: التحقق من العمل
### Step 5: Verify Everything Works

1. افتح موقعك على: `https://YOUR_APP.vercel.app`
2. في حالة قاعدة البيانات فارغة، اضغط **"تحديث الآن"** في الأعلى لتشغيل أول مزامنة
3. بعد دقيقة، يجب أن تظهر الأخبار الأولى
4. تحقق من لوحة تحكم Vercel → **Deployments → Functions** لمشاهدة logs

---

## 🔧 استكشاف المشاكل الشائعة
### Troubleshooting

**المشكلة: الموقع يعمل لكن لا توجد أخبار**
- Solution: Click "تحديث الآن" button to manually trigger first sync
- Check Vercel logs: Settings → Functions → `/api/fetch-news` → View Logs

**المشكلة: خطأ "Unauthorized" في API**
- تأكد أن `CRON_SECRET` متطابق في Vercel وفي الكود
- Ensure `CRON_SECRET` matches in Vercel environment variables

**المشكلة: خطأ Supabase**
- تأكد أن SQL Migration اشتغل بنجاح في Supabase SQL Editor
- تحقق من أن الـ keys صحيحة وبدون مسافات زائدة

**المشكلة: بعض المصادر لا تُحمَّل**
- بعض المواقع تحجب الـ scraping — هذا طبيعي
- الأخبار ستأتي من المصادر التي تدعم RSS

---

## 📊 ملاحظات تقنية للمطورين
### Technical Notes for Developers

### Architecture Summary:
```
Vercel Cron (*/15 min)
  └─ GET /api/fetch-news
       ├─ Fetches RSS from 8 sources in parallel
       ├─ Classifies each item (sentiment, risk, industry)
       ├─ Deduplicates by content_hash
       ├─ Merges duplicate stories from multiple sources
       └─ Inserts to Supabase news_feed table

Next.js App Router (ISR, revalidate: 300s)
  └─ page.tsx (Server Component)
       ├─ Fetches from Supabase directly (no API hop)
       ├─ Renders all panels server-side
       └─ Client components: SearchBar, NewsCard (export/copy)

Supabase PostgreSQL
  ├─ news_feed (main table, 8 sources)
  ├─ cbe_circulars (manual entry or CBE scrape)
  ├─ sector_health (seeded, updateable)
  ├─ fetch_sources (sync status tracking)
  └─ sync_log (cron job history)
```

### Adding New Sources:
Edit `lib/sources.ts` → Add entry to `SOURCES` array with RSS URL.

### Adding Arabic Translation:
In `/api/fetch-news/route.ts`, after classification, call a translation API
(e.g., Google Translate API or DeepL) to populate `title_ar` and `summary_ar`.

### Production Checklist:
- [ ] Set `CRON_SECRET` to a strong random value (min 32 chars)
- [ ] Enable Supabase RLS policies (already in migration)
- [ ] Set up Supabase database backups (Settings → Database → Backups)
- [ ] Configure custom domain in Vercel (optional)
- [ ] Enable Vercel Analytics for usage monitoring (optional, free tier available)

---

## 📞 الدعم التقني
إذا واجهت أي مشكلة، تحقق من:
1. Vercel deployment logs
2. Supabase logs (Database → Logs)
3. Browser console (F12 → Console)

**رادار المخاطر** — مبني بـ Next.js 14 + Supabase + Tailwind CSS
تحديث تلقائي كل 15 دقيقة من 8 مصادر مصرية
