'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, ListChecks, Calendar, Users, 
  MoreVertical, Edit2, Trash2, CheckCircle2, 
  Clock, FileText, AlertCircle, ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format } from 'date-fns'

export function TugasClient({ initialAssignments, subjects, classes }: any) {
  const [assignments, setAssignments] = React.useState(initialAssignments)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [filter, setFilter] = React.useState('ALL')

  const filteredAssignments = assignments.filter((a: any) => 
    filter === 'ALL' || a.status === filter
  )

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-bold tracking-tight text-white">Tugas & Penilaian</h1>
          <p className="text-white/50 text-lg mt-1">Buat tugas baru dan nilai hasil pekerjaan siswa.</p>
        </motion.div>
        <Button onClick={() => setIsModalOpen(true)} className="rounded-xl bg-primary hover:bg-primary/90 h-12 px-6">
          <Plus className="mr-2 h-5 w-5" /> Buat Tugas
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-[#1C1C1E] border border-[#3A3A3C] rounded-2xl w-fit">
        {['ALL', 'PUBLISHED', 'DRAFT', 'CLOSED'].map(t => (
          <button 
            key={t}
            onClick={() => setFilter(t)}
            className={cn(
              "px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-xl transition-all",
              filter === t ? "bg-primary text-white" : "text-white/40 hover:text-white"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Assignment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssignments.map((a: any) => {
          const ungradedCount = a.submissions.filter((s: any) => s.score === null).length
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-3xl bg-[#1C1C1E] border border-[#3A3A3C] group hover:border-white/20 transition-all cursor-pointer relative"
            >
              <div className="flex items-start justify-between mb-4">
                <Badge className={cn("rounded-full px-3 py-1", 
                  a.status === 'PUBLISHED' ? "bg-green-500/10 text-green-400" : a.status === 'DRAFT' ? "bg-white/5 text-white/40" : "bg-red-500/10 text-red-400"
                )}>
                  {a.status}
                </Badge>
                <div className="flex items-center gap-2">
                  {ungradedCount > 0 && (
                    <Badge className="bg-orange-500 text-white border-none h-6 w-6 p-0 flex items-center justify-center rounded-full animate-pulse">
                      {ungradedCount}
                    </Badge>
                  )}
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white/20">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <h4 className="text-xl font-bold text-white mb-2 truncate group-hover:text-primary transition-colors">{a.title}</h4>
              
              <div className="flex items-center gap-2 mb-6">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: a.subject.color }} />
                <span className="text-xs text-white/40">{a.subject.name} • {a.class?.name || 'Semua Kelas'}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 rounded-2xl bg-black/20 border border-white/5">
                  <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-1">Kumpul</p>
                  <p className="text-sm font-bold text-white">{a.submissions.length}</p>
                </div>
                <div className="p-3 rounded-2xl bg-black/20 border border-white/5">
                  <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-1">Deadline</p>
                  <p className="text-sm font-bold text-white">{format(new Date(a.deadline), 'dd/MM')}</p>
                </div>
              </div>

              <Button className="w-full h-11 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 group-hover:border-primary/50 text-white/70">
                Lihat Pengumpulan <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )
        })}

        {filteredAssignments.length === 0 && (
          <div className="md:col-span-2 lg:col-span-3 py-20 text-center border-2 border-dashed border-[#3A3A3C] rounded-[40px] opacity-20">
             <ListChecks className="h-16 w-16 mx-auto mb-4" />
             <p>Tidak ada tugas dengan kriteria ini.</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-[#1C1C1E] border-[#3A3A3C] text-white rounded-[32px] sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Buat Tugas Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <Label>Judul Tugas</Label>
              <Input placeholder="Contoh: Laporan Analisis Data" className="bg-black/20 border-white/10 h-12 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Deskripsi & Instruksi</Label>
              <Textarea placeholder="Berikan instruksi detail untuk siswa..." className="bg-black/20 border-white/10 rounded-xl min-h-[120px]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Mata Pelajaran</Label>
                <Select>
                  <SelectTrigger className="bg-black/20 border-white/10 h-12 rounded-xl">
                    <SelectValue placeholder="Pilih Mapel" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1C1C1E] border-[#3A3A3C] text-white">
                    {subjects.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Target Kelas</Label>
                <Select>
                  <SelectTrigger className="bg-black/20 border-white/10 h-12 rounded-xl">
                    <SelectValue placeholder="Pilih Kelas" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1C1C1E] border-[#3A3A3C] text-white">
                    {classes.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Deadline</Label>
                <Input type="datetime-local" className="bg-black/20 border-white/10 h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Nilai Maksimal</Label>
                <Input type="number" defaultValue={100} className="bg-black/20 border-white/10 h-12 rounded-xl" />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button className="bg-primary hover:bg-primary/90 h-12 px-8 rounded-xl font-bold">Publikasikan Sekarang</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
