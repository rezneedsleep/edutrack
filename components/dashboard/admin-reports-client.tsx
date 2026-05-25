'use client'

import { motion } from 'framer-motion'
import { 
  BarChart3, 
  Download, 
  Users, 
  GraduationCap, 
  BookOpen, 
  FileCheck,
  Activity,
  Calendar,
  Layers
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts'

export function AdminReportsClient({ stats }: any) {
  const data = [
    { name: 'Siswa', value: stats.studentCount, color: '#22C55E' },
    { name: 'Guru', value: stats.teacherCount, color: '#3B82F6' },
    { name: 'Admin', value: stats.userCount - stats.studentCount - stats.teacherCount, color: '#A855F7' },
    { name: 'Kelas', value: stats.classCount, color: '#F59E0B' },
    { name: 'Mapel', value: stats.subjectCount, color: '#EF4444' },
  ]

  const activityData = [
    { name: 'Tugas', value: stats.assignmentCount, color: '#06B6D4' },
    { name: 'Submisi', value: stats.submissionCount, color: '#6366F1' },
  ]

  const handleExport = () => {
    window.print()
  }

  return (
    <div className="space-y-10 pb-20 print:p-0">
      <style jsx global>{`
        @media print {
          aside, nav, .top-bar, button, .no-print {
            display: none !important;
          }
          body {
            background: white !important;
            color: black !important;
          }
          .recharts-wrapper {
            width: 100% !important;
          }
        }
      `}</style>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 print:mb-8">
        <div>
          <p className="text-[#5483B3] font-bold uppercase tracking-wider text-xs mb-2">
            Platform Analytics
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">Laporan Sistem</h1>
          <p className="text-sm font-medium text-[var(--muted-foreground)] mt-2">Visualisasi data dan performa ekosistem EduTrack.</p>
        </div>
        
        <Button 
          onClick={handleExport}
          className="bg-[#5483B3] hover:bg-[#3B6FA0] text-white rounded-xl font-bold text-sm h-11 px-8 shadow-md transition-all gap-2 no-print"
        >
          <Download className="h-4 w-4" /> Export PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Pengguna', value: stats.userCount, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Total Kelas', value: stats.classCount, icon: GraduationCap, color: 'text-green-500', bg: 'bg-green-50' },
          { label: 'Total Mapel', value: stats.subjectCount, icon: BookOpen, color: 'text-orange-500', bg: 'bg-orange-50' },
          { label: 'Submisi Tugas', value: stats.submissionCount, icon: FileCheck, color: 'text-purple-500', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl hover:shadow-md transition-all shadow-sm">
              <CardContent className="p-6">
                 <div className="flex justify-between items-center mb-4">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                       <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <Activity className="h-4 w-4 text-[var(--muted-foreground)] opacity-50" />
                 </div>
                 <h3 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)]">{stat.value}</h3>
                 <p className="text-sm font-bold text-[var(--muted-foreground)] mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-sm overflow-hidden">
          <CardHeader className="p-6 md:p-8 border-b border-[var(--border)] bg-[var(--muted)]/30 flex flex-row items-center justify-between">
             <div>
                <CardTitle className="text-xl font-extrabold tracking-tight">Distribusi Entitas</CardTitle>
                <CardDescription className="text-sm font-medium text-[var(--muted-foreground)] mt-1">Komposisi pengguna dan akademik.</CardDescription>
             </div>
             <div className="h-10 w-10 bg-[#5483B3]/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-[#5483B3]" />
             </div>
          </CardHeader>
          <CardContent className="p-6 md:p-8 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} fontWeight="600" tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} fontWeight="600" tickLine={false} axisLine={false} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                   itemStyle={{ color: '#0f172a', fontSize: '14px', fontWeight: 'bold' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-sm overflow-hidden">
          <CardHeader className="p-6 md:p-8 border-b border-[var(--border)] bg-[var(--muted)]/30 flex flex-row items-center justify-between">
             <div>
                <CardTitle className="text-xl font-extrabold tracking-tight">Aktivitas Akademik</CardTitle>
                <CardDescription className="text-sm font-medium text-[var(--muted-foreground)] mt-1">Perbandingan tugas dan pengumpulan.</CardDescription>
             </div>
             <div className="h-10 w-10 bg-[#22C55E]/10 rounded-lg flex items-center justify-center">
                <Activity className="h-5 w-5 text-[#22C55E]" />
             </div>
          </CardHeader>
          <CardContent className="p-6 md:p-8 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} layout="vertical" margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={12} fontWeight="600" tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} fontWeight="600" tickLine={false} axisLine={false} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                   itemStyle={{ color: '#0f172a', fontSize: '14px', fontWeight: 'bold' }}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={40}>
                  {activityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
