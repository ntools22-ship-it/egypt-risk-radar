// lib/sources.ts
// ─────────────────────────────────────────────────────────────────────────────
// Radar Al-Makhater — Data Source Registry & Scrapers
// ─────────────────────────────────────────────────────────────────────────────

export const RISK_KEYWORDS = [
  // Arabic risk signals
  'تعثر', 'إفلاس', 'تصفية', 'حجز', 'مديونية', 'قضية', 'دعوى',
  'غرامة', 'عقوبة', 'توقف', 'خسارة', 'إعادة هيكلة', 'استحواذ',
  'تراجع', 'انخفاض', 'ضائقة', 'أزمة', 'مخالفة', 'إيقاف',
  'رهن', 'ضمان', 'مصادرة', 'تخلف', 'عجز', 'إلغاء ترخيص',
  // English risk signals
  'default', 'insolvency', 'liquidation', 'lawsuit', 'seizure',
  'fine', 'penalty', 'restructuring', 'acquisition', 'loss',
  'NPL', 'non-performing', 'overdue', 'distress', 'violation',
]

export const POSITIVE_KEYWORDS = [
  'استثمار', 'نمو', 'توسع', 'ربح', 'عائد', 'تمويل', 'إطلاق',
  'شراكة', 'تعاون', 'ترقية', 'حصة', 'مشروع', 'طرح',
  'growth', 'profit', 'expansion', 'investment', 'partnership',
]

export interface SourceConfig {
  id: string
  name: string
  name_ar: string
  base_url: string
  rss_url?: string
  type: 'rss' | 'scrape'
  category: string
  enabled: boolean
  selector?: {
    articles: string
    title: string
    summary?: string
    link: string
    date?: string
  }
}

export const SOURCES: SourceConfig[] = [
  // ── Central Bank of Egypt ──────────────────────────────────────────────────
  {
    id: 'cbe',
    name: 'Central Bank of Egypt',
    name_ar: 'البنك المركزي المصري',
    base_url: 'https://www.cbe.org.eg',
    rss_url: 'https://www.cbe.org.eg/en/news-publications/press-releases',
    type: 'scrape',
    category: 'Banking',
    enabled: true,
    selector: {
      articles: '.press-release-item, .news-item, article',
      title: 'h2, h3, .title',
      summary: 'p, .summary',
      link: 'a',
      date: '.date, time',
    },
  },
  // ── Financial Regulatory Authority ────────────────────────────────────────
  {
    id: 'fra',
    name: 'Financial Regulatory Authority (FRA)',
    name_ar: 'الهيئة العامة للرقابة المالية',
    base_url: 'https://www.fra.gov.eg',
    rss_url: 'https://www.fra.gov.eg/ar/index.php/pressrelease',
    type: 'scrape',
    category: 'Regulatory',
    enabled: true,
    selector: {
      articles: '.news-item, .press-item, li.item',
      title: 'h2, h3, .title, a',
      summary: 'p, .description',
      link: 'a',
      date: '.date, time, .created',
    },
  },
  // ── Egypt Exchange (EGX) Disclosures ──────────────────────────────────────
  {
    id: 'egx',
    name: 'Egyptian Exchange (EGX)',
    name_ar: 'البورصة المصرية',
    base_url: 'https://www.egx.com.eg',
    rss_url: 'https://www.egx.com.eg/ar/Disclosure.aspx',
    type: 'scrape',
    category: 'Capital Markets',
    enabled: true,
    selector: {
      articles: '.disclosure-row, tr.data-row, .item',
      title: 'td:nth-child(2), .title, h3',
      summary: 'td:nth-child(3), .desc',
      link: 'a',
      date: 'td:first-child, .date',
    },
  },
  // ── Enterprise Egypt ──────────────────────────────────────────────────────
  {
    id: 'enterprise',
    name: 'Enterprise',
    name_ar: 'إنتربرايز',
    base_url: 'https://enterprise.press',
    rss_url: 'https://enterprise.press/feed/',
    type: 'rss',
    category: 'Business',
    enabled: true,
  },
  // ── Hapi Journal ──────────────────────────────────────────────────────────
  {
    id: 'hapi',
    name: 'Hapi Journal',
    name_ar: 'هابي جورنال',
    base_url: 'https://hapijournal.com',
    rss_url: 'https://hapijournal.com/feed/',
    type: 'rss',
    category: 'Business',
    enabled: true,
  },
  // ── Amwal Al Ghad ─────────────────────────────────────────────────────────
  {
    id: 'amwal',
    name: 'Amwal Al Ghad',
    name_ar: 'أموال الغد',
    base_url: 'https://www.amwalalghad.com',
    rss_url: 'https://www.amwalalghad.com/feed/',
    type: 'rss',
    category: 'Finance',
    enabled: true,
  },
  // ── Mubasher ──────────────────────────────────────────────────────────────
  {
    id: 'mubasher',
    name: 'Mubasher',
    name_ar: 'مباشر',
    base_url: 'https://www.mubasher.info',
    rss_url: 'https://www.mubasher.info/countries/eg/news/rss',
    type: 'rss',
    category: 'Markets',
    enabled: true,
  },
  // ── Al Mal News ───────────────────────────────────────────────────────────
  {
    id: 'almal',
    name: 'Al Mal News',
    name_ar: 'المال',
    base_url: 'https://almalnews.com',
    rss_url: 'https://almalnews.com/feed/',
    type: 'rss',
    category: 'Finance',
    enabled: true,
  },
  // ── Official Gazette ──────────────────────────────────────────────────────
  {
    id: 'gazette',
    name: 'Official Gazette (Al-Waqa\'i Al-Masreyya)',
    name_ar: 'الوقائع المصرية',
    base_url: 'https://www.op.gov.eg',
    rss_url: 'https://www.op.gov.eg/ar/index.php?option=com_content&view=frontpage&format=feed&type=rss',
    type: 'rss',
    category: 'Legal',
    enabled: true,
  },
]

// ─── Classifier ───────────────────────────────────────────────────────────────

export function classifyNews(title: string, summary: string, sourceCategory: string) {
  const text = `${title} ${summary}`.toLowerCase()

  // Sentiment detection
  const riskScore = RISK_KEYWORDS.filter(k => text.includes(k.toLowerCase())).length
  const positiveScore = POSITIVE_KEYWORDS.filter(k => text.includes(k.toLowerCase())).length

  let sentiment: 'سلبي' | 'تحذير' | 'إيجابي' | 'محايد' = 'محايد'
  let sentimentColor: 'red' | 'amber' | 'green' | 'neutral' = 'neutral'

  if (riskScore >= 2) { sentiment = 'سلبي'; sentimentColor = 'red' }
  else if (riskScore === 1) { sentiment = 'تحذير'; sentimentColor = 'amber' }
  else if (positiveScore >= 1) { sentiment = 'إيجابي'; sentimentColor = 'green' }

  // Risk level
  let riskLevel: 'حرج' | 'مرتفع' | 'متوسط' | 'منخفض' = 'منخفض'
  if (riskScore >= 3) riskLevel = 'حرج'
  else if (riskScore === 2) riskLevel = 'مرتفع'
  else if (riskScore === 1) riskLevel = 'متوسط'

  // Risk type
  const legalKw = ['قضية', 'دعوى', 'حجز', 'غرامة', 'مخالفة', 'lawsuit', 'fine', 'seizure']
  const macroKw = ['تضخم', 'فائدة', 'سعر صرف', 'inflation', 'interest rate', 'currency']
  const creditKw = ['تعثر', 'مديونية', 'default', 'NPL', 'overdue', 'إفلاس']
  const opKw = ['توقف', 'عطل', 'أزمة تشغيلية', 'operational']

  let riskType: 'ائتماني' | 'تشغيلي' | 'كلي' | 'قانوني' = 'ائتماني'
  if (legalKw.some(k => text.includes(k))) riskType = 'قانوني'
  else if (macroKw.some(k => text.includes(k))) riskType = 'كلي'
  else if (opKw.some(k => text.includes(k))) riskType = 'تشغيلي'
  else if (creditKw.some(k => text.includes(k))) riskType = 'ائتماني'

  // Industry
  const industryMap: Record<string, string[]> = {
    'عقارات': ['عقار', 'إسكان', 'تطوير', 'real estate', 'property', 'housing'],
    'زراعة': ['زراعة', 'محاصيل', 'agriculture', 'farming', 'crops'],
    'صناعة': ['مصنع', 'صناعة', 'تصنيع', 'industrial', 'manufacturing', 'factory'],
    'تجزئة': ['تجارة', 'بيع', 'retail', 'trade', 'commerce'],
    'طاقة': ['طاقة', 'كهرباء', 'بترول', 'energy', 'oil', 'gas', 'electricity'],
    'تكنولوجيا': ['تقنية', 'رقمي', 'تطبيق', 'technology', 'digital', 'app'],
    'سياحة': ['سياحة', 'فندق', 'tourism', 'hotel', 'hospitality'],
    'بنوك': ['بنك', 'مصرف', 'bank', 'banking', 'finance'],
    'تأمين': ['تأمين', 'insurance'],
  }
  let industry = sourceCategory
  for (const [ind, keywords] of Object.entries(industryMap)) {
    if (keywords.some(k => text.includes(k))) { industry = ind; break }
  }

  // Client size
  const corpKw = ['شركة كبرى', 'مجموعة', 'قطاع', 'corporate', 'conglomerate', 'group']
  const smeKw = ['شركة', 'مؤسسة', 'SME', 'medium', 'small enterprise']
  let clientSize: 'كبرى' | 'متوسط' | 'صغير' | 'أفراد' = 'متوسط'
  if (corpKw.some(k => text.includes(k))) clientSize = 'كبرى'
  else if (smeKw.some(k => text.includes(k))) clientSize = 'متوسط'

  // Early warning: high risk in last 24h
  const isEarlyWarning = riskScore >= 2

  // Extract entity names (simple heuristic: Arabic words starting with capital or after كلمة شركة/بنك)
  const entityPattern = /(?:شركة|بنك|مصرف|مجموعة|هيئة|صندوق)\s+[\u0600-\u06FF\s]+/g
  const entities = (title + ' ' + summary).match(entityPattern)?.map(e => e.trim()) ?? []

  // Keywords found
  const keywords = RISK_KEYWORDS.filter(k => text.includes(k.toLowerCase()))
    .concat(POSITIVE_KEYWORDS.filter(k => text.includes(k.toLowerCase())))

  return {
    sentiment,
    sentimentColor,
    riskLevel,
    riskType,
    industry,
    clientSize,
    isEarlyWarning,
    entities: [...new Set(entities)],
    keywords: [...new Set(keywords)],
  }
}

// ─── Content Hash ─────────────────────────────────────────────────────────────

export function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16)
}
