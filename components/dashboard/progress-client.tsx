'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Clock, 
  CheckCircle2, 
  Zap, 
  Calendar,
  BarChart3,
  Trophy,
  Activity
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { toast } from 'sonner'
import { Progress } from '@/components/ui/progress'

export function ProgressClient({ subjects, logs }: any) {
  const [isLogModalOpen, setIsLogModalOpen] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedTopic, setSelectedTopic] = useState('')
  const [duration, setDuration] = useState(30)
  const [difficulty, setDifficulty] = useState(3)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Real Stats Calculations
  const totalMinutes = logs?.reduce((acc: number, log: any) => acc + log.duration, 0) || 0
  const totalHours = (totalMinutes / 60).toFixed(1)
  
  const completedTopicsCount = new Set(logs?.map((log: any) => log.topicId)).size || 0
  const totalTopicsAvailable = subjects?.reduce((acc: number, sub: any) => acc + (sub.subject.topics?.length || 0), 0) || 0
  
  const avgDifficulty = logs?.length > 0 
    ? (logs.reduce((acc: number, log: any) => acc + log.difficulty, 0) / logs.length).toFixed(1) 
    : 0

  // Streak Calculation
  const calculateStreak = () => {
    if (!logs || logs.length === 0) return 0
    const dates = Array.from(new Set(logs.map((l: any) => new Date(l.loggedAt as string).toDateString())))
      .map(d => new Date(d as string).getTime())
      .sort((a, b) => b - a)
    
    let streak = 0
    let current = new Date().setHours(0,0,0,0)
    
    for (const date of dates) {
      const diff = Math.floor((current - date) / (1000 * 60 * 60 * 24))
      if (diff <= 1) {
        streak++
        current = date
      } else {
        break
      }
    }
    return streak
  }
  const currentStreak = calculateStreak()

  // Heatmap Data (last 112 days)
  const getHeatmapData = () => {
    const data = []
    const now = new Date()
    for (let i = 111; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dateStr = date.toDateString()
      const dayLogs = logs?.filter((l: any) => new Date(l.loggedAt).toDateString() === dateStr) || []
      const intensity = dayLogs.length > 0 ? Math.min(dayLogs.length, 4) : 0
      data.push({ date: dateStr, intensity })
    }
    return data
  }
  const heatmapData = getHeatmapData()

  const handleLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectId: selectedSubject,
          topicId: selectedTopic,
          duration,
          difficulty: difficulty,
          loggedAt: new Date()
        })
      })

      if (res.ok) {
        toast.success('Log belajar berhasil disimpan!')
        setIsLogModalOpen(false)
        window.location.reload()
      } else {
        toast.error('Gagal menyimpan log')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan sistem')
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredTopics = subjects.find((s: any) => s.subjectId === selectedSubject)?.subject.topics || []

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)]">Monitoring Progres</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-2 font-medium">Pantau seberapa jauh langkah belajarmu hari ini.</p>
        </div>
        
        <Dialog open={isLogModalOpen} onOpenChange={setIsLogModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#5483B3] hover:bg-[#3B6FA0] text-white rounded-xl font-bold h-12 px-6 shadow-lg shadow-[#5483B3]/20 transition-all">
              <Plus className="mr-2 h-5 w-5" /> Catat Belajar
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[var(--card)] border-[var(--border)] rounded-2xl text-[var(--foreground)] max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-[var(--foreground)]">Input Sesi Belajar</DialogTitle>
              <DialogDescription className="text-xs font-medium text-[var(--muted-foreground)] mt-1.5">
                Simpan progresmu agar selalu konsisten setiap harinya.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleLogSubmit} className="space-y-6 pt-4">
               <div className="space-y-5">
                  <div className="space-y-2.5">
                     <Label className="text-xs font-bold text-[var(--foreground)]">Pilih Mata Pelajaran</Label>
                     <Select value={selectedSubject} onValueChange={setSelectedSubject} required>
                        <SelectTrigger className="bg-[var(--muted)] border-transparent rounded-xl h-12 focus:ring-2 focus:ring-[#5483B3]/20 focus:border-[#5483B3]">
                           <SelectValue placeholder="Pilih Mapel" />
                        </SelectTrigger>
                        <SelectContent className="bg-[var(--card)] border-[var(--border)] rounded-xl shadow-xl">
                           {subjects.map((s: any) => (
                             <SelectItem key={s.subjectId} value={s.subjectId} className="font-medium">{s.subject.name}</SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>

                  {selectedSubject && (
                    <div className="space-y-2.5">
                       <Label className="text-xs font-bold text-[var(--foreground)]">Pilih Topik</Label>
                       <Select value={selectedTopic} onValueChange={setSelectedTopic} required>
                          <SelectTrigger className="bg-[var(--muted)] border-transparent rounded-xl h-12 focus:ring-2 focus:ring-[#5483B3]/20 focus:border-[#5483B3]">
                             <SelectValue placeholder="Pilih Topik" />
                          </SelectTrigger>
                          <SelectContent className="bg-[var(--card)] border-[var(--border)] rounded-xl shadow-xl">
                             {filteredTopics.map((t: any) => (
                               <SelectItem key={t.id} value={t.id} className="font-medium">{t.name}</SelectItem>
                             ))}
                          </SelectContent>
                       </Select>
                    </div>
                  )}

                  <div className="space-y-4 pt-2">
                     <div className="flex justify-between items-center">
                        <Label className="text-xs font-bold text-[var(--foreground)]">Durasi (Menit)</Label>
                        <span className="text-[#5483B3] font-extrabold text-sm bg-[#5483B3]/10 px-2 py-0.5 rounded-md">{duration} Min</span>
                     </div>
                     <Slider 
                        value={[duration]} 
                        onValueChange={(v) => setDuration(v[0])} 
                        max={180} 
                        step={5} 
                        className="py-2"
                     />
                  </div>

                  <div className="space-y-4 pt-2">
                     <div className="flex justify-between items-center">
                        <Label className="text-xs font-bold text-[var(--foreground)]">Tingkat Kesulitan</Label>
                        <span className="text-[#5483B3] font-extrabold text-sm bg-[#5483B3]/10 px-2 py-0.5 rounded-md">{difficulty}/5</span>
                     </div>
                     <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setDifficulty(star)}
                            className={`flex-1 h-10 rounded-lg text-sm font-bold transition-all border ${
                              difficulty >= star 
                                ? 'bg-[#5483B3] border-[#5483B3] text-white shadow-md' 
                                : 'bg-[var(--muted)] border-transparent text-[var(--muted-foreground)] hover:bg-[var(--muted)]/80'
                            }`}
                          >
                            {star}
                          </button>
                        ))}
                     </div>
                  </div>
               </div>

               <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full h-12 bg-[#5483B3] hover:bg-[#3B6FA0] text-white font-bold rounded-xl shadow-lg shadow-[#5483B3]/20 transition-all mt-4"
               >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Sesi Belajar'}
               </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Jam', value: `${totalHours}h`, icon: Clock, color: '#5483B3', bg: 'rgba(84, 131, 179, 0.1)' },
          { label: 'Topik Selesai', value: `${completedTopicsCount}/${totalTopicsAvailable}`, icon: CheckCircle2, color: '#22C55E', bg: 'rgba(34, 197, 94, 0.1)' },
          { label: 'Streak Belajar', value: `${currentStreak} Hari`, icon: Zap, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
          { label: 'Avg. Kesulitan', value: avgDifficulty, icon: BarChart3, color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.1)' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
          >
            <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="h-10 w-10 rounded-xl mb-4 flex items-center justify-center" style={{ backgroundColor: stat.bg }}>
                  <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
                </div>
                <h3 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)] mb-1">{stat.value}</h3>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Heatmap Activity */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-sm">
               <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <div>
                    <CardTitle className="text-sm font-bold text-[var(--foreground)]">Aktivitas Belajar</CardTitle>
                    <p className="text-[11px] text-[var(--muted-foreground)] font-medium mt-0.5">16 Minggu Terakhir</p>
                  </div>
                  <div className="flex items-center gap-2 bg-[var(--muted)] px-3 py-1.5 rounded-lg">
                     <span className="text-[9px] text-[var(--muted-foreground)] font-bold uppercase">Less</span>
                     <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-[2px] bg-[var(--muted-foreground)]/20" />
                        <div className="w-2.5 h-2.5 rounded-[2px] bg-[#5483B3]/20" />
                        <div className="w-2.5 h-2.5 rounded-[2px] bg-[#5483B3]/50" />
                        <div className="w-2.5 h-2.5 rounded-[2px] bg-[#5483B3]/80" />
                        <div className="w-2.5 h-2.5 rounded-[2px] bg-[#5483B3]" />
                     </div>
                     <span className="text-[9px] text-[var(--muted-foreground)] font-bold uppercase">More</span>
                  </div>
               </CardHeader>
               <CardContent>
                  <div className="grid grid-cols-[repeat(16,1fr)] gap-1.5">
                     {heatmapData.map((day, i) => (
                        <div 
                          key={i} 
                          title={day.date}
                          className={`aspect-square rounded-[3px] transition-all hover:scale-125 hover:shadow-md cursor-pointer ${
                            day.intensity === 0 ? 'bg-[var(--muted)]' : 
                            day.intensity === 1 ? 'bg-[#5483B3]/20' :
                            day.intensity === 2 ? 'bg-[#5483B3]/50' :
                            day.intensity === 3 ? 'bg-[#5483B3]/80' : 'bg-[#5483B3]'
                          }`} 
                        />
                     ))}
                  </div>
               </CardContent>
            </Card>
          </motion.div>

          {/* History List */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-4">
             <div className="flex items-center gap-2 px-1">
               <Activity className="h-4 w-4 text-[var(--muted-foreground)]" />
               <h3 className="text-sm font-bold text-[var(--foreground)]">Riwayat Sesi Belajar</h3>
             </div>
             
             <div className="space-y-3">
               {logs?.length > 0 ? logs.map((log: any, i: number) => (
                 <Card key={i} className="bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-sm hover:border-[#5483B3]/30 transition-all">
                    <CardContent className="p-4 md:p-5">
                       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-4 md:gap-5">
                             <div className="text-center w-14 h-14 bg-[#5483B3]/10 text-[#5483B3] rounded-xl flex flex-col items-center justify-center shrink-0">
                                <p className="text-[9px] font-bold uppercase tracking-wider">{new Date(log.loggedAt).toLocaleDateString('id-ID', { month: 'short' })}</p>
                                <p className="text-lg font-extrabold leading-none">{new Date(log.loggedAt).getDate()}</p>
                             </div>
                             <div className="min-w-0">
                                <h4 className="text-sm font-bold text-[var(--foreground)] truncate">{log.topic.name}</h4>
                                <p className="text-[11px] font-medium text-[var(--muted-foreground)] mt-1 flex items-center gap-1.5">
                                  <span>{log.topic.subject.name}</span>
                                  <span className="w-1 h-1 rounded-full bg-[var(--muted-foreground)] opacity-50" />
                                  <span className="text-[#5483B3] font-semibold">{log.duration} Menit</span>
                                </p>
                             </div>
                          </div>
                          <div className="flex items-center gap-1 bg-[var(--muted)] px-3 py-1.5 rounded-lg shrink-0 w-fit">
                             {Array.from({ length: 5 }).map((_, s) => (
                               <div key={s} className={`w-1.5 h-1.5 rounded-full ${s < log.difficulty ? 'bg-[#F59E0B]' : 'bg-[var(--border)]'}`} />
                             ))}
                          </div>
                       </div>
                    </CardContent>
                 </Card>
               )) : (
                 <div className="py-12 text-center border border-dashed border-[var(--border)] rounded-2xl bg-[var(--card)]">
                    <Clock className="h-8 w-8 mx-auto text-[var(--muted-foreground)] mb-3 opacity-50" />
                    <p className="text-sm font-semibold text-[var(--muted-foreground)]">Belum ada riwayat belajar</p>
                    <p className="text-[11px] text-[var(--muted-foreground)] mt-1">Mulai catat sesimu hari ini!</p>
                 </div>
               )}
             </div>
          </motion.div>
        </div>

        {/* Right Sidebar - Weekly Target Panel */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-sm h-fit sticky top-28">
             <CardHeader className="pb-4 border-b border-[var(--border)]">
                <CardTitle className="text-sm font-bold text-[var(--foreground)]">Target Mingguan</CardTitle>
                <p className="text-[11px] font-medium text-[var(--muted-foreground)]">Pencapaian dari target minimalmu</p>
             </CardHeader>
             <CardContent className="p-5 space-y-6 pt-5">
                {subjects.map((sub: any, i: number) => {
                  const now = new Date()
                  const sevenDaysAgo = new Date()
                  sevenDaysAgo.setDate(now.getDate() - 7)
                  
                  const weeklyMinutes = logs
                    ?.filter((l: any) => l.topic.subjectId === sub.subjectId && new Date(l.loggedAt) >= sevenDaysAgo)
                    .reduce((acc: number, l: any) => acc + l.duration, 0) || 0
                  
                  const weeklyHours = (weeklyMinutes / 60).toFixed(1)
                  const targetHours = sub.targetHours || 10
                  const progressPercent = Math.min((parseFloat(weeklyHours) / targetHours) * 100, 100) || 0
                  const isAchieved = progressPercent >= 100

                  return (
                    <div key={i} className="space-y-3">
                       <div className="flex justify-between items-start">
                          <div className="min-w-0 pr-3">
                            <h4 className="text-xs font-bold text-[var(--foreground)] truncate">{sub.subject.name}</h4>
                            <p className="text-[10px] font-medium text-[var(--muted-foreground)] mt-0.5">
                              {weeklyHours} dari {targetHours} Jam
                            </p>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                            isAchieved ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-[#5483B3]/10 text-[#5483B3]'
                          }`}>
                            {Math.round(progressPercent)}%
                          </span>
                       </div>
                       
                       <div className="w-full bg-[var(--muted)] rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ease-out ${isAchieved ? 'bg-[#22C55E]' : 'bg-[#5483B3]'}`} 
                            style={{ width: `${progressPercent}%` }}
                          />
                       </div>
                    </div>
                  )
                })}
                
                <div className="pt-6 mt-4">
                   <div className="bg-gradient-to-br from-[#5483B3] to-[#3B6FA0] p-5 rounded-2xl flex flex-col items-center text-center text-white relative overflow-hidden shadow-md">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2" />
                      <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center mb-3 relative z-10 backdrop-blur-sm">
                        <Trophy className="h-6 w-6 text-white" />
                      </div>
                      <h5 className="text-sm font-bold tracking-tight mb-1.5 relative z-10">Tingkatkan Streak!</h5>
                      <p className="text-[11px] font-medium text-white/80 leading-relaxed relative z-10">
                        {currentStreak > 0 
                          ? `Luar biasa! Kamu sudah mempertahankan streak selama ${currentStreak} hari berturut-turut.`
                          : "Mulai sesi belajar pertamamu hari ini untuk membangun streak!"}
                      </p>
                   </div>
                </div>
             </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
