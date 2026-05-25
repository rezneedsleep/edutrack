'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, Clock, BookOpen, Target, 
  CheckCircle2, Circle, Calendar, ArrowUpRight, 
  AlertCircle, ChevronRight, Star
} from 'lucide-react'
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts'
import { format, differenceInDays } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { useAppStore } from '@/store/useAppStore'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function StudentDashboard({ 
  userSubjects, 
  progressLogs, 
  todaySchedules, 
  upcomingAssignments,
  notifications
}: any) {
  const { user } = useAppStore()

  // Calculate Streak (Simulated for now based on logs)
  const streak = 5 // From seed

  // Calculate stats
  const totalSubjects = userSubjects.length
  const weeklyProgress = 65 // Simulated
  const ranking = 3 // Simulated

  const chartData = React.useMemo(() => {
    // Basic aggregation of logs for chart
    return progressLogs.map((log: any) => ({
      date: format(new Date(log.loggedAt), 'dd/MM'),
      duration: log.duration,
      subject: log.subjectId === 'IPAS' ? 'IPAS' : 'PAI' // Simple map
    }))
  }, [progressLogs])

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Selamat {new Date().getHours() < 12 ? 'Pagi' : new Date().getHours() < 18 ? 'Siang' : 'Malam'}, {user?.name}!
          </h1>
          <p className="text-white/50 text-lg mt-1">
            Streak belajarmu saat ini adalah <span className="text-primary font-bold">{streak} hari</span>. Pertahankan!
          </p>
        </div>
        <Button className="rounded-full px-6 bg-primary hover:bg-primary/90 h-12 text-lg font-semibold shadow-lg shadow-primary/20">
          <TrendingUp className="mr-2 h-5 w-5" /> Lihat Detail Progress
        </Button>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Mata Pelajaran', value: totalSubjects, icon: BookOpen, color: 'text-blue-400' },
          { label: 'Progress Minggu Ini', value: `${weeklyProgress}%`, icon: TrendingUp, color: 'text-green-400', trend: '+12% vs lalu' },
          { label: 'Streak Belajar', value: `${streak} Hari`, icon: ZapIcon, color: 'text-orange-400', trend: 'Rekor: 12 hari' },
          { label: 'Ranking Kelas', value: `#${ranking}`, icon: TrophyIcon, color: 'text-purple-400', trend: 'Naik dari #5' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-3xl bg-[#1C1C1E] border border-[#3A3A3C] relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <stat.icon className="h-16 w-16" />
            </div>
            <p className="text-xs font-medium text-white/40 uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
              {stat.trend && <span className="text-[10px] text-green-400 font-medium">{stat.trend}</span>}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <Card className="lg:col-span-2 p-8 rounded-3xl bg-[#1C1C1E] border-[#3A3A3C]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white">Aktivitas Belajar</h3>
            <div className="flex gap-2 p-1 bg-black/40 rounded-xl border border-white/5">
              {['1W', '1M', '3M', '1Y'].map(t => (
                <button key={t} className={cn("px-3 py-1 text-[10px] font-bold rounded-lg transition-all", t === '1W' ? "bg-primary text-white" : "text-white/30 hover:text-white")}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3A3A3C" vertical={false} />
                <XAxis dataKey="date" stroke="#8E8E93" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#8E8E93" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1C1C1E', borderColor: '#3A3A3C', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend />
                <Line type="monotone" dataKey="duration" name="Menit" stroke="#0A84FF" strokeWidth={3} dot={{ fill: '#0A84FF', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Target Hari Ini */}
        <Card className="p-8 rounded-3xl bg-[#1C1C1E] border-[#3A3A3C]">
          <h3 className="text-xl font-bold text-white mb-6">Target Hari Ini</h3>
          <div className="space-y-4">
            {todaySchedules.length > 0 ? todaySchedules.map((schedule: any) => (
              <div key={schedule.id} className="flex items-center gap-4 p-4 rounded-2xl bg-black/20 border border-white/5 group hover:border-primary/30 transition-all">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-primary opacity-20 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-semibold text-white truncate">{schedule.subject.name}</p>
                  <p className="text-xs text-white/40">{schedule.startTime} - {schedule.endTime} • {schedule.room}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white/20">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )) : (
              <div className="text-center py-10">
                <p className="text-white/30 text-sm italic">Tidak ada jadwal hari ini</p>
              </div>
            )}
          </div>
          <Button variant="outline" className="w-full mt-6 rounded-xl border-white/10 text-white/50 hover:bg-white/5">
            Lihat Kalender Lengkap
          </Button>
        </Card>
      </div>

      {/* Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userSubjects.map((us: any, i: number) => {
          const progress = Math.floor(Math.random() * 100) // Simulated
          const status = progress > 80 ? 'Ahead' : progress > 40 ? 'On Track' : 'Lagging'
          const color = us.subject.color
          return (
            <motion.div
              key={us.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-3xl bg-[#1C1C1E] border border-[#3A3A3C] hover:border-white/20 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: `${color}20` }}>
                  <BookOpen className="h-6 w-6" style={{ color }} />
                </div>
                <Badge className={cn("rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest", 
                  status === 'Ahead' ? "bg-green-500/20 text-green-400" : status === 'On Track' ? "bg-blue-500/20 text-blue-400" : "bg-orange-500/20 text-orange-400"
                )}>
                  {status}
                </Badge>
              </div>
              <h4 className="text-lg font-bold text-white mb-1">{us.subject.name}</h4>
              <p className="text-xs text-white/40 mb-4">{us.subject.teacher?.name || 'Guru'}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold text-white/40">
                  <span>Progress Belajar</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-1.5 bg-black/40" style={{ '--progress-foreground': color } as any} />
              </div>
              
              <div className="text-xs p-3 rounded-xl bg-black/20 text-white/60 flex items-center gap-2">
                <Target className="h-3 w-3 text-primary" />
                <span>Selanjutnya: {us.subject.topics?.[0]?.name || 'Topik Baru'}</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Assignments */}
      <Card className="p-8 rounded-3xl bg-[#1C1C1E] border-[#3A3A3C]">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-white">Tugas Mendatang</h3>
          <Link href="/dashboard/assignments" className="text-sm text-primary hover:underline">Semua Tugas →</Link>
        </div>
        <div className="space-y-2">
          {upcomingAssignments.map((as: any) => {
            const daysLeft = differenceInDays(new Date(as.deadline), new Date())
            const isSubmitted = as.submissions.length > 0
            return (
              <div key={as.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5 hover:border-white/10 transition-all gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: as.subject.color }} />
                  <div>
                    <h5 className="text-sm font-semibold text-white">{as.title}</h5>
                    <p className="text-[11px] text-white/40">{as.subject.name} • Pak {as.subject.teacherId === 'odang' ? 'Odang' : 'Samsu'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className={cn("text-[11px] font-bold uppercase tracking-widest", daysLeft <= 2 ? "text-red-400" : "text-white/40")}>
                      {daysLeft === 0 ? 'Hari Ini!' : `${daysLeft} Hari Lagi`}
                    </p>
                    <p className="text-[10px] text-white/30">{format(new Date(as.deadline), 'dd MMM yyyy')}</p>
                  </div>
                  <Badge variant={isSubmitted ? "success" : "secondary"} className="rounded-full px-4 h-8 flex items-center justify-center">
                    {isSubmitted ? 'Sudah Dikumpulkan' : 'Belum Selesai'}
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

function ZapIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
  )
}

function TrophyIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
