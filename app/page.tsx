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

// تحديث الكاش كل 5 دقائق
export const revalidate = 300

async function getDashboardData(category?: string) {
  const ago24h = new Date(Date.now() - 86_400_000).toISOString()

  // 1. جلب تحذيرات الـ 24 ساعة الأخيرة
  const { data: warnings } = await supabase
    .from('news_feed')
    .select('*')
    .eq('is_early_warning', true)
    .gte('published_at', ago24h)
    .order('published_at', { ascending: false })
    .limit(8)

  // 2. جلب التغذية الإخبارية الرئيسية مع الفلترة
  let query = supabase
    .from('news_feed')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(40) // رفعنا الحد لزيادة التنوع

  if (category && category !== 'all') {
    if (category === 'warning') {
      query = query.in('sentiment', ['سلبي', 'تحذير'])
    } else {
      // نستخدم 'sector' لضمان التطابق مع كود الـ Scraper
      query = query.eq('sector', category)
    }
  }
  const { data: news } = await query

  // 3. إحصائيات العدادات العلويّة
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
    .eq('risk_level', 'حرج')
    .gte('published_at', ago24h)

  // 4. جلب بيانات المصادر والقطاعات
  const { data: sources } = await supabase
    .from('fetch_sources')
    .select('*')
    .order('last_fetched', { ascending: false })

  const { data: sectors } = await supabase
    .from('sector_health')
    .select('*')
    .order('risk_score', { ascending: false })

  const { data: circulars } = await supabase
    .from('cbe_circulars')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(4)

  const { data: tickerItems } = await supabase
    .from('news_feed')
    .select('id, title, sentiment, sentiment_color')
    .in('sentiment', ['سلبي', 'تحذير'])
    .order('published_at', { ascending: false })
    .limit(12)

  return {
    news: (news ?? []) as NewsItem[],
    warnings: (warnings ?? []) as NewsItem[],
    circulars: circulars ?? [],
    sectors: sectors ?? [],
    sources: (sources ?? []),
    tickerItems: tickerItems ?? [],
    stats: {
      total_news_24h: total24h ?? 0,
      early_warnings_24h: warningCount ?? 0,
      breaking_count:
