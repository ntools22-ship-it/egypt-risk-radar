// Generates professional Arabic bank memo summaries

import type { NewsItem } from '@/types'

const RISK_LEVEL_MAP: Record<string, string> = {
  'حرج': 'بالغة الخطورة',
  'مرتفع': 'مرتفعة',
  'متوسط': 'متوسطة',
  'منخفض': 'منخفضة',
}

const RISK_TYPE_MAP: Record<string, string> = {
  'ائتماني': 'ائتمانية',
  'تشغيلي': 'تشغيلية',
  'كلي': 'اقتصادية كلية',
  'قانوني': 'قانونية',
}

export function generateMemo(item: NewsItem): string {
  const date = new Date(item.published_at).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const riskDesc = RISK_LEVEL_MAP[item.risk_level] ?? item.risk_level
  const riskTypeDesc = RISK_TYPE_MAP[item.risk_type] ?? item.risk_type
  const summary = item.summary_ar ?? item.summary

  const entityList = item.entities?.length
    ? `الجهة/الكيان المعني: ${item.entities.slice(0, 2).join('، ')}.`
    : ''

  return `📋 ملاحظة ائتمانية — رادار المخاطر المصري
─────────────────────────────
التاريخ: ${date}
المصدر: ${item.source_name}
القطاع: ${item.sector} | الصناعة: ${item.industry}
درجة المخاطرة: ${riskDesc} | النوع: ${riskTypeDesc}
─────────────────────────────
الموضوع: ${item.title_ar ?? item.title}

الملخص التنفيذي:
${summary.length > 300 ? summary.slice(0, 300) + '...' : summary}

${entityList}
التوصية: يُوصى بمراجعة ملف ${item.entities?.[0] ?? 'الجهة المعنية'} والتحقق من مدى تأثير هذا الحدث على محفظة الائتمان الحالية أو أي تعاملات مستقبلية.
─────────────────────────────
رادار المخاطر المصري | تم الإنشاء تلقائياً
`.trim()
}

export function generateBulkMemo(items: NewsItem[], searchTerm: string): string {
  const date = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })
  const negative = items.filter(i => i.sentiment === 'سلبي').length
  const warnings = items.filter(i => i.sentiment === 'تحذير').length
  const positive = items.filter(i => i.sentiment === 'إيجابي').length

  const topItems = items
    .filter(i => i.sentiment === 'سلبي' || i.sentiment === 'تحذير')
    .slice(0, 3)
    .map((item, idx) => {
      const d = new Date(item.published_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })
      return `${idx + 1}. [${d}] ${item.title_ar ?? item.title} — ${item.source_name}`
    })
    .join('\n')

  return `📊 تقرير بحث — رادار المخاطر المصري
─────────────────────────────
التاريخ: ${date}
كلمة البحث: ${searchTerm}
إجمالي الأخبار: ${items.length} خبر
─────────────────────────────
ملخص إحصائي:
• أخبار سلبية/مخاطر: ${negative}
• تحذيرات: ${warnings}
• أخبار إيجابية: ${positive}

أبرز الأخبار السلبية:
${topItems || 'لا توجد أخبار سلبية مسجلة.'}

─────────────────────────────
التوصية الائتمانية:
${negative >= 3 ? 'توجد مؤشرات مخاطر متعددة تستوجب مراجعة شاملة لملف الائتمان قبل أي قرار.' : negative >= 1 ? 'توجد إشارات تحذيرية، يُوصى بمتابعة الوضع وإخضاعه للمراقبة الدورية.' : 'لا توجد مؤشرات مخاطر ائتمانية ظاهرة في الفترة المرصودة.'}
─────────────────────────────
رادار المخاطر المصري | تم الإنشاء تلقائياً
`.trim()
}
