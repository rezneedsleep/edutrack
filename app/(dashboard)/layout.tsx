'use client'

import { Sidebar } from '@/components/dashboard/sidebar'
import { Topbar } from '@/components/dashboard/topbar'
import { MobileNav } from '@/components/dashboard/mobile-nav'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="h-10 w-10 border-3 border-[#5483B3]/20 rounded-full" />
            <div className="absolute inset-0 h-10 w-10 border-3 border-[#5483B3] border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-sm text-[var(--muted-foreground)] font-medium">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-[var(--background)] overflow-x-hidden transition-colors duration-300">
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <div className="lg:pl-[256px] transition-all duration-300 min-h-screen flex flex-col">
        <Topbar />
        {session.user?.email === 'admin@demo.com' && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-3 sm:px-6 lg:px-8 flex items-center gap-3 text-amber-600 dark:text-amber-500/90 shrink-0">
            <AlertTriangle className="h-4 w-4 shrink-0 animate-pulse text-amber-500" />
            <p className="text-xs font-bold leading-relaxed">
              Mode Demo Admin (Read-Only): Anda masuk menggunakan akun demo. Seluruh fitur penambahan, pengeditan, dan penghapusan data dinonaktifkan untuk menjaga integritas database.
            </p>
          </div>
        )}
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-24 lg:pb-8">
          {children}
        </main>
        <MobileNav />
      </div>
    </div>
  )
}
