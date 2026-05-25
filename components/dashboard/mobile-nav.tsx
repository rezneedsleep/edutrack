'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  TrendingUp,
  BookOpen,
  Trophy,
  User,
  Users,
  ClipboardList,
  Calendar,
  School,
  FileText,
  UserCheck
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'

const studentNavItems = [
  { href: '/dashboard', label: 'Beranda', icon: LayoutDashboard },
  { href: '/dashboard/progress', label: 'Progres', icon: TrendingUp },
  { href: '/dashboard/assignments', label: 'Tugas', icon: ClipboardList },
  { href: '/dashboard/leaderboard', label: 'Peringkat', icon: Trophy },
  { href: '/dashboard/settings', label: 'Profil', icon: User },
]

const teacherNavItems = [
  { href: '/dashboard', label: 'Beranda', icon: LayoutDashboard },
  { href: '/dashboard/siswa-guru', label: 'Siswa', icon: Users },
  { href: '/dashboard/tugas-guru', label: 'Tugas', icon: ClipboardList },
  { href: '/dashboard/schedule', label: 'Jadwal', icon: Calendar },
  { href: '/dashboard/settings', label: 'Profil', icon: User },
]

const adminNavItems = [
  { href: '/dashboard/admin', label: 'Beranda', icon: LayoutDashboard },
  { href: '/dashboard/admin/students', label: 'Siswa', icon: Users },
  { href: '/dashboard/admin/teachers', label: 'Guru', icon: UserCheck },
  { href: '/dashboard/admin/reports', label: 'Laporan', icon: FileText },
  { href: '/dashboard/admin/settings', label: 'Profil', icon: User },
]

const userNavItems = [
  { href: '/dashboard', label: 'Beranda', icon: LayoutDashboard },
  { href: '/dashboard/calendar', label: 'Kalender', icon: Calendar },
  { href: '/dashboard/settings', label: 'Profil', icon: User },
]

export function MobileNav() {
  const pathname = usePathname()
  const { user } = useAppStore()
  
  const navItems = 
    user?.role === 'ADMIN' ? adminNavItems : 
    user?.role === 'TEACHER' ? teacherNavItems : 
    user?.role === 'USER' ? userNavItems : 
    studentNavItems

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-[var(--border)] lg:hidden px-2 pb-safe">
      <div className="flex items-center justify-around h-16 relative">  
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && item.href !== '/dashboard/admin' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all relative z-10 rounded-2xl mx-0.5',
                isActive ? 'text-[#5483B3]' : 'text-[var(--muted-foreground)]'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-active"
                  className="absolute inset-x-2 top-1.5 bottom-1.5 bg-[#5483B3]/8 rounded-2xl -z-10"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                />
              )}
              <item.icon className={cn("h-5 w-5 transition-all duration-200", isActive && "scale-105")} />
              <span className={cn(
                "text-[10px] font-medium transition-all",
                isActive ? "opacity-100 font-semibold" : "opacity-60"
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
