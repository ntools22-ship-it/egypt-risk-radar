import { Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { TopBar } from '@/components/TopBar'
import { Sidebar } from '@/components/Sidebar'
import { NewsFeed } from '@/components/NewsFeed'
import { MainTabs } from '@/components/MainTabs'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function HomePage({ searchParams }: { searchParams: any }) {
  const activeCategory = searchParams.category || 'all'

  // جلب الأخبار حسب التبويب المختار
  let query = supabase.from('news_feed').select('*').order('published_at', { ascending: false }).limit(50)
  
  if (activeCategory !== 'all') {
    query = query.contains('tabs', [activeCategory])
  }

  const { data: news } = await query
  
  // حساب العدادات
  const { data: allData } = await supabase.from('news_feed').select('tabs')
  const counts = {
    all: allData?.length || 0,
    banks: allData?.filter(n => n.tabs?.includes('banks')).length || 0,
    credit: allData?.filter(n => n.tabs?.includes('credit')).length || 0,
    warning: allData?.filter(n => n.tabs?.includes('warning')).length || 0,
    sectors: allData?.filter(n => n.tabs?.includes('sectors')).length || 0,
    fx: allData?.filter(n => n.tabs?.includes('fx')).length || 0,
    cbe: allData?.filter(n => n.tabs?.includes('cbe')).length || 0,
    global: allData?.filter(n => n.tabs?.includes('global')).length || 0,
  }

  return (
    <div className="flex min-h-screen bg-[#0d1117] text-white">
      <Sidebar activeCategory={activeCategory} />
      <div className="flex-1 flex flex-col">
        <TopBar stats={{ total_24h: counts.all }} sources={[]} />
        <MainTabs activeCategory={activeCategory} counts={counts} />
        <main className="p-4 overflow-y-auto">
          <NewsFeed initialNews={news || []} />
        </main>
      </div>
    </div>
  )
}
