'use client'
import Link from 'next/link'
import {
  Home, Building2, TrendingUp, AlertTriangle,
  Wheat, Factory, Search
} from 'lucide-react'

const NAV_ITEMS = [
  { id: 'all', label: 'الرئيسية', sub: 'جميع الأخبار', icon: Home, href: '/' },
  { id: 'banks', label: 'البنوك والرقابة', sub: 'CBE · بنوك · تمويل', icon: Building2, href: '/?category=banks' },
  { id: 'economy', label: 'الاقتصاد الكلي', sub: 'بلومبرغ · الأهرام · مباشر', icon: TrendingUp, href: '/?category=economy' },
  { id: 'industry', label: 'الصناعة والشركات', sub: 'بورصة · إفصاحات · مصانع', icon: Factory, href: '/?category=industry' },
  { id: 'agriculture', label: 'الزراعة والغذاء', sub: 'محاصيل · تصدير · أسعار', icon: Wheat, href: '/?category=agriculture' },
  { id: 'warning', label: 'الإنذار المبكر', sub: 'تعثر · إفلاس · مخاطر', icon: AlertTriangle, href: '/?category=warning', danger: true },
]

export function Sidebar({ activeCategory }: { activeCategory: string }) {
  return (
    <aside className="hidden lg:flex flex-col w-60 min-h-[calc(100vh-4rem)] bg-radar-surface border-l border-radar-border sticky top-14 h-[calc(100vh-4rem)] overflow-y-auto">
      <nav className="flex-1 p-3 space-y-0.5">
        <div className="px-3 py-2 mb-1 text-right">
          <span className="text-[10px] font-bold text-radar-muted uppercase tracking-widest font-cairo">الأقسام</span>
        </div>
        
        {NAV_ITEMS.map(({ id, label, sub, icon: Icon, href, danger }) => {
          const isActive = activeCategory === id
          return (
            <Link
              key={id}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group dir-rtl ${
                isActive
                  ? danger ? 'bg-red-500/15 border border-red-500/20'
                  : 'bg-blue-500/15 border border-blue-500/20'
                  : 'hover:bg-radar-card'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${
                isActive
                  ? danger ? 'text-red-400' : 'text-blue-400'
                  : 'text-radar-muted group-hover:text-radar-text'
              }`} />
              <div className="flex-1 min-w-0 text-right">
                <div className={`text-sm font-semibold truncate font-cairo ${
                  isActive ? danger ? 'text-red-300' : 'text-white' : 'text-radar-text'
                }`}>{label}</div>
                <div className="text-[10px] text-radar-muted truncate font-cairo">{sub}</div>
              </div>
              {danger && !isActive && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
              )}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-radar-border">
        <Link
          href="/search"
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-radar-card hover:bg-radar-border transition-colors dir-rtl"
        >
          <Search className="w-4 h-4 text-radar-muted" />
          <span className="text-sm text-radar-muted font-cairo">ابحث عن شركة...</span>
        </Link>
      </div>

      <div className="p-4 border-t border-radar-border text-center">
        <p className="text-[10px] text-radar-dim leading-relaxed font-sans">
          رادار المخاطر المصري<br />
          {new Date().getFullYear()} © جميع الحقوق محفوظة
        </p>
      </div>
    </aside>
  )
}
