'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Plus, Star, Clock, BookOpen, Target, Calendar, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"

export function ProgressClient({ stats, heatmapData, weeklyGoals, subjects }: any) {
  const [isLogOpen, setIsLogOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  
  // Form state
  const [selectedSubject, setSelectedSubject] = React.useState('')
  const [selectedTopic, setSelectedTopic] = React.useState('')
  const [duration, setDuration] = React.useState([45])
  const [difficulty, setDifficulty] = React.useState(3)
  const [notes, setNotes] = React.useState('')

  const availableTopics = React.useMemo(() => {
    const sub = subjects.find((s: any) => s.id === selectedSubject)
    return sub?.topics || []
  }, [selectedSubject, subjects])

  const handleLogSubmit = async () => {
    if (!selectedSubject || !selectedTopic) {
      toast.error('Pilih mata pelajaran dan topik')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectId: selectedSubject,
          topicId: selectedTopic,
          duration: duration[0],
          difficulty,
          notes
        })
      })

      if (res.ok) {
        toast.success('Log belajar berhasil disimpan!')
        setIsLogOpen(false)
        // Reset form
        setSelectedSubject('')
        setSelectedTopic('')
        setDuration([45])
        setDifficulty(3)
        setNotes('')
      } else {
        throw new Error('Gagal menyimpan log')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-bold tracking-tight text-white">Progress Saya</h1>
          <p className="text-white/50 text-lg mt-1">Pantau kemajuan belajarmu secara mendalam.</p>
        </motion.div>
        
        <Dialog open={isLogOpen} onOpenChange={setIsLogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-2xl px-8 bg-primary hover:bg-primary/90 h-14 text-lg font-bold shadow-2xl shadow-primary/30">
              <Plus className="mr-2 h-6 w-6" /> Log Belajar
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1C1C1E] border-[#3A3A3C] text-white sm:max-w-[500px] rounded-[32px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Catat Aktivitas Belajar</DialogTitle>
              <DialogDescription className="text-white/50">
                Log materi yang baru saja kamu pelajari hari ini.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label>Mata Pelajaran</Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="bg-black/20 border-white/10 rounded-xl h-12">
                    <SelectValue placeholder="Pilih Mata Pelajaran" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1C1C1E] border-[#3A3A3C] text-white">
                    {subjects.map((s: any) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Topik</Label>
                <Select value={selectedTopic} onValueChange={setSelectedTopic} disabled={!selectedSubject}>
                  <SelectTrigger className="bg-black/20 border-white/10 rounded-xl h-12">
                    <SelectValue placeholder="Pilih Topik" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1C1C1E] border-[#3A3A3C] text-white">
                    {availableTopics.map((t: any) => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Durasi Belajar</Label>
                  <span className="text-primary font-bold">{duration[0]} Menit</span>
                </div>
                <Slider 
                  value={duration} 
                  onValueChange={setDuration} 
                  max={180} 
                  min={15} 
                  step={15} 
                  className="py-4"
                />
              </div>

              <div className="space-y-4">
                <Label>Tingkat Kesulitan</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onClick={() => setDifficulty(s)}
                      className={cn(
                        "flex-1 h-12 rounded-xl border transition-all flex items-center justify-center",
                        difficulty >= s ? "bg-primary/20 border-primary text-primary" : "bg-black/20 border-white/10 text-white/30"
                      )}
                    >
                      <Star className={cn("h-5 w-5", difficulty >= s && "fill-current")} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Catatan (Opsional)</Label>
                <Textarea 
                  placeholder="Apa saja yang kamu pelajari? Kendala apa yang dihadapi?" 
                  className="bg-black/20 border-white/10 rounded-xl resize-none"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleLogSubmit} 
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 font-bold"
                disabled={loading}
              >
                {loading ? 'Menyimpan...' : 'Simpan Progress'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Jam Belajar', value: `${stats.totalHours} jam`, icon: Clock, color: 'text-blue-400' },
          { label: 'Topik Selesai', value: stats.completedTopics, icon: BookOpen, color: 'text-green-400' },
          { label: 'Streak Terpanjang', value: `${stats.longestStreak} hari`, icon: Target, color: 'text-orange-400' },
          { label: 'Avg Kesulitan', value: stats.avgDifficulty, icon: Star, color: 'text-yellow-400' },
        ].map((stat, i) => (
          <div key={stat.label} className="p-6 rounded-3xl bg-[#1C1C1E] border border-[#3A3A3C]">
            <p className="text-xs font-medium text-white/40 uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
              <stat.icon className={cn("h-6 w-6", stat.color)} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Heatmap */}
        <Card className="lg:col-span-2 p-8 rounded-3xl bg-[#1C1C1E] border-[#3A3A3C]">
          <h3 className="text-xl font-bold text-white mb-6">Aktivitas Belajar</h3>
          <div className="flex flex-wrap gap-1 md:gap-1.5">
            {heatmapData.map((d: any, i: number) => {
              const opacity = d.minutes === 0 ? 0.05 : d.minutes < 30 ? 0.3 : d.minutes < 60 ? 0.6 : 1
              return (
                <div 
                  key={i} 
                  className="h-3 w-3 md:h-4 md:w-4 rounded-sm bg-primary transition-all hover:scale-125 cursor-help"
                  style={{ opacity }}
                  title={`${d.date.split('T')[0]}: ${d.minutes} menit`}
                />
              )
            })}
          </div>
          <div className="mt-6 flex items-center justify-end gap-2 text-[10px] text-white/30 uppercase tracking-widest font-bold">
            <span>Kurang</span>
            <div className="flex gap-1">
              {[0.05, 0.3, 0.6, 1].map(o => <div key={o} className="h-2 w-2 rounded-sm bg-primary" style={{ opacity: o }} />)}
            </div>
            <span>Lebih</span>
          </div>
        </Card>

        {/* Weekly Goals */}
        <Card className="p-8 rounded-3xl bg-[#1C1C1E] border-[#3A3A3C]">
          <h3 className="text-xl font-bold text-white mb-6">Target Mingguan</h3>
          <div className="space-y-6">
            {weeklyGoals.map((goal: any) => {
              const current = Math.floor(Math.random() * goal.targetHours) // Simulated
              const progress = (current / goal.targetHours) * 100
              return (
                <div key={goal.id} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/70 font-medium">{goal.subject.name}</span>
                    <span className="text-white/40">{current} / {goal.targetHours} jam</span>
                  </div>
                  <Progress value={progress} className="h-1.5 bg-black/40" style={{ '--progress-foreground': goal.subject.color } as any} />
                </div>
              )
            })}
          </div>
          <Button variant="ghost" className="w-full mt-6 rounded-xl hover:bg-white/5 text-white/30 text-xs uppercase tracking-widest font-bold">
            Edit Target
          </Button>
        </Card>
      </div>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
