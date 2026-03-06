// components/SearchBar.tsx
'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, History } from 'lucide-react'

const QUICK_SEARCHES = [
  'بنك مصر', 'القاهرة الإسكندرية', 'طلعت مصطفى', 'أوراسكوم', 'سيدي كرير', 'إفلاس', 'تعثر'
]

interface Props {
  initialQuery?: string
}

export function SearchBar({ initialQuery }: Props) {
  const [query, setQuery] = useState(initialQuery ?? '')
  const [focused, setFocused] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSearch = (q: string) => {
    const trimmed = q.trim()
    if (!trimmed) {
      router.push('/')
      return
    }
    // Save to localStorage search history
    try {
      const hist: string[] = JSON.parse(localStorage.getItem('searchHistory') ?? '[]')
      const updated = [trimmed, ...hist.filter(h => h !== trimmed)].slice(0, 10)
      localStorage.setItem('searchHistory', JSON.stringify(updated))
    } catch { /* ignore */ }

    startTransition(() => {
      router.push(`/?q=${encodeURIComponent(trimmed)}`)
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch(query)
  }

  const handleClear = () => {
    setQuery('')
    router.push('/')
  }

  return (
    <div className="relative">
      <div className={`flex items-center gap-3 bg-radar-card border rounded-xl px-4 py-3 transition-all ${
        focused ? 'border-radar-accent shadow-[0_0_0_3px_rgba(26,86,219,0.15)]' : 'border-radar-border'
      }`}>
        {isPending
          ? <div className="w-4 h-4 border-2 border-radar-accent border-t-transparent rounded-full animate-spin flex-shrink-0" />
          : <Search className="w-4 h-4 text-radar-muted flex-shrink-0" />
        }
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="ابحث عن أي شركة أو كيان... (مثال: بنك مصر، طلعت مصطفى، أوراسكوم)"
          className="flex-1 bg-transparent text-radar-text placeholder-radar-muted text-sm outline-none"
          dir="rtl"
        />
        {query && (
          <button onClick={handleClear} className="text-radar-muted hover:text-radar-text transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => handleSearch(query)}
          className="flex-shrink-0 px-4 py-1.5 bg-radar-accent hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          بحث
        </button>
      </div>

      {/* Quick searches */}
      {!query && !initialQuery && (
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="flex items-center gap-1 text-[10px] text-radar-muted">
            <History className="w-3 h-3" />
            بحث سريع:
          </span>
          {QUICK_SEARCHES.map(qs => (
            <button
              key={qs}
              onClick={() => { setQuery(qs); handleSearch(qs) }}
              className="text-[11px] px-2.5 py-1 bg-radar-card border border-radar-border hover:border-radar-accent text-radar-muted hover:text-radar-text rounded-full transition-colors"
            >
              {qs}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
