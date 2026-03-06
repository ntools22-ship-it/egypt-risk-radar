// components/NewsCard.tsx
'use client'
import { useState } from 'react'
import { ExternalLink, Copy, Check, TrendingUp, TrendingDown, Minus, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'
import type { NewsItem } from '@/types'

interface Props {
  news: NewsItem
  index?: number
}

const RISK_BADGE_STYLES: Record<string, string> = {
  'حرج': 'bg-red-500/10 text-red-400 border-red-500/20',
  'مرتفع': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  'متوسط': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'منخفض': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
}

const SENTIMENT_ICON: Record<string, React.FC<{ className?: string }>> = {
  'سلبي': ({ className }) => <TrendingDown className={className} />,
  'تحذير': ({ className }) => <AlertCircle className={className} />,
  'إيجابي': ({ className }) => <TrendingUp className={className} />,
  'محايد': ({ className }) => <Minus className={className} />,
}

const SENTIMENT_COLORS: Record<string, string> = {
  red: 'border-red-600/40 bg-red-500/[0.03]',
  amber: 'border-amber-600/30 bg-amber-500/[0.03]',
  green: 'border-emerald-600/30 bg-emerald-500/[0.03]',
  neutral: 'border-radar-border bg-radar-card',
}

const SENTIMENT_LEFT: Record<string, string> = {
  red: 'bg-red-500',
  amber: 'bg-amber-500',
  green: 'bg-emerald-500',
  neutral: 'bg-radar-dim',
}

const ICON_COLORS: Record<string, string> = {
  red: 'text-red-400',
  amber: 'text-amber-400',
  green: 'text-emerald-400',
  neutral: 'text-radar-muted',
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3600000)
  const m = Math.floor(diff / 60000)
  const d = Math.floor(diff / 86400000)
  if (d >= 1) return `منذ ${d} يوم`
  if (h >= 1) return `منذ ${h} ساعة`
  return `منذ ${m} دقيقة`
}

export function NewsCard({ news, index = 0 }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const [exporting, setExporting] = useState(false)

  const cardColor = SENTIMENT_COLORS[news.sentiment_color] ?? SENTIMENT_COLORS.neutral
  const leftColor = SENTIMENT_LEFT[news.sentiment_color] ?? SENTIMENT_LEFT.neutral
  const iconColor = ICON_COLORS[news.sentiment_color] ?? ICON_COLORS.neutral
  const SentimentIcon = SENTIMENT_ICON[news.sentiment] ?? SENTIMENT_ICON['محايد']

  const handleExportMemo = async () => {
    setExporting(true)
    try {
      const res = await fetch(`/api/export-memo?id=${news.id}`)
      const { memo } = await res.json()
      await navigator.clipboard.writeText(memo)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch {
      // fallback
      const text = `${news.title_ar ?? news.title}\n${news.summary_ar ?? news.summary}`
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } finally {
      setExporting(false)
    }
  }

  const hasDuplicates = news.duplicate_sources?.length > 0

  return (
    <article
      className={`card-enter relative flex rounded-xl border overflow-hidden transition-shadow hover:shadow-lg ${cardColor}`}
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      {/* Colored left border stripe */}
      <div className={`w-1 flex-shrink-0 ${leftColor}`} />

      <div className="flex-1 p-4">

        {/* Top row: badges + sentiment icon */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">

            {news.is_breaking && (
              <span className="badge-breaking px-2 py-0.5 text-[10px] font-bold text-white rounded text-center">
                ⚡ عاجل
              </span>
            )}

            <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded border ${RISK_BADGE_STYLES[news.risk_level] ?? RISK_BADGE_STYLES['منخفض']}`}>
              {news.risk_level}
            </span>

            <span className="px-2 py-0.5 text-[10px] font-medium bg-radar-surface text-radar-muted border border-radar-border rounded">
              {news.risk_type}
            </span>

            <span className="px-2 py-0.5 text-[10px] font-medium bg-radar-surface text-radar-muted border border-radar-border rounded">
              {news.industry}
            </span>

            <span className="px-2 py-0.5 text-[10px] font-medium bg-radar-surface text-radar-muted border border-radar-border rounded">
              {news.client_size}
            </span>

            {hasDuplicates && (
              <span className="px-2 py-0.5 text-[10px] font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded">
                {news.duplicate_sources.length + 1} مصادر
              </span>
            )}
          </div>

          <SentimentIcon className={`w-5 h-5 flex-shrink-0 ${iconColor}`} />
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-white leading-relaxed mb-2">
          {news.title_ar ?? news.title}
        </h3>

        {/* Summary */}
        <p className={`text-xs text-radar-muted leading-relaxed mb-3 transition-all ${expanded ? '' : 'line-clamp-2'}`}>
          {news.summary_ar ?? news.summary}
        </p>

        {/* Expand/collapse if summary is long */}
        {(news.summary_ar ?? news.summary).length > 180 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-[10px] text-radar-accent hover:text-blue-300 mb-3 transition-colors"
          >
            {expanded ? <><ChevronUp className="w-3 h-3" />إخفاء</> : <><ChevronDown className="w-3 h-3" />عرض المزيد</>}
          </button>
        )}

        {/* Keywords */}
        {news.keywords?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {news.keywords.slice(0, 4).map(kw => (
              <span key={kw} className="px-1.5 py-0.5 text-[9px] bg-radar-border text-radar-dim rounded font-mono">
                #{kw}
              </span>
            ))}
          </div>
        )}

        {/* Duplicate sources if merged */}
        {hasDuplicates && expanded && (
          <div className="mb-3 p-2 bg-radar-surface rounded-lg border border-radar-border">
            <p className="text-[10px] font-bold text-radar-muted mb-1">ظهر في {news.duplicate_sources.length + 1} مصادر:</p>
            <div className="flex flex-wrap gap-1">
              <span className="text-[10px] text-radar-text bg-radar-card px-2 py-0.5 rounded">{news.source_name}</span>
              {news.duplicate_sources.map((src, i) => (
                <span key={i} className="text-[10px] text-radar-muted bg-radar-border px-2 py-0.5 rounded">{src}</span>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex items-center gap-2 text-[11px] text-radar-muted">
            <span className="font-semibold text-radar-text">{news.source_name}</span>
            <span className="text-radar-dim">·</span>
            <span>{timeAgo(news.published_at)}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Export for memo */}
            <button
              onClick={handleExportMemo}
              disabled={exporting}
              className={`flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold rounded-lg border transition-all ${
                copied
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-radar-surface border-radar-border text-radar-muted hover:text-white hover:border-radar-accent'
              }`}
              title="نسخ ملاحظة ائتمانية"
            >
              {copied ? <><Check className="w-3 h-3" />تم النسخ</> : <><Copy className="w-3 h-3" />تصدير للمذكرة</>}
            </button>

            {/* Source link */}
            <a
              href={news.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-semibold bg-radar-accent/10 hover:bg-radar-accent/20 text-blue-400 border border-radar-accent/20 rounded-lg transition-colors"
            >
              المصدر
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </div>
    </article>
  )
}
