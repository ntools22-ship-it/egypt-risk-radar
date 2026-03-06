// components/LiveTicker.tsx
import { AlertTriangle } from 'lucide-react'

interface TickerItem {
  id: string
  title: string
  title_ar?: string | null
  sentiment: string
  sentiment_color: string
}

interface Props {
  items: TickerItem[]
}

export function LiveTicker({ items }: Props) {
  if (!items.length) return null

  // Duplicate items for seamless loop
  const doubled = [...items, ...items]

  return (
    <div className="bg-red-950/40 border-b border-red-900/30 overflow-hidden h-8 flex items-center">
      <div className="flex-shrink-0 flex items-center gap-2 px-3 h-full bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider z-10">
        <AlertTriangle className="w-3 h-3" />
        <span>تنبيهات</span>
      </div>
      <div className="overflow-hidden flex-1">
        <div className="ticker-inner flex gap-8 whitespace-nowrap items-center h-8">
          {doubled.map((item, i) => (
            <span key={`${item.id}-${i}`} className="flex items-center gap-2 text-[11px]">
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                item.sentiment_color === 'red' ? 'bg-red-400' :
                item.sentiment_color === 'amber' ? 'bg-amber-400' : 'bg-emerald-400'
              }`} />
              <span className={
                item.sentiment_color === 'red' ? 'text-red-300' :
                item.sentiment_color === 'amber' ? 'text-amber-300' :
                'text-radar-text'
              }>
                {item.title_ar ?? item.title}
              </span>
              <span className="text-radar-dim mx-2">◆</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
