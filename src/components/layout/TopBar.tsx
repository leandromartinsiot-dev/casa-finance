'use client'

import { signOut } from '@/lib/auth/auth.service'
import { LogOut, User } from 'lucide-react'
import type { Profile } from '@/lib/types/domain.types'

export function TopBar({ profile }: { profile: Profile }) {
  return (
    <header className="h-14 bg-white border-b border-slate-200
                       flex items-center justify-between px-4 md:px-6 shrink-0">
      <div className="md:hidden w-8" />
      <div className="flex-1" />
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <User size={15} className="text-green-600" />
          </div>
          <span className="hidden sm:block font-medium">
            {profile.full_name ?? 'Utilizador'}
          </span>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="flex items-center gap-1.5 text-sm text-slate-500
                       hover:text-red-600 transition-colors px-2 py-1.5 rounded-md
                       hover:bg-red-50"
          >
            <LogOut size={15} />
            <span className="hidden sm:block">Sair</span>
          </button>
        </form>
      </div>
    </header>
  )
}
