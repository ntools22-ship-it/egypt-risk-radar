'use client'
import { ExternalLink, Share2, TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react'
import type { NewsItem } from '@/types'

interface Props { news: NewsItem; index?: number }

const RISK_BADGE: Record<string, string> = {
  'حرج':    'bg-red-500/10 text-red-400 border-red-500/20',
  'مرتفع':  'bg-orange-500/10 text-orange-400 border-orange-500/20',
  'متوسط':  'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'منخفض':  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
}

const CARD_COLOR: Record<string, string> = {
  red:     'border-red-600/40 bg-red-500/[0.03]',
  amber:   'border-amber-600/30 bg-amber-500/[0.03]',
  green:   'border-emerald-600/30 bg-emerald-500/[0.03]',
  neutral: 'border-radar-border bg-radar-card',
}

const SENTIMENT_ICON: Record<string, React.FC<{ className?: string }>> = {
  'سلبي':   ({ className }) => <TrendingDown className={className} />,
  'تحذير':  ({ className }) => <AlertCircle className={className} />,
  'إيجابي': ({ className }) => <TrendingUp className={className} />,
  'محايد':  ({ className }) => <Minus className={className} />,
}

function cairoPubTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('ar-EG', {
      timeZone: 'Africa/Cairo',
      hour: '2-digit', minute: '2-digit',
      day: 'numeric', month: 'short',
    })
  } catch { return 'الآن' }
}

export function NewsCard({ news, index = 0 }: Props) {
  const color = news.sentiment_color ?? 'neutral'
  const SentimentIcon = SENTIMENT_ICON[news.sentiment] ?? SENTIMENT_ICON['محايد']

  const handleShare = async () => {
    const text = `${news.title}\nالمصدر: ${news.source_name}\nرابط الخبر: ${news.source_url}`
    if (navigator.share) {
      await navigator.share({ title: news.title, url: news.source_url })
    } else {
      await navigator.clipboard.writeText(text)
    }
  }

  return (
    <article
      className={`relative flex rounded-xl border overflow-hidden transition-all duration-300 hover:translate-x-1 hover:shadow-lg ${CARD_COLOR[color] ?? CARD_COLOR.neutral}`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* مؤشر اللون الجانبي */}
      <div className={`w-1.5 flex-shrink-0 ${
        color === 'red' ? 'bg-red-500' : 
        color === 'amber' ? 'bg-amber-500' : 
        color === 'green' ? 'bg-emerald-500' : 'bg-radar-border'
      }`} />

      <div className="flex-1 p-4">
        {/* Badges & Indicators */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {news.is_breaking && (
              <span className="bg-red-600 text-white px-2 py-0.5 text-[10px] font-black rounded animate-pulse">⚡ عاجل</span>
            )}
            <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${RISK_BADGE[news.risk_level] ?? RISK_BADGE['منخفض']}`}>
              {news.risk_level}
            </span>
            <span className="px-2 py-0.5 text-[10px] bg-radar-surface/50 text-radar-muted border border-radar-border rounded font-medium">
              {news.risk_type}
            </span>
            <span className="px-2 py-0.5 text-[10px] bg-radar-surface/50 text-radar-muted border border-radar-border rounded font-medium">
              {news.industry}
            </span>
          </div>
          <SentimentIcon className={`w-5 h-5 flex-shrink-0 ${
            color === 'red' ? 'text-red-400' : 
            color === 'amber' ? 'text-amber-400' : 
            color === 'green' ? 'text-emerald-400' : 'text-radar-muted'
          }`} />
        </div>

        {/* Headline — العنوان الرئيسي */}
        <a href={news.source_url} target="_blank" rel="noopener noreferrer"
          className="block text-[15px] font-bold text-white leading-relaxed hover:text-blue-400 transition-colors mb-4 decoration-blue-500/30">
          {news.title_ar ?? news.title}
        </a>

        {/* Hidden Summary — الملخص مخفي لكن موجود للـ DOM */}
        <p className="hidden" aria-hidden="true">{news.summary_ar ?? news.summary}</p>

        {/* Footer Info */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="font-bold text-blue-400/90">{news.source_name}</span>
            <span className="text-radar-dim">|</span>
            <span className="text-radar-muted font-medium">{cairoPubTime(news.published_at)}</span>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleShare}
              className="p-1.5 text-radar-muted hover:text-white hover:bg-radar-surface rounded-md transition-all"
              title="مشاركة الخبر">
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <a href={news.source_url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-md transition-all">
              التفاصيل
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </article>
  )
}
