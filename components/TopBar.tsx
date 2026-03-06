'use client'
import { useState } from 'react'
import { Activity, RefreshCw, Wifi, WifiOff, Clock, AlertTriangle } from 'lucide-react'
import type { DashboardStats } from '@/types'

interface Props {
  stats: DashboardStats
  sources: Array<{ source_id: string; name: string; status: string; last_fetched: string | null }>
}

export function TopBar({ stats, sources }: Props) {
  const [syncing, setSyncing] = useState(false)
  const [showSources, setShowSources] = useState(false)

  const handleManualSync = async () => {
    setSyncing(true)
    try {
      await fetch('/api/fetch-news', {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_SYNC_TRIGGER ?? ''}` },
      })
      window.location.reload()
    } catch {
      // silent
    } finally {
      setSyncing(false)
    }
  }

  const lastSync = stats.last_sync
    ? new Date(stats.last_sync).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    : '—'

  const activeCount = sources.filter(s => s.status === 'active').length
  const errorCount = sources.filter(s => s.status === 'error').length

  return (
    <header className="sticky top-0 z-50 bg-radar-surface border-b border-radar-border">
      <div className="flex items-center justify-between px-4 lg:px-6 h-14">

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-bold text-white leading-none">رادار المخاطر</div>
              <div className="text-[10px] text-radar-muted leading-none mt-0.5 ltr">Radar Al-Makhater</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-dot" />
            <span className="text-[10px] font-semibold text-emerald-400 hidden sm:block">مباشر</span>
          </div>
        </div>

        <div className="hidden md:flex flex-col items-center">
          <span className="text-xs font-semibold text-radar-text">
            {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
          <span className="text-[10px] text-radar-muted">
            {new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSources(!showSources)}
            className="relative flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-radar-card transition-colors"
          >
            {errorCount > 0
              ? <WifiOff className="w-4 h-4 text-red-400" />
              : <Wifi className="w-4 h-4 text-emerald-400" />
            }
            <span className="text-xs font-num">
              <span className="text-emerald-400">{activeCount}</span>
              <span className="text-radar-muted">/{sources.length}</span>
            </span>
            {errorCount > 0 && (
              <span className="absolute -top-1 -left-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center font-bold">
                {errorCount}
              </span>
            )}
          </button>

          <div className="hidden sm:flex items-center gap-1 text-[10px] text-radar-muted">
            <Clock className="w-3 h-3" />
            <span>آخر تحديث: {lastSync}</span>
          </div>

          <button
            onClick={handleManualSync}
            disabled={syncing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-radar-accent hover:bg-blue-600 disabled:opacity-50 text-white rounded-md transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:block">{syncing ? 'جارٍ المزامنة...' : 'تحديث الآن'}</span>
          </button>
        </div>
      </div>

      {showSources && (
        <div className="absolute top-14 left-4 w-72 bg-radar-card border border-radar-border rounded-lg shadow-2xl z-50 overflow-hidden">
          <div className="px-3 py-2 border-b border-radar-border">
            <span className="text-xs font-bold text-radar-text">حالة المصادر</span>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {sources.map(s => (
              <div key={s.source_id} className="flex items-center justify-between px-3 py-2 hover:bg-radar-surface">
                <span className="text-xs text-radar-text">{s.name}</span>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                  s.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                  s.status === 'error' ? 'bg-red-500/10 text-red-400' :
                  'bg-gray-500/10 text-gray-400'
                }`}>
                  {s.status === 'active' ? 'نشط' : s.status === 'error' ? 'خطأ' : 'معلق'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
