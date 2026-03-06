app/api/fetch-news/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { SOURCES, classifyNews, simpleHash } from '@/lib/sources'
import { parseRSSFeed } from '@/lib/rss-parser'

export const maxDuration = 60

export async function GET(req: NextRequest) {
  const secret = req.headers.get('authorization')
  if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results = {
    fetched: 0,
    inserted: 0,
    duplicates: 0,
    errors: [] as string[],
    sources_processed: 0,
  }

  for (const source of SOURCES.filter(s => s.enabled && s.rss_url)) {
    try {
      const feed = await parseRSSFeed(source.rss_url!)
      if (!feed) {
        results.errors.push(`${source.id}: no feed returned`)
        continue
      }

      results.sources_processed++

      for (const item of feed.items) {
        results.fetched++

        const title = item.title
        const summary = item.description?.slice(0, 600) ?? ''
        const hash = simpleHash(title + source.id)

        const { data: existing } = await supabaseAdmin
          .from('news_feed')
          .select('id, duplicate_sources')
          .eq('content_hash', hash)
          .single()

        if (existing) {
          const sources: string[] = existing.duplicate_sources ?? []
          if (!sources.includes(source.name)) {
            await supabaseAdmin
              .from('news_feed')
              .update({
                duplicate_sources: [...sources, source.name],
                updated_at: new Date().toISOString(),
              })
              .eq('id', existing.id)
          }
          results.duplicates++
          continue
        }

        const classification = classifyNews(title, summary, source.category)

        let publishedAt: string
        try {
          publishedAt = item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString()
        } catch {
          publishedAt = new Date().toISOString()
        }

        const { error } = await supabaseAdmin.from('news_feed').insert({
          title,
          title_ar: null,
          summary,
          summary_ar: null,
          source_url: item.link,
          source_name: source.name_ar,
          sector: source.category,
          industry: classification.industry,
          risk_level: classification.riskLevel,
          risk_type: classification.riskType,
          client_size: classification.clientSize,
          sentiment: classification.sentiment,
          sentiment_color: classification.sentimentColor,
          is_breaking: classification.riskLevel === 'حرج',
          is_early_warning: classification.isEarlyWarning,
          category: source.category,
          keywords: classification.keywords,
          entities: classification.entities,
          content_hash: hash,
          duplicate_sources: [],
          published_at: publishedAt,
        })

        if (error) {
          if (!error.message.includes('duplicate') && !error.message.includes('unique')) {
            results.errors.push(`${source.id}: ${error.message}`)
          }
        } else {
          results.inserted++
        }
      }

      await supabaseAdmin
        .from('fetch_sources')
        .upsert({
          source_id: source.id,
          name: source.name_ar,
          last_fetched: new Date().toISOString(),
          status: 'active',
        }, { onConflict: 'source_id' })

    } catch (err) {
      results.errors.push(`${source.id}: ${String(err)}`)
      await supabaseAdmin
        .from('fetch_sources')
        .upsert({
          source_id: source.id,
          name: source.name_ar,
          last_fetched: new Date().toISOString(),
          status: 'error',
        }, { onConflict: 'source_id' })
    }
  }

  await supabaseAdmin.from('sync_log').insert({
    fetched: results.fetched,
    inserted: results.inserted,
    duplicates: results.duplicates,
    errors: results.errors,
    sources_processed: results.sources_processed,
    synced_at: new Date().toISOString(),
  })

  return NextResponse.json({ success: true, ...results })
}

export async function POST(req: NextRequest) {
  return GET(req)
}
