import type { SourceConfig } from '@/types'

export const RISK_KEYWORDS = [
  'تعثر', 'إفلاس', 'تصفية', 'حجز', 'مديونية', 'قضية', 'دعوى',
  'غرامة', 'عقوبة', 'توقف', 'خسارة', 'إعادة هيكلة',
  'تراجع', 'انخفاض', 'ضائقة', 'أزمة', 'مخالفة', 'إيقاف',
  'رهن', 'ضمان', 'مصادرة', 'تخلف', 'عجز', 'إلغاء ترخيص',
  'غلق', 'إلغاء', 'تعليق', 'حبس', 'اعتقال', 'احتجاز',
  'default', 'insolvency', 'liquidation', 'lawsuit', 'seizure',
  'fine', 'penalty', 'restructuring', 'loss', 'NPL',
  'non-performing', 'overdue', 'distress', 'violation',
]

export const POSITIVE_KEYWORDS = [
  'استثمار', 'نمو', 'توسع', 'ربح', 'عائد', 'تمويل', 'إطلاق',
  'شراكة', 'تعاون', 'ترقية', 'مشروع', 'طرح', 'افتتاح',
  'growth', 'profit', 'expansion', 'investment', 'partnership',
]

export const BREAKING_KEYWORDS = [
  'عاجل', 'عاجلاً', 'للتو', 'الآن', 'breaking', 'urgent',
  'انفجار', 'حريق', 'زلزال', 'فيضان', 'حادث', 'وفاة',
  'استقالة', 'إقالة', 'تعيين', 'قرار', 'مرسوم',
]

export { SourceConfig }

export const SOURCES: SourceConfig[] = [
  // ── أخبار عاجلة ──────────────────────────────────────────────────────────
  {
    id: 'youm7',
    name: 'Youm7',
    name_ar: 'اليوم السابع',
    base_url: 'https://www.youm7.com',
    rss_url: 'https://www.youm7.com/rss/rssfeeds.aspx',
    type: 'rss',
    category: 'breaking',
    enabled: true,
  },
  {
    id: 'masrawy',
    name: 'Masrawy',
    name_ar: 'مصراوي',
    base_url: 'https://www.masrawy.com',
    rss_url: 'https://www.masrawy.com/news/rss',
    type: 'rss',
    category: 'breaking',
    enabled: true,
  },
  // ── أخبار المركزي ─────────────────────────────────────────────────────────
  {
    id: 'febanks_cbe',
    name: 'FeBanks CBE',
    name_ar: 'في البنوك - المركزي',
    base_url: 'https://febanks.com',
    rss_url: 'https://febanks.com/tag/%d8%a7%d9%84%d8%a8%d9%86%d9%83-%d8%a7%d9%84%d9%85%d8%b1%d9%83%d8%b2%d9%8ي/feed/',
    type: 'rss',
    category: 'cbe',
    enabled: true,
  },
  {
    id: 'amwal_cbe',
    name: 'Amwal CBE',
    name_ar: 'أموال الغد - مركزي',
    base_url: 'https://www.amwalalghad.com',
    rss_url: 'https://www.amwalalghad.com/tag/البنك-المركزي/feed/',
    type: 'rss',
    category: 'cbe',
    enabled: true,
  },
  // ── سعر الدولار ──────────────────────────────────────────────────────────
  {
    id: 'eleqtisad_dollar',
    name: 'Eleqtisad Dollar',
    name_ar: 'الاقتصاد - سعر الدولار',
    base_url: 'https://eleqtisadenews.com',
    rss_url: 'https://eleqtisadenews.com/tag/%d8%b3%d8%b9%d8%b1-%d8%a7%d9%84%d8%af%d9%88%d9%84%d8%a7%d8%b1/feed/',
    type: 'rss',
    category: 'dollar',
    enabled: true,
  },
  {
    id: 'amwal_dollar',
    name: 'Amwal Dollar',
    name_ar: 'أموال الغد - الدولار',
    base_url: 'https://www.amwalalghad.com',
    rss_url: 'https://www.amwalalghad.com/tag/سعر-الدولار/feed/',
    type: 'rss',
    category: 'dollar',
    enabled: true,
  },
  // ── أخبار البنوك ──────────────────────────────────────────────────────────
  {
    id: 'febanks',
    name: 'FeBanks',
    name_ar: 'في البنوك',
    base_url: 'https://febanks.com',
    rss_url: 'https://febanks.com/feed/',
    type: 'rss',
    category: 'banks',
    enabled: true,
  },
  {
    id: 'amwal_banks',
    name: 'Amwal Banks',
    name_ar: 'أموال الغد - بنوك',
    base_url: 'https://www.amwalalghad.com',
    rss_url: 'https://www.amwalalghad.com/tag/بنوك/feed/',
    type: 'rss',
    category: 'banks',
    enabled: true,
  },
  // ── تمويل وائتمان ─────────────────────────────────────────────────────────
  {
    id: 'hapi',
    name: 'Hapi Journal',
    name_ar: 'حابي',
    base_url: 'https://hapijournal.com',
    rss_url: 'https://hapijournal.com/feed/',
    type: 'rss',
    category: 'credit',
    enabled: true,
  },
  {
    id: 'almal',
    name: 'Al Mal',
    name_ar: 'المال',
    base_url: 'https://almalnews.com',
    rss_url: 'https://almalnews.com/feed/',
    type: 'rss',
    category: 'credit',
    enabled: true,
  },
  // ── إشارات الإنذار المبكر ─────────────────────────────────────────────────
  {
    id: 'enterprise',
    name: 'Enterprise',
    name_ar: 'إنتربرايز',
    base_url: 'https://enterprise.press',
    rss_url: 'https://enterprise.press/feed/',
    type: 'rss',
    category: 'warning',
    enabled: true,
  },
  {
    id: 'mubasher',
    name: 'Mubasher',
    name_ar: 'مباشر',
    base_url: 'https://www.mubasher.info',
    rss_url: 'https://www.mubasher.info/countries/eg/news/rss',
    type: 'rss',
    category: 'warning',
    enabled: true,
  },
  // ── القطاعات ──────────────────────────────────────────────────────────────
  {
    id: 'amwal_main',
    name: 'Amwal Al Ghad',
    name_ar: 'أموال الغد',
    base_url: 'https://www.amwalalghad.com',
    rss_url: 'https://www.amwalalghad.com/feed/',
    type: 'rss',
    category: 'sectors',
    enabled: true,
  },
  {
    id: 'egx',
    name: 'EGX',
    name_ar: 'البورصة المصرية',
    base_url: 'https://www.egx.com.eg',
    rss_url: 'https://www.egx.com.eg/ar/news.aspx',
    type: 'rss',
    category: 'sectors',
    enabled: true,
  },
  // ── إقليمي ودولي ──────────────────────────────────────────────────────────
  {
    id: 'bloomberg_ar',
    name: 'Bloomberg Arabic',
    name_ar: 'اقتصاد الشرق',
    base_url: 'https://www.bloomberg.com/arabic',
    rss_url: 'https://feeds.bloomberg.com/markets/news.rss',
    type: 'rss',
    category: 'global',
    enabled: true,
  },
]

export function classifyNews(title: string, summary: string, sourceCategory: string) {
  const text = `${title} ${summary}`.toLowerCase()

  const riskScore = RISK_KEYWORDS.filter(k => text.includes(k.toLowerCase())).length
  const positiveScore = POSITIVE_KEYWORDS.filter(k => text.includes(k.toLowerCase())).length
  const breakingScore = BREAKING_KEYWORDS.filter(k => text.includes(k.toLowerCase())).length

  let sentiment: 'سلبي' | 'تحذير' | 'إيجابي' | 'محايد' = 'محايد'
  let sentimentColor: 'red' | 'amber' | 'green' | 'neutral' = 'neutral'
  if (riskScore >= 2) { sentiment = 'سلبي'; sentimentColor = 'red' }
  else if (riskScore === 1) { sentiment = 'تحذير'; sentimentColor = 'amber' }
  else if (positiveScore >= 1) { sentiment = 'إيجابي'; sentimentColor = 'green' }

  let riskLevel: 'حرج' | 'مرتفع' | 'متوسط' | 'منخفض' = 'منخفض'
  if (riskScore >= 3) riskLevel = 'حرج'
  else if (riskScore === 2) riskLevel = 'مرتفع'
  else if (riskScore === 1 || sourceCategory === 'warning') riskLevel = 'متوسط'

  const legalKw = ['قضية', 'دعوى', 'حجز', 'غرامة', 'مخالفة', 'حبس', 'lawsuit', 'fine']
  const macroKw = ['تضخم', 'فائدة', 'سعر صرف', 'دولار', 'inflation', 'interest', 'currency']
  const creditKw = ['تعثر', 'مديونية', 'default', 'NPL', 'إفلاس', 'ديون']
  const opKw = ['توقف', 'عطل', 'أزمة', 'operational', 'disruption']

  let riskType: 'ائتماني' | 'تشغيلي' | 'كلي' | 'قانوني' = 'ائتماني'
  if (legalKw.some(k => text.includes(k))) riskType = 'قانوني'
  else if (macroKw.some(k => text.includes(k))) riskType = 'كلي'
  else if (opKw.some(k => text.includes(k))) riskType = 'تشغيلي'
  else if (creditKw.some(k => text.includes(k))) riskType = 'ائتماني'

  let smartCategory = sourceCategory
  if (text.includes('البنك المركزي') || text.includes('cbe') || text.includes('سياسة نقدية') || text.includes('فائدة')) {
    smartCategory = 'cbe'
  } else if (text.includes('دولار') || text.includes('يورو') || text.includes('سعر الصرف') || text.includes('جنيه')) {
    smartCategory = 'dollar'
  } else if (RISK_KEYWORDS.filter(k => text.includes(k)).length >= 2) {
    smartCategory = 'warning'
  }

  const industryMap: Record<string, string[]> = {
    'عقارات': ['عقار', 'إسكان', 'تطوير عقاري', 'real estate'],
    'زراعة': ['زراعة', 'محاصيل', 'agriculture', 'farming'],
    'صناعة': ['مصنع', 'صناعة', 'تصنيع', 'industrial'],
    'تجارة': ['تجارة', 'بيع', 'retail', 'trade'],
    'طاقة': ['طاقة', 'كهرباء', 'بترول', 'energy', 'oil'],
    'تكنولوجيا': ['تقنية', 'رقمي', 'تطبيق', 'technology', 'digital'],
    'سياحة': ['سياحة', 'فندق', 'tourism', 'hotel'],
    'بنوك': ['بنك', 'مصرف', 'bank', 'banking'],
    'تأمين': ['تأمين', 'insurance'],
    'اتصالات': ['اتصالات', 'telecom', 'موبايل'],
  }
  let industry = 'اقتصاد عام'
  for (const [ind, keywords] of Object.entries(industryMap)) {
    if (keywords.some(k => text.includes(k))) { industry = ind; break }
  }

  let clientSize: 'كبرى' | 'متوسط' | 'صغير' | 'أفراد' = 'متوسط'
  if (['شركة كبرى', 'مجموعة', 'قطاع', 'corporate'].some(k => text.includes(k))) clientSize = 'كبرى'
  else if (['أفراد', 'مواطن', 'مستهلك', 'retail'].some(k => text.includes(k))) clientSize = 'أفراد'

  const isEarlyWarning = riskScore >= 2 || sourceCategory === 'warning'
  const isBreaking = breakingScore >= 1 || sourceCategory === 'breaking'

  const entityPattern = /(?:شركة|بنك|مصرف|مجموعة|هيئة|صندوق)\s+[\u0600-\u06FF\s]{2,20}/g
  const entities = (title + ' ' + summary).match(entityPattern)?.map(e => e.trim()) ?? []
  const keywords = [...new Set([
    ...RISK_KEYWORDS.filter(k => text.includes(k.toLowerCase())),
    ...POSITIVE_KEYWORDS.filter(k => text.includes(k.toLowerCase())),
  ])]

  return {
    sentiment, sentimentColor, riskLevel, riskType,
    industry, clientSize, isEarlyWarning, isBreaking,
    smartCategory,
    entities: [...new Set(entities)],
    keywords,
  }
}

export function smartRoute(title: string, summary: string, sourceCategory: string): string {
  const text = `${title} ${summary}`.toLowerCase()
  if (text.includes('البنك المركزي') || text.includes('سياسة نقدية')) return 'cbe'
  if (text.includes('دولار') || text.includes('سعر الصرف')) return 'dollar'
  if (RISK_KEYWORDS.filter(k => text.includes(k)).length >= 2) return 'warning'
  return sourceCategory
}

export function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16)
}
