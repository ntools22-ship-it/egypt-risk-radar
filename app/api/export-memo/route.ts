import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateMemo, generateBulkMemo } from '@/lib/memo'
import type { NewsItem } from '@/types'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const query = searchParams.get('q')

  if (id) {
    const { data, error } = await supabase
      .from('news_feed')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    const memo = generateMemo(data as NewsItem)
    return NextResponse.json({ memo })
  }

  if (query) {
    const { data } = await supabase
      .from('news_feed')
      .select('*')
      .or(`title.ilike.%${query}%,summary.ilike.%${query}%,title_ar.ilike.%${query}%`)
      .order('published_at', { ascending: false })
      .limit(50)

    const memo = generateBulkMemo((data ?? []) as NewsItem[], query)
    return NextResponse.json({ memo })
  }

  return NextResponse.json({ error: 'Provide id or q parameter' }, { status: 400 })
}
