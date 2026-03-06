'use client'
import { useState } from 'react'
import { RefreshCw, Wifi, WifiOff, Clock, ShieldAlert } from 'lucide-react'
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
      // نستخدم المفتاح السري المخصص للتحديث اليدوي
      await fetch('/api/fetch-news?key=radar2026secret', {
        method: 'GET',
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
    <header className="sticky top-0 z-50 bg-radar-surface border-b border-radar-border backdrop-blur-md bg-opacity-90">
      <div className="flex items-center justify-between px-4 lg:px-6 h-14 gap-3 dir-rtl">

        {/* ── Logo & Live Status ── */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-900 shadow-lg shadow-blue-900/40">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block text-right">
            <div className="text-sm font-black text-white tracking-wide leading-none font-cairo">
              رادار المخاطر
            </div>
            <div className="text-[9px] text-blue-400 font-mono tracking-widest mt-0.5 uppercase">
              Egypt Risk Radar
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-400 hidden sm:block font-cairo">مباشر</span>
          </div>
        </div>

        {/* ── Center Date ── */}
        <div className="hidden md:flex flex-col items-center flex-1">
          <span className="text-xs font-semibold text-radar-text font-cairo">
            {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
          <span className="text-[10px] text-radar-muted font-sans">
            {new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* ── Actions & Health ── */}
        <div className="flex items-center gap-2 flex-shrink-0">

          {/* Last sync info */}
          <div className="hidden sm:flex items-center gap-1 text-[10px] text-radar-muted font-sans ml-2">
            <Clock className="w-3 h-3" />
            <span>{lastSync}</span>
          </div>

          {/* Sources status button */}
          <button
            onClick={() => setShowSources(!showSources)}
            className="relative flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-radar-card transition-colors"
            title="حالة المصادر"
          >
            {errorCount > 0
              ? <WifiOff className="w-4 h-4 text-red-400" />
              : <Wifi className="w-4 h-4 text-emerald-400" />
            }
            <span className="text-xs font-mono">
              <span className="text-emerald-400">{activeCount}</span>
              <span className="text-radar-muted">/{sources.length}</span>
            </span>
            {errorCount > 0 && (
              <span className="absolute -top-1 -left-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center font-bold">
                {errorCount}
              </span>
            )}
          </button>

          {/* Manual Sync Button */}
          <button
            onClick={handleManualSync}
            disabled={syncing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-all shadow-md active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:block font-cairo">{syncing ? 'جارٍ...' : 'تحديث'}</span>
          </button>
        </div>
      </div>

      {/* Sources Dropdown */}
      {showSources && (
        <div className="absolute top-14 left-4 w-72 bg-radar-card border border-radar-border rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="px-4 py-2.5 border-b border-radar-border flex items-center justify-between dir-rtl">
            <span className="text-xs font-bold text-white font-cairo">حالة المصادر ({sources.length})</span>
            <span className="text-[10px] text-emerald-400 font-cairo">{activeCount} نشط</span>
          </div>
          <div className="max-h-72 overflow-y-auto divide-y divide-radar-border">
            {sources.map(s => (
              <div key={s.source_id} className="flex items-center justify-between px-4 py-2.5 hover:bg-radar-surface transition-colors dir-rtl">
                <span className="text-xs text-radar-text truncate flex-1 font-cairo ml-2">{s.name}</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0 ${
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
