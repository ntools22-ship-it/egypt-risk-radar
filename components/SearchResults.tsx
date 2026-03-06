// components/SearchResults.tsx
'use client'
import { NewsCard } from './NewsCard'
import { generateBulkMemo } from '@/lib/memo'
import { useState } from 'react'
import { Search, Copy, Check, TrendingDown, AlertTriangle, TrendingUp } from 'lucide-react'
import type { NewsItem } from '@/types'

interface Props {
  results: NewsItem[]
  query: string
  stats: { negative: number; warnings: number; positive: number }
  total: number
}

export function SearchResults({ results, query, stats, total }: Props) {
  const [copied, setCopied] = useState(false)

  const handleBulkExport = async () => {
    const res = await fetch(`/api/export-memo?q=${encodeURIComponent(query)}`)
    const { memo } = await res.json()
    await navigator.clipboard.writeText(memo)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  const riskProfile = stats.negative >= 3 ? 'مرتفعة' : stats.negative >= 1 ? 'متوسطة' : 'منخفضة'
  const riskColor = stats.negative >= 3 ? 'text-red-400' : stats.negative >= 1 ? 'text-amber-400' : 'text-emerald-400'

  return (
    <div className="space-y-4">
      {/* Search result header */}
      <div className="bg-radar-card border border-radar-border rounded-xl p-4">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Search className="w-4 h-4 text-radar-accent" />
              <span className="text-xs text-radar-muted">نتائج البحث عن:</span>
            </div>
            <h2 className="text-lg font-bold text-white">{query}</h2>
          </div>
          <button
            onClick={handleBulkExport}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border transition-all flex-shrink-0 ${
              copied
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-radar-surface border-radar-border text-radar-muted hover:border-radar-accent hover:text-white'
            }`}
          >
            {copied ? <><Check className="w-3.5 h-3.5" />تم النسخ</> : <><Copy className="w-3.5 h-3.5" />تصدير التقرير</>}
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-radar-surface rounded-lg p-3 text-center">
            <div className="text-xl font-bold font-num text-white">{total}</div>
            <div className="text-[10px] text-radar-muted">إجمالي الأخبار</div>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
            <div className="text-xl font-bold font-num text-red-400">{stats.negative}</div>
            <div className="text-[10px] text-radar-muted flex items-center justify-center gap-1">
              <TrendingDown className="w-2.5 h-2.5" />سلبي
            </div>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-center">
            <div className="text-xl font-bold font-num text-amber-400">{stats.warnings}</div>
            <div className="text-[10px] text-radar-muted flex items-center justify-center gap-1">
              <AlertTriangle className="w-2.5 h-2.5" />تحذيرات
            </div>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-center">
            <div className="text-xl font-bold font-num text-emerald-400">{stats.positive}</div>
            <div className="text-[10px] text-radar-muted flex items-center justify-center gap-1">
              <TrendingUp className="w-2.5 h-2.5" />إيجابي
            </div>
          </div>
        </div>

        {/* Risk profile */}
        <div className="mt-3 pt-3 border-t border-radar-border flex items-center gap-2 text-xs">
          <span className="text-radar-muted">ملف المخاطر الائتمانية:</span>
          <span className={`font-bold ${riskColor}`}>{riskProfile}</span>
          {stats.negative >= 3 && (
            <span className="text-[10px] text-red-300/70">· يُوصى بمراجعة الملف الائتماني</span>
          )}
        </div>
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <div className="bg-radar-card border border-radar-border rounded-xl p-12 text-center">
          <Search className="w-8 h-8 text-radar-dim mx-auto mb-3" />
          <p className="text-sm text-radar-muted">لا توجد أخبار مسجلة لهذا البحث</p>
        </div>
      ) : (
        <div className="space-y-3">
          {results.map((item, i) => (
            <NewsCard key={item.id} news={item} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
