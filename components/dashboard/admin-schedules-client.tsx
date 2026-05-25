'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Calendar,
  Clock,
  MapPin,
  MoreVertical,
  Edit3,
  Users,
  DownloadCloud,
  UploadCloud,
  Trash2,
  BookOpen
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

export function AdminSchedulesClient({ initialSchedules, classes, subjects, teachers }: any) {
  const [schedules, setSchedules] = useState(initialSchedules)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    classId: '',
    subjectId: '',
    teacherId: '',
    dayOfWeek: 0,
    startTime: '08:00',
    endTime: '09:30',
    room: ''
  })

  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/admin/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        const newSchedule = await res.json()
        setSchedules([...schedules, newSchedule])
        toast.success('Jadwal berhasil ditambahkan')
        setIsAddOpen(false)
      } else {
        toast.error('Gagal menambahkan jadwal')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan sistem')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditSchedule = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSchedule?.id) {
      toast.error('ID Jadwal tidak ditemukan')
      return
    }
    
    setIsSubmitting(true)
    console.log("UPDATING SCHEDULE:", selectedSchedule.id, formData)
    
    try {
      const res = await fetch(`/api/admin/schedules/${selectedSchedule.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        const updatedSchedule = await res.json()
        setSchedules(schedules.map((s: any) => s.id === selectedSchedule.id ? updatedSchedule : s))
        toast.success('Jadwal berhasil diperbarui')
        setIsEditOpen(false)
      } else {
        const errData = await res.text()
        console.error("EDIT ERROR:", errData)
        toast.error('Gagal memperbarui jadwal')
      }
    } catch (error) {
      console.error("EDIT CATCH:", error)
      toast.error('Terjadi kesalahan sistem')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteSchedule = async () => {
    if (!selectedSchedule?.id) {
      toast.error('ID Jadwal tidak ditemukan')
      return
    }

    setIsSubmitting(true)
    console.log("DELETING SCHEDULE:", selectedSchedule.id)

    try {
      const res = await fetch(`/api/admin/schedules/${selectedSchedule.id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setSchedules(schedules.filter((s: any) => s.id !== selectedSchedule.id))
        toast.success('Jadwal berhasil dihapus')
        setIsDeleteOpen(false)
      } else {
        toast.error('Gagal menghapus jadwal')
      }
    } catch (error) {
      console.error("DELETE CATCH:", error)
      toast.error('Terjadi kesalahan sistem')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleExport = () => {
    const csvRows = [
      ['ID', 'Kelas', 'Mapel', 'Guru', 'Hari', 'Mulai', 'Selesai', 'Ruang'],
      ...schedules.map((s: any) => [
        s.id,
        s.class?.name || '-',
        s.subject?.name || '-',
        s.teacher?.name || '-',
        DAYS[s.dayOfWeek],
        s.startTime,
        s.endTime,
        s.room || '-'
      ])
    ]

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "edutrack_schedules_export.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Jadwal diekspor')
  }

  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      const text = event.target?.result as string
      const lines = text.split('\n').filter(line => line.trim())
      if (lines.length < 2) {
        toast.error('File CSV kosong atau tidak valid')
        return
      }

      const dataRows = lines.slice(1)
      setIsSubmitting(true)
      
      let successCount = 0
      let failCount = 0

      for (const row of dataRows) {
        const [classId, subjectId, teacherId, dayOfWeek, startTime, endTime, room] = row.split(',').map(s => s.trim())
        if (!classId || !subjectId || !teacherId) continue

        try {
          const res = await fetch('/api/admin/schedules', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              classId,
              subjectId,
              teacherId,
              dayOfWeek: parseInt(dayOfWeek) || 0,
              startTime: startTime || '08:00',
              endTime: endTime || '09:30',
              room: room || ''
            })
          })
          if (res.ok) {
            const newSchedule = await res.json()
            setSchedules((prev: any) => [...prev, newSchedule])
            successCount++
          } else {
            failCount++
          }
        } catch (error) {
          failCount++
        }
      }

      toast.success(`Import selesai: ${successCount} berhasil, ${failCount} gagal`)
      setIsSubmitting(false)
      e.target.value = ''
    }
    reader.readAsText(file)
  }

  const handleTeacherChange = (teacherId: string) => {
    const teacher = teachers.find((t: any) => t.id === teacherId)
    const firstSubject = teacher?.teacherSubjects?.[0]
    
    setFormData({
      ...formData,
      teacherId,
      subjectId: firstSubject ? firstSubject.id : formData.subjectId
    })
  }

  const openEdit = (s: any) => {
    setSelectedSchedule(s)
    setFormData({
      classId: s.classId,
      subjectId: s.subjectId,
      teacherId: s.teacherId,
      dayOfWeek: s.dayOfWeek,
      startTime: s.startTime,
      endTime: s.endTime,
      room: s.room || ''
    })
    setIsEditOpen(true)
  }

  const openDelete = (s: any) => {
    setSelectedSchedule(s)
    setIsDeleteOpen(true)
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-[#5483B3] font-bold uppercase tracking-wider text-xs mb-2">
            Scheduling System
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">Kelola Jadwal</h1>
          <p className="text-sm font-medium text-[var(--muted-foreground)] mt-2">Atur pembagian waktu dan ruang belajar mengajar.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
            <Button 
                 onClick={handleExport}
                 variant="outline"
                 className="border-[var(--border)] hover:bg-[var(--muted)] text-[var(--foreground)] rounded-xl h-11 px-4 font-bold shadow-sm"
            >
               <DownloadCloud className="h-4 w-4 text-[#5483B3]" />
            </Button>

            <div className="relative">
              <input 
                type="file" 
                id="schedule-csv-import" 
                accept=".csv" 
                className="hidden" 
                onChange={handleImportCSV} 
              />
              <Button 
                   onClick={() => document.getElementById('schedule-csv-import')?.click()}
                   variant="outline"
                   className="border-[var(--border)] hover:bg-[var(--muted)] text-[var(--foreground)] rounded-xl h-11 px-4 font-bold shadow-sm"
              >
                 <UploadCloud className="h-4 w-4 text-[#5483B3]" />
              </Button>
            </div>
            
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#5483B3] hover:bg-[#3B6FA0] text-white rounded-xl font-bold text-sm h-11 px-6 shadow-md transition-all gap-2 w-full sm:w-auto">
                  <Plus className="h-4 w-4" /> Tambah Jadwal
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[var(--card)] border-[var(--border)] text-[var(--foreground)] max-w-lg rounded-2xl shadow-xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-extrabold tracking-tight">Tambah Jadwal</DialogTitle>
                  <DialogDescription className="text-sm font-medium text-[var(--muted-foreground)]">Formulir pengaturan waktu belajar baru untuk mata pelajaran dan kelas tertentu.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddSchedule} className="space-y-5 py-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-[var(--foreground)]">Kelas</Label>
                      <Select value={formData.classId} onValueChange={(v) => setFormData({...formData, classId: v})}>
                        <SelectTrigger className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]">
                          <SelectValue placeholder="Pilih Kelas" />
                        </SelectTrigger>
                        <SelectContent className="bg-[var(--card)] border-[var(--border)] rounded-xl shadow-lg">
                          {classes.map((c: any) => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-[var(--foreground)]">Mapel</Label>
                      <Select value={formData.subjectId} onValueChange={(v) => setFormData({...formData, subjectId: v})}>
                        <SelectTrigger className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]">
                          <SelectValue placeholder="Pilih Mapel" />
                        </SelectTrigger>
                        <SelectContent className="bg-[var(--card)] border-[var(--border)] rounded-xl shadow-lg">
                          {subjects.map((s: any) => (
                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-[var(--foreground)]">Guru Pengampu</Label>
                    <Select value={formData.teacherId} onValueChange={handleTeacherChange}>
                      <SelectTrigger className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]">
                        <SelectValue placeholder="Pilih Guru" />
                      </SelectTrigger>
                      <SelectContent className="bg-[var(--card)] border-[var(--border)] rounded-xl shadow-lg">
                        {teachers.map((t: any) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.name} {t.teacherSubjects?.[0] ? `(${t.teacherSubjects[0].name})` : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-[var(--foreground)]">Hari</Label>
                      <Select value={formData.dayOfWeek.toString()} onValueChange={(v) => setFormData({...formData, dayOfWeek: parseInt(v)})}>
                        <SelectTrigger className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]">
                          <SelectValue placeholder="Pilih Hari" />
                        </SelectTrigger>
                        <SelectContent className="bg-[var(--card)] border-[var(--border)] rounded-xl shadow-lg">
                          {DAYS.map((day, i) => (
                            <SelectItem key={i} value={i.toString()}>{day}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-[var(--foreground)]">Ruangan</Label>
                      <Input value={formData.room} onChange={(e) => setFormData({...formData, room: e.target.value})} className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]" placeholder="Lab RPL 1" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-[var(--foreground)]">Jam Mulai</Label>
                      <Input type="time" value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})} className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-[var(--foreground)]">Jam Selesai</Label>
                      <Input type="time" value={formData.endTime} onChange={(e) => setFormData({...formData, endTime: e.target.value})} className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]" />
                    </div>
                  </div>
                  <Button disabled={isSubmitting} className="w-full h-12 bg-[#5483B3] hover:bg-[#3B6FA0] text-white font-bold rounded-xl text-sm shadow-md mt-4">
                    {isSubmitting ? 'Memproses...' : 'Simpan Jadwal'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schedules.map((s: any, i: number) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="h-full"
          >
            <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl hover:shadow-md transition-all group relative overflow-hidden h-full flex flex-col hover:-translate-y-1">
               <div className="absolute -top-6 -right-6 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none text-[#5483B3]">
                  <Calendar className="h-32 w-32" />
               </div>
               <div className="h-2 w-full transition-all group-hover:opacity-80" style={{ backgroundColor: s.subject?.color || '#5483B3' }} />
               <CardContent className="p-6 md:p-8 space-y-6 flex-1 flex flex-col relative z-10">
                  <div className="flex justify-between items-start">
                     <Badge className="bg-[#5483B3]/10 text-[#5483B3] border-none rounded-md text-xs font-bold px-3 py-1">
                        {DAYS[s.dayOfWeek]}
                     </Badge>
                  </div>

                  <div className="space-y-1.5 flex-1 mt-2">
                     <h3 className="text-2xl font-bold tracking-tight text-[var(--foreground)] group-hover:text-[#5483B3] transition-colors">{s.subject?.name}</h3>
                     <p className="text-sm font-medium text-[#5483B3]">Kelas {s.class?.name}</p>
                  </div>

                  <div className="space-y-3 pt-5 border-t border-[var(--border)]">
                     <div className="flex items-center gap-3 text-[var(--muted-foreground)]">
                        <div className="bg-[#5483B3]/10 p-1.5 rounded-md">
                           <Clock className="h-3.5 w-3.5 text-[#5483B3]" />
                        </div>
                        <span className="text-xs font-bold">{s.startTime} — {s.endTime}</span>
                     </div>
                     <div className="flex items-center gap-3 text-[var(--muted-foreground)]">
                        <div className="bg-[#5483B3]/10 p-1.5 rounded-md">
                           <MapPin className="h-3.5 w-3.5 text-[#5483B3]" />
                        </div>
                        <span className="text-xs font-bold">{s.room || 'Tidak Ada Ruangan'}</span>
                     </div>
                     <div className="flex items-center gap-3 text-[var(--muted-foreground)]">
                        <div className="bg-[#5483B3]/10 p-1.5 rounded-md">
                           <Users className="h-3.5 w-3.5 text-[#5483B3]" />
                        </div>
                        <span className="text-xs font-bold truncate">{s.teacher?.name}</span>
                     </div>
                  </div>

                  <div className="flex items-center justify-end gap-1 pt-4 border-t border-[var(--border)] mt-auto">
                     <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--muted-foreground)] hover:text-[#5483B3] hover:bg-[#5483B3]/10 rounded-lg transition-colors" onClick={() => openEdit(s)}>
                        <Edit3 className="h-4 w-4" />
                     </Button>
                     <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--muted-foreground)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" onClick={() => openDelete(s)}>
                        <Trash2 className="h-4 w-4" />
                     </Button>
                  </div>
               </CardContent>
            </Card>
          </motion.div>
        ))}
        {schedules.length === 0 && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 py-24 text-center border-2 border-dashed border-[var(--border)] rounded-2xl bg-[var(--card)]">
            <div className="h-16 w-16 bg-[var(--muted)] rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-[var(--muted-foreground)] opacity-50" />
            </div>
            <h3 className="text-sm font-bold text-[var(--foreground)] mb-1">Belum ada jadwal</h3>
            <p className="text-xs font-medium text-[var(--muted-foreground)]">Silakan tambah jadwal baru untuk kelas dan mata pelajaran.</p>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-[var(--card)] border-[var(--border)] text-[var(--foreground)] max-w-lg rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-extrabold tracking-tight">Edit Jadwal</DialogTitle>
            <DialogDescription className="text-sm font-medium text-[var(--muted-foreground)]">Ubah waktu, hari, atau mata pelajaran pada jadwal yang sudah ada.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSchedule} className="space-y-5 py-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-[var(--foreground)]">Kelas</Label>
                <Select value={formData.classId} onValueChange={(v) => setFormData({...formData, classId: v})}>
                  <SelectTrigger className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]">
                    <SelectValue placeholder="Pilih Kelas" />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--card)] border-[var(--border)] rounded-xl shadow-lg">
                    {classes.map((c: any) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-[var(--foreground)]">Mapel</Label>
                <Select value={formData.subjectId} onValueChange={(v) => setFormData({...formData, subjectId: v})}>
                  <SelectTrigger className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]">
                    <SelectValue placeholder="Pilih Mapel" />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--card)] border-[var(--border)] rounded-xl shadow-lg">
                    {subjects.map((s: any) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-[var(--foreground)]">Guru Pengampu</Label>
              <Select value={formData.teacherId} onValueChange={handleTeacherChange}>
                <SelectTrigger className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]">
                  <SelectValue placeholder="Pilih Guru" />
                </SelectTrigger>
                <SelectContent className="bg-[var(--card)] border-[var(--border)] rounded-xl shadow-lg">
                  {teachers.map((t: any) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name} {t.teacherSubjects?.[0] ? `(${t.teacherSubjects[0].name})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-[var(--foreground)]">Hari</Label>
                <Select value={formData.dayOfWeek.toString()} onValueChange={(v) => setFormData({...formData, dayOfWeek: parseInt(v)})}>
                  <SelectTrigger className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]">
                    <SelectValue placeholder="Pilih Hari" />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--card)] border-[var(--border)] rounded-xl shadow-lg">
                    {DAYS.map((day, i) => (
                      <SelectItem key={i} value={i.toString()}>{day}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-[var(--foreground)]">Ruangan</Label>
                <Input value={formData.room} onChange={(e) => setFormData({...formData, room: e.target.value})} className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-[var(--foreground)]">Jam Mulai</Label>
                <Input type="time" value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})} className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-[var(--foreground)]">Jam Selesai</Label>
                <Input type="time" value={formData.endTime} onChange={(e) => setFormData({...formData, endTime: e.target.value})} className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]" />
              </div>
            </div>
            <Button disabled={isSubmitting} className="w-full h-12 bg-[#5483B3] hover:bg-[#3B6FA0] text-white font-bold rounded-xl text-sm shadow-md mt-4">
              {isSubmitting ? 'Memproses...' : 'Perbarui Jadwal'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="bg-[var(--card)] border-[var(--border)] text-[var(--foreground)] max-w-sm rounded-2xl shadow-xl overflow-hidden p-0">
          <div className="p-6 md:p-8 text-center">
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="h-8 w-8 text-red-600" />
            </div>
            <DialogTitle className="text-xl font-bold mb-2">Hapus Jadwal?</DialogTitle>
            <DialogDescription className="text-sm font-medium text-[var(--muted-foreground)] leading-relaxed">
               Tindakan ini akan menghapus sesi belajar dari kalender sistem secara permanen.
            </DialogDescription>
            <div className="flex flex-col gap-3 mt-6">
              <Button disabled={isSubmitting} variant="destructive" className="w-full rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs h-11 shadow-md" onClick={handleDeleteSchedule}>
                {isSubmitting ? 'Menghapus...' : 'Ya, Hapus Sekarang'}
              </Button>
              <Button variant="outline" className="w-full rounded-xl border-[var(--border)] font-bold text-xs h-11" onClick={() => setIsDeleteOpen(false)}>
                Batal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
