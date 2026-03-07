import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { SOURCES, classifyNews, simpleHash, isArabicText } from '@/lib/sources'
import { parseRSSFeed } from '@/lib/rss-parser'

export const maxDuration = 60

export async function GET(req: NextRequest) {
  const urlSecret = req.nextUrl.searchParams.get('secret')
  if (urlSecret !== (process.env.NEXT_PUBLIC_SYNC_TRIGGER || 'radar2026secret')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const thirtyDaysAgo = new Date(Date.now() - 30 * 86_400_000).toISOString()
  await supabaseAdmin.from('news_feed').delete().lt('published_at', thirtyDaysAgo)

  const results = { fetched: 0, inserted: 0, duplicates: 0, skipped_lang: 0, errors: [] as string[] }

  for (const source of SOURCES.filter(s => s.enabled && s.rss_url)) {
    try {
      const feed = await parseRSSFeed(source.rss_url!)
      if (!feed) continue

      for (const item of feed.items) {
        results.fetched++
        const title = item.title || ''
        const summary = item.contentSnippet || item.content || ''
        
        if (!isArabicText(title)) {
          results.skipped_lang++
          continue
        }

        const cl = classifyNews(title, summary, source.category)
        const hash = simpleHash(title + source.id)
        const publishedAt = new Date(item.pubDate || new Date()).toISOString()

        const { error } = await supabaseAdmin.from('news_feed').upsert({
          title,
          summary,
          url: item.link,
          source_id: source.id,
          source_name: source.name_ar,
          category: source.category,
          tabs: cl.tabs,
          content_hash: hash,
          published_at: publishedAt,
        }, { onConflict: 'content_hash' })

        if (!error) results.inserted++
      }
    } catch (err) {
      results.errors.push(`${source.id}: ${String(err)}`)
    }
  }

  return NextResponse.json({ success: true, ...results })
}
