// components/NewsFeed.tsx
import { NewsCard } from './NewsCard'
import { Newspaper } from 'lucide-react'
import type { NewsItem } from '@/types'

const CATEGORY_LABELS: Record<string, string> = {
  all: 'جميع الأخبار',
  Banking: 'البنوك والرقابة',
  'Capital Markets': 'أسواق المال',
  Business: 'أخبار الشركات',
  Finance: 'أسواق وأموال',
  Legal: 'الوقائع القانونية',
  warning: 'الإنذار المبكر',
}

interface Props {
  news: NewsItem[]
  activeCategory: string
}

export function NewsFeed({ news, activeCategory }: Props) {
  const title = CATEGORY_LABELS[activeCategory] ?? activeCategory

  if (!news.length) {
    return (
      <div className="bg-radar-card border border-radar-border rounded-xl p-12 text-center">
        <Newspaper className="w-8 h-8 text-radar-dim mx-auto mb-3" />
        <p className="text-sm text-radar-muted">لا توجد أخبار في هذا القسم حالياً</p>
        <p className="text-xs text-radar-dim mt-1">ستظهر الأخبار عند اكتمال التزامن القادم</p>
      </div>
    )
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-radar-accent" />
          {title}
        </h2>
        <span className="text-[11px] text-radar-muted font-num">{news.length} خبر</span>
      </div>
      <div className="space-y-3">
        {news.map((item, i) => (
          <NewsCard key={item.id} news={item} index={i} />
        ))}
      </div>
    </section>
  )
}
