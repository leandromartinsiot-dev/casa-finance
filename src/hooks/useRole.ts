'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { UserRole } from '@/lib/types/domain.types'

type RoleState = {
  role: UserRole | null
  isAdmin: boolean
  isLoading: boolean
}

export function useRole(): RoleState {
  const [state, setState] = useState<RoleState>({
    role: null,
    isAdmin: false,
    isLoading: true,
  })

  useEffect(() => {
    const supabase = createClient()

    async function fetchRole() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setState({ role: null, isAdmin: false, isLoading: false })
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      const role = (profile?.role as UserRole) ?? 'USER'
      setState({ role, isAdmin: role === 'ADMIN', isLoading: false })
    }

    fetchRole()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchRole()
    })

    return () => subscription.unsubscribe()
  }, [])

  return state
}
