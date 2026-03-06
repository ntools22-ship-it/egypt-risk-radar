import type { Metadata } from 'next'
import { Cairo } from 'next/font/google'
import './globals.css'

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-cairo',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'رادار المخاطر | Radar Al-Makhater',
  description: 'لوحة تحكم ذكية لمراقبة مخاطر الائتمان والأخبار المالية المصرية — للمحللين والمراجعين الائتمانيين',
  keywords: ['مخاطر ائتمانية', 'بنوك مصر', 'رادار المخاطر', 'Egypt banking risk', 'credit analysis'],
  openGraph: {
    title: 'رادار المخاطر — المنصة المصرفية المصرية',
    description: 'تتبع مخاطر الائتمان والأخبار المالية في مصر بشكل آني',
    locale: 'ar_EG',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0a0e1a" />
      </head>
      <body className={`${cairo.className} bg-radar-bg text-radar-text antialiased`}>
        {children}
      </body>
    </html>
  )
}
