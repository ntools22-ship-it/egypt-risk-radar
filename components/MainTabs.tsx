'use client'
import Link from 'next/link'

interface Props {
  activeCategory: string
  counts: {
    all: number; banks: number; credit: number; warning: number
    sectors: number; fx: number; cbe: number; global: number
  }
}

const TABS = [
  { id: 'all',     label: 'الكل',                    key: 'all'     },
  { id: 'banks',   label: '🏦 أخبار البنوك',           key: 'banks'   },
  { id: 'credit',  label: '💰 تمويل وائتمان',          key: 'credit'  },
  { id: 'warning', label: '⚠️ إنذار مبكر',             key: 'warning', danger: true },
  { id: 'sectors', label: '🏗️ أخبار القطاعات',         key: 'sectors' },
  { id: 'fx',      label: '💵 أسعار الصرف',            key: 'fx'      },
  { id: 'cbe',     label: '🏛️ أخبار المركزي',          key: 'cbe'     },
  { id: 'global',  label: '🌍 عالمي',                key: 'global'  },
]

export function MainTabs({ activeCategory, counts }: Props) {
  return (
    <div className="bg-[#161b22] border-b border-gray-800 sticky top-0 z-10">
      <div className="flex overflow-x-auto no-scrollbar px-2">
        {TABS.map((tab) => (
          <Link
            key={tab.id}
            href={tab.id === 'all' ? '/' : `/?category=${tab.id}`}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
              activeCategory === tab.id
                ? tab.danger 
                  ? 'border-red-500 text-red-500' 
                  : 'border-blue-500 text-blue-500'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
            <span className={`px-1.5 py-0.5 rounded text-[10px] ${
              activeCategory === tab.id 
              ? tab.danger ? 'bg-red-500/20' : 'bg-blue-500/20' 
              : 'bg-gray-800'
            }`}>
              {counts[tab.key as keyof typeof counts] || 0}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
