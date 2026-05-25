'use client'

import { motion } from 'framer-motion'
import { 
  BookOpen, 
  TrendingUp, 
  Trophy, 
  Zap, 
  Clock, 
  Calendar,
  ChevronRight,
  ArrowUpRight,
  Flame,
  CheckCircle2,
  Copy
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

const DONUT_COLORS = ['#5483B3', '#E2E8F0']

export function StudentDashboard({ user, subjects, recentLogs, assignments, allSubmissions }: any) {
  // 1. Calculate Total Minutes
  const totalMinutes = recentLogs?.reduce((acc: number, log: any) => acc + (log.duration || 0), 0) || 0
  
  // 2. Calculate Streak
  const calculateStreak = () => {
    if (!recentLogs || recentLogs.length === 0) return 0
    const dates = Array.from(new Set(recentLogs.map((log: any) => 
      new Date(log.loggedAt).toDateString()
    ))).map(d => new Date(d as string))
    
    dates.sort((a, b) => b.getTime() - a.getTime())
    
    let streak = 0
    let today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Check if latest log is today or yesterday
    const latest = dates[0]
    const diff = (today.getTime() - latest.getTime()) / (1000 * 60 * 60 * 24)
    
    if (diff > 1) return 0 // Streak broken

    for (let i = 0; i < dates.length; i++) {
      if (i === 0) {
        streak++
        continue
      }
      const prev = dates[i-1]
      const curr = dates[i]
      const dayDiff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24)
      if (dayDiff === 1) {
        streak++
      } else {
        break
      }
    }
    return streak
  }
  const streak = calculateStreak()

  // 3. Prepare Weekly Chart Data
  const getWeeklyData = () => {
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
    const last7Days: any[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      last7Days.push({
        fullDate: d.toDateString(),
        day: days[d.getDay()],
        hours: 0
      })
    }

    recentLogs?.forEach((log: any) => {
      const logDate = new Date(log.loggedAt).toDateString()
      const dayData = last7Days.find(d => d.fullDate === logDate)
      if (dayData) {
        dayData.hours += (log.duration || 0) / 60 // Convert to hours
      }
    })

    return last7Days.map(d => ({ day: d.day, hours: Number(d.hours.toFixed(1)) }))
  }
  const weeklyChartData = getWeeklyData()
  const totalWeeklyHours = weeklyChartData.reduce((acc, d) => acc + (Number(d.hours) || 0), 0).toFixed(1)

  // 4. Calculate Subject Progress
  const getSubjectStats = (userSubject: any) => {
    const totalTopics = userSubject.subject.topics?.length || 0
    if (totalTopics === 0) return { percent: 0, completed: 0, total: 0 }
    
    const subjectTopics = userSubject.subject.topics.map((t: any) => t.id)
    const completedTopics = new Set(
      recentLogs
        ?.filter((log: any) => subjectTopics.includes(log.topicId))
        .map((log: any) => log.topicId)
    ).size

    return {
      percent: Math.round((completedTopics / totalTopics) * 100),
      completed: completedTopics,
      total: totalTopics
    }
  }

  // Donut chart data
  const submittedCount = allSubmissions?.length || 0
  const pendingCount = assignments?.filter((a: any) => !a.submissions?.length)?.length || 0
  const donutData = [
    { name: 'Selesai', value: submittedCount || 1 },
    { name: 'Belum', value: pendingCount || 1 },
  ]

  const statCards = [
    { 
      label: 'Total Mapel', 
      value: subjects?.length || 0, 
      icon: BookOpen, 
      trend: subjects?.length > 0 ? `${subjects.length} aktif` : '0 aktif',
      trendUp: true,
      color: '#5483B3',
      bgColor: 'rgba(84, 131, 179, 0.08)'
    },
    { 
      label: 'Menit Belajar', 
      value: totalMinutes.toLocaleString(), 
      icon: Clock, 
      trend: 'total semua',
      trendUp: true,
      color: '#22C55E',
      bgColor: 'rgba(34, 197, 94, 0.08)'
    },
    { 
      label: 'Streak Belajar', 
      value: streak, 
      icon: Flame, 
      trend: streak > 5 ? 'Luar biasa!' : streak > 0 ? 'Ayo lanjutkan!' : 'Mulai belajar!',
      trendUp: streak > 0,
      color: '#F59E0B',
      bgColor: 'rgba(245, 158, 11, 0.08)'
    },
    { 
      label: 'Tugas Selesai', 
      value: allSubmissions?.length || 0, 
      icon: CheckCircle2, 
      trend: 'dikumpulkan',
      trendUp: true,
      color: '#8B5CF6',
      bgColor: 'rgba(139, 92, 246, 0.08)'
    },
  ]

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 className="text-xl font-bold text-[var(--foreground)]">
          Halo, {user?.name?.split(' ')[0] || 'Siswa'} 👋
        </h2>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Berikut rangkuman aktivitas belajarmu.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
          >
            <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl hover:shadow-md hover:shadow-black/5 transition-all duration-300">
              <CardContent className="p-4 md:p-5">
                <div className="flex justify-between items-start mb-3">
                  <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: stat.bgColor }}>
                    <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] tracking-tight">{stat.value}</h3>
                  <p className="text-[11px] font-medium text-[var(--muted-foreground)] mt-1 uppercase tracking-wide">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Weekly Activity Bar Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-sm font-semibold text-[var(--foreground)]">Aktivitas Belajar</CardTitle>
                  <p className="text-xs text-[var(--muted-foreground)] mt-0.5">7 hari terakhir</p>
                </div>
                <div className="flex items-center gap-1.5 bg-[var(--muted)] px-3 py-1.5 rounded-lg">
                  <span className="text-lg font-bold text-[var(--foreground)]">{totalWeeklyHours}</span>
                  <span className="text-[11px] text-[var(--muted-foreground)]">jam</span>
                </div>
              </CardHeader>
              <CardContent className="h-[260px] pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyChartData} barSize={28}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis 
                      dataKey="day" 
                      stroke="var(--muted-foreground)" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                      fontWeight={500}
                    />
                    <YAxis 
                      stroke="var(--muted-foreground)" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                      fontWeight={500}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--card)', 
                        border: '1px solid var(--border)', 
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        fontSize: '13px'
                      }}
                      cursor={{ fill: 'var(--muted)', radius: 8 }}
                    />
                    <Bar 
                      dataKey="hours" 
                      fill="#5483B3" 
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Subject Progress Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {subjects?.slice(0, 4).map((sub: any, i: number) => {
              const stats = getSubjectStats(sub)
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.06 }}
                >
                  <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl hover:shadow-md hover:shadow-black/5 transition-all duration-300">
                    <CardContent className="p-4 md:p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${sub.subject.color}12` }}>
                            <BookOpen className="h-4 w-4" style={{ color: sub.subject.color }} />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-[var(--foreground)]">{sub.subject.name}</h4>
                            <p className="text-[11px] text-[var(--muted-foreground)]">{stats.completed}/{stats.total} topik</p>
                          </div>
                        </div>
                        <span className="text-sm font-bold" style={{ color: sub.subject.color }}>{stats.percent}%</span>
                      </div>
                      <div className="w-full bg-[var(--muted)] rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500 ease-out" 
                          style={{ width: `${stats.percent}%`, backgroundColor: sub.subject.color }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4 md:space-y-6">
          {/* Donut Chart - Tugas Overview */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-[var(--foreground)]">Ringkasan Tugas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[180px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={donutData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {donutData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-[var(--foreground)]">{submittedCount}</p>
                      <p className="text-[10px] text-[var(--muted-foreground)]">Selesai</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center gap-6 mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#5483B3]" />
                    <span className="text-xs text-[var(--muted-foreground)]">Selesai ({submittedCount})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#E2E8F0]" />
                    <span className="text-xs text-[var(--muted-foreground)]">Belum ({pendingCount})</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Upcoming Assignments */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-[var(--foreground)]">Tugas Mendatang</CardTitle>
                  <Link href="/dashboard/assignments" className="text-xs text-[#5483B3] font-medium hover:underline flex items-center gap-1">
                    Semua <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {assignments?.length > 0 ? assignments.slice(0, 4).map((as: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--muted)] hover:bg-[var(--sidebar-hover)] transition-all group cursor-pointer">
                    <div className="h-10 w-10 rounded-xl bg-[var(--card)] flex flex-col items-center justify-center border border-[var(--border)] shrink-0">
                      <span className="text-[9px] font-semibold uppercase text-[var(--muted-foreground)] leading-tight">
                        {new Date(as.deadline).toLocaleDateString('id-ID', { month: 'short' })}
                      </span>
                      <span className="text-sm font-bold text-[var(--foreground)] leading-tight">
                        {new Date(as.deadline).getDate()}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h5 className="text-sm font-medium text-[var(--foreground)] truncate group-hover:text-[#5483B3] transition-colors">
                        {as.title}
                      </h5>
                      <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">{as.subject.name}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <CheckCircle2 className="h-8 w-8 text-[#22C55E] mx-auto mb-2" />
                    <p className="text-sm text-[var(--muted-foreground)]">Tidak ada tugas baru 🎉</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* CTA Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-gradient-to-br from-[#5483B3] to-[#3B6FA0] text-white rounded-2xl border-none overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              <CardContent className="p-5 relative z-10">
                <div className="h-9 w-9 rounded-xl bg-white/15 flex items-center justify-center mb-3">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-base font-bold mb-1.5 leading-tight">Mulai Sesi Belajar</h3>
                <p className="text-white/70 text-xs leading-relaxed mb-4">Catat progresmu hari ini untuk pertahankan streak.</p>
                <Link href="/dashboard/progress">
                  <Button className="w-full bg-[var(--card)] hover:bg-white/90 text-[#3B6FA0] rounded-xl font-semibold text-sm h-10 shadow-md transition-all">
                    Catat Progres
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
