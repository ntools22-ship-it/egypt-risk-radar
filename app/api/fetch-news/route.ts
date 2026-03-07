import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { SOURCES, classifyNews, simpleHash, smartRoute } from '@/lib/sources'
import { parseRSSFeed } from '@/lib/rss-parser'

export const maxDuration = 60
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const headerSecret = req.headers.get('authorization')
  const urlSecret = req.nextUrl.searchParams.get('secret')
  const secret = headerSecret ?? `Bearer ${urlSecret ?? ''}`

  // التحقق من صلاحية الوصول باستخدام السر الخاص بك
  if (secret !== `Bearer ${process.env.CRON_SECRET}` && secret !== `Bearer ${process.env.NEXT_PUBLIC_SYNC_TRIGGER}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 1. تنظيف تلقائي (Auto-cleanup): حذف الأخبار التي مر عليها أكثر من 30 يوم
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    await supabaseAdmin
      .from('news_feed')
      .delete()
      .lt('published_at', thirtyDaysAgo)
  } catch (cleanupErr) {
    console.error('Cleanup error:', cleanupErr)
  }

  const results = { fetched: 0, inserted: 0, duplicates: 0, errors: [] as string[], sources_processed: 0 }

  // 2. البدء في سحب الأخبار من المصادر الـ 15
  for (const source of SOURCES.filter(s => s.enabled && s.rss_url)) {
    try {
      const feed = await parseRSSFeed(source.rss_url!)
      if (!feed) { results.errors.push(`${source.id}: no feed`); continue }

      results.sources_processed++

      for (const item of feed.items) {
        results.fetched++
        const title = item.title || ''
        if (!title.trim()) continue

        const summary = item.description?.slice(0, 600) ?? ''
        const hash = simpleHash(title + source.id)

        // التحقق من عدم تكرار الخبر
        const { data: existing } = await supabaseAdmin
          .from('news_feed').select('id, duplicate_sources')
          .eq('content_hash', hash).single()

        if (existing) {
          const srcs: string[] = existing.duplicate_sources ?? []
          if (!srcs.includes(source.name_ar)) {
            await supabaseAdmin.from('news_feed')
              .update({ duplicate_sources: [...srcs, source.name_ar], updated_at: new Date().toISOString() })
              .eq('id', existing.id)
          }
          results.duplicates++
          continue
        }

        // التصنيف الذكي وتحديد القسم
        const classification = classifyNews(title, summary, source.category)
        const finalCategory = smartRoute(title, summary, source.category)

        let publishedAt: string
        try {
          publishedAt = item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString()
        } catch { publishedAt = new Date().toISOString() }

        // إدخال الخبر في قاعدة البيانات
        const { error } = await supabaseAdmin.from('news_feed').insert({
          title,
          summary,
          source_url: item.link ?? source.base_url,
          source_name: source.name_ar,
          sector: finalCategory,
          category: finalCategory,
          industry: classification.industry,
          risk_level: classification.riskLevel,
          risk_type: classification.riskType,
          client_size: classification.clientSize,
          sentiment: classification.sentiment,
          sentiment_color: classification.sentimentColor,
          is_breaking: classification.isBreaking,
          is_early_warning: classification.isEarlyWarning,
          keywords: classification.keywords,
          entities: classification.entities,
          content_hash: hash,
          duplicate_sources: [],
          published_at: publishedAt,
        })

        if (error && !error.message.includes('duplicate') && !error.message.includes('unique')) {
          results.errors.push(`${source.id}: ${error.message}`)
        } else if (!error) {
          results.inserted++
        }
      }

      // تحديث حالة المصدر
      await supabaseAdmin.from('fetch_sources').upsert({
        source_id: source.id, name: source.name_ar,
        last_fetched: new Date().toISOString(), status: 'active',
      }, { onConflict: 'source_id' })

    } catch (err) {
      results.errors.push(`${source.id}: ${String(err)}`)
      await supabaseAdmin.from('fetch_sources').upsert({
        source_id: source.id, name: source.name_ar,
        last_fetched: new Date().toISOString(), status: 'error',
      }, { onConflict: 'source_id' })
    }
  }

  // تسجيل عملية المزامنة
  await supabaseAdmin.from('sync_log').insert({ ...results, synced_at: new Date().toISOString() })
  return NextResponse.json({ success: true, ...results })
}

export async function POST(req: NextRequest) { return GET(req) }
