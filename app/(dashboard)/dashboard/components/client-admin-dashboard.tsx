'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Users, GraduationCap, BookOpen, UserCheck, TrendingUp, Plus } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts'
import { format } from 'date-fns'

export function AdminDashboard({ stats, recentUsers }: any) {
  // Simulated Chart Data
  const growthData = [
    { name: 'Week 1', users: 40 },
    { name: 'Week 2', users: 75 },
    { name: 'Week 3', users: 120 },
    { name: 'Week 4', users: 190 },
  ]

  const activityData = [
    { date: '1 Apr', logs: 45 },
    { date: '2 Apr', logs: 52 },
    { date: '3 Apr', logs: 68 },
    { date: '4 Apr', logs: 59 },
    { date: '5 Apr', logs: 85 },
    { date: '6 Apr', logs: 94 },
    { date: '7 Apr', logs: 72 },
  ]

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold tracking-tight text-white">Admin Panel</h1>
          <p className="text-white/50 text-lg mt-1">Kelola seluruh ekosistem EduTrack sekolahmu.</p>
        </motion.div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl border-white/10 hover:bg-white/5">
            Ekspor CSV
          </Button>
          <Button className="rounded-xl bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" /> Tambah Pengguna
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Pengguna', value: stats.totalUsers, icon: Users, color: 'text-blue-400' },
          { label: 'Siswa Aktif', value: stats.activeStudents, icon: UserCheck, color: 'text-green-400' },
          { label: 'Total Guru', value: stats.totalTeachers, icon: GraduationCap, color: 'text-purple-400' },
          { label: 'Mata Pelajaran', value: stats.totalSubjects, icon: BookOpen, color: 'text-orange-400' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-3xl bg-[#1C1C1E] border border-[#3A3A3C]"
          >
            <p className="text-xs font-medium text-white/40 uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
              <stat.icon className={cn("h-8 w-8", stat.color)} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Growth Chart */}
        <Card className="p-8 rounded-3xl bg-[#1C1C1E] border-[#3A3A3C]">
          <h3 className="text-xl font-bold text-white mb-6">Pertumbuhan Pengguna</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3A3A3C" vertical={false} />
                <XAxis dataKey="name" stroke="#8E8E93" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#8E8E93" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1C1C1E', borderColor: '#3A3A3C', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="users" fill="#0A84FF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Activity Chart */}
        <Card className="p-8 rounded-3xl bg-[#1C1C1E] border-[#3A3A3C]">
          <h3 className="text-xl font-bold text-white mb-6">Aktivitas Platform</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorLogs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#BF5AF2" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#BF5AF2" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#3A3A3C" vertical={false} />
                <XAxis dataKey="date" stroke="#8E8E93" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#8E8E93" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1C1C1E', borderColor: '#3A3A3C', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="logs" stroke="#BF5AF2" fillOpacity={1} fill="url(#colorLogs)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Users Table */}
      <Card className="p-8 rounded-3xl bg-[#1C1C1E] border-[#3A3A3C] overflow-hidden">
        <h3 className="text-xl font-bold text-white mb-6">Pendaftaran Terbaru</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#3A3A3C] text-white/40 text-xs uppercase tracking-widest font-bold">
                <th className="pb-4">Nama</th>
                <th className="pb-4">Email</th>
                <th className="pb-4">Role</th>
                <th className="pb-4">Bergabung</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {recentUsers.map((u: any) => (
                <tr key={u.id} className="border-b border-white/5 last:border-0 group">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center font-bold text-xs">
                        {u.name.charAt(0)}
                      </div>
                      <span className="font-medium text-white">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-4 text-white/50">{u.email}</td>
                  <td className="py-4">
                    <Badge variant="outline" className={cn("rounded-full border-none px-3", 
                      u.role === 'ADMIN' ? "bg-red-400/10 text-red-400" : u.role === 'TEACHER' ? "bg-purple-400/10 text-purple-400" : "bg-blue-400/10 text-blue-400"
                    )}>
                      {u.role}
                    </Badge>
                  </td>
                  <td className="py-4 text-white/50">{format(new Date(u.createdAt), 'dd MMM yyyy')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
