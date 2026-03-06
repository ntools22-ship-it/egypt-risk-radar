// components/EarlyWarningPanel.tsx
import { AlertTriangle, Clock } from 'lucide-react'
import { NewsCard } from './NewsCard'
import type { NewsItem } from '@/types'

interface Props {
  warnings: NewsItem[]
}

export function EarlyWarningPanel({ warnings }: Props) {
  return (
    <section className="rounded-xl border border-red-500/30 bg-red-500/[0.04] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-red-500/10 border-b border-red-500/20">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <span className="text-sm font-bold text-red-300">إشارات الإنذار المبكر</span>
          <span className="text-[10px] font-semibold px-2 py-0.5 bg-red-500 text-white rounded-full">
            {warnings.length}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-red-400/70">
          <Clock className="w-3 h-3" />
          <span>آخر 24 ساعة</span>
        </div>
      </div>

      {/* Warning cards */}
      <div className="p-3 space-y-2">
        {warnings.map((w, i) => (
          <NewsCard key={w.id} news={w} index={i} />
        ))}
      </div>
    </section>
  )
}
