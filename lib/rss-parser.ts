// Lightweight RSS/Atom parser — no external dependency needed

export interface RSSItem {
  title: string
  link: string
  description: string
  pubDate: string | null
  guid: string | null
}

export interface RSSFeed {
  title: string
  items: RSSItem[]
}

export async function parseRSSFeed(url: string, timeoutMs = 10000): Promise<RSSFeed | null> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'RadarAlMakhater/1.0 (Banking Risk Monitor Egypt)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      },
      next: { revalidate: 0 },
    })
    clearTimeout(timeout)

    if (!res.ok) return null

    const xml = await res.text()
    return parseXML(xml)
  } catch {
    return null
  }
}

function parseXML(xml: string): RSSFeed {
  // Extract channel title
  const feedTitle = extractTag(xml, 'title') ?? 'Unknown Feed'

  // Find all item or entry elements
  const itemMatches = xml.match(/<item[\s\S]*?<\/item>|<entry[\s\S]*?<\/entry>/gi) ?? []

  const items: RSSItem[] = itemMatches.slice(0, 20).map(item => {
    const title = decodeHtml(extractTag(item, 'title') ?? '')
    const link = extractTag(item, 'link') ?? extractAttr(item, 'link', 'href') ?? ''
    const description = decodeHtml(
      extractTag(item, 'description') ??
      extractTag(item, 'summary') ??
      extractTag(item, 'content') ?? ''
    )
    const pubDate = extractTag(item, 'pubDate') ?? extractTag(item, 'published') ?? extractTag(item, 'updated') ?? null
    const guid = extractTag(item, 'guid') ?? extractTag(item, 'id') ?? null

    return { title: stripHtml(title), link: link.trim(), description: stripHtml(description), pubDate, guid }
  }).filter(i => i.title && i.link)

  return { title: feedTitle, items }
}

function extractTag(xml: string, tag: string): string | null {
  const cdataRe = new RegExp(`<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*<\\/${tag}>`, 'i')
  const normalRe = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i')
  return (xml.match(cdataRe)?.[1] ?? xml.match(normalRe)?.[1] ?? null)?.trim() ?? null
}

function extractAttr(xml: string, tag: string, attr: string): string | null {
  const re = new RegExp(`<${tag}[^>]*${attr}=["']([^"']+)["']`, 'i')
  return xml.match(re)?.[1] ?? null
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function decodeHtml(html: string): string {
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#\d+;/g, c => String.fromCharCode(parseInt(c.replace(/&#|;/g, ''))))
}
