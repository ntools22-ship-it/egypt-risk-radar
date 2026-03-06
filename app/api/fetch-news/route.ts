import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const maxDuration = 60

// ── القائمة الكاملة والموسعة للمصادر (17 مصدر) ────────────────────────────────
const SOURCES = [
  // أموال الغد
  { id: 'amwal_main', name: 'أموال الغد', rss: 'https://www.amwalalghad.com/feed/', category: 'banks' },
  { id: 'amwal_banks', name: 'أموال الغد - بنوك', rss: 'https://www.amwalalghad.com/category/banks/feed/', category: 'banks' },
  { id: 'amwal_cos', name: 'أموال الغد - شركات', rss: 'https://www.amwalalghad.com/category/companies/feed/', category: 'industry' },
  // حابي والمال ومصراوي
  { id: 'hapi', name: 'حابي', rss: 'https://hapijournal.com/feed/', category: 'economy' },
  { id: 'almal', name: 'المال', rss: 'https://almalnews.com/feed/', category: 'banks' },
  { id: 'masrawy_eco', name: 'مصراوي - اقتصاد', rss: 'https://www.masrawy.com/rss/Economy', category: 'economy' },
  // المصادر الدولية والرسمية
  { id: 'bloomberg_ar', name: 'اقتصاد الشرق', rss: 'https://www.bloombergalarabiya.com/feed', category: 'economy' },
  { id: 'enterprise', name: 'Enterprise', rss: 'https://enterprise.press/feed/', category: 'economy' },
  { id: 'cbe', name: 'البنك المركزي المصري', rss: 'https://www.cbe.org.eg/ar/Pages/PressReleases.aspx', category: 'banks' },
  // قطاعات الصناعة والزراعة والبورصة
  { id: 'egx', name: 'البورصة المصرية', rss: 'https://www.egx.com.eg/ar/rss.aspx', category: 'industry' },
  { id: 'ahram_eco', name: 'الأهرام الاقتصادي', rss: 'https://gate.ahram.org.eg/rss/5.aspx', category: 'economy' },
  { id: 'mubasher', name: 'مباشر', rss: 'https://www.mubasher.info/countries/eg/news/rss', category: 'banks' },
  // الأخبار العامة (أقسام الاقتصاد)
  { id: 'akhbarelyom', name: 'أخبار اليوم - اقتصاد', rss: 'https://akhbarelyom.com/rss/section/3', category: 'economy' },
  { id: 'youm7_banks', name: 'اليوم السابع - بنوك', rss: 'https://www.youm7.com/rss/Category/89', category: 'banks' },
  { id: 'youm7_agri', name: 'اليوم السابع - زراعة', rss: 'https://www.youm7.com/rss/Category/127', category: 'agriculture' },
  { id: 'masrawy_agri', name: 'مصراوي - زراعة', rss: 'https://www.masrawy.com/rss/Agriculture', category: 'agriculture' },
  { id: 'youm7_industry', name: 'اليوم السابع - صناعة', rss: 'https://www.youm7.com/rss/Category/88', category: 'industry' },
]

// ── الكلمات المفتاحية للمخاطر والكيانات ──────────────────────────────────────
const RISK_KEYWORDS = ['تعثر','إفلاس','تصفية','حجز','مديونية','قضية','غرامة','خسارة','أزمة','تخلف','عجز']
const KNOWN_ENTITIES = ['البنك الأهلي','بنك مصر','CIB','بنك القاهرة','أوراسكوم','طلعت مصطفى','فوري','سي آي بي']

// ── منطق التحليل والتصنيف ──────────────────────────────────────────────────
function classifyNews(title: string, summary: string) {
  const text = `${title} ${summary}`.toLowerCase()
  const riskScore = RISK_KEYWORDS.filter(k => text.includes(k)).length
  
  const sentiment = riskScore >= 2 ? 'سلبي' : riskScore === 1 ? 'تحذير' : 'محايد'
  const sentimentColor = riskScore >= 2 ? 'red' : riskScore === 1 ? 'amber' : 'neutral'
  const riskLevel = riskScore >= 2 ? 'مرتفع' : riskScore === 1 ? 'متوسط' : 'منخفض'

  return {
    sentiment, sentimentColor, riskLevel,
    isEarlyWarning: riskScore >= 1,
    entities: KNOWN_ENTITIES.filter(e => text.includes(e.toLowerCase())),
  }
}

// إنشاء بصمة فريدة تعتمد على العنوان + اسم المصدر لمنع تحديث الوقت عشوائياً
function makeHash(title: string, sourceId: string): string {
  const str = title.trim().toLowerCase() + sourceId
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = ((hash << 5) - hash) + str.charCodeAt(i)
  return Math.abs(hash).toString(16)
}

// ── سحب البيانات من الـ RSS ──────────────────────────────────────────────────
async function fetchRSS(url: string) {
  try {
    const res = await fetch(url, { 
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0' },
      next: { revalidate: 0 } 
    })
    const xml = await res.text()
    // دعم وسم item و entry معاً لضمان سحب كل المصادر
    const items = xml.match(/<item[\s\S]*?<\/item>|<entry[\s\S]*?<\/entry>/gi) ?? []
    return items.slice(0, 15).map(item => {
      const getT = (t: string) => {
        const m = item.match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)<\\/${t}>`, 'i'))
        return m?.[1]?.replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]+>/g, ' ').trim() ?? ''
      }
      return { title: getT('title'), link: getT('link'), description: getT('description') || getT('summary') || '' }
    }).filter(i => i.title && i.link)
  } catch { return [] }
}

// ── المعالج الرئيسي ────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const key = searchParams.get('key')
  
  // التحقق من الهوية (عبر الرابط لسهولة التحديث اليدوي)
  if (key !== 'radar2026secret') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results = { fetched: 0, inserted: 0, duplicates: 0, errors: [] as string[] }

  for (const source of SOURCES) {
    const items = await fetchRSS(source.rss)
    for (const item of items) {
      results.fetched++
      const hash = makeHash(item.title, source.id)

      // تحقق من التكرار - لا نقوم بالتحديث إذا وجدنا نفس الـ Hash
      const { data: existing } = await supabaseAdmin.from('news_feed').select('id').eq('content_hash', hash).single()

      if (existing) {
        results.duplicates++
        continue 
      }

      const cls = classifyNews(item.title, item.description)
      const { error } = await supabaseAdmin.from('news_feed').insert({
        title: item.title,
        summary: item.description.slice(0, 500),
        source_url: item.link,
        source_name: source.name,
        category: source.category, // لضمان الظهور في الـ Sidebar الصح
        sentiment: cls.sentiment,
        sentiment_color: cls.sentimentColor,
        risk_level: cls.riskLevel,
        is_early_warning: cls.isEarlyWarning,
        content_hash: hash,
        entities: cls.entities,
        published_at: new Date().toISOString()
      })

      if (error) results.errors.push(`${source.name}: ${error.message}`)
      else results.inserted++
    }
  }

  return NextResponse.json({ success: true, ...results })
}
