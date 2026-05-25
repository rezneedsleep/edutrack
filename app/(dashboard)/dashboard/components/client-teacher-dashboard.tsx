'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Users, TrendingUp, AlertCircle, Clock, ChevronRight, UserCheck } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'
import { id as localeId } from 'date-fns/locale'

export function TeacherDashboard({ stats, mySubjects, recentLogs }: any) {
  return (
    <div className="space-y-8 pb-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold tracking-tight text-white">Dashboard Guru</h1>
        <p className="text-white/50 text-lg mt-1">Pantau kemajuan siswa dan kelola materi pelajaranmu.</p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Siswa', value: stats.studentCount, icon: Users, color: 'text-blue-400' },
          { label: 'Rata-rata Progress', value: '62%', icon: TrendingUp, color: 'text-green-400' },
          { label: 'Perlu Perhatian', value: '4', icon: AlertCircle, color: 'text-orange-400' },
          { label: 'Menunggu Penilaian', value: stats.pendingSubmissions, icon: Clock, color: 'text-purple-400' },
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 p-8 rounded-3xl bg-[#1C1C1E] border-[#3A3A3C]">
          <h3 className="text-xl font-bold text-white mb-6">Aktivitas Terbaru Siswa</h3>
          <div className="space-y-4">
            {recentLogs.map((log: any) => (
              <div key={log.id} className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5 group hover:border-white/10 transition-all">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {log.user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {log.user.name} <span className="text-white/30 font-normal">mempelajari</span> {log.topic?.name || 'Topik'}
                    </p>
                    <p className="text-xs text-white/40">
                      {log.subject.name} • {log.duration} menit • {formatDistanceToNow(new Date(log.loggedAt), { addSuffix: true, locale: localeId })}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="border-white/10 text-white/40">
                  {log.difficulty}/5 Kesulitan
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Alert Panel */}
        <Card className="p-8 rounded-3xl bg-[#1C1C1E] border-[#3A3A3C]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Perlu Perhatian</h3>
            <Badge className="bg-orange-500/20 text-orange-400">4 Siswa</Badge>
          </div>
          <div className="space-y-4">
             {/* Simulated lagging students */}
             {[
               { name: 'Ahmad Faisal', class: 'X RPL 1', reason: 'Tidak aktif 3 hari', progress: 35 },
               { name: 'Siti Aminah', class: 'X RPL 1', reason: 'Progress < 40%', progress: 28 }
             ].map((student, i) => (
               <div key={i} className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10 space-y-3">
                 <div className="flex items-center justify-between">
                   <p className="text-sm font-semibold text-white">{student.name}</p>
                   <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">{student.class}</span>
                 </div>
                 <p className="text-xs text-orange-400/70">{student.reason}</p>
                 <div className="flex items-center gap-4">
                   <div className="flex-1 h-1 bg-orange-500/10 rounded-full overflow-hidden">
                     <div className="h-full bg-orange-500" style={{ width: `${student.progress}%` }} />
                   </div>
                   <span className="text-xs font-bold text-white/60">{student.progress}%</span>
                 </div>
                 <Button className="w-full h-8 rounded-lg bg-orange-500 hover:bg-orange-600 text-[10px] font-bold uppercase tracking-widest">
                   Kirim Notifikasi
                 </Button>
               </div>
             ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
