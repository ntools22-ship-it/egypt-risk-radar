'use client'
import { useState } from 'react'
import { ShieldAlert, RefreshCw, Wifi, WifiOff, Clock, Share2 } from 'lucide-react'
import type { DashboardStats } from '@/types'

interface Props {
  stats: DashboardStats
  sources: Array<{ source_id: string; name: string; status: string; last_fetched: string | null }>
}

export function TopBar({ stats, sources }: Props) {
  const [syncing, setSyncing] = useState(false)
  const [showSources, setShowSources] = useState(false)
  const [syncMsg, setSyncMsg] = useState('')

  const handleManualSync = async () => {
    setSyncing(true)
    setSyncMsg('')
    try {
      // استخدام المفتاح السري المبرمج مسبقاً للتحقق من الصلاحية
      const triggerSecret = process.env.NEXT_PUBLIC_SYNC_TRIGGER || 'radar2026secret'
      const res = await fetch(`/api/fetch-news?secret=${triggerSecret}`, {
        method: 'GET',
      })
      const data = await res.json()
      if (data.success) {
        setSyncMsg(`✅ تم إضافة ${data.inserted} خبر جديد`)
        setTimeout(() => { setSyncMsg(''); window.location.reload() }, 2000)
      } else {
        setSyncMsg('❌ فشل التحديث')
        setTimeout(() => setSyncMsg(''), 3000)
      }
    } catch {
      setSyncMsg('❌ خطأ في الاتصال بالسيرفر')
      setTimeout(() => setSyncMsg(''), 3000)
    } finally {
      setSyncing(false)
    }
  }

  const handleShare = async () => {
    const text = `رادار المخاطر المصري — آخر التحديثات المصرفية والمخاطر: ${stats.total_news_24h} خبر في الـ 24 ساعة الأخيرة.`
    if (navigator.share) {
      await navigator.share({ title: 'رادار المخاطر', text, url: window.location.href })
    } else {
      await navigator.clipboard.writeText(`${text}\n${window.location.href}`)
      setSyncMsg('✅ تم نسخ الرابط')
      setTimeout(() => setSyncMsg(''), 2000)
    }
  }

  const lastSync = stats.last_sync
    ? new Date(stats.last_sync).toLocaleTimeString('ar-EG', { timeZone: 'Africa/Cairo', hour: '2-digit', minute: '2-digit' })
    : '—'

  const activeCount = sources.filter(s => s.status === 'active').length
  const errorCount = sources.filter(s => s.status === 'error').length

  return (
    <header className="sticky top-0 z-50 bg-radar-surface border-b border-radar-border shadow-md">
      <div className="flex items-center justify-between px-4 lg:px-6 h-14">

        {/* Logo & Identity */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-900 flex items-center justify-center shadow-lg shadow-blue-900/30">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div className="hidden xs:block">
              <div className="text-base font-extrabold text-white leading-none">رادار المخاطر</div>
              <div className="text-[10px] text-radar-muted font-medium mt-1 tracking-wider uppercase">Risk Radar · Egypt</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-400 hidden sm:block">مباشر</span>
          </div>
        </div>

        {/* Middle: Date & Time (Cairo) */}
        <div className="hidden md:flex flex-col items-center">
          <span className="text-xs font-bold text-radar-text">
            {new Date().toLocaleDateString('ar-EG', { timeZone: 'Africa/Cairo', weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
          <div className="flex items-center gap-1 mt-0.5">
            <Clock className="w-3 h-3 text-radar-dim" />
            <span className="text-[10px] text-radar-muted font-mono tracking-tighter">
              {new Date().toLocaleTimeString('ar-EG', { timeZone: 'Africa/Cairo', hour: '2-digit', minute: '2-digit' })} (القاهرة)
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          
          {/* Sources Status */}
          <button onClick={() => setShowSources(!showSources)}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-radar-card transition-all border border-transparent hover:border-radar-border">
            {errorCount > 0 ? <WifiOff className="w-4 h-4 text-red-500" /> : <Wifi className="w-4 h-4 text-emerald-500" />}
            <span className="text-xs font-bold">
              <span className="text-emerald-400">{activeCount}</span>
              <span className="text-radar-muted">/{sources.length}</span>
            </span>
          </button>

          <div className="hidden lg:block text-[10px] text-radar-muted min-w-[100px] text-center">
            {syncMsg || `آخر مزامنة: ${lastSync}`}
          </div>

          {/* Share Button */}
          <button onClick={handleShare}
            className="p-2 text-radar-muted hover:text-white bg-radar-card border border-radar-border rounded-lg hover:bg-radar-border transition-all shadow-sm">
            <Share2 className="w-4 h-4" />
          </button>

          {/* Refresh Button */}
          <button onClick={handleManualSync} disabled={syncing}
            className="flex items-center gap-2 px-3 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg transition-all shadow-lg shadow-blue-600/20">
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{syncing ? 'جارٍ السحب...' : 'تحديث الآن'}</span>
          </button>
        </div>
      </div>

      {/* Sources Dropdown */}
      {showSources && (
        <div className="absolute top-16 left-4 lg:left-auto lg:right-4 w-72 bg-radar-card border border-radar-border rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
          <div className="px-4 py-3 bg-radar-surface border-b border-radar-border">
            <h3 className="text-xs font-black text-white uppercase tracking-widest">شبكة المصادر الحالية</h3>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {sources.map(s => (
              <div key={s.source_id} className="flex items-center justify-between px-4 py-3 hover:bg-radar-surface/50 border-b border-radar-border/50 last:border-0 transition-colors">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-radar-text">{s.name}</span>
                  <span className="text-[9px] text-radar-dim">
                    {s.last_fetched ? new Date(s.last_fetched).toLocaleTimeString('ar-EG', {timeZone: 'Africa/Cairo'}) : 'لم يتم السحب بعد'}
                  </span>
                </div>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                  s.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  s.status === 'error' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                }`}>
                  {s.status === 'active' ? 'نشط' : s.status === 'error' ? 'خطأ' : 'خامل'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
