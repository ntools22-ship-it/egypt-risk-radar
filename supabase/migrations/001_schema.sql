-- رادار المخاطر — Database Schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- News Feed
create table if not exists news_feed (
  id              uuid primary key default uuid_generate_v4(),
  title           text not null,
  title_ar        text,
  summary         text not null default '',
  summary_ar      text,
  source_url      text not null,
  source_name     text not null,
  sector          text not null default 'General',
  industry        text not null default 'غير محدد',
  risk_level      text not null default 'منخفض',
  risk_type       text not null default 'ائتماني',
  client_size     text not null default 'متوسط',
  sentiment       text not null default 'محايد',
  sentiment_color text not null default 'neutral',
  is_breaking     boolean not null default false,
  is_early_warning boolean not null default false,
  category        text not null default 'General',
  keywords        text[] default '{}',
  entities        text[] default '{}',
  duplicate_sources text[] default '{}',
  content_hash    text unique,
  published_at    timestamptz not null default now(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_news_published_at on news_feed (published_at desc);
create index if not exists idx_news_sentiment on news_feed (sentiment);
create index if not exists idx_news_category on news_feed (category);
create index if not exists idx_news_is_early_warning on news_feed (is_early_warning);
create index if not exists idx_news_is_breaking on news_feed (is_breaking);
create index if not exists idx_news_content_hash on news_feed (content_hash);
create index if not exists idx_news_fts on news_feed
  using gin(to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(title_ar,'') || ' ' || coalesce(summary,'')));

-- CBE Circulars
create table if not exists cbe_circulars (
  id               uuid primary key default uuid_generate_v4(),
  circular_number  text not null unique,
  title            text not null,
  title_ar         text,
  summary          text not null default '',
  summary_ar       text,
  document_url     text,
  impact_level     text not null default 'متوسط',
  affected_sectors text[] default '{}',
  published_at     timestamptz not null default now(),
  created_at       timestamptz not null default now()
);

create index if not exists idx_cbe_published on cbe_circulars (published_at desc);

-- Sector Health
create table if not exists sector_health (
  id             uuid primary key default uuid_generate_v4(),
  sector         text not null unique,
  status         text not null default 'Stable',
  risk_score     integer not null default 50 check (risk_score between 0 and 100),
  trend          text not null default 'Flat',
  key_indicators jsonb default '{}',
  last_updated   timestamptz not null default now(),
  created_at     timestamptz not null default now()
);

insert into sector_health (sector, status, risk_score, trend, key_indicators) values
  ('عقارات وإنشاءات', 'High Risk', 78, 'Up', '{"NPL_rate": "8.2%", "vacancy_rate": "22%"}'),
  ('تجزئة بنكية (أفراد)', 'Stable', 42, 'Flat', '{"NPL_rate": "3.1%", "growth": "+12%"}'),
  ('صناعة وتصنيع', 'Declining', 65, 'Up', '{"energy_cost_increase": "+38%", "FX_exposure": "high"}'),
  ('سياحة وضيافة', 'Expanding', 28, 'Down', '{"occupancy": "78%", "revenue_growth": "+31%"}'),
  ('تمويل الشركات الصغيرة', 'High Risk', 72, 'Up', '{"NPL_rate": "11.4%", "stress_index": "high"}'),
  ('اتصالات وتقنية', 'Stable', 35, 'Flat', '{"growth": "+18%", "FX_risk": "low"}'),
  ('زراعة وأغذية', 'Stable', 45, 'Flat', '{"subsidy_risk": "medium", "export_growth": "+8%"}'),
  ('طاقة وبترول', 'Stable', 38, 'Down', '{"production_increase": "+5%", "price_volatility": "medium"}')
on conflict (sector) do nothing;

-- Fetch Sources
create table if not exists fetch_sources (
  id           uuid primary key default uuid_generate_v4(),
  source_id    text not null unique,
  name         text not null,
  last_fetched timestamptz,
  status       text not null default 'pending',
  created_at   timestamptz not null default now()
);

-- Sync Log
create table if not exists sync_log (
  id                  uuid primary key default uuid_generate_v4(),
  fetched             integer default 0,
  inserted            integer default 0,
  duplicates          integer default 0,
  errors              text[] default '{}',
  sources_processed   integer default 0,
  synced_at           timestamptz not null default now()
);

create index if not exists idx_sync_log_at on sync_log (synced_at desc);

-- Subscribers
create table if not exists subscribers (
  id                  uuid primary key default uuid_generate_v4(),
  email               text not null unique,
  name                text not null,
  organization        text,
  instant_alerts      boolean not null default false,
  daily_brief         boolean not null default true,
  risk_summary        boolean not null default false,
  sector_preferences  jsonb default '[]',
  is_active           boolean not null default true,
  verified            boolean not null default false,
  subscribed_at       timestamptz not null default now(),
  created_at          timestamptz not null default now()
);

-- Row Level Security
alter table news_feed enable row level security;
alter table cbe_circulars enable row level security;
alter table sector_health enable row level security;
alter table fetch_sources enable row level security;
alter table subscribers enable row level security;

create policy "Public can read news" on news_feed for select using (true);
create policy "Public can read cbe" on cbe_circulars for select using (true);
create policy "Public can read sectors" on sector_health for select using (true);
create policy "Public can read sources" on fetch_sources for select using (true);
create policy "Service can insert news" on news_feed for insert with check (true);
create policy "Service can update news" on news_feed for update using (true);
create policy "Service can upsert sources" on fetch_sources for all using (true);
create policy "Service can insert sync_log" on sync_log for all using (true);
create policy "Anyone can subscribe" on subscribers for insert with check (true);
