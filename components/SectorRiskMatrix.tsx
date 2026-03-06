// components/SectorRiskMatrix.tsx
import { Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface Sector {
  id: string
  sector: string
  status: string
  risk_score: number
  trend: string
  last_updated: string
}

function getRiskBarColor(score: number) {
  if (score >= 70) return 'bg-red-500'
  if (score >= 40) return 'bg-amber-500'
  return 'bg-emerald-500'
}

function getStatusStyles(status: string) {
  const map: Record<string, string> = {
    'High Risk': 'text-red-400 bg-red-500/10 border-red-500/20',
    'Declining': 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    'Stable': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    'Expanding': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    'مرتفع': 'text-red-400 bg-red-500/10 border-red-500/20',
    'هابط': 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    'مستقر': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    'متنامي': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  }
  return map[status] ?? 'text-radar-muted bg-radar-surface border-radar-border'
}

export function SectorRiskMatrix({ sectors }: { sectors: Sector[] }) {
  return (
    <div className="bg-radar-card border border-radar-border rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-radar-border">
        <Activity className="w-4 h-4 text-radar-accent" />
        <div>
          <h3 className="text-sm font-bold text-white">مصفوفة مخاطر القطاعات</h3>
          <p className="text-[10px] text-radar-muted">Sector Risk Matrix</p>
        </div>
      </div>

      {sectors.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-xs text-radar-muted">لا توجد بيانات القطاعات</p>
        </div>
      ) : (
        <div className="p-3 grid grid-cols-1 gap-2">
          {sectors.map(s => (
            <div key={s.id} className="bg-radar-surface rounded-lg p-3 border border-radar-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-white truncate flex-1">{s.sector}</span>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className={`text-[9px] font-bold border px-1.5 py-0.5 rounded ${getStatusStyles(s.status)}`}>
                    {s.status}
                  </span>
                  {s.trend === 'Up' || s.trend === 'صاعد'
                    ? <TrendingUp className="w-3 h-3 text-red-400" />
                    : s.trend === 'Down' || s.trend === 'هابط'
                    ? <TrendingDown className="w-3 h-3 text-emerald-400" />
                    : <Minus className="w-3 h-3 text-radar-dim" />
                  }
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-radar-border rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${getRiskBarColor(s.risk_score)}`}
                    style={{ width: `${s.risk_score}%` }}
                  />
                </div>
                <span className="text-[10px] font-num font-bold text-radar-text w-10 text-left">
                  {s.risk_score}/100
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
