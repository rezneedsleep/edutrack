'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, BookOpen, ClipboardList, AlertCircle, TrendingUp,
  Clock, FileText, ChevronRight, Plus, Trash2, Link as LinkIcon, ArrowRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

export function TeacherDashboard({ user, subjects, pendingGrades, students, activities, materials, classes }: any) {
  const router = useRouter()
  const [isAddMaterialOpen, setIsAddMaterialOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [materialData, setMaterialData] = useState({
    title: '',
    description: '',
    subjectId: '',
    classId: '',
    fileUrl: ''
  })

  const DONUT_COLORS = ['#5483B3', '#EF4444']

  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!materialData.title || !materialData.subjectId) {
      toast.error('Judul dan Mata Pelajaran wajib diisi')
      return
    }
    
    setIsSubmitting(true)
    try {
      const payload = {
        ...materialData,
        attachments: materialData.fileUrl ? [{ url: materialData.fileUrl, name: 'Lampiran' }] : []
      }
      
      const res = await fetch('/api/teacher/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      if (res.ok) {
        toast.success('Materi berhasil diunggah')
        setIsAddMaterialOpen(false)
        router.refresh()
      } else {
        toast.error('Gagal mengunggah materi')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan sistem')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteMaterial = async (id: string) => {
    if (!confirm('Hapus materi ini?')) return
    try {
      const res = await fetch(`/api/teacher/materials/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Materi dihapus')
        router.refresh()
      }
    } catch (error) {
      toast.error('Gagal menghapus materi')
    }
  }

  // Ringkasan Stats Calculation
  const totalStudents = students?.length || 0
  let totalProgress = 0
  let laggingCount = 0
  
  if (totalStudents > 0) {
    students.forEach((student: any) => {
      const completedTopics = new Set(student.progressLogs?.map((log: any) => log.topicId)).size
      const allAvailableTopics = subjects.reduce((acc: number, sub: any) => acc + (sub.topics?.length || 0), 0)
      const progress = allAvailableTopics > 0 ? (completedTopics / allAvailableTopics) * 100 : 0
      totalProgress += progress
      if (progress < 30 && allAvailableTopics > 0) laggingCount++
    })
  }
  
  const avgProgress = totalStudents > 0 ? Math.round(totalProgress / totalStudents) : 0
  const donutData = [
    { name: 'Aktif', value: Math.max(totalStudents - laggingCount, 0) || 1 },
    { name: 'Lagging', value: laggingCount || 0 },
  ]

  const statCards = [
    { label: 'Total Siswa', value: totalStudents, icon: Users, color: '#5483B3', bgColor: 'rgba(84, 131, 179, 0.08)' },
    { label: 'Rata-rata Progres', value: `${avgProgress}%`, icon: TrendingUp, color: '#22C55E', bgColor: 'rgba(34, 197, 94, 0.08)' },
    { label: 'Siswa Tertinggal', value: laggingCount, icon: AlertCircle, color: laggingCount > 0 ? '#EF4444' : '#22C55E', bgColor: laggingCount > 0 ? 'rgba(239, 68, 68, 0.08)' : 'rgba(34, 197, 94, 0.08)' },
    { label: 'Menunggu Nilai', value: pendingGrades || 0, icon: ClipboardList, color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.08)' },
  ]

  return (
    <div className="space-y-8 pb-20">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
          Halo, {user?.name?.split(' ')[0] || 'Guru'} 👋
        </h2>
        <p className="text-[var(--muted-foreground)] mt-1 font-medium">
          Kelola kelas, materi, dan tugas siswa Anda dengan mudah.
        </p>
      </motion.div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-[var(--card)] border border-[var(--border)] p-1 rounded-2xl h-12 shadow-sm">
          <TabsTrigger value="overview" className="rounded-xl data-[state=active]:bg-[#5483B3] data-[state=active]:text-white font-semibold">Ringkasan</TabsTrigger>
          <TabsTrigger value="materials" className="rounded-xl data-[state=active]:bg-[#5483B3] data-[state=active]:text-white font-semibold">Materi Saya</TabsTrigger>
          <TabsTrigger value="assignments" className="rounded-xl data-[state=active]:bg-[#5483B3] data-[state=active]:text-white font-semibold">Tugas Saya</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat, i) => (
              <Card key={i} className="bg-[var(--card)] border-[var(--border)] rounded-3xl shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-5">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: stat.bgColor }}>
                    <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
                  </div>
                  <h3 className="text-3xl font-extrabold tracking-tight mb-1">{stat.value}</h3>
                  <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 bg-[var(--card)] border-[var(--border)] rounded-3xl shadow-sm overflow-hidden">
              <CardHeader className="bg-[var(--muted)]/30 border-b border-[var(--border)] p-6">
                <CardTitle className="text-lg font-bold">Mata Pelajaran Saya</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                {subjects?.length > 0 ? subjects.map((sub: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-[var(--border)] bg-[var(--background)] hover:border-[#5483B3] transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${sub.color}15` }}>
                        <BookOpen className="h-5 w-5" style={{ color: sub.color }} />
                      </div>
                      <div>
                        <h5 className="font-bold text-[var(--foreground)]">{sub.name}</h5>
                        <p className="text-xs font-medium text-[var(--muted-foreground)]">{sub.topics?.length || 0} Topik • {sub.assignments?.length || 0} Tugas</p>
                      </div>
                    </div>
                  </div>
                )) : (
                  <p className="text-center py-8 text-[var(--muted-foreground)]">Belum ada mata pelajaran.</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-[var(--card)] border-[var(--border)] rounded-3xl shadow-sm overflow-hidden">
              <CardHeader className="bg-[var(--muted)]/30 border-b border-[var(--border)] p-6">
                <CardTitle className="text-lg font-bold">Aktivitas Terbaru</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {activities?.length > 0 ? activities.map((activity: any, i: number) => (
                  <div key={i} className="flex gap-3 items-start pb-4 border-b border-[var(--border)] last:border-0 last:pb-0">
                     <div className={`mt-0.5 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${activity.type === 'SUBMISSION' ? 'bg-[#5483B3]/10 text-[#5483B3]' : 'bg-[#22C55E]/10 text-[#22C55E]'}`}>
                        {activity.type === 'SUBMISSION' ? <FileText className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
                     </div>
                     <div>
                        <p className="text-sm text-[var(--foreground)] leading-tight font-medium">
                           <span className="font-bold">{activity.user}</span> {activity.type === 'SUBMISSION' ? 'mengumpulkan tugas' : 'mencatat progres'} <span className="font-bold text-[#5483B3]">{activity.item}</span>
                        </p>
                     </div>
                  </div>
                )) : (
                  <p className="text-center py-8 text-[var(--muted-foreground)]">Belum ada aktivitas.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="materials">
          <Card className="bg-[var(--card)] border-[var(--border)] rounded-3xl shadow-sm overflow-hidden min-h-[400px] flex flex-col justify-center items-center p-8 text-center bg-dot-pattern relative">
             <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-[#5483B3]/5 blur-[80px] pointer-events-none" />
             <div className="h-20 w-20 bg-[#5483B3]/10 rounded-full flex items-center justify-center mb-6 text-[#5483B3]">
               <BookOpen className="h-10 w-10" />
             </div>
             <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">Materi & Kelas Saya</h3>
             <p className="text-[var(--muted-foreground)] max-w-md mx-auto mb-6 text-sm">
               Kelola kelas pengajaran, publikasikan kurikulum bab, dan bagikan lampiran belajar digital untuk seluruh kelas pengajaran Anda.
             </p>
             <Link href="/dashboard/materi">
               <Button className="bg-[#5483B3] hover:bg-[#3B6FA0] text-white font-bold h-11 rounded-xl px-8 shadow-md transition-all gap-2">
                 Buka Panel Materi & Kelas <ArrowRight className="h-4 w-4" />
               </Button>
             </Link>
          </Card>
        </TabsContent>

        <TabsContent value="assignments">
          <Card className="bg-[var(--card)] border-[var(--border)] rounded-3xl shadow-sm overflow-hidden min-h-[400px] flex flex-col justify-center items-center p-8 text-center bg-dot-pattern relative">
             <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-[#5483B3]/5 blur-[80px] pointer-events-none" />
             <div className="h-20 w-20 bg-[#5483B3]/10 rounded-full flex items-center justify-center mb-6 text-[#5483B3]">
               <ClipboardList className="h-10 w-10" />
             </div>
             <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">Kelola Tugas & Evaluasi</h3>
             <p className="text-[var(--muted-foreground)] max-w-md mx-auto mb-6 text-sm">
               Buat tugas baru, atur draf penugasan, kelola tenggat waktu belajar siswa, dan update status penugasan secara massal.
             </p>
             <Link href="/dashboard/kelola-tugas">
               <Button className="bg-[#5483B3] hover:bg-[#3B6FA0] text-white font-bold h-11 rounded-xl px-8 shadow-md transition-all gap-2">
                 Buka Panel Kelola Tugas <ArrowRight className="h-4 w-4" />
               </Button>
             </Link>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
