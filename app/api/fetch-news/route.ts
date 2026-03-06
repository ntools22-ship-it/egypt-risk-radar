import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const maxDuration = 60

// ── المصادر الشاملة ──────────────────────────────────────────────────────────
const SOURCES = [
  { id: 'amwal', name: 'أموال الغد', rss: 'https://www.amwalalghad.com/feed/', category: 'تمويل' },
  { id: 'amwal_banks', name: 'أموال الغد - بنوك', rss: 'https://www.amwalalghad.com/category/banks/feed/', category: 'بنوك' },
  { id: 'amwal_companies', name: 'أموال الغد - شركات', rss: 'https://www.amwalalghad.com/category/companies/feed/', category: 'شركات' },
  { id: 'hapi', name: 'حابي', rss: 'https://hapijournal.com/feed/', category: 'صفقات' },
  { id: 'almal', name: 'المال', rss: 'https://almalnews.com/feed/', category: 'بنوك' },
  { id: 'masrawy', name: 'مصراوي - اقتصاد', rss: 'https://www.masrawy.com/rss/Economy', category: 'اقتصاد' },
  { id: 'bloomberg_ar', name: 'اقتصاد الشرق', rss: 'https://www.bloombergalarabiya.com/feed', category: 'تحليلات' },
  { id: 'ahram_eco', name: 'الأهرام الاقتصادي', rss: 'https://gate.ahram.org.eg/rss/5.aspx', category: 'صناعة وزراعة' },
  { id: 'enterprise', name: 'Enterprise', rss: 'https://enterprise.press/feed/', category: 'أعمال' },
]

const RISK_KEYWORDS = ['تعثر', 'إفلاس', 'تصفية', 'حجز', 'مديونية', 'خسارة', 'إعادة هيكلة', 'أزمة']
const KNOWN_ENTITIES = ['البنك الأهلي', 'بنك مصر', 'CIB', 'بنك القاهرة', 'أوراسكوم', 'طلعت مصطفى', 'فوري']

function detectIndustry(text: string): string {
  const t = text.toLowerCase()
  if (['بنك', 'مصرف', 'ائتمان'].some(k => t.includes(k))) return 'بنوك'
  if (['عقار', 'إسكان'].some(k => t.includes(k))) return 'عقارات'
  if (['مصنع', 'صناعة'].some(k => t.includes(k))) return 'صناعة'
  if (['زراعة', 'محصول'].some(k => t.includes(k))) return 'زراعة'
  return 'عام'
}

function classifyNews(title: string, summary: string) {
  const text = `${title} ${summary}`.toLowerCase()
  const riskScore = RISK_KEYWORDS.filter(k => text.includes(k)).length
  let sentiment = 'محايد', color = 'neutral', level = 'منخفض'
  if (riskScore >= 2) { sentiment = 'سلبي'; color = 'red'; level = 'حرج' }
  else if (riskScore === 1) { sentiment = 'تحذير'; color = 'amber'; level = 'متوسط' }
  const entities = KNOWN_ENTITIES.filter(e => text.includes(e.toLowerCase()))
  return { sentiment, sentimentColor: color, riskLevel: level, industry: detectIndustry(text), entities }
}

function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = ((hash << 5) - hash) + str.charCodeAt(i)
  return Math.abs(hash).toString(16)
}

async function fetchRSS(url: string) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, next: { revalidate: 0 } })
    const xml = await res.text()
    const items = xml.match(/<item[\s\S]*?<\/item>/gi) ?? []
    return items.slice(0, 10).map(item => {
      const title = item.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:]]>)?<\/title>/i)?.[1] ?? ''
      const link = item.match(/<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:]]>)?<\/link>/i)?.[1] ?? ''
      const desc = item.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:]]>)?<\/description>/i)?.[1] ?? ''
      return { title, link, description: desc.replace(/<[^>]+>/g, '').trim() }
    }).filter(i => i.title && i.link)
  } catch { return [] }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const key = searchParams.get('key')
  
  if (key !== 'radar2026secret') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results = { fetched: 0, inserted: 0, duplicates: 0, errors: [] as string[] }

  for (const source of SOURCES) {
    const items = await fetchRSS(source.rss)
    for (const item of items) {
      results.fetched++
      const hash = simpleHash(item.title)
      const cls = classifyNews(item.title, item.description)

      // ملاحظة: تأكد أن اسم الجدول في Supabase هو 'news_feed' أو 'news'
      const { error } = await supabaseAdmin.from('news_feed').insert({
        title: item.title,
        summary: item.description.slice(0, 500),
        source_url: item.link,
        source_name: source.name,
        industry: cls.industry,
        risk_level: cls.riskLevel,
        sentiment: cls.sentiment,
        sentiment_color: cls.sentimentColor,
        entities: cls.entities,
        content_hash: hash,
        published_at: new Date().toISOString(),
      })

      if (error) {
        if (error.code === '23505') results.duplicates++
        else results.errors.push(error.message)
      } else {
        results.inserted++
      }
    }
  }

  return NextResponse.json({ success: true, ...results })
}
