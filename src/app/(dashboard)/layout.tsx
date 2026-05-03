import { redirect } from 'next/navigation'
import { getCurrentProfile } from '@/lib/auth/auth.service'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const profile = await getCurrentProfile()
  if (!profile) redirect('/login')

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar role={profile.role as 'ADMIN' | 'USER'} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar profile={profile} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
