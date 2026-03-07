'use client'
import { useState } from 'react'
import { ShieldAlert, RefreshCw, CheckCircle, XCircle } from 'lucide-react'

interface Props {
  stats: { total_24h: number }
  sources: any[]
}

export function TopBar({ stats }: Props) {
  const [syncing, setSyncing] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const handleSync = async () => {
    setSyncing(true)
    try {
      const res = await fetch(`/api/fetch-news?secret=radar2026secret`)
      const data = await res.json()
      setMsg(data.success ? `✅ تم سحب ${data.inserted} خبر` : '❌ فشل التحديث')
      if (data.success) setTimeout(() => window.location.reload(), 2000)
    } catch {
      setMsg('❌ خطأ في الاتصال')
    } finally {
      setSyncing(false)
      setTimeout(() => setMsg(null), 3000)
    }
  }

  return (
    <header className="h-16 border-b border-gray-800 bg-[#0d1117]/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-gray-900 px-3 py-1.5 rounded-full border border-gray-800">
          <ShieldAlert className="w-4 h-4 text-blue-400" />
          <span className="text-xs text-gray-400">نشط الآن: <b className="text-white">{stats.total_24h}</b> خبر</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {msg && <span className="text-xs font-medium animate-pulse">{msg}</span>}
        <button 
          onClick={handleSync}
          disabled={syncing}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            syncing ? 'bg-gray-800 text-gray-500' : 'bg-blue-600 hover:bg-blue-500 text-white'
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'جاري السحب...' : 'تحديث الرادار'}
        </button>
      </div>
    </header>
  )
}
