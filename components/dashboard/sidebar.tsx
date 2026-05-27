'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  TrendingUp, 
  ClipboardList, 
  BookOpen, 
  Calendar, 
  FileBarChart, 
  Trophy, 
  Bell, 
  Settings, 
  Users, 
  GraduationCap, 
  Megaphone,
  HelpCircle,
  LogOut,
  UserCheck,
  ChevronRight,
  MessageSquare
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const sidebarLinks = {
  STUDENT: [
    { label: 'Beranda', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Progres Saya', icon: TrendingUp, href: '/dashboard/progress' },
    { label: 'Tugas', icon: ClipboardList, href: '/dashboard/assignments' },
    { label: 'Ujian Online', icon: ClipboardList, href: '/dashboard/student/exams' },
    { label: 'Mata Pelajaran', icon: BookOpen, href: '/dashboard/subjects' },
    { label: 'Forum Diskusi', icon: MessageSquare, href: '/dashboard/discussions' },
    { label: 'Jadwal Kelas', icon: ClipboardList, href: '/dashboard/schedule' },
    { label: 'Kalender', icon: Calendar, href: '/dashboard/calendar' },
    { label: 'Laporan', icon: FileBarChart, href: '/dashboard/reports' },
    { label: 'Peringkat', icon: Trophy, href: '/dashboard/leaderboard' },
    { label: 'Notifikasi', icon: Bell, href: '/dashboard/notifications' },
    { label: 'Bantuan', icon: HelpCircle, href: '/dashboard/help' },
    { label: 'Pengaturan', icon: Settings, href: '/dashboard/settings' },
  ],
  TEACHER: [
    { label: 'Beranda', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Kelola Kelas', icon: GraduationCap, href: '/dashboard/admin/classes' },
    { label: 'Materi Saya', icon: BookOpen, href: '/dashboard/materi' },
    { label: 'Kelola Materi', icon: ClipboardList, href: '/dashboard/kelola-materi' },
    { label: 'Kelola Tugas', icon: ClipboardList, href: '/dashboard/kelola-tugas' },
    { label: 'Kelola Ujian', icon: ClipboardList, href: '/dashboard/teacher/exams' },
    { label: 'Ekskul Saya', icon: Trophy, href: '/dashboard/ekskul-guru' },
    { label: 'Forum Diskusi', icon: MessageSquare, href: '/dashboard/discussions' },
    { label: 'Data Siswa', icon: Users, href: '/dashboard/siswa-guru' },
    { label: 'Jadwal Kelas', icon: ClipboardList, href: '/dashboard/schedule' },
    { label: 'Kalender', icon: Calendar, href: '/dashboard/calendar' },
    { label: 'Laporan', icon: FileBarChart, href: '/dashboard/reports' },
    { label: 'Notifikasi', icon: Bell, href: '/dashboard/notifications' },
    { label: 'Bantuan', icon: HelpCircle, href: '/dashboard/help' },
    { label: 'Pengaturan', icon: Settings, href: '/dashboard/settings' },
  ],
  ADMIN: [
    { label: 'Beranda', icon: LayoutDashboard, href: '/dashboard/admin' },
    { label: 'Kelola Pengguna', icon: Users, href: '/dashboard/admin/users' },
    { label: 'Kelola Kelas', icon: GraduationCap, href: '/dashboard/admin/classes' },
    { label: 'Kelola Mapel', icon: BookOpen, href: '/dashboard/admin/subjects' },
    { label: 'Kelola Materi', icon: ClipboardList, href: '/dashboard/kelola-materi' },
    { label: 'Kelola Tugas', icon: ClipboardList, href: '/dashboard/kelola-tugas' },
    { label: 'Kelola Ekskul', icon: Trophy, href: '/dashboard/admin/extracurriculars' },
    { label: 'Kelola Jadwal', icon: ClipboardList, href: '/dashboard/admin/schedules' },
    { label: 'Kalender', icon: Calendar, href: '/dashboard/calendar' },
    { label: 'Pengumuman', icon: Megaphone, href: '/dashboard/admin/announcements' },
    { label: 'Forum Diskusi', icon: MessageSquare, href: '/dashboard/discussions' },
    { label: 'Laporan', icon: FileBarChart, href: '/dashboard/admin/reports' },
    { label: 'Bantuan', icon: HelpCircle, href: '/dashboard/help' },
    { label: 'Pengaturan', icon: Settings, href: '/dashboard/admin/settings' },
  ],
  COACH: [
    { label: 'Beranda', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Ekskul Saya', icon: Trophy, href: '/dashboard/ekskul-guru' },
    { label: 'Forum Diskusi', icon: MessageSquare, href: '/dashboard/discussions' },
    { label: 'Kalender', icon: Calendar, href: '/dashboard/calendar' },
    { label: 'Notifikasi', icon: Bell, href: '/dashboard/notifications' },
    { label: 'Bantuan', icon: HelpCircle, href: '/dashboard/help' },
    { label: 'Pengaturan', icon: Settings, href: '/dashboard/settings' },
  ],
  USER: [
    { label: 'Beranda', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Kalender', icon: Calendar, href: '/dashboard/calendar' },
    { label: 'Notifikasi', icon: Bell, href: '/dashboard/notifications' },
    { label: 'Bantuan', icon: HelpCircle, href: '/dashboard/help' },
    { label: 'Pengaturan', icon: Settings, href: '/dashboard/settings' },
  ]
}

interface SidebarProps {
  isMobile?: boolean
  onClose?: () => void
}

export function Sidebar({ isMobile, onClose }: SidebarProps = {}) {
  const { data: session } = useSession()
  const pathname = usePathname()
  
  const rawRole = (session?.user as any)?.role || 'USER'
  const role = (rawRole in sidebarLinks) ? (rawRole as keyof typeof sidebarLinks) : 'USER'
  const links = sidebarLinks[role]

  const mainLinks = links.slice(0, -2)
  const bottomLinks = links.slice(-2)

  return (
    <aside className={cn(
      "flex flex-col transition-colors duration-300 h-full w-full",
      isMobile 
        ? "bg-[var(--sidebar-bg)]" 
        : "fixed left-0 top-0 h-screen w-[256px] bg-[var(--sidebar-bg)] border-r border-[var(--border)] z-50 hidden lg:flex"
    )}>
      {/* Logo */}
      <div className="px-5 py-6 flex items-center justify-between">
        <Link 
          href="/" 
          onClick={() => {
            if (isMobile) setTimeout(() => onClose?.(), 100)
          }} 
          className="flex items-center gap-2.5"
        >
          <Image
            src="/logo.png"
            alt="EduTrack Logo"
            width={140}
            height={36}
            className="h-9 w-auto"
            priority
          />
        </Link>
      </div>

      {/* Label */}
      <div className="px-5 pt-2 pb-3">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">Menu</span>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto scrollbar-hide">
        {mainLinks.map((link) => {
          const isActive = pathname === link.href || 
            (link.href !== '/dashboard' && link.href !== '/dashboard/admin' && pathname.startsWith(link.href + '/')) ||
            (link.href === '/dashboard' && pathname === '/dashboard') ||
            (link.href === '/dashboard/admin' && pathname === '/dashboard/admin')
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => {
                if (isMobile) setTimeout(() => onClose?.(), 100)
              }}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative text-[13px] font-medium",
                isActive 
                  ? "bg-[#5483B3]/10 text-[#5483B3] font-semibold" 
                  : "text-[var(--muted-foreground)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--foreground)]"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#5483B3] rounded-r-full" />
              )}
              <link.icon className={cn(
                "h-[18px] w-[18px] flex-shrink-0 transition-colors",
                isActive ? "text-[#5483B3]" : "text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]"
              )} />
              <span>{link.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Divider */}
      <div className="mx-5 border-t border-[var(--border)]" />

      {/* Bottom Section */}
      <div className="px-3 py-2 space-y-0.5">
        {bottomLinks.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => {
                if (isMobile) setTimeout(() => onClose?.(), 100)
              }}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group text-[13px] font-medium",
                isActive 
                  ? "bg-[#5483B3]/10 text-[#5483B3] font-semibold" 
                  : "text-[var(--muted-foreground)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--foreground)]"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#5483B3] rounded-r-full" />
              )}
              <link.icon className={cn(
                "h-[18px] w-[18px] flex-shrink-0",
                isActive ? "text-[#5483B3]" : ""
              )} />
              <span>{link.label}</span>
            </Link>
          )
        })}

        {/* Sign Out */}
        <button
          onClick={() => {
            if (isMobile) {
              setTimeout(() => onClose?.(), 100)
            } else {
              onClose?.()
            }
            signOut({ callbackUrl: '/login' })
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[var(--muted-foreground)] hover:text-[#EF4444] hover:bg-[#EF4444]/5 transition-all duration-200 group text-[13px] font-medium"
        >
          <LogOut className="h-[18px] w-[18px] group-hover:-translate-x-0.5 transition-transform flex-shrink-0" />
          <span>Keluar</span>
        </button>
      </div>

      {/* User Info Footer */}
      <div className="px-3 py-4 border-t border-[var(--border)]">
        <div className="flex items-center gap-3 px-2">
          <Avatar className="h-9 w-9 rounded-full ring-2 ring-[var(--border)]">
            <AvatarImage src={(session?.user as any)?.image} />
            <AvatarFallback className="bg-[#5483B3]/10 text-[#5483B3] font-semibold text-sm rounded-full">
              {session?.user?.name?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-[var(--foreground)] truncate">{session?.user?.name}</p>
            <p className="text-[11px] text-[var(--muted-foreground)] capitalize">{(session?.user as any)?.role?.toLowerCase()}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
