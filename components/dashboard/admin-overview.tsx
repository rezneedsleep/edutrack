'use client'

import { motion } from 'framer-motion'
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  ShieldCheck,
  TrendingUp,
  Globe,
  Activity,
  School,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts'

const DONUT_COLORS = ['#5483B3', '#22C55E', '#7DA0CA']

export function AdminOverview({ stats, recentUsers }: any) {
  const roleDistData = [
    { name: 'Siswa', count: stats.studentCount },
    { name: 'Guru', count: stats.teacherCount },
    { name: 'Admin', count: stats.userCount - stats.studentCount - stats.teacherCount }
  ]

  const baseUsers = Math.max(1, stats.userCount)
  const growthData = [
    { month: 'Jan', Pengguna: Math.floor(baseUsers * 0.2) || 0 },
    { month: 'Feb', Pengguna: Math.floor(baseUsers * 0.4) || 1 },
    { month: 'Mar', Pengguna: Math.floor(baseUsers * 0.6) || 2 },
    { month: 'Apr', Pengguna: Math.floor(baseUsers * 0.75) || 3 },
    { month: 'Mei', Pengguna: Math.floor(baseUsers * 0.9) || 4 },
    { month: 'Jun', Pengguna: baseUsers },
  ]

  const donutData = [
    { name: 'Siswa', value: stats.studentCount || 1 },
    { name: 'Guru', value: stats.teacherCount || 1 },
    { name: 'Admin', value: Math.max(stats.userCount - stats.studentCount - stats.teacherCount, 1) }
  ]

  const statCards = [
    { 
      label: 'Total Pengguna', 
      value: stats.userCount, 
      icon: Users, 
      trend: 'semua role',
      trendUp: true,
      color: '#5483B3',
      bgColor: 'rgba(84, 131, 179, 0.08)'
    },
    { 
      label: 'Siswa Aktif', 
      value: stats.studentCount, 
      icon: GraduationCap, 
      trend: 'terdaftar',
      trendUp: true,
      color: '#22C55E',
      bgColor: 'rgba(34, 197, 94, 0.08)'
    },
    { 
      label: 'Total Guru', 
      value: stats.teacherCount, 
      icon: ShieldCheck, 
      trend: 'aktif mengajar',
      trendUp: true,
      color: '#8B5CF6',
      bgColor: 'rgba(139, 92, 246, 0.08)'
    },
    { 
      label: 'Mata Pelajaran', 
      value: stats.subjectCount, 
      icon: BookOpen, 
      trend: `${stats.classCount || 0} kelas`,
      trendUp: true,
      color: '#F59E0B',
      bgColor: 'rgba(245, 158, 11, 0.08)'
    },
  ]

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 className="text-xl font-bold text-[var(--foreground)]">
          Halo, Admin 👋
        </h2>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Berikut ringkasan statistik platform hari ini.
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
        {/* Main Charts */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Growth Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-sm font-semibold text-[var(--foreground)]">Pertumbuhan Pengguna</CardTitle>
                  <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Tren pendaftaran pengguna baru</p>
                </div>
                <span className="text-xs text-[#5483B3] font-medium bg-[#5483B3]/8 px-2.5 py-1 rounded-lg">{new Date().getFullYear()}</span>
              </CardHeader>
              <CardContent className="h-[280px] pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={growthData} id="admin-growth-chart">
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#5483B3" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#5483B3" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} fontWeight={500} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} fontWeight={500} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--card)', 
                        borderColor: 'var(--border)',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                      itemStyle={{ color: 'var(--foreground)', fontWeight: 600 }}
                    />
                    <Area type="monotone" dataKey="Pengguna" stroke="#5483B3" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
 
          {/* Role Distribution Bar Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-[var(--foreground)]">Distribusi Role</CardTitle>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Perbandingan jumlah pengguna per role</p>
              </CardHeader>
              <CardContent className="h-[240px] pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={roleDistData} barSize={36} id="admin-role-bar-chart">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} fontWeight={500} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} fontWeight={500} />
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
                    <Bar dataKey="count" fill="#5483B3" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>
 
        {/* Right sidebar */}
        <div className="space-y-4 md:space-y-6">
          {/* Role Donut */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-[var(--foreground)]">Komposisi Pengguna</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[180px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart id="admin-role-pie-chart">
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
                      <p className="text-2xl font-bold text-[var(--foreground)]">{stats.userCount}</p>
                      <p className="text-[10px] text-[var(--muted-foreground)]">Total</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-2">
                  {[
                    { label: 'Siswa', color: '#5483B3', count: stats.studentCount },
                    { label: 'Guru', color: '#22C55E', count: stats.teacherCount },
                    { label: 'Admin', color: '#7DA0CA', count: stats.userCount - stats.studentCount - stats.teacherCount },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs text-[var(--muted-foreground)]">{item.label} ({item.count})</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Users */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-[var(--foreground)]">Pengguna Terbaru</CardTitle>
                  <Link href="/dashboard/admin/students" className="text-xs text-[#5483B3] font-medium hover:underline flex items-center gap-1">
                    Semua <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {recentUsers?.length > 0 ? recentUsers.slice(0, 4).map((u: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[var(--muted)] hover:bg-[var(--sidebar-hover)] transition-all">
                    <div className="flex items-center gap-3">
                      <div className={`h-9 w-9 rounded-xl flex items-center justify-center text-[var(--foreground)] text-sm font-bold shadow-sm ${
                        u.role === 'STUDENT' ? 'bg-[#5483B3]/10 text-[#5483B3]' : u.role === 'TEACHER' ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-[#7DA0CA]/10 text-[#7DA0CA]'
                      }`}>
                        {u.name?.[0] || '?'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--foreground)]">{u.name}</p>
                        <p className="text-[10px] text-[var(--muted-foreground)]">{u.email}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg ${
                      u.role === 'STUDENT' ? 'bg-[#5483B3]/10 text-[#5483B3]' 
                      : u.role === 'TEACHER' ? 'bg-[#22C55E]/10 text-[#22C55E]'
                      : 'bg-[#7DA0CA]/10 text-[#7DA0CA]'
                    }`}>
                      {u.role === 'STUDENT' ? 'Siswa' : u.role === 'TEACHER' ? 'Guru' : 'Admin'}
                    </span>
                  </div>
                )) : (
                  <p className="text-center py-6 text-sm text-[var(--muted-foreground)]">Tidak ada data pengguna</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* System Status */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-gradient-to-br from-[#5483B3] to-[#3B6FA0] text-white rounded-2xl border-none overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              <CardContent className="p-5 relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-white/15 flex items-center justify-center">
                    <School className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-[11px] text-white/70 font-medium uppercase tracking-wider">Tahun Ajaran</p>
                    <p className="text-sm font-semibold">2025 / 2026</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-white/15 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-[#22C55E]" />
                  </div>
                  <div>
                    <p className="text-[11px] text-white/70 font-medium uppercase tracking-wider">Semester</p>
                    <p className="text-sm font-semibold text-[#4ADE80]">Genap — Aktif</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-white/15 flex items-center justify-center">
                    <GraduationCap className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-[11px] text-white/70 font-medium uppercase tracking-wider">Kurikulum</p>
                    <p className="text-sm font-semibold">Merdeka Belajar</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
