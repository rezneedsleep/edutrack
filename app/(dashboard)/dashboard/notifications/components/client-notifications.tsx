'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Bell, Clock, Trophy, AlertCircle, Settings, CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { markNotificationAsRead, markAllNotificationsAsRead } from '../actions'
import { useRouter } from 'next/navigation'

const typeConfig: Record<string, any> = {
  reminder: { icon: Clock, label: 'Pengingat', color: 'text-primary bg-primary/10' },
  achievement: { icon: Trophy, label: 'Pencapaian', color: 'text-warning bg-warning/10' },
  alert: { icon: AlertCircle, label: 'Alert', color: 'text-destructive bg-destructive/10' },
  system: { icon: Settings, label: 'Sistem', color: 'text-muted-foreground bg-muted' },
}

function formatDate(date: Date): string {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 60) return `${minutes || 1} menit lalu`
  if (hours < 24) return `${hours} jam lalu`
  if (days < 7) return `${days} hari lalu`
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

export function NotificationsClient({ initialNotifications }: { initialNotifications: any[] }) {
  const router = useRouter()
  const [notifications, setLocalNotifications] = React.useState(initialNotifications)
  const [isUpdating, setIsUpdating] = React.useState(false)

  const handleMarkAsRead = async (id: string) => {
    setLocalNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    await markNotificationAsRead(id)
    router.refresh()
  }

  const handleMarkAllAsRead = async () => {
    setIsUpdating(true)
    setLocalNotifications(prev => prev.map(n => ({ ...n, read: true })))
    await markAllNotificationsAsRead()
    setIsUpdating(false)
    router.refresh()
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const filterNotifications = (type?: string) => {
    if (!type || type === 'all') return notifications
    return notifications.filter(n => n.type === type)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Bell className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-heading-1 text-foreground">Notifikasi</h1>
            <p className="text-body text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} notifikasi belum dibaca` : 'Semua notifikasi sudah dibaca'}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" className="rounded-xl" onClick={handleMarkAllAsRead} disabled={isUpdating}>
            <CheckCheck className="h-4 w-4 mr-2" /> Tandai Semua Dibaca
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-secondary rounded-xl p-1">
          <TabsTrigger value="all" className="rounded-lg">Semua</TabsTrigger>
          <TabsTrigger value="reminder" className="rounded-lg">Pengingat</TabsTrigger>
          <TabsTrigger value="achievement" className="rounded-lg">Pencapaian</TabsTrigger>
          <TabsTrigger value="alert" className="rounded-lg">Alert</TabsTrigger>
        </TabsList>

        {['all', 'reminder', 'achievement', 'alert'].map(tab => (
          <TabsContent key={tab} value={tab} className="mt-6">
            <div className="space-y-3">
              {filterNotifications(tab === 'all' ? undefined : tab).length > 0 ? (
                filterNotifications(tab === 'all' ? undefined : tab).map((notification, index) => {
                  const config = typeConfig[notification.type] || typeConfig.system
                  const Icon = config.icon

                  return (
                    <motion.button key={notification.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}
                      onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                      className={cn('w-full text-left rounded-3xl p-6 transition-colors', notification.read ? 'bg-card border border-border' : 'bg-primary/5 border border-primary/20')}
                    >
                      <div className="flex items-start gap-4">
                        <div className={cn('h-12 w-12 rounded-2xl flex items-center justify-center shrink-0', config.color)}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className={cn('text-body font-semibold', notification.read ? 'text-foreground' : 'text-primary')}>{notification.title}</p>
                              <p className="text-body-sm text-muted-foreground mt-1">{notification.message}</p>
                            </div>
                            {!notification.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />}
                          </div>
                          <p className="text-caption text-muted-foreground mt-3">{formatDate(notification.createdAt)}</p>
                        </div>
                      </div>
                    </motion.button>
                  )
                })
              ) : (
                <div className="text-center py-16 rounded-3xl bg-card border border-border">
                  <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-heading-3 text-foreground mb-2">Tidak ada notifikasi</h3>
                  <p className="text-body text-muted-foreground">Notifikasi baru akan muncul di sini</p>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
