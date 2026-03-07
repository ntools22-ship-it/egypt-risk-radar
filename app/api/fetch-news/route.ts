import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { SOURCES, classifyNews, simpleHash, isArabicText } from '@/lib/sources'
import { parseRSSFeed } from '@/lib/rss-parser'

export const maxDuration = 60

export async function GET(req: NextRequest) {
  const urlSecret = req.nextUrl.searchParams.get('secret')
  const providedSecret = urlSecret ?? ''
  
  if (providedSecret !== (process.env.CRON_SECRET || 'radar2026secret')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const thirtyDaysAgo = new Date(Date.now() - 30 * 86_400_000).toISOString()
  await supabaseAdmin.from('news_feed').delete().lt('published_at', thirtyDaysAgo)

  const results = { fetched: 0, inserted: 0, duplicates: 0, skipped_lang: 0, errors: [] as string[], sources_processed: 0 }

  for (const source of SOURCES.filter(s => s.enabled && s.rss_url)) {
    try {
      const feed = await parseRSSFeed(source.rss_url!)
      if (!feed) { results.errors.push(`${source.id}: no feed`); continue }
      results.sources_processed++

      for (const item of feed.items) {
        results.fetched++
        const title = item.title ?? ''
        const summary = item.contentSnippet || item.content || ''
        
        if (!isArabicText(title)) {
          results.skipped_lang++
          continue
        }

        const hash = simpleHash(title + source.id)

        const { data: existing } = await supabaseAdmin
          .from('news_feed').select('id, tabs')
          .eq('content_hash', hash).single()

        const cl = classifyNews(title, summary, source.category)

        if (existing) {
          const oldTabs: string[] = existing.tabs ?? []
          const newTabs = [...new Set([...oldTabs, ...cl.tabs])]
          if (newTabs.length !== oldTabs.length) {
            await supabaseAdmin.from('news_feed')
              .update({ tabs: newTabs, updated_at: new Date().toISOString() })
              .eq('id', existing.id)
          }
          results.duplicates++
          continue
        }

        const publishedAt = item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString()

        const { error } = await supabaseAdmin.from('news_feed').insert({
          title,
          summary,
          source_url: item.link,
          source_name: source.name_ar,
          category: source.category,
          tabs: cl.tabs,
          content_hash: hash,
          published_at: publishedAt,
        })

        if (!error) results.inserted++
      }
    } catch (err) {
      results.errors.push(`${source.id}: ${String(err)}`)
    }
  }

  return NextResponse.json({ success: true, ...results })
}

export async function POST(req: NextRequest) { return GET(req) }
