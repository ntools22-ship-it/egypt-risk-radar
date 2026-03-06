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

// ✅ منع الكاش نهائياً لجعل البيانات تظهر لحظياً
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getDashboardData(category?: string) {
  const ago24h = new Date(Date.now() - 86_400_000).toISOString()

  // 1. جلب التنبيهات المبكرة لآخر 24 ساعة
  const { data: warnings } = await supabase
    .from('news_feed')
    .select('*')
    .eq('is_early_warning', true)
    .gte('published_at', ago24h)
    .order('published_at', { ascending: false })
    .limit(8)

  // 2. جلب التغذية الإخبارية (تستخدم sector للمطابقة مع السكرايبر)
  let newsQuery = supabase
    .from('news_feed')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(40)

  if (category && category !== 'all') {
    if (category === 'warning') {
      newsQuery = newsQuery.in('sentiment', ['سلبي', 'تحذير'])
    } else {
      newsQuery = newsQuery.eq('sector', category)
    }
  }
  const { data: news } = await newsQuery

  // 3. جلب كافة المصادر المتاحة (الـ 17 مصدر)
  const { data: sources } = await supabase
    .from('fetch_sources')
    .select('*')
    .order('name', { ascending: true })

  // 4. جلب بيانات شريط الأخبار المتحرك (أحدث الأخبار السلبية)
  const { data: tickerItems } = await supabase
    .from('news_feed')
    .select('id, title, title_ar, sentiment, sentiment_color')
    .in('sentiment', ['سلبي', 'تحذير'])
    .order('published_at', { ascending: false })
    .limit(20)

  // 5. الإحصائيات السريعة
  const { count: total24h } = await supabase
    .from('news_feed')
    .select('*', { count: 'exact', head: true })
    .gte('published_at', ago24h)

  const { count: warningCount } = await supabase
    .from('news_feed')
    .select('*', { count: 'exact', head: true })
    .eq('is_early_warning', true)
    .gte('published_at', ago24h)

  const { count: breakingCount } = await supabase
    .from('news_feed')
    .select('*', { count: 'exact', head: true })
    .eq('is_breaking', true)
    .gte('published_at', ago24h)

  const { data: sectors } = await supabase
    .from('sector_health')
    .select('*')
    .order('risk_score', { ascending: false })

  const { data: circulars } = await supabase
    .from('cbe_circulars')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(4)

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
      last_sync: sources?.sort((a, b) => 
        new Date(b.last_fetched ?? 0).getTime() - new Date(a.last_fetched ?? 0).getTime()
      )?.[0]?.last_fetched ?? null,
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
    <div className="min-h-screen bg-radar-bg font-cairo text-right" dir="rtl">
      <TopBar stats={data.stats} sources={data.sources} />
      
      {/* شريط الأخبار المتحرك ببيانات حقيقية */}
      <LiveTicker items={data.tickerItems} />

      <div className="flex">
        <Sidebar activeCategory={category ?? 'all'} />

        <main className="flex-1 min-w-0 p-4 lg:p-6 space-y-5">
          <StatsStrip stats={data.stats} />
          <SearchBar initialQuery={q} />

          {q ? (
            <Suspense fallback={<SearchSkeleton />}>
              <SearchResultsServer query={q} />
            </Suspense>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 space-y-5">
                {data.warnings.length > 0 && (
                  <EarlyWarningPanel warnings={data.warnings} />
                )}
                <NewsFeed
                  news={data.news}
                  activeCategory={category ?? 'all'}
                />
              </div>

              <div className="space-y-5">
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

async function SearchResultsServer({ query }: { query: string }) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const res = await fetch(
    `${baseUrl}/api/search?q=${encodeURIComponent(query)}`,
    { cache: 'no-store' }
  )
  const data = await res.json()
  const { SearchResults } = await import('@/components/SearchResults')
  return (
    <SearchResults 
      results={data.results ?? []} 
      query={query} 
      stats={data.stats ?? { negative: 0, warnings: 0, positive: 0 }} 
      total={data.total ?? 0} 
    />
  )
}

function SearchSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-28 bg-radar-card rounded-xl border border-radar-border animate-pulse" />
      ))}
    </div>
  )
}
