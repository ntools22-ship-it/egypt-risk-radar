
types/index.ts

export type RiskLevel = 'حرج' | 'مرتفع' | 'متوسط' | 'منخفض'
export type ClientSize = 'كبرى' | 'متوسط' | 'صغير' | 'أفراد'
export type RiskType = 'ائتماني' | 'تشغيلي' | 'كلي' | 'قانوني'
export type Sentiment = 'سلبي' | 'تحذير' | 'إيجابي' | 'محايد'

export interface NewsItem {
  id: string
  title: string
  title_ar: string | null
  summary: string
  summary_ar: string | null
  source_url: string
  source_name: string
  source_logo?: string | null
  sector: string
  industry: string
  risk_level: RiskLevel
  risk_type: RiskType
  client_size: ClientSize
  sentiment: Sentiment
  sentiment_color: 'red' | 'amber' | 'green' | 'neutral'
  is_breaking: boolean
  is_early_warning: boolean
  category: string
  keywords: string[]
  entities: string[]
  content_hash: string | null
  duplicate_sources: string[]
  published_at: string
  created_at: string
  updated_at: string
}

export interface CBECircular {
  id: string
  circular_number: string
  title: string
  title_ar: string | null
  summary: string
  summary_ar: string | null
  document_url: string | null
  impact_level: 'مرتفع' | 'متوسط' | 'منخفض'
  affected_sectors: string[]
  published_at: string
  created_at: string
}

export interface SectorHealth {
  id: string
  sector: string
  status: string
  risk_score: number
  trend: 'صاعد' | 'هابط' | 'مستقر'
  key_indicators: Record<string, string | number>
  last_updated: string
  created_at: string
}

export interface SearchResult {
  id: string
  entity_name: string
  entity_name_ar: string
  news_items: NewsItem[]
  first_seen: string
  last_seen: string
  risk_summary: string
  total_negative: number
  total_positive: number
}

export interface FetchedSource {
  name: string
  url: string
  type: 'rss' | 'scrape' | 'api'
  last_fetched: string | null
  status: 'active' | 'error' | 'pending'
}

export interface DashboardStats {
  total_news_24h: number
  early_warnings_24h: number
  breaking_count: number
  sources_active: number
  last_sync: string
}
