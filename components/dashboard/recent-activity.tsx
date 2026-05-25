'use client'

import * as React from 'react'
import { Clock, BookOpen } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface ActivityItem {
  id: string
  subject: string
  topic: string
  duration: number
  date: Date
  color: string
}

interface RecentActivityProps {
  activities: ActivityItem[]
  className?: string
}

function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} menit`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours} jam ${mins} menit` : `${hours} jam`
}

function formatDate(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) {
    return 'Hari ini'
  } else if (days === 1) {
    return 'Kemarin'
  } else if (days < 7) {
    return `${days} hari lalu`
  } else {
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
    })
  }
}

export function RecentActivity({ activities, className }: RecentActivityProps) {
  return (
    <div
      className={cn(
        'rounded-3xl bg-card border border-border p-6',
        className
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-heading-3 text-foreground">Aktivitas Terakhir</h3>
          <p className="text-caption text-muted-foreground">
            Riwayat belajarmu
          </p>
        </div>
      </div>

      <ScrollArea className="h-[300px] pr-4">
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 relative"
              >
                {/* Timeline line */}
                {index < activities.length - 1 && (
                  <div className="absolute left-5 top-12 w-px h-[calc(100%-12px)] bg-border" />
                )}

                {/* Icon */}
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${activity.color}20` }}
                >
                  <BookOpen
                    className="h-5 w-5"
                    style={{ color: activity.color }}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-body-sm font-medium text-foreground">
                        {activity.subject}
                      </p>
                      <p className="text-caption text-muted-foreground truncate">
                        {activity.topic}
                      </p>
                    </div>
                    <span className="text-caption text-muted-foreground whitespace-nowrap">
                      {formatDate(activity.date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-caption text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatDuration(activity.duration)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-body-sm text-muted-foreground">
              Belum ada aktivitas
            </p>
            <p className="text-caption text-muted-foreground">
              Mulai log belajarmu sekarang!
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
