// components/CBETrackerPanel.tsx
import { FileText, ExternalLink } from 'lucide-react'

interface Circular {
  id: string
  circular_number: string
  title: string
  title_ar?: string | null
  summary: string
  summary_ar?: string | null
  document_url?: string | null
  impact_level: string
  published_at: string
}

const IMPACT_STYLES: Record<string, string> = {
  'مرتفع': 'bg-red-500/10 text-red-400 border-red-500/20',
  'متوسط': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'منخفض': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'High': 'bg-red-500/10 text-red-400 border-red-500/20',
  'Medium': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Low': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function CBETrackerPanel({ circulars }: { circulars: Circular[] }) {
  return (
    <div className="bg-radar-card border border-radar-border rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-radar-border">
        <FileText className="w-4 h-4 text-radar-accent" />
        <div>
          <h3 className="text-sm font-bold text-white">كتب البنك المركزي</h3>
          <p className="text-[10px] text-radar-muted">CBE Regulatory Tracker</p>
        </div>
      </div>

      {circulars.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-xs text-radar-muted">لا توجد كتب دورية حالياً</p>
        </div>
      ) : (
        <div className="divide-y divide-radar-border">
          {circulars.map(c => (
            <div key={c.id} className="p-4 hover:bg-radar-surface transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-[10px] font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded">
                  {c.circular_number}
                </span>
                <span className={`text-[10px] font-semibold border px-1.5 py-0.5 rounded ${IMPACT_STYLES[c.impact_level] ?? IMPACT_STYLES['Low']}`}>
                  {c.impact_level}
                </span>
              </div>
              <h4 className="text-xs font-bold text-white leading-snug mb-1">
                {c.title_ar ?? c.title}
              </h4>
              <p className="text-[11px] text-radar-muted leading-relaxed line-clamp-2 mb-2">
                {c.summary_ar ?? c.summary}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-radar-dim">{formatDate(c.published_at)}</span>
                {c.document_url && (
                  <a
                    href={c.document_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    عرض <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
