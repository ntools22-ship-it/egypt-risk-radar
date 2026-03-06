// components/Sidebar.tsx
import Link from 'next/link'
import { Home, Building2, TrendingUp, AlertTriangle, Target, FileText, Search, Newspaper } from 'lucide-react'

interface Props {
  activeCategory: string
}

const NAV_ITEMS = [
  { id: 'all', label: 'الرئيسية', sublabel: 'جميع الأخبار', icon: Home },
  { id: 'Banking', label: 'البنوك والرقابة', sublabel: 'CBE · FRA', icon: Building2 },
  { id: 'Capital Markets', label: 'أسواق المال', sublabel: 'EGX · إفصاحات', icon: TrendingUp },
  { id: 'Business', label: 'أخبار الشركات', sublabel: 'تمويل · استثمار', icon: Newspaper },
  { id: 'Finance', label: 'أسواق وأموال', sublabel: 'أمول · مباشر', icon: Target },
  { id: 'Legal', label: 'الوقائع القانونية', sublabel: 'الجريدة الرسمية', icon: FileText },
  { id: 'warning', label: 'الإنذار المبكر', sublabel: 'إشارات الخطر', icon: AlertTriangle, danger: true },
]

export function Sidebar({ activeCategory }: Props) {
  return (
    <aside className="hidden lg:flex flex-col w-60 min-h-[calc(100vh-4rem)] bg-radar-surface border-l border-radar-border sticky top-14 h-[calc(100vh-4rem)] overflow-y-auto">

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        <div className="px-3 py-2 mb-1">
          <span className="text-[10px] font-bold text-radar-muted uppercase tracking-widest">القائمة الرئيسية</span>
        </div>

        {NAV_ITEMS.map(({ id, label, sublabel, icon: Icon, danger }) => {
          const isActive = activeCategory === id
          return (
            <Link
              key={id}
              href={id === 'all' ? '/' : `/?category=${id}`}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                isActive
                  ? danger
                    ? 'bg-red-500/15 border border-red-500/20'
                    : 'bg-radar-accent/15 border border-radar-accent/20'
                  : 'hover:bg-radar-card'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${
                isActive
                  ? danger ? 'text-red-400' : 'text-blue-400'
                  : 'text-radar-muted group-hover:text-radar-text'
              }`} />
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-semibold truncate ${
                  isActive
                    ? danger ? 'text-red-300' : 'text-white'
                    : 'text-radar-text'
                }`}>
                  {label}
                </div>
                <div className="text-[10px] text-radar-muted truncate">{sublabel}</div>
              </div>
              {danger && !isActive && (
                <span className="w-2 h-2 rounded-full bg-red-500 live-dot flex-shrink-0" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Search companies */}
      <div className="p-3 border-t border-radar-border">
        <div className="px-1 mb-2">
          <span className="text-[10px] font-bold text-radar-muted uppercase tracking-widest">بحث الشركات</span>
        </div>
        <Link
          href="/search"
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-radar-card hover:bg-radar-border transition-colors"
        >
          <Search className="w-4 h-4 text-radar-muted" />
          <span className="text-sm text-radar-muted">ابحث عن شركة...</span>
        </Link>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-radar-border">
        <p className="text-[10px] text-radar-dim text-center leading-relaxed">
          رادار المخاطر المصري<br />
          يتحدث تلقائياً كل 15 دقيقة
        </p>
      </div>
    </aside>
  )
}
