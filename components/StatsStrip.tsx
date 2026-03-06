// components/StatsStrip.tsx
import { AlertTriangle, TrendingUp, Zap, Database } from 'lucide-react'
import type { DashboardStats } from '@/types'

export function StatsStrip({ stats }: { stats: DashboardStats }) {
  const cards = [
    {
      label: 'أخبار آخر 24 ساعة',
      value: stats.total_news_24h,
      icon: Database,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      label: 'إشارات إنذار مبكر',
      value: stats.early_warnings_24h,
      icon: AlertTriangle,
      color: 'text-red-400',
      bg: 'bg-red-500/10 border-red-500/20',
    },
    {
      label: 'أخبار عاجلة',
      value: stats.breaking_count,
      icon: Zap,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      label: 'مصادر نشطة',
      value: `${stats.sources_active}`,
      icon: TrendingUp,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map(({ label, value, icon: Icon, color, bg }) => (
        <div key={label} className={`rounded-lg border ${bg} p-4 flex items-center gap-3`}>
          <div className={`p-2 rounded-lg ${bg}`}>
            <Icon className={`w-4 h-4 ${color}`} />
          </div>
          <div>
            <div className={`text-xl font-bold font-num ${color}`}>{value}</div>
            <div className="text-[11px] text-radar-muted leading-tight">{label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
