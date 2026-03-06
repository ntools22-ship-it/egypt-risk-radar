// app/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// رادار المخاطر — لوحة التحكم الرئيسية
// Bloomberg-style Arabic banking risk dashboard
// ─────────────────────────────────────────────────────────────────────────────

import { Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { TopBar } from '@/components/TopBar'
import { Sidebar } from '@/components/Sidebar'
import { NewsFeed } from '@/components/NewsFeed'
import { EarlyWarningPanel } from '@/components/EarlyWarningPanel'
import { SectorRiskMatrix } from '@/components/SectorRiskMatrix'
import { CBETrackerPanel } from '@/components/CBETrackerPanel'
import { SearchBar } from '@/components/SearchBar'
import { StatsStrip } from '@/components/StatsStrip'
import { LiveTicker } from '@/components/LiveTicker'
import type { NewsItem } from '@/types'

// Revalidate every 5 minutes (ISR)
export const revalidate = 300

async function getDashboardData(category?: string) {
  const twentyFourHoursAgo = new Date(Date.now() - 86_400_000).toISOString()

  // Early warnings — last 24h red news
  const { data: warnings } = await supabase
    .from('news_feed')
    .select('*')
    .eq('is_early_warning', true)
    .gte('published_at', twentyFourHoursAgo)
    .order('published_at', { ascending: false })
    .limit(8)

  // Main news feed
  let query = supabase
    .from('news_feed')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(30)

  if (category && category !== 'all') {
    if (category === 'warning') {
      query = query.in('sentiment', ['سلبي', 'تحذير'])
    } else {
      query = query.eq('category', category)
    }
  }
  const { data: news } = await query

  // Stats
  const { count: total24h } = await supabase
    .from('news_feed')
    .select('*', { count: 'exact', head: true })
    .gte('published_at', twentyFourHoursAgo)

  const { count: warningCount } = await supabase
    .from('news_feed')
    .select('*', { count: 'exact', head: true })
    .eq('is_early_warning', true)
    .gte('published_at', twentyFourHoursAgo)

  const { count: breakingCount } = await supabase
    .from('news_feed')
    .select('*', { count: 'exact', head: true })
    .eq('is_breaking', true)
    .gte('published_at', twentyFourHoursAgo)

  // CBE Circulars
  const { data: circulars } = await supabase
    .from('cbe_circulars')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(4)

  // Sector health
  const { data: sectors } = await supabase
    .from('sector_health')
    .select('*')
    .order('risk_score', { ascending: false })

  // Source status
  const { data: sources } = await supabase
    .from('fetch_sources')
    .select('*')
    .order('last_fetched', { ascending: false })

  // Ticker items (breaking + warning)
  const { data: tickerItems } = await supabase
    .from('news_feed')
    .select('id, title, title_ar, sentiment, sentiment_color')
    .in('sentiment', ['سلبي', 'تحذير'])
    .order('published_at', { ascending: false })
    .limit(12)

  return {
    news: (news ?? []) as NewsItem[],
    warnings: (warnings ?? []) as NewsItem[],
    circulars: circulars ?? [],
    sectors: sectors ?? [],
    sources: sources ?? [],
    tickerItems: tickerItems ?? [],
    stats: {
      total_news_24h: total24h ?? 0,
      early_warnings_24h: warningCount ?? 0,
      breaking_count: breakingCount ?? 0,
      sources_active: sources?.filter(s => s.status === 'active').length ?? 0,
      last_sync: sources?.[0]?.last_fetched ?? null,
    },
  }
}

interface PageProps {
  searchParams: { category?: string; q?: string }
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const { category, q } = searchParams
  const data = await getDashboardData(category)

  return (
    <div className="min-h-screen bg-radar-bg font-cairo">

      {/* ── Top Navigation Bar ──────────────────────────────────────────────── */}
      <TopBar stats={data.stats} sources={data.sources} />

      {/* ── Breaking News Ticker ────────────────────────────────────────────── */}
      <LiveTicker items={data.tickerItems} />

      {/* ── Layout ─────────────────────────────────────────────────────────── */}
      <div className="flex">

        {/* ── Right Sidebar (RTL = primary) ─────────────────────────────────── */}
        <Sidebar activeCategory={category ?? 'all'} />

        {/* ── Main Content ─────────────────────────────────────────────────── */}
        <main className="flex-1 min-w-0 p-4 lg:p-6 space-y-6">

          {/* Stats Strip */}
          <StatsStrip stats={data.stats} />

          {/* Search */}
          <SearchBar initialQuery={q} />

          {/* If search active, we'll show results below via client component */}
          {q ? (
            <Suspense fallback={<SearchSkeleton />}>
              <SearchResultsServer query={q} />
            </Suspense>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

              {/* ── Main Feed (2/3 width) ────────────────────────────────────── */}
              <div className="xl:col-span-2 space-y-6">

                {/* Early Warning Section — always visible at top */}
                {data.warnings.length > 0 && (
                  <EarlyWarningPanel warnings={data.warnings} />
                )}

                {/* Main News Feed */}
                <NewsFeed
                  news={data.news}
                  activeCategory={category ?? 'all'}
                />
              </div>

              {/* ── Right Column (1/3 width) ─────────────────────────────────── */}
              <div className="space-y-6">
                <CBETrackerPanel circulars={data.circulars} />
                <SectorRiskMatrix sectors={data.sectors} />
              </div>

            </div>
          )}
        </main>
      </div>
    </div>
  )
}

// ── Server component for search results ───────────────────────────────────────
async function SearchResultsServer({ query }: { query: string }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/search?q=${encodeURIComponent(query)}`,
    { next: { revalidate: 0 } }
  )
  const data = await res.json()

  const { SearchResults } = await import('@/components/SearchResults')
  return <SearchResults results={data.results} query={query} stats={data.stats} total={data.total} />
}

function SearchSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-28 bg-radar-card rounded-lg border border-radar-border animate-pulse" />
      ))}
    </div>
  )
}
