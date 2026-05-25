'use client'

import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useSWR from 'swr'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'
import { toast } from 'sonner'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function NotificationDropdown() {
  const { data: notifications, mutate } = useSWR('/api/notifications', fetcher, {
    refreshInterval: 10000, // Refresh every 10 seconds for real-time feel
  })

  // Provide fallback empty array if data isn't loaded or error
  const notifsList = Array.isArray(notifications) ? notifications : []
  const unreadCount = notifsList.filter((n: any) => !n.read).length || 0

  const markAsRead = async (id: string) => {
    try {
      // Optimistic UI update
      mutate(notifsList.map((n: any) => n.id === id ? { ...n, read: true } : n), false)
      await fetch(`/api/notifications`, { 
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      mutate()
    } catch (error) {
      console.error('Failed to mark as read', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      mutate(notifsList.map((n: any) => ({ ...n, read: true })), false)
      await fetch('/api/notifications', { method: 'PATCH' })
      mutate()
      toast.success('Semua notifikasi ditandai sudah dibaca')
    } catch (error) {
      toast.error('Gagal menandai semua notifikasi')
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative h-9 w-9 rounded-xl text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full ring-2 ring-[var(--topbar-bg)]" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-[var(--card)] border-[var(--border)] rounded-xl shadow-lg shadow-black/5 mr-2">
        <div className="flex items-center justify-between px-3 py-2">
          <DropdownMenuLabel className="text-sm text-[var(--foreground)] font-semibold p-0">Notifikasi</DropdownMenuLabel>
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="text-[11px] text-[#5483B3] hover:underline font-medium">
              Tandai semua dibaca
            </button>
          )}
        </div>
        <DropdownMenuSeparator className="bg-[var(--border)]" />
        <div className="max-h-[350px] overflow-y-auto py-1">
          {!notifications ? (
            <div className="p-4 text-center text-xs text-[var(--muted-foreground)]">Memuat...</div>
          ) : notifsList.length === 0 ? (
            <div className="p-4 text-center flex flex-col items-center justify-center gap-2">
              <Bell className="h-8 w-8 text-[var(--muted)] opacity-50" />
              <span className="text-xs text-[var(--muted-foreground)]">Belum ada notifikasi baru</span>
            </div>
          ) : (
            notifsList.map((notif: any) => (
              <div 
                key={notif.id} 
                className={`flex flex-col items-start gap-1 p-3 cursor-pointer hover:bg-[var(--muted)]/50 transition-colors ${!notif.read ? 'bg-[#5483B3]/5' : ''}`}
                onClick={() => {
                  if (!notif.read) markAsRead(notif.id)
                }}
              >
                <div className="flex items-start justify-between w-full">
                  <span className={`text-sm ${!notif.read ? 'font-semibold text-[var(--foreground)]' : 'font-medium text-[var(--foreground)]'}`}>
                    {notif.title}
                  </span>
                  {!notif.read && <span className="w-2 h-2 bg-[#5483B3] rounded-full mt-1.5 flex-shrink-0" />}
                </div>
                <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 leading-relaxed">
                  {notif.message}
                </p>
                <span className="text-[10px] text-[var(--muted-foreground)]/70 mt-1">
                  {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: id })}
                </span>
              </div>
            ))
          )}
        </div>
        <DropdownMenuSeparator className="bg-[var(--border)]" />
        <div className="p-2">
          <Button variant="outline" className="w-full text-xs h-8 rounded-lg border-[var(--border)] text-[var(--foreground)]">
            Lihat Semua Notifikasi
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
