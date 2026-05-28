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

export function AdminOverview({ stats, recentUsers, chartData }: any) {
  const defaultRoleData = [
    { name: 'Siswa', count: stats.studentCount, fill: '#5483B3' },
    { name: 'Guru', count: stats.teacherCount, fill: '#22C55E' },
    { name: 'Admin', count: stats.userCount - stats.studentCount - stats.teacherCount, fill: '#ef4444' }
  ]

  const ROLE_COLORS: Record<string, string> = {
    SUPER_ADMIN: '#DC2626',
    KETUA_YAYASAN: '#B91C1C',
    KEPALA_SEKOLAH: '#991B1B',
    WAKASEK_KURIKULUM: '#2563EB',
    WAKASEK_KESISWAAN: '#1D4ED8',
    WAKASEK_HUBIN: '#1E3A8A',
    KAPROG: '#0891B2',
    KEPALA_LAB: '#0D9488',
    TATA_USAHA: '#4F46E5',
    BENDAHARA_YAYASAN: '#059669',
    BENDAHARA_SEKOLAH: '#10B981',
    PANITIA_PPDB: '#DB2777',
    GURU_MAPEL: '#16A34A',
    WALI_KELAS: '#15803D',
    GURU_BK: '#84CC16',
    PUSTAKAWAN: '#CA8A04',
    PETUGAS_UKS: '#E11D48',
    STAF_SARPRAS: '#78350F',
    SISWA: '#3B82F6',
    ORANG_TUA: '#F59E0B',
    ALUMNI: '#6B7280',
    STUDENT: '#5483B3',
    TEACHER: '#22C55E',
    ADMIN: '#EF4444',
    COACH: '#8B5CF6',
    USER: '#94A3B8',
    PARENT: '#F59E0B'
  }

  const ROLE_NAMES: Record<string, string> = {
    STUDENT: 'Siswa',
    TEACHER: 'Guru',
    PARENT: 'Wali/Orang Tua',
    COACH: 'Pelatih',
    ADMIN: 'Admin',
    SUPER_ADMIN: 'Super Admin',
    KETUA_YAYASAN: 'Ketua Yayasan',
    KEPALA_SEKOLAH: 'Kepala Sekolah',
    WAKASEK_KURIKULUM: 'Wakasek Kurikulum',
    WAKASEK_KESISWAAN: 'Wakasek Kesiswaan',
    WAKASEK_HUBIN: 'Wakasek Hubin',
    KAPROG: 'Kaprog',
    KEPALA_LAB: 'Kepala Lab',
    TATA_USAHA: 'Tata Usaha',
    BENDAHARA_YAYASAN: 'Bendahara Yayasan',
    BENDAHARA_SEKOLAH: 'Bendahara Sekolah',
    PANITIA_PPDB: 'Panitia PPDB',
    GURU_MAPEL: 'Guru Mapel',
    WALI_KELAS: 'Wali Kelas',
    GURU_BK: 'Guru BK',
    PUSTAKAWAN: 'Pustakawan',
    PETUGAS_UKS: 'Petugas UKS',
    STAF_SARPRAS: 'Staf Sarpras',
    SISWA: 'Siswa',
    ORANG_TUA: 'Orang Tua',
    ALUMNI: 'Alumni',
    USER: 'User'
  }

  const aggregatedRoles: Record<string, { count: number, fill: string }> = {}

  if (chartData) {
    chartData.forEach((d: any) => {
      // Normalize name to map back to uppercase config keys (e.g., 'Wakasek Kurikulum' -> 'WAKASEK_KURIKULUM')
      const rawKey = d.name.toUpperCase().replace(/[\s\-]/g, '_')
      const roleName = ROLE_NAMES[rawKey] || d.name
      const fill = d.fill || ROLE_COLORS[rawKey] || '#64748B'

      if (!aggregatedRoles[roleName]) {
        aggregatedRoles[roleName] = { count: 0, fill }
      }
      aggregatedRoles[roleName].count += d.value
    })
  }

  const roleDistData = chartData ? Object.entries(aggregatedRoles).map(([name, data]) => ({
    name,
    count: data.count,
    fill: data.fill
  })) : defaultRoleData;

  const baseUsers = Math.max(1, stats.userCount)
  const growthData = [
    { month: 'Jan', Pengguna: Math.floor(baseUsers * 0.2) || 0 },
    { month: 'Feb', Pengguna: Math.floor(baseUsers * 0.4) || 1 },
    { month: 'Mar', Pengguna: Math.floor(baseUsers * 0.6) || 2 },
    { month: 'Apr', Pengguna: Math.floor(baseUsers * 0.75) || 3 },
    { month: 'Mei', Pengguna: Math.floor(baseUsers * 0.9) || 4 },
    { month: 'Jun', Pengguna: baseUsers },
  ]

  const donutData = roleDistData.map((d: any) => ({
    name: d.name,
    value: d.count || 1,
    fill: d.fill
  }))

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
                    {(() => { const Icon = stat.icon; return <Icon className="h-4 w-4" style={{ color: stat.color }} />; })()}
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
                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                      {
                        roleDistData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))
                      }
                    </Bar>
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
                        {donutData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
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
                  {roleDistData.map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                      <span className="text-xs text-[var(--muted-foreground)]">{item.name} ({item.count})</span>
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
                      : u.role === 'ADMIN' ? 'bg-purple-400/10 text-purple-400'
                      : u.role === 'COACH' ? 'bg-orange-400/10 text-orange-400'
                      : 'bg-gray-400/10 text-gray-400'
                    }`}>
                      {u.role === 'STUDENT' ? 'Siswa' : u.role === 'TEACHER' ? 'Guru' : u.role === 'COACH' ? 'Pelatih' : u.role === 'ADMIN' ? 'Admin' : 'Tamu'}
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
