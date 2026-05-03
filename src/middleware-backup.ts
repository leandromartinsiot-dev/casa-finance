import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_ROUTES = [
  '/dashboard/contas/new',
  '/dashboard/contas/edit',
  '/dashboard/mercado/new',
  '/dashboard/combustivel/new',
  '/dashboard/compras',
  '/dashboard/utilizadores',
]

const PUBLIC_ROUTES = ['/login', '/auth/callback', '/']

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isPublicRoute = PUBLIC_ROUTES.some((r) => pathname.startsWith(r))

  if (!user && !isPublicRoute) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (user && pathname === '/login') {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = '/dashboard'
    return NextResponse.redirect(dashboardUrl)
  }

  const needsAdmin = ADMIN_ROUTES.some((r) => pathname.startsWith(r))
  if (user && needsAdmin) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'ADMIN') {
      const forbiddenUrl = request.nextUrl.clone()
      forbiddenUrl.pathname = '/dashboard'
      forbiddenUrl.searchParams.set('error', 'forbidden')
      return NextResponse.redirect(forbiddenUrl)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|webp)).*)',
  ],
}
