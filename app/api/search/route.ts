import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q')?.trim()
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = 20
  const offset = (page - 1) * limit

  if (!query || query.length < 2) {
    return NextResponse.json({ error: 'Query too short' }, { status: 400 })
  }

  const { data, error, count } = await supabase
    .from('news_feed')
    .select('*', { count: 'exact' })
    .or(`title.ilike.%${query}%,summary.ilike.%${query}%,title_ar.ilike.%${query}%,summary_ar.ilike.%${query}%`)
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const negative = data?.filter(i => i.sentiment === 'سلبي').length ?? 0
  const warnings = data?.filter(i => i.sentiment === 'تحذير').length ?? 0
  const positive = data?.filter(i => i.sentiment === 'إيجابي').length ?? 0

  return NextResponse.json({
    query,
    results: data ?? [],
    total: count ?? 0,
    page,
    stats: { negative, warnings, positive },
  })
}
