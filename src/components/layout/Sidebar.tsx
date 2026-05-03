'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard, Receipt, ShoppingCart,
  ShoppingBag, Fuel, X, Menu, ChevronRight,
  History, Users,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const NAV_ITEMS = [
  { href: '/dashboard',             label: 'Dashboard',    icon: LayoutDashboard, adminOnly: false },
  { href: '/dashboard/contas',      label: 'Contas',       icon: Receipt,         adminOnly: false },
  { href: '/dashboard/mercado',     label: 'Mercado',      icon: ShoppingCart,    adminOnly: false },
  { href: '/dashboard/compras',     label: 'Compras',      icon: ShoppingBag,     adminOnly: false },
  { href: '/dashboard/combustivel', label: 'Combustível',  icon: Fuel,            adminOnly: false },
  { href: '/dashboard/historico',   label: 'Histórico',    icon: History,         adminOnly: false },
  { href: '/dashboard/utilizadores',label: 'Utilizadores', icon: Users,           adminOnly: true  },
]

type Props = { role: 'ADMIN' | 'USER' }

export function Sidebar({ role }: Props) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const visibleItems = NAV_ITEMS.filter((item) => !item.adminOnly || role === 'ADMIN')

  const nav = (
    <nav className="flex flex-col gap-1 p-4">
      <div className="mb-6 px-2">
        <span className="text-green-600 font-bold text-lg tracking-tight">
          💰 CasaFinance
        </span>
        {role === 'ADMIN' && (
          <span className="ml-2 text-[10px] bg-green-100 text-green-700
                           px-1.5 py-0.5 rounded font-semibold uppercase tracking-wide">
            Admin
          </span>
        )}
      </div>

      {visibleItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
              'transition-all duration-150 group',
              active
                ? 'bg-green-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            )}
          >
            <Icon size={18} className={cn(active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600')} />
            <span>{label}</span>
            {active && <ChevronRight size={14} className="ml-auto opacity-60" />}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-slate-200"
        onClick={() => setOpen(true)}
      >
        <Menu size={20} />
      </button>

      {open && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="relative w-64 bg-white shadow-xl flex flex-col h-full">
            <button
              className="absolute top-4 right-4 p-1 rounded hover:bg-slate-100"
              onClick={() => setOpen(false)}
            >
              <X size={18} />
            </button>
            {nav}
          </aside>
        </div>
      )}

      <aside className="hidden md:flex w-56 lg:w-64 bg-white border-r border-slate-200 flex-col h-full shrink-0">
        {nav}
      </aside>
    </>
  )
}
