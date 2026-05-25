'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, TrendingUp, Flame, Trophy, CheckCircle2,
  AlertTriangle, Users, Clock, ChevronRight, Bell, X,
} from 'lucide-react'
import { StatCard } from '@/components/dashboard/stat-card'
import { ProgressChart } from '@/components/dashboard/progress-chart'
import { SubjectCard } from '@/components/dashboard/subject-card'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { sendNotification } from '../actions'

const ICON_MAP: Record<string, any> = {
  BookOpen, TrendingUp, Flame, Trophy, Users, Clock, AlertTriangle,
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  ON_TRACK: { label: 'On Track', className: 'bg-success/10 text-success border-success/20' },
  LAGGING:  { label: 'Perlu Perhatian', className: 'bg-warning/10 text-warning border-warning/20' },
  AHEAD:    { label: 'Terdepan', className: 'bg-primary/10 text-primary border-primary/20' },
}

/* ──────────────────────────────────────────────
   STUDENT DASHBOARD
────────────────────────────────────────────── */
export function StudentDashboard({
  user, stats, chartData, subjects, recentActivities, targets, assignments = [],
}: any) {
  const [localTargets, setLocalTargets] = React.useState(targets)

  const toggleTarget = (id: string) =>
    setLocalTargets((prev: any) =>
      prev.map((t: any) => (t.id === id ? { ...t, done: !t.done } : t))
    )

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-heading-1 text-foreground">Selamat pagi, {user.name}!</h1>
        <p className="text-body text-muted-foreground mt-1">Terus semangat belajarnya hari ini.</p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat: any, i: number) => (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <StatCard {...stat} icon={ICON_MAP[stat.iconName] ?? BookOpen} />
          </motion.div>
        ))}
      </div>

      {/* Chart + Today Targets */}
      <div className="grid lg:grid-cols-3 gap-6">
        <ProgressChart data={chartData} className="lg:col-span-2" />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-3xl bg-card border border-border p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-heading-3 text-foreground">Target Hari Ini</h3>
              <p className="text-caption text-muted-foreground">
                {localTargets.filter((t: any) => t.done).length}/{localTargets.length} selesai
              </p>
            </div>
            <Button variant="ghost" size="sm">Tambah</Button>
          </div>
          <div className="space-y-3">
            {localTargets.map((t: any) => (
              <div key={t.id} className={cn('flex items-center gap-3 p-3 rounded-xl transition-colors', t.done ? 'bg-success/5' : 'bg-secondary hover:bg-secondary/80')}>
                <Checkbox checked={t.done} onCheckedChange={() => toggleTarget(t.id)} className="h-5 w-5 rounded-lg" />
                <div className="flex-1 min-w-0">
                  <p className={cn('text-body-sm font-medium truncate', t.done ? 'text-muted-foreground line-through' : 'text-foreground')}>{t.topic}</p>
                  <p className="text-caption text-muted-foreground">{t.subject}</p>
                </div>
                {t.done && <CheckCircle2 className="h-5 w-5 text-success shrink-0" />}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Subjects + Assignments + Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-heading-3 text-foreground">Progress Mata Pelajaran</h2>
              <Button variant="ghost" size="sm" asChild><a href="/dashboard/subjects">Lihat semua</a></Button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {subjects.map((s: any, i: number) => (
                <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <SubjectCard {...s} status={s.status.toLowerCase().replace('_', '-')} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Upcoming Assignments */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="rounded-3xl bg-card border border-border p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-heading-3 text-foreground">Tugas Mendatang</h2>
              <Button variant="ghost" size="sm" asChild><a href="/dashboard/assignments">Lihat semua</a></Button>
            </div>
            <div className="space-y-3">
              {assignments.length > 0 ? assignments.map((a: any) => {
                const daysLeft = Math.ceil((new Date(a.deadline).getTime() - Date.now()) / 86400000)
                const label = daysLeft === 0 ? 'Hari ini!' : daysLeft < 0 ? 'Terlewat' : `${daysLeft} hari lagi`
                return (
                  <div key={a.id} onClick={() => window.location.href = `/dashboard/assignments/${a.id}`}
                    className="flex items-center gap-4 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${a.subjectColor}20`, color: a.subjectColor }}>
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-body-sm font-medium text-foreground truncate">{a.title}</p>
                      <p className="text-caption text-muted-foreground">{a.subjectName}</p>
                    </div>
                    <Badge variant={daysLeft <= 2 ? 'destructive' : 'secondary'} className="text-caption shrink-0">{label}</Badge>
                  </div>
                )
              }) : (
                <p className="text-body-sm text-muted-foreground text-center py-4">Tidak ada tugas mendatang.</p>
              )}
            </div>
          </motion.div>
        </div>

        <div><RecentActivity activities={recentActivities} /></div>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────
   TEACHER DASHBOARD
────────────────────────────────────────────── */
export function TeacherDashboard({ user, stats, classStudents, laggingAlerts, recentLogs }: any) {
  const [notifModal, setNotifModal] = React.useState<{ id: string; name: string } | null>(null)
  const [notifMsg, setNotifMsg] = React.useState('')
  const [isSending, setIsSending] = React.useState(false)
  const [sentIds, setSentIds] = React.useState<string[]>([])

  const handleSendNotif = async () => {
    if (!notifModal || !notifMsg.trim()) return
    setIsSending(true)
    try {
      await sendNotification(notifModal.id, notifMsg)
      setSentIds(prev => [...prev, notifModal.id])
      setNotifModal(null)
      setNotifMsg('')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-heading-1 text-foreground">Selamat pagi, {user.name}!</h1>
        <p className="text-body text-muted-foreground mt-1">
          {laggingAlerts.length > 0
            ? `${laggingAlerts.length} siswa membutuhkan perhatian Anda hari ini.`
            : 'Semua siswa berstatus baik hari ini!'}
        </p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s: any, i: number) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <StatCard {...s} icon={ICON_MAP[s.iconName] ?? Users} />
          </motion.div>
        ))}
      </div>

      {/* Alert Panel */}
      {laggingAlerts.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="rounded-3xl bg-card border border-warning/30 p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="h-8 w-8 rounded-lg bg-warning/10 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-warning" />
            </div>
            <div>
              <h3 className="text-heading-3 text-foreground">Siswa Perlu Perhatian</h3>
              <p className="text-caption text-muted-foreground">{laggingAlerts.length} siswa</p>
            </div>
          </div>
          <div className="space-y-3">
            {laggingAlerts.map((alert: any) => (
              <div key={alert.id} className={cn('flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-2xl border',
                alert.severity === 'high' ? 'bg-destructive/5 border-destructive/20' : 'bg-warning/5 border-warning/20'
              )}>
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback className="bg-warning/10 text-warning text-caption font-semibold">
                    {alert.studentName?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-body-sm font-medium text-foreground">{alert.studentName}</p>
                  <p className="text-caption text-muted-foreground">{alert.issue} · {alert.subject}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="outline" asChild className="rounded-lg text-caption">
                    <a href={`/dashboard/siswa`}>Lihat Detail</a>
                  </Button>
                  {sentIds.includes(alert.id) ? (
                    <Badge variant="secondary" className="bg-success/10 text-success h-8 px-3">Terkirim ✓</Badge>
                  ) : (
                    <Button size="sm" className="rounded-lg text-caption" onClick={() => setNotifModal({ id: alert.id, name: alert.studentName })}>
                      <Bell className="w-3.5 h-3.5 mr-1.5" />Kirim Notifikasi
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Class Progress Table + Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 rounded-3xl bg-card border border-border overflow-hidden"
        >
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="text-heading-3 text-foreground">Progress Siswa</h3>
              <p className="text-caption text-muted-foreground">{classStudents.length} siswa</p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <a href="/dashboard/siswa">Lihat semua <ChevronRight className="h-4 w-4 ml-1" /></a>
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  {['Siswa', 'Progress', 'Terakhir Aktif', 'Status'].map(h => (
                    <th key={h} className="text-left py-3 px-6 text-caption font-semibold text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {classStudents.map((s: any) => {
                  const st = STATUS_CONFIG[s.status] ?? STATUS_CONFIG.ON_TRACK
                  return (
                    <tr key={s.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-caption font-medium">{s.avatar}</AvatarFallback>
                          </Avatar>
                          <span className="text-body-sm font-medium text-foreground">{s.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-2">
                          <Progress value={s.progress} className="w-20 h-1.5" />
                          <span className="text-caption font-mono">{s.progress}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-caption text-muted-foreground">{s.lastActive}</td>
                      <td className="py-3 px-6">
                        <Badge variant="outline" className={cn('text-[11px]', st.className)}>{st.label}</Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Recent Activity Feed */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="rounded-3xl bg-card border border-border p-6"
        >
          <h3 className="text-heading-3 text-foreground mb-5">Aktivitas Terbaru Siswa</h3>
          <div className="space-y-3">
            {recentLogs && recentLogs.length > 0 ? recentLogs.map((log: any) => (
              <div key={log.id} className="flex gap-3">
                <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ backgroundColor: log.color }} />
                <div className="min-w-0">
                  <p className="text-body-sm font-medium text-foreground truncate">{log.studentName}</p>
                  <p className="text-caption text-muted-foreground truncate">{log.subject} · {log.topic}</p>
                  <p className="text-[11px] text-muted-foreground/60">{log.timeAgo}</p>
                </div>
              </div>
            )) : (
              <p className="text-caption text-muted-foreground">Belum ada aktivitas siswa.</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Notification Modal */}
      <AnimatePresence>
        {notifModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => !isSending && setNotifModal(null)}
            />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-card border border-border rounded-3xl shadow-xl p-6"
            >
              <button onClick={() => setNotifModal(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-heading-3 text-foreground">Kirim Notifikasi</h3>
                  <p className="text-caption text-muted-foreground">Kepada: {notifModal.name}</p>
                </div>
              </div>
              <Textarea
                placeholder="Tulis pesan untuk siswa ini..."
                className="rounded-xl min-h-[120px] mb-4"
                value={notifMsg}
                onChange={e => setNotifMsg(e.target.value)}
                disabled={isSending}
              />
              <div className="flex gap-3 justify-end">
                <Button variant="ghost" onClick={() => setNotifModal(null)} disabled={isSending}>Batal</Button>
                <Button onClick={handleSendNotif} disabled={isSending || !notifMsg.trim()}>
                  {isSending ? 'Mengirim...' : 'Kirim'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
