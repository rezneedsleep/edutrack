'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Bell, Search, User, LogOut, GraduationCap, Moon, Sun, LayoutDashboard, TrendingUp, ClipboardList, BookOpen, Calendar, FileBarChart, Trophy, Settings, Users, Megaphone, HelpCircle, UserCheck, MessageSquare, X, Menu } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NotificationDropdown } from "./notification-dropdown"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Sidebar } from "./sidebar"

// All searchable items
const searchableItems = [
  { label: 'Beranda', icon: LayoutDashboard, href: '/dashboard', keywords: ['home', 'beranda', 'dashboard'] },
  { label: 'Beranda Admin', icon: LayoutDashboard, href: '/dashboard/admin', keywords: ['admin', 'beranda admin'] },
  { label: 'Kelola Siswa', icon: Users, href: '/dashboard/admin/students', keywords: ['siswa', 'student', 'murid', 'kelola siswa'] },
  { label: 'Kelola Guru', icon: UserCheck, href: '/dashboard/admin/teachers', keywords: ['guru', 'teacher', 'pengajar', 'kelola guru'] },
  { label: 'Kelola Kelas', icon: GraduationCap, href: '/dashboard/admin/classes', keywords: ['kelas', 'class', 'kelola kelas'] },
  { label: 'Kelola Mapel', icon: BookOpen, href: '/dashboard/admin/subjects', keywords: ['mapel', 'mata pelajaran', 'subject'] },
  { label: 'Kelola Jadwal', icon: ClipboardList, href: '/dashboard/admin/schedules', keywords: ['jadwal', 'schedule'] },
  { label: 'Kalender', icon: Calendar, href: '/dashboard/calendar', keywords: ['kalender', 'calendar', 'tanggal', 'hari libur'] },
  { label: 'Pengumuman', icon: Megaphone, href: '/dashboard/admin/announcements', keywords: ['pengumuman', 'announcement'] },
  { label: 'Forum Diskusi', icon: MessageSquare, href: '/dashboard/discussions', keywords: ['forum', 'diskusi', 'discussion'] },
  { label: 'Laporan', icon: FileBarChart, href: '/dashboard/admin/reports', keywords: ['laporan', 'report'] },
  { label: 'Pengaturan', icon: Settings, href: '/dashboard/admin/settings', keywords: ['pengaturan', 'settings', 'setting'] },
  { label: 'Bantuan', icon: HelpCircle, href: '/dashboard/help', keywords: ['bantuan', 'help', 'faq'] },
  { label: 'Progres Saya', icon: TrendingUp, href: '/dashboard/progress', keywords: ['progres', 'progress', 'nilai'] },
  { label: 'Tugas', icon: ClipboardList, href: '/dashboard/assignments', keywords: ['tugas', 'assignment', 'pr'] },
  { label: 'Mata Pelajaran', icon: BookOpen, href: '/dashboard/subjects', keywords: ['mata pelajaran', 'mapel', 'subject'] },
  { label: 'Jadwal Kelas', icon: ClipboardList, href: '/dashboard/schedule', keywords: ['jadwal', 'schedule'] },
  { label: 'Peringkat', icon: Trophy, href: '/dashboard/leaderboard', keywords: ['peringkat', 'leaderboard', 'ranking'] },
  { label: 'Notifikasi', icon: Bell, href: '/dashboard/notifications', keywords: ['notifikasi', 'notification'] },
]

function getPageTitle(pathname: string): string {
  if (pathname === '/dashboard') return 'Beranda'
  if (pathname === '/dashboard/admin') return 'Beranda Admin'
  if (pathname.includes('/progress')) return 'Progres Saya'
  if (pathname.includes('/assignments')) return 'Tugas'
  if (pathname.includes('/subjects') || pathname.includes('/mapel')) return 'Mata Pelajaran'
  if (pathname.includes('/schedule')) return 'Jadwal'
  if (pathname.includes('/reports')) return 'Laporan'
  if (pathname.includes('/leaderboard')) return 'Peringkat'
  if (pathname.includes('/notifications')) return 'Notifikasi'
  if (pathname.includes('/settings')) return 'Pengaturan'
  if (pathname.includes('/help')) return 'Pusat Bantuan'
  if (pathname.includes('/users/students') || pathname.includes('/siswa')) return 'Data Siswa'
  if (pathname.includes('/users/teachers')) return 'Data Guru'
  if (pathname.includes('/classes')) return 'Kelola Kelas'
  if (pathname.includes('/announcements')) return 'Pengumuman'
  if (pathname.includes('/materi')) return 'Materi'
  if (pathname.includes('/tugas')) return 'Tugas'
  if (pathname.includes('/calendar')) return 'Kalender'
  if (pathname.includes('/discussions')) return 'Forum Diskusi'
  if (pathname.includes('/students')) return 'Kelola Siswa'
  if (pathname.includes('/teachers')) return 'Kelola Guru'
  return 'Beranda'
}

export function Topbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const pageTitle = getPageTitle(pathname)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const today = new Date()
  const dateStr = today.toLocaleDateString('id-ID', { 
    weekday: 'long',
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  })

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    const query = searchQuery.toLowerCase()
    return searchableItems.filter(item => 
      item.label.toLowerCase().includes(query) || 
      item.keywords.some(kw => kw.includes(query))
    ).slice(0, 8)
  }, [searchQuery])

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard shortcut ⌘K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        setIsSearchFocused(true)
      }
      if (e.key === 'Escape') {
        setIsSearchFocused(false)
        inputRef.current?.blur()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSelectResult = (href: string) => {
    setSearchQuery('')
    setIsSearchFocused(false)
    router.push(href)
  }

  return (
    <header className="h-16 bg-[var(--topbar-bg)] border-b border-[var(--border)] px-4 md:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-40 transition-colors duration-300">
      {/* Mobile Logo & Hamburger Menu */}
      <div className="flex items-center gap-3 lg:hidden">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] rounded-xl">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[256px] bg-[var(--sidebar-bg)] border-r border-[var(--border)]">
            <SheetTitle className="sr-only">Navigasi Sidebar</SheetTitle>
            <SheetDescription className="sr-only">Menu navigasi platform EduTrack</SheetDescription>
            <Sidebar isMobile onClose={() => setIsMobileMenuOpen(false)} />
          </SheetContent>
        </Sheet>
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="EduTrack Logo"
            width={120}
            height={28}
            className="h-7 w-auto"
          />
        </Link>
      </div>

      {/* Page Title & Date - Desktop */}
      <div className="hidden lg:flex flex-col">
        <div className="flex items-center gap-2">
          <h1 className="text-base font-semibold text-[var(--foreground)]">{pageTitle}</h1>
        </div>
        <p className="text-xs text-[var(--muted-foreground)]">{dateStr}</p>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0 relative z-50">
        {/* Search with Dropdown */}
        <div className="hidden md:block relative" ref={searchRef}>
          <div className="relative w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
            <Input 
              ref={inputRef}
              placeholder="Cari menu, siswa, guru..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setIsSearchFocused(true) }}
              onFocus={() => setIsSearchFocused(true)}
              className="bg-[var(--muted)] border-[var(--border)] focus:ring-2 focus:ring-[#5483B3]/30 focus:border-[#5483B3]/40 pl-10 pr-14 h-10 text-sm rounded-xl transition-all placeholder:text-[var(--muted-foreground)]/60"
            />
            {searchQuery ? (
              <button 
                onClick={() => { setSearchQuery(''); inputRef.current?.focus() }} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            ) : (
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden lg:inline-flex h-5 select-none items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--card)] px-1.5 font-mono text-[10px] font-medium text-[var(--muted-foreground)]">
                ⌘K
              </kbd>
            )}
          </div>

          {/* Search Dropdown */}
          {isSearchFocused && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-xl shadow-black/10 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {searchResults.length > 0 ? (
                <div className="py-2">
                  <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                    Hasil Pencarian
                  </p>
                  {searchResults.map((item) => (
                    <button
                      key={item.href}
                      onClick={() => handleSelectResult(item.href)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--muted)] transition-colors text-left group"
                    >
                      <div className="h-8 w-8 rounded-lg bg-[#5483B3]/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="h-4 w-4 text-[#5483B3]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--foreground)] group-hover:text-[#5483B3] transition-colors">{item.label}</p>
                        <p className="text-[10px] text-[var(--muted-foreground)] truncate">{item.href}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center">
                  <Search className="h-8 w-8 text-[var(--muted-foreground)] opacity-30 mx-auto mb-2" />
                  <p className="text-sm font-medium text-[var(--muted-foreground)]">Tidak ditemukan</p>
                  <p className="text-xs text-[var(--muted-foreground)]/70 mt-0.5">Coba kata kunci lain</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notifications */}
        <NotificationDropdown />

        {/* Divider */}
        <div className="h-8 w-px bg-[var(--border)] hidden sm:block mx-1" />

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 hover:opacity-80 transition-opacity rounded-xl p-1.5 pr-3 hover:bg-[var(--muted)]">
              <Avatar className="h-8 w-8 rounded-full ring-2 ring-[var(--border)]">
                <AvatarImage src={(session?.user as any)?.image} />
                <AvatarFallback className="bg-[#5483B3]/10 text-[#5483B3] font-semibold text-xs rounded-full">
                  {session?.user?.name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden sm:block">
                <p className="text-[13px] font-semibold text-[var(--foreground)] leading-tight">{session?.user?.name}</p>
                <p className="text-[10px] text-[var(--muted-foreground)] capitalize">{(session?.user as any)?.role?.toLowerCase()}</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[var(--card)] border-[var(--border)] rounded-xl shadow-lg shadow-black/5">
            <DropdownMenuLabel className="text-xs text-[var(--muted-foreground)] font-medium">Akun Saya</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[var(--border)]" />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="cursor-pointer py-2.5 rounded-lg text-[var(--foreground)]">
                <User className="mr-2 h-4 w-4" />
                <span className="text-sm font-medium">Profil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="cursor-pointer py-2.5 rounded-lg text-[#EF4444] focus:text-[#EF4444]"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span className="text-sm font-medium">Keluar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
