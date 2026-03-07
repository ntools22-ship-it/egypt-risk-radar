'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Home, Building2, CreditCard, AlertTriangle, BarChart2, DollarSign, Globe, Landmark, ChevronDown, ChevronUp } from 'lucide-react'

const NAV = [
  { id: 'all', label: 'الكل', icon: Home },
  { 
    id: 'banks', label: 'أخبار البنوك', icon: Building2,
    subs: [{id: 'banks_gov', label: 'بنوك حكومية'}, {id: 'banks_private', label: 'بنوك خاصة'}]
  },
  { id: 'credit', label: 'تمويل وائتمان', icon: CreditCard },
  { id: 'warning', label: 'إنذار مبكر', icon: AlertTriangle, danger: true },
  { id: 'sectors', label: 'أخبار القطاعات', icon: BarChart2 },
  { id: 'fx', label: 'أسعار الصرف', icon: DollarSign },
  { id: 'cbe', label: 'أخبار المركزي', icon: Landmark },
  { id: 'global', label: 'عالمي', icon: Globe },
]

export function Sidebar({ activeCategory }: { activeCategory: string }) {
  const [openSub, setOpenSub] = useState<string | null>(null)

  return (
    <aside className="w-64 bg-[#0d1117] border-l border-gray-800 hidden lg:flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          رادار المخاطر
        </h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {NAV.map((item) => (
          <div key={item.id}>
            <Link
              href={item.id === 'all' ? '/' : `/?category=${item.id}`}
              className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                activeCategory === item.id 
                ? 'bg-blue-600/10 text-blue-400' 
                : 'text-gray-400 hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-5 h-5 ${item.danger ? 'text-red-500' : ''}`} />
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          </div>
        ))}
      </nav>
    </aside>
  )
}
