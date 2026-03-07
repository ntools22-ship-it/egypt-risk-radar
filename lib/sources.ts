// lib/sources.ts
// رادار المخاطر — نظام المصادر والتصنيف الكامل

export interface SourceConfig {
  id: string
  name: string
  name_ar: string
  base_url: string
  rss_url?: string
  type: 'rss'
  category: string
  enabled: boolean
}

// 1. كلمات المخاطر (38 كلمة)
export const RISK_KEYWORDS = [
  'تعثر', 'تعثر سداد', 'توقف مدفوعات', 'إفلاس', 'إفلاس فني', 'عسر مالي',
  'تصفية', 'تصفية إجبارية', 'حجز', 'حجز على أموال', 'مديونية',
  'قضية', 'دعوى', 'رفع دعوى', 'إجراءات قانونية', 'تنفيذ حكم',
  'حراسة قضائية', 'إخلاء طرف', 'مصادرة', 'ضبط', 'إحالة للنيابة',
  'حبس', 'اعتقال', 'احتجاز', 'تحقيق',
  'غرامة', 'عقوبة', 'مخالفة', 'جزاء',
  'توقف', 'وقف نشاط', 'إيقاف', 'تعليق', 'إلغاء ترخيص', 'سحب ترخيص',
  'غلق فرع', 'إغلاق', 'تعليق تداول', 'شطب',
  'خسارة', 'خسائر فادحة', 'تراجع حاد', 'تدهور', 'ضائقة', 'أزمة', 'اضطراب',
  'ديون متعثرة', 'قروض متعثرة'
];

// 2. كلمات التمويل والائتمان (32 كلمة)
export const CREDIT_KEYWORDS = [
  'تسهيل ائتماني', 'قرض مشترك', 'توريق', 'سندات', 'صكوك', 'اتفاقية تمويل',
  'خط ائتمان', 'تجديد تمويل', 'مد أجل', 'تمويل مشترك', 'قرض بنكي',
  'تمويل مشروع', 'إصدار سندات', 'طرح صكوك', 'تمويل عقاري', 'ائتمان مصرفي',
  'تمويل SME', 'قرض ميسر', 'دعم تمويلي', 'حزمة تمويل', 'تمويل متوسط الأجل',
  'تمويل طويل الأجل', 'خدمات مصرفية', 'ائتمان استهلاكي', 'تمويل السيارات',
  'تمويل شخصي', 'بطاقة ائتمان', 'تحصيل ديون', 'جدولة ديون', 'إعادة جدولة',
  'مقايضة ديون', 'ضمانات بنكية'
];

// 3. كلمات البنك المركزي (24 كلمة)
export const CBE_KEYWORDS = [
  'البنك المركزي', 'المركزي المصري', 'سعر الفائدة', 'الفائدة الأساسية',
  'لجنة السياسة النقدية', 'احتياطي إلزامي', 'سياسة نقدية', 'اجتماع المركزي',
  'قرار المركزي', 'تعميم مصرفي', 'ضخ سيولة', 'سحب سيولة', 'عمليات السوق المفتوحة',
  'كوريدور الفائدة', 'تيسير كمي', 'رفع الفائدة', 'خفض الفائدة', 'تثبيت الفائدة',
  'نسبة الاحتياطي', 'رأس المال التنظيمي', 'بازل', 'ترخيص بنكي',
  'محافظ البنك المركزي', 'نشرة مصرفية'
];

// 4. كلمات أسعار الصرف (28 كلمة)
export const FX_KEYWORDS = [
  'سعر الدولار', 'الدولار الأمريكي', 'سعر الصرف', 'أسعار العملات', 'اليورو',
  'الجنيه الإسترليني', 'الريال السعودي', 'الدرهم الإماراتي', 'الدينار الكويتي',
  'اليوان الصيني', 'الفرنك السويسري', 'تحويل عملة', 'سعر البيع', 'سعر الشراء',
  'تراجع الجنيه', 'ارتفاع الدولار', 'انخفاض الجنيه', 'تقلبات العملة',
  'السوق الموازي', 'السوق السوداء', 'تحرير سعر الصرف', 'ربط العملة',
  'تعويم', 'خفض قيمة', 'العملة الأجنبية', 'احتياطي النقد الأجنبي',
  'تدفقات دولارية', 'مدفوعات خارجية'
];

// 5. كلمات إيجابية (28 كلمة)
export const POSITIVE_KEYWORDS = [
  'استثمار', 'نمو', 'توسع', 'ربح', 'عائد', 'إطلاق', 'شراكة', 'تعاون',
  'ترقية', 'مشروع', 'طرح', 'افتتاح', 'تمويل', 'تسهيل', 'اتفاقية',
  'رفع تصنيف', 'أرباح', 'توزيعات', 'زيادة رأس مال', 'إصدار ناجح',
  'تجاوز توقعات', 'أفضل أداء', 'رقم قياسي', 'إنجاز', 'تحسن',
  'فوز بعقد', 'منحة', 'دعم حكومي'
];

// المصادر المعتمدة (11 مصدر RSS عربي)
export const SOURCES: SourceConfig[] = [
  { id: 'youm7', name: 'Youm7', name_ar: 'اليوم السابع', base_url: 'youm7.com', rss_url: 'https://www.youm7.com/rss/rssfeeds.aspx', type: 'rss', category: 'breaking', enabled: true },
  { id: 'febanks', name: 'FeBanks', name_ar: 'في البنوك', base_url: 'febanks.com', rss_url: 'https://febanks.com/feed/', type: 'rss', category: 'banks', enabled: true },
  { id: 'amwal_banks', name: 'Amwal Banks', name_ar: 'أموال الغد - بنوك', base_url: 'amwalalghad.com', rss_url: 'https://www.amwalalghad.com/tag/بنوك/feed/', type: 'rss', category: 'banks', enabled: true },
  { id: 'amwal_cbe', name: 'Amwal CBE', name_ar: 'أموال الغد - المركزي', base_url: 'amwalalghad.com', rss_url: 'https://www.amwalalghad.com/tag/البنك-المركزي/feed/', type: 'rss', category: 'cbe', enabled: true },
  { id: 'amwal_dollar', name: 'Amwal Dollar', name_ar: 'أموال الغد - صرف', base_url: 'amwalalghad.com', rss_url: 'https://www.amwalalghad.com/tag/سعر-الدولار/feed/', type: 'rss', category: 'fx', enabled: true },
  { id: 'amwal_main', name: 'Amwal Main', name_ar: 'أموال الغد - قطاعات', base_url: 'amwalalghad.com', rss_url: 'https://www.amwalalghad.com/feed/', type: 'rss', category: 'sectors', enabled: true },
  { id: 'hapi', name: 'Hapi', name_ar: 'حابي جورنال', base_url: 'hapijournal.com', rss_url: 'https://hapijournal.com/feed/', type: 'rss', category: 'credit', enabled: true },
  { id: 'almal', name: 'AlMal', name_ar: 'المال نيوز', base_url: 'almalnews.com', rss_url: 'https://almalnews.com/feed/', type: 'rss', category: 'credit', enabled: true },
  { id: 'masrawy', name: 'Masrawy', name_ar: 'مصراوي اقتصاد', base_url: 'masrawy.com', rss_url: 'https://www.masrawy.com/news/rss', type: 'rss', category: 'sectors', enabled: true },
  { id: 'eleqtisad', name: 'Eleqtisad', name_ar: 'الاقتصاد نيوز', base_url: 'eleqtisadenews.com', rss_url: 'https://eleqtisadenews.com/tag/%d8%b3%d8%b9%d8%b1-%d8%a7%d9%84%d8%af%d9%88%d9%84%d8%a7%d8%b1/feed/', type: 'rss', category: 'fx', enabled: true },
  { id: 'mubasher', name: 'Mubasher', name_ar: 'مباشر مصر', base_url: 'mubasher.info', rss_url: 'https://www.mubasher.info/countries/eg/news/rss', type: 'rss', category: 'global', enabled: true },
  { id: 'skynews', name: 'SkyNews', name_ar: 'سكاي نيوز عربي', base_url: 'skynewsarabia.com', rss_url: 'https://www.skynewsarabia.com/rss/v1/business.xml', type: 'rss', category: 'global', enabled: true },
  { id: 'sahm', name: 'Sahm', name_ar: 'سهم نيوز', base_url: 'sahmnews.com', rss_url: 'https://sahmnews.com/feed/', type: 'rss', category: 'banks', enabled: true }
];

// وظائف مساعدة للتصنيف واللغة والهاش
export function isArabicText(text: string): boolean {
  const arabicPattern = /[\u0600-\u06FF]/;
  const chars = text.split('');
  const arabicChars = chars.filter(c => arabicPattern.test(c));
  return (arabicChars.length / chars.length) >= 0.4;
}

export function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// منطق التصنيف التلقائي
export function classifyNews(title: string, summary: string, sourceCategory: string) {
  const text = (title + ' ' + summary).toLowerCase();
  const tabs: string[] = [sourceCategory];

  // حساب النقاط
  const riskScore = RISK_KEYWORDS.filter(k => text.includes(k.toLowerCase())).length;
  const creditScore = CREDIT_KEYWORDS.filter(k => text.includes(k.toLowerCase())).length;
  const cbeScore = CBE_KEYWORDS.filter(k => text.includes(k.toLowerCase())).length;
  const fxScore = FX_KEYWORDS.filter(k => text.includes(k.toLowerCase())).length;

  // توجيه للتبويبات بناءً على النقاط
  if (riskScore >= 2 && !tabs.includes('warning')) tabs.push('warning');
  if (creditScore >= 1 && !tabs.includes('credit')) tabs.push('credit');
  if (cbeScore >= 1 && !tabs.includes('cbe')) tabs.push('cbe');
  if (fxScore >= 1 && !tabs.includes('fx')) tabs.push('fx');

  return { tabs, riskScore, creditScore };
}
