'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Search, 
  BookOpen, 
  User, 
  Layers,
  MoreVertical,
  Edit3,
  Trash2,
  Save,
  Palette,
  AlertTriangle,
  HelpCircle,
  DownloadCloud,
  UploadCloud,
  X
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from '@/components/ui/textarea'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const PRESET_COLORS = [
  '#5483B3', // Brand Primary
  '#0A84FF', // Blue
  '#FF375F', // Red
  '#32D74B', // Green
  '#FFD60A', // Yellow
  '#BF5AF2', // Purple
  '#FF9F0A', // Orange
  '#64D2FF', // Sky
  '#5E5CE6', // Indigo
  '#AC8E68', // Brown
  '#FF453A', // Crimson
]

export function AdminSubjectsClient({ initialSubjects, teachers, classes }: any) {
  const [subjects, setSubjects] = useState(initialSubjects)
  const [search, setSearch] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#5483B3',
    teacherId: ''
  })

  // Local color state to prevent lag during dragging
  const [localColor, setLocalColor] = useState('#5483B3')

  const [isAddTopicOpen, setIsAddTopicOpen] = useState(false)
  const [newTopicName, setNewTopicName] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    isDestructive?: boolean;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {},
    isDestructive: false
  })


  // Material CRUD states in AdminSubjectsClient
  const [isAddMaterialOpen, setIsAddMaterialOpen] = useState(false)
  const [isEditMaterialOpen, setIsEditMaterialOpen] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null)
  
  const [materialFormData, setMaterialFormData] = useState({
    title: '',
    description: '',
    classId: 'all',
    status: 'BELUM_DITUGASKAN',
    attachments: [] as { name: string; url: string }[]
  })
  const [newMatAttachName, setNewMatAttachName] = useState('')
  const [newMatAttachUrl, setNewMatAttachUrl] = useState('')

  const addMaterialAttachment = () => {
    if (!newMatAttachName.trim() || !newMatAttachUrl.trim()) {
      toast.error('Lengkapi nama dan URL lampiran')
      return
    }
    let url = newMatAttachUrl.trim()
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url
    }
    setMaterialFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, { name: newMatAttachName.trim(), url }]
    }))
    setNewMatAttachName('')
    setNewMatAttachUrl('')
  }

  const removeMaterialAttachment = (index: number) => {
    setMaterialFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }))
  }

  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!materialFormData.title) {
      toast.error('Judul materi wajib diisi')
      return
    }
    setIsSubmitting(true)
    const toastId = toast.loading('Menambahkan materi...')
    try {
      const res = await fetch('/api/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...materialFormData,
          subjectId: selectedSubject.id
        })
      })
      if (res.ok) {
        const newMat = await res.json()
        toast.success('Materi berhasil ditambahkan', { id: toastId })
        setIsAddMaterialOpen(false)
        
        // Mutate local state
        const updatedSelected = {
          ...selectedSubject,
          materials: [newMat, ...(selectedSubject.materials || [])]
        }
        setSelectedSubject(updatedSelected)
        setSubjects(subjects.map((s: any) => s.id === updatedSelected.id ? updatedSelected : s))
      } else {
        const err = await res.text()
        toast.error(err || 'Gagal menambahkan materi', { id: toastId })
      }
    } catch (e) {
      toast.error('Kesalahan koneksi', { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditMaterialSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!materialFormData.title) {
      toast.error('Judul materi wajib diisi')
      return
    }
    setIsSubmitting(true)
    const toastId = toast.loading('Menyimpan materi...')
    try {
      const res = await fetch(`/api/materials/${selectedMaterial.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(materialFormData)
      })
      if (res.ok) {
        const updatedMat = await res.json()
        toast.success('Materi berhasil diperbarui', { id: toastId })
        setIsEditMaterialOpen(false)
        
        // Mutate local state
        const updatedSelected = {
          ...selectedSubject,
          materials: selectedSubject.materials.map((m: any) => m.id === selectedMaterial.id ? updatedMat : m)
        }
        setSelectedSubject(updatedSelected)
        setSubjects(subjects.map((s: any) => s.id === updatedSelected.id ? updatedSelected : s))
      } else {
        const err = await res.text()
        toast.error(err || 'Gagal memperbarui materi', { id: toastId })
      }
    } catch (e) {
      toast.error('Kesalahan koneksi', { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteMaterial = async (id: string) => {
    if (!confirm('Hapus materi ini?')) return
    const toastId = toast.loading('Menghapus materi...')
    try {
      const res = await fetch(`/api/materials/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Materi dihapus', { id: toastId })
        const updatedSelected = {
          ...selectedSubject,
          materials: selectedSubject.materials.filter((m: any) => m.id !== id)
        }
        setSelectedSubject(updatedSelected)
        setSubjects(subjects.map((s: any) => s.id === updatedSelected.id ? updatedSelected : s))
      } else {
        toast.error('Gagal menghapus materi', { id: toastId })
      }
    } catch (e) {
      toast.error('Kesalahan koneksi', { id: toastId })
    }
  }

  const openAddMaterial = () => {
    setMaterialFormData({
      title: '',
      description: '',
      classId: 'all',
      status: 'BELUM_DITUGASKAN',
      attachments: []
    })
    setNewMatAttachName('')
    setNewMatAttachUrl('')
    setIsAddMaterialOpen(true)
  }

  const openEditMaterial = (mat: any) => {
    setSelectedMaterial(mat)
    let parsedAttachments = []
    if (mat.attachments) {
      try {
        parsedAttachments = typeof mat.attachments === 'string'
          ? JSON.parse(mat.attachments)
          : mat.attachments
      } catch (e) {
        parsedAttachments = []
      }
    }
    setMaterialFormData({
      title: mat.title,
      description: mat.description || '',
      classId: mat.classId || 'all',
      status: mat.status || 'BELUM_DITUGASKAN',
      attachments: parsedAttachments
    })
    setIsEditMaterialOpen(true)
  }


  const filteredSubjects = subjects.filter((s: any) => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.teacher?.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/admin/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        const newSubject = await res.json()
        setSubjects([...subjects, newSubject])
        toast.success('Mapel berhasil ditambahkan')
        setIsAddOpen(false)
        setFormData({ name: '', description: '', color: '#5483B3', teacherId: '' })
      } else {
        toast.error('Gagal menambahkan mapel')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan sistem')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleExport = () => {
    const csvRows = [
      ['ID', 'Nama Mapel', 'Deskripsi', 'Warna', 'Guru Pengampu'],
      ...subjects.map((s: any) => [
        s.id,
        s.name,
        s.description || '',
        s.color,
        s.teacher?.name || '-'
      ])
    ]

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "edutrack_subjects_export.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Daftar mapel diekspor')
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
        const [name, description, color, teacherId] = row.split(',').map(s => s.trim())
        if (!name) continue

        try {
          const res = await fetch('/api/admin/subjects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name,
              description: description || '',
              color: color || '#5483B3',
              teacherId: teacherId || null
            })
          })
          if (res.ok) {
            const newSubject = await res.json()
            setSubjects((prev: any) => [...prev, newSubject])
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

  const handleEditSubject = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const payload = {
        ...formData,
        teacherId: formData.teacherId === 'none' ? null : formData.teacherId
      }
      const res = await fetch(`/api/admin/subjects/${selectedSubject.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        const updatedSubject = await res.json()
        setSubjects(subjects.map((s: any) => s.id === selectedSubject.id ? updatedSubject : s))
        toast.success('Mapel berhasil diperbarui')
        setIsEditOpen(false)
      } else {
        toast.error('Gagal memperbarui mapel')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan sistem')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteSubject = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/admin/subjects/${selectedSubject.id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setSubjects(subjects.filter((s: any) => s.id !== selectedSubject.id))
        toast.success('Mapel berhasil dihapus')
        setIsDeleteOpen(false)
      } else {
        toast.error('Gagal menghapus mapel')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan sistem')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteSchedule = async (scheduleId: string, teacherName: string) => {
    setDeleteConfirm({
      isOpen: true,
      title: 'Hapus Jadwal?',
      description: `Apakah Anda yakin ingin menghapus semua jadwal pengajar ${teacherName} untuk mata pelajaran ini?`,
      isDestructive: true,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/schedules/${scheduleId}`, {
            method: 'DELETE'
          })
          if (res.ok) {
            toast.success(`Jadwal ${teacherName} berhasil dihapus`)
            // Update local state
            const updatedSchedules = selectedSubject.schedules.filter((s: any) => s.id !== scheduleId)
            const updatedSelected = {
              ...selectedSubject,
              schedules: updatedSchedules
            }
            setSelectedSubject(updatedSelected)
            setSubjects(subjects.map((s: any) => s.id === updatedSelected.id ? updatedSelected : s))
          } else {
            toast.error('Gagal menghapus jadwal')
          }
        } catch (error) {
          toast.error('Kesalahan sistem')
        }
      }
    })
  }

  const handleAddTopic = async (subjectId: string, name: string) => {
    if (!name) return
    try {
      const res = await fetch('/api/admin/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, subjectId })
      })
      if (res.ok) {
        const newTopic = await res.json()
        const updatedSelected = {
          ...selectedSubject,
          topics: [...(selectedSubject.topics || []), newTopic]
        }
        setSelectedSubject(updatedSelected)
        setSubjects(subjects.map((s: any) => s.id === updatedSelected.id ? updatedSelected : s))
        toast.success('Topik ditambahkan')
      }
    } catch (error) {
      toast.error('Gagal menambah topik')
    }
  }

  const handleDeleteTopic = async (topicId: string) => {
    setDeleteConfirm({
      isOpen: true,
      title: 'Hapus Topik?',
      description: 'Apakah Anda yakin ingin menghapus topik ini? Data materi di dalamnya akan ikut terhapus secara permanen.',
      isDestructive: true,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/topics/${topicId}`, {
            method: 'DELETE'
          })
          if (res.ok) {
            const updatedSelected = {
              ...selectedSubject,
              topics: selectedSubject.topics.filter((t: any) => t.id !== topicId)
            }
            setSelectedSubject(updatedSelected)
            setSubjects(subjects.map((s: any) => s.id === updatedSelected.id ? updatedSelected : s))
            toast.success('Topik berhasil dihapus')
          }
        } catch (error) {
          toast.error('Gagal menghapus topik')
        }
      }
    })
  }

  const openEdit = (s: any) => {
    setSelectedSubject(s)
    const color = s.color || '#5483B3'
    setFormData({
      name: s.name,
      description: s.description || '',
      color: color,
      teacherId: s.teacherId || ''
    })
    setLocalColor(color)
    setIsEditOpen(true)
  }

  const openDelete = (s: any) => {
    setSelectedSubject(s)
    setIsDeleteOpen(true)
  }

  const openDetail = (s: any) => {
    setSelectedSubject(s)
    setIsDetailOpen(true)
  }

  const getConnectedTeachers = (s: any) => {
    if (!s) return []
    const teachersMap = new Map()
    
    // Primary teacher
    if (s.teacher) {
      teachersMap.set(s.teacher.id, { ...s.teacher, role: 'Guru Utama' })
    }

    // Schedule teachers
    s.schedules?.forEach((sched: any) => {
      if (sched.teacher && !teachersMap.has(sched.teacher.id)) {
        teachersMap.set(sched.teacher.id, { ...sched.teacher, role: 'Guru Pengampu Kelas' })
      }
    })

    return Array.from(teachersMap.values())
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-[#5483B3] font-bold uppercase tracking-wider text-xs mb-2">Subject Management</p>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">Kelola Mapel</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-2 font-medium">Daftar seluruh mata pelajaran di sistem EduTrack.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
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
                    id="subject-csv-import" 
                    accept=".csv" 
                    className="hidden" 
                    onChange={handleImportCSV} 
                  />
                  <Button 
                       onClick={() => document.getElementById('subject-csv-import')?.click()}
                       variant="outline"
                       className="border-[var(--border)] hover:bg-[var(--muted)] text-[var(--foreground)] rounded-xl h-11 px-4 font-bold shadow-sm"
                  >
                     <UploadCloud className="h-4 w-4 text-[#5483B3]" />
                  </Button>
                </div>
            </div>

            <div className="relative w-full sm:w-64">
               <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
               <Input 
                 placeholder="Cari nama mapel..." 
                 className="bg-[var(--card)] border-[var(--border)] pl-10 h-11 text-sm rounded-xl focus-visible:ring-[#5483B3] shadow-sm transition-all"
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
               />
            </div>
           <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#5483B3] hover:bg-[#3B6FA0] text-white rounded-xl font-bold text-sm h-11 px-6 shadow-md transition-all gap-2 w-full sm:w-auto">
                  <Plus className="h-4 w-4" /> Tambah Mapel
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[var(--card)] border-[var(--border)] text-[var(--foreground)] max-w-md rounded-2xl shadow-xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-extrabold tracking-tight">Tambah Mapel Baru</DialogTitle>
                  <DialogDescription className="text-sm font-medium text-[var(--muted-foreground)]">Daftarkan mata pelajaran baru ke dalam kurikulum EduTrack.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddSubject} className="space-y-5 py-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-[var(--foreground)]">Nama Mapel</Label>
                    <Input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]" placeholder="Contoh: Matematika" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-[var(--foreground)]">Deskripsi</Label>
                    <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="bg-[var(--card)] border-[var(--border)] rounded-xl text-sm focus-visible:ring-[#5483B3] p-3" />
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2 col-span-2">
                      <Label className="text-xs font-bold text-[var(--foreground)] flex items-center gap-2">
                         <Palette className="h-4 w-4 text-[#5483B3]" /> Warna Aksen
                      </Label>
                      <div className="flex flex-wrap gap-2 p-3 bg-[var(--muted)]/50 border border-[var(--border)] rounded-xl">
                        {PRESET_COLORS.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => {
                              setLocalColor(c)
                              setFormData({...formData, color: c})
                            }}
                            className={`h-8 w-8 rounded-full border-2 transition-all ${
                              localColor === c ? "border-[var(--foreground)] scale-110 shadow-md" : "border-transparent hover:scale-105"
                            }`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                        <div className="relative">
                           <input 
                              type="color" 
                              value={localColor} 
                              onChange={(e) => {
                                  setLocalColor(e.target.value)
                                  setFormData({...formData, color: e.target.value})
                              }} 
                              className="h-8 w-8 bg-transparent border-none cursor-pointer p-0 opacity-0 absolute inset-0 z-10" 
                           />
                           <div 
                              className="h-8 w-8 rounded-full border-2 border-dashed flex items-center justify-center text-xs font-bold transition-all shadow-sm"
                              style={!PRESET_COLORS.includes(localColor) ? { backgroundColor: localColor, borderColor: 'var(--foreground)' } : { backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
                           >
                              {PRESET_COLORS.includes(localColor) ? '?' : ''}
                           </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label className="text-xs font-bold text-[var(--foreground)]">Guru Pengampu Utama</Label>
                      <Select value={formData.teacherId} onValueChange={(v) => setFormData({...formData, teacherId: v})}>
                        <SelectTrigger className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]">
                          <SelectValue placeholder="Pilih Guru" />
                        </SelectTrigger>
                        <SelectContent className="bg-[var(--card)] border-[var(--border)] rounded-xl shadow-lg">
                          {teachers.map((t: any) => (
                            <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button disabled={isSubmitting} className="w-full h-12 bg-[#5483B3] hover:bg-[#3B6FA0] text-white font-bold rounded-xl text-sm shadow-md mt-4">
                    {isSubmitting ? 'Memproses...' : 'Simpan Mapel'}
                  </Button>
                </form>
              </DialogContent>
           </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map((s: any, i: number) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => openDetail(s)}
            className="cursor-pointer h-full"
          >
            <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl hover:shadow-md transition-all group h-full flex flex-col overflow-hidden hover:-translate-y-1">
               <div className="h-2 w-full transition-all group-hover:opacity-80" style={{ backgroundColor: s.color || '#5483B3' }} />
               <CardContent className="p-6 md:p-8 space-y-5 flex flex-col h-full">
                  <div className="flex justify-between items-start">
                     <div 
                        className="h-14 w-14 rounded-2xl flex items-center justify-center shadow-sm" 
                        style={{ backgroundColor: `${s.color || '#5483B3'}15`, color: s.color || '#5483B3' }}
                     >
                        <BookOpen className="h-7 w-7" />
                     </div>
                  </div>

                  <div className="flex-1 space-y-2">
                     <h3 className="text-2xl font-bold tracking-tight text-[var(--foreground)] group-hover:text-[#5483B3] transition-colors">{s.name}</h3>
                     <p className="text-sm font-medium text-[var(--muted-foreground)] leading-relaxed line-clamp-2">{s.description || 'Tidak ada deskripsi'}</p>
                  </div>

                  <div className="space-y-2.5 pt-4 border-t border-[var(--border)]">
                     <div className="flex items-center gap-2.5 text-[var(--muted-foreground)]">
                        <User className="h-4 w-4 shrink-0" />
                        <span className="text-xs font-bold truncate">Pengampu: {s.teacher?.name || 'Belum ditugaskan'}</span>
                     </div>
                     <div className="flex items-center gap-2.5 text-[var(--muted-foreground)]">
                        <Layers className="h-4 w-4 shrink-0" />
                        <span className="text-xs font-bold">{s.topics?.length || 0} Topik / Materi</span>
                     </div>
                  </div>

                  <div className="flex items-center justify-end gap-1 pt-3 border-t border-[var(--border)] mt-auto">
                     <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--muted-foreground)] hover:text-[#5483B3] hover:bg-[#5483B3]/10 rounded-lg transition-colors" onClick={(e) => { e.stopPropagation(); openEdit(s); }}>
                        <Edit3 className="h-4 w-4" />
                     </Button>
                     <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--muted-foreground)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" onClick={(e) => { e.stopPropagation(); openDelete(s); }}>
                        <Trash2 className="h-4 w-4" />
                     </Button>
                  </div>
               </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="bg-[var(--card)] border-[var(--border)] text-[var(--foreground)] max-w-lg rounded-2xl p-0 overflow-hidden shadow-xl">
          <DialogHeader className="p-6 md:p-8 border-b border-[var(--border)] bg-[var(--muted)]/30 relative">
            <div className="flex items-center gap-4 relative z-10">
               <div 
                  className="h-14 w-14 rounded-2xl flex items-center justify-center shadow-sm shrink-0" 
                  style={{ backgroundColor: `${selectedSubject?.color || '#5483B3'}15`, color: selectedSubject?.color || '#5483B3' }}
               >
                  <BookOpen className="h-7 w-7" />
               </div>
               <div>
                  <DialogTitle className="text-2xl font-extrabold tracking-tight">
                     {selectedSubject?.name}
                  </DialogTitle>
                  <DialogDescription className="text-xs font-bold text-[var(--muted-foreground)] mt-1">
                    Detail mata pelajaran dan pengampu
                  </DialogDescription>
               </div>
            </div>
          </DialogHeader>
          <div className="p-6 md:p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-[var(--foreground)]">Deskripsi Mapel</Label>
              <p className="text-sm font-medium text-[var(--muted-foreground)] leading-relaxed">{selectedSubject?.description || 'Tidak ada deskripsi untuk mata pelajaran ini.'}</p>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-bold text-[var(--foreground)]">Guru yang Terhubung ({getConnectedTeachers(selectedSubject).length})</Label>
              <div className="grid gap-2">
                {getConnectedTeachers(selectedSubject).length > 0 ? (
                  getConnectedTeachers(selectedSubject).map((teacher: any) => (
                    <div key={teacher.id} className="flex items-center justify-between p-3 bg-[var(--background)] border border-[var(--border)] rounded-xl group hover:border-[#5483B3]/30 transition-all shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-[var(--muted)] rounded-lg flex items-center justify-center text-[#5483B3]">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[var(--foreground)]">{teacher.name}</p>
                          <p className="text-xs font-medium text-[#5483B3]">{teacher.role}</p>
                        </div>
                      </div>
                      <Badge className="bg-[#22C55E]/10 text-[#22C55E] hover:bg-[#22C55E]/20 border-none text-[10px] font-bold px-2 py-0.5 rounded-md">
                        Aktif
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[var(--muted-foreground)] font-medium p-4 bg-[var(--muted)] rounded-xl border border-[var(--border)] text-center">Belum ada guru yang terhubung.</p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-[var(--foreground)]">Daftar Topik / Materi ({selectedSubject?.topics?.length || 0})</Label>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {selectedSubject?.topics?.length > 0 ? (
                  selectedSubject.topics.map((topic: any, idx: number) => (
                    <div 
                      key={topic.id} 
                      className="flex items-center gap-3 p-3 bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-sm cursor-pointer hover:border-[#5483B3]/40 hover:bg-[#5483B3]/5 transition-all group"
                      onClick={() => {
                        window.location.href = `/dashboard/materi?subjectId=${selectedSubject.id}&topicId=${topic.id}`
                      }}
                    >
                      <div className="h-6 w-6 rounded-md bg-[var(--muted)] group-hover:bg-[#5483B3]/10 flex items-center justify-center text-[var(--muted-foreground)] group-hover:text-[#5483B3] text-xs font-bold transition-all">
                        {idx + 1}
                      </div>
                      <p className="text-sm font-bold text-[var(--foreground)] group-hover:text-[#5483B3] transition-colors">{topic.name}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[var(--muted-foreground)] font-medium p-4 bg-[var(--muted)] rounded-xl border border-[var(--border)] text-center">Belum ada topik untuk mapel ini.</p>
                )}
              </div>
            </div>

            {/* Materi Pembelajaran Section */}
            <div className="space-y-3 pt-4 border-t border-[var(--border)]">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-[var(--foreground)]">Materi Pembelajaran ({selectedSubject?.materials?.length || 0})</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-lg border-[var(--border)] text-xs font-bold gap-1"
                  onClick={openAddMaterial}
                >
                  <Plus className="h-3 w-3" /> Tambah
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {selectedSubject?.materials?.length > 0 ? (
                  selectedSubject.materials.map((mat: any) => (
                    <div key={mat.id} className="flex items-center justify-between p-3 bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-sm group hover:border-[#5483B3]/30 transition-all">
                      <div className="flex items-center gap-3 overflow-hidden min-w-0">
                        <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                          <BookOpen className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[var(--foreground)] truncate">{mat.title}</p>
                          <p className="text-[10px] text-[var(--muted-foreground)] truncate">
                            {mat.class?.name || 'Semua Kelas'} • {mat.status}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-[var(--muted-foreground)] hover:text-[#5483B3] rounded-md"
                          onClick={() => openEditMaterial(mat)}
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-[var(--muted-foreground)] hover:text-red-500 rounded-md"
                          onClick={() => handleDeleteMaterial(mat.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[var(--muted-foreground)] font-medium p-3 bg-[var(--muted)] rounded-xl border border-[var(--border)] text-center">Belum ada materi pembelajaran.</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="p-6 border-t border-[var(--border)] gap-3 bg-[var(--card)]">
            <Button 
              variant="outline" 
              className="flex-1 rounded-xl border-[var(--border)] font-bold text-xs h-11" 
              onClick={() => setIsDetailOpen(false)}
            >
              Tutup
            </Button>
            <Button 
              className="flex-1 rounded-xl bg-[#5483B3] hover:bg-[#3B6FA0] text-white font-bold shadow-md text-xs h-11 gap-2" 
              onClick={() => {
                setIsDetailOpen(false);
                openEdit(selectedSubject);
              }}
            >
              <Edit3 className="h-4 w-4" /> Edit Mapel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-[var(--card)] border-[var(--border)] text-[var(--foreground)] max-w-md rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-extrabold tracking-tight">Edit Mapel</DialogTitle>
            <DialogDescription className="text-sm font-medium text-[var(--muted-foreground)] mt-1">Ubah informasi mata pelajaran atau kelola guru yang terhubung.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubject} className="space-y-5 py-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-[var(--foreground)]">Nama Mapel</Label>
              <Input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-[var(--foreground)]">Deskripsi</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="bg-[var(--card)] border-[var(--border)] rounded-xl text-sm focus-visible:ring-[#5483B3] p-3" />
            </div>
            <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2 col-span-2">
                  <Label className="text-xs font-bold text-[var(--foreground)] flex items-center gap-2">
                      <Palette className="h-4 w-4 text-[#5483B3]" /> Warna Aksen
                  </Label>
                  <div className="flex flex-wrap gap-2 p-3 bg-[var(--muted)]/50 border border-[var(--border)] rounded-xl">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          setLocalColor(c)
                          setFormData({...formData, color: c})
                        }}
                        className={`h-8 w-8 rounded-full border-2 transition-all ${
                          localColor === c ? "border-[var(--foreground)] scale-110 shadow-md" : "border-transparent hover:scale-105"
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                    <div className="relative">
                        <input 
                          type="color" 
                          value={localColor} 
                          onChange={(e) => {
                              setLocalColor(e.target.value)
                              setFormData({...formData, color: e.target.value})
                          }} 
                          className="h-8 w-8 bg-transparent border-none cursor-pointer p-0 opacity-0 absolute inset-0 z-10" 
                        />
                        <div 
                          className="h-8 w-8 rounded-full border-2 border-dashed flex items-center justify-center text-xs font-bold transition-all shadow-sm"
                          style={!PRESET_COLORS.includes(localColor) ? { backgroundColor: localColor, borderColor: 'var(--foreground)' } : { backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
                        >
                          {PRESET_COLORS.includes(localColor) ? '?' : ''}
                        </div>
                    </div>
                  </div>
                </div>
              <div className="space-y-2 col-span-2">
                <Label className="text-xs font-bold text-[var(--foreground)]">Guru Pengampu Utama</Label>
                <Select value={formData.teacherId} onValueChange={(v) => setFormData({...formData, teacherId: v})}>
                  <SelectTrigger className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]">
                    <SelectValue placeholder="Pilih Guru Utama" />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--card)] border-[var(--border)] rounded-xl shadow-lg">
                    <SelectItem value="none">Tanpa Guru Utama</SelectItem>
                    {teachers.map((t: any) => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3 pt-5 border-t border-[var(--border)]">
              <Label className="text-xs font-bold text-[var(--foreground)]">Daftar Guru Terhubung</Label>
              <div className="space-y-2">
                {/* Primary Teacher View - Only show if it matches current form selection */}
                {(formData.teacherId && formData.teacherId !== 'none') && (
                  <div className="flex items-center justify-between p-3 bg-[var(--background)] border border-[#5483B3]/30 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-[#5483B3]/10 rounded-lg flex items-center justify-center text-[#5483B3]">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[var(--foreground)]">
                          {teachers.find((t: any) => t.id === formData.teacherId)?.name || "Guru Utama"}
                        </p>
                        <p className="text-[10px] font-bold text-[#5483B3]">Guru Utama</p>
                      </div>
                    </div>
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="sm" 
                      className="text-[10px] font-bold text-[var(--muted-foreground)] hover:text-red-500 rounded-md h-7 px-2"
                      onClick={() => setFormData({...formData, teacherId: 'none'})}
                    >
                      Lepas Jabatan
                    </Button>
                  </div>
                )}

                {/* Schedule Teachers View */}
                {selectedSubject?.schedules?.map((sched: any) => (
                  <div key={sched.id} className="flex items-center justify-between p-3 bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-[var(--muted)] rounded-lg flex items-center justify-center text-[var(--muted-foreground)]">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[var(--foreground)]">{sched.teacher?.name || 'Unknown Teacher'}</p>
                        <p className="text-[10px] font-medium text-[var(--muted-foreground)]">Kelas: {sched.class?.name || 'Unknown'}</p>
                      </div>
                    </div>
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-[var(--muted-foreground)] hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      onClick={() => handleDeleteSchedule(sched.id, sched.teacher.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                {(!selectedSubject?.teacher && (!selectedSubject?.schedules || selectedSubject.schedules.length === 0)) && (
                  <p className="text-xs text-[var(--muted-foreground)] font-medium p-3 bg-[var(--muted)] rounded-xl border border-[var(--border)] text-center">Tidak ada guru yang terhubung.</p>
                )}
              </div>
            </div>

            {/* Managed Topics List */}
            <div className="space-y-3 pt-5 border-t border-[var(--border)]">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-[var(--foreground)]">Manajemen Topik / Materi</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="h-8 rounded-lg border-[var(--border)] text-xs font-bold gap-1"
                  onClick={() => {
                    setNewTopicName('')
                    setIsAddTopicOpen(true)
                  }}
                >
                  <Plus className="h-3 w-3" /> Tambah
                </Button>
              </div>
              <div className="space-y-2">
                {selectedSubject?.topics?.length > 0 ? (
                  [...selectedSubject.topics].sort((a: any, b: any) => a.order - b.order).map((topic: any, idx: number) => (
                    <div key={topic.id} className="flex items-center justify-between p-3 bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-sm group hover:border-[#5483B3]/30 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="h-6 w-6 rounded-md bg-[var(--muted)] flex items-center justify-center text-[var(--muted-foreground)] text-xs font-bold">
                          {idx + 1}
                        </div>
                        <p className="text-xs font-bold text-[var(--foreground)]">{topic.name}</p>
                      </div>
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-[var(--muted-foreground)] hover:text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                        onClick={() => handleDeleteTopic(topic.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[var(--muted-foreground)] font-medium p-3 bg-[var(--muted)] rounded-xl border border-[var(--border)] text-center">Belum ada topik.</p>
                )}
              </div>
            </div>

            <Button disabled={isSubmitting} className="w-full h-12 bg-[#5483B3] hover:bg-[#3B6FA0] text-white font-bold rounded-xl text-sm shadow-md mt-6">
              {isSubmitting ? 'Memproses...' : 'Perbarui Mapel'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={deleteConfirm.isOpen} onOpenChange={(open) => setDeleteConfirm(prev => ({ ...prev, isOpen: open }))}>
        <AlertDialogContent className="bg-[var(--card)] border-[var(--border)] text-[var(--foreground)] rounded-2xl max-w-sm p-6">
          <AlertDialogHeader>
             <div className="flex flex-col items-center gap-3 mb-2">
                <div className={cn("h-12 w-12 rounded-full flex items-center justify-center mb-1", deleteConfirm.isDestructive ? "bg-red-100 text-red-600" : "bg-[#5483B3]/10 text-[#5483B3]")}>
                   <AlertTriangle className="h-6 w-6" />
                </div>
                <AlertDialogTitle className="text-xl font-bold text-center">{deleteConfirm.title}</AlertDialogTitle>
             </div>
            <AlertDialogDescription className="text-[var(--muted-foreground)] text-sm font-medium leading-relaxed text-center">
              {deleteConfirm.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 sm:space-x-3">
            <AlertDialogCancel className="rounded-xl border-[var(--border)] font-bold text-xs h-10 w-full sm:w-auto">Batal</AlertDialogCancel>
            <AlertDialogAction 
               onClick={deleteConfirm.onConfirm}
               className={cn("rounded-xl font-bold text-xs h-10 w-full sm:w-auto shadow-md", deleteConfirm.isDestructive ? "bg-red-600 hover:bg-red-700 text-white" : "bg-[#5483B3] hover:bg-[#3B6FA0] text-white")}
            >
               Ya, Lanjutkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Topic Dialog */}
      <Dialog open={isAddTopicOpen} onOpenChange={setIsAddTopicOpen}>
        <DialogContent className="bg-[var(--card)] border-[var(--border)] text-[var(--foreground)] max-w-sm rounded-2xl shadow-xl p-6">
          <DialogHeader>
            <div className="flex flex-col items-center gap-3 mb-2">
               <div className="h-12 w-12 rounded-full flex items-center justify-center bg-[#5483B3]/10 text-[#5483B3] mb-1">
                  <HelpCircle className="h-6 w-6" />
               </div>
               <DialogTitle className="text-xl font-bold text-center">Tambah Topik</DialogTitle>
            </div>
            <DialogDescription className="text-[var(--muted-foreground)] text-sm font-medium text-center">
              Masukkan nama topik atau materi baru untuk mata pelajaran ini.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
             <div className="space-y-2">
                <Label className="text-xs font-bold text-[var(--foreground)]">Nama Topik</Label>
                <Input 
                   autoFocus
                   value={newTopicName} 
                   onChange={(e) => setNewTopicName(e.target.value)}
                   onKeyDown={(e) => {
                      if (e.key === 'Enter' && newTopicName) {
                         handleAddTopic(selectedSubject.id, newTopicName)
                         setIsAddTopicOpen(false)
                      }
                   }}
                   className="bg-[var(--background)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3] shadow-sm" 
                   placeholder="Contoh: Integral & Turunan" 
                />
             </div>
          </div>
          <DialogFooter className="sm:space-x-3 mt-2">
            <Button 
               variant="outline" 
               className="rounded-xl border-[var(--border)] font-bold text-xs h-11 w-full sm:w-auto" 
               onClick={() => setIsAddTopicOpen(false)}
            >
               Batal
            </Button>
            <Button 
               disabled={!newTopicName}
               className="rounded-xl bg-[#5483B3] hover:bg-[#3B6FA0] text-white font-bold text-xs h-11 w-full sm:w-auto shadow-md" 
               onClick={() => {
                  handleAddTopic(selectedSubject.id, newTopicName)
                  setIsAddTopicOpen(false)
               }}
            >
               Simpan Topik
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="bg-[var(--card)] border-[var(--border)] text-[var(--foreground)] max-w-sm rounded-2xl shadow-xl overflow-hidden p-0">
          <div className="p-6 md:p-8 text-center">
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="h-8 w-8 text-red-600" />
            </div>
            <DialogTitle className="text-xl font-bold mb-2">Hapus Mapel?</DialogTitle>
            <DialogDescription className="text-sm font-medium text-[var(--muted-foreground)] leading-relaxed">
               Menghapus mapel akan berdampak pada jadwal dan tugas yang berkaitan dengan subjek ini. Topik dan materi di dalamnya akan ikut terhapus.
            </DialogDescription>
            <div className="flex flex-col gap-3 mt-6">
              <Button disabled={isSubmitting} variant="destructive" className="w-full rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs h-11 shadow-md" onClick={handleDeleteSubject}>
                {isSubmitting ? 'Menghapus...' : 'Ya, Hapus Sekarang'}
              </Button>
              <Button variant="outline" className="w-full rounded-xl border-[var(--border)] font-bold text-xs h-11" onClick={() => setIsDeleteOpen(false)}>
                Batal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Material Dialog */}
      <Dialog open={isAddMaterialOpen} onOpenChange={setIsAddMaterialOpen}>
        <DialogContent className="bg-[var(--card)] border-[var(--border)] rounded-2xl text-[var(--foreground)] max-w-md shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Tambah Materi Pembelajaran Baru</DialogTitle>
            <DialogDescription className="text-xs text-[var(--muted-foreground)] mt-1">
              Unggah materi, modul, atau referensi digital untuk kelas ini.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddMaterial} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Judul Materi</Label>
              <Input
                required
                value={materialFormData.title}
                onChange={(e) => setMaterialFormData({ ...materialFormData, title: e.target.value })}
                className="bg-[var(--muted)]/50 border-[var(--border)] rounded-xl h-11 text-xs font-semibold focus-visible:ring-1"
                placeholder="Contoh: Modul Dasar JavaScript"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Deskripsi / Penjelasan</Label>
              <Textarea
                value={materialFormData.description}
                onChange={(e) => setMaterialFormData({ ...materialFormData, description: e.target.value })}
                className="bg-[var(--muted)]/50 border-[var(--border)] rounded-xl min-h-[100px] text-xs resize-none font-semibold focus-visible:ring-1"
                placeholder="Deskripsikan isi materi ini..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Sasaran Kelas</Label>
                <Select
                  value={materialFormData.classId || 'all'}
                  onValueChange={(val) => setMaterialFormData({ ...materialFormData, classId: val })}
                >
                  <SelectTrigger className="bg-[var(--muted)]/50 border-[var(--border)] rounded-xl h-11 text-xs">
                    <SelectValue placeholder="Semua Kelas" />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--card)] border-[var(--border)] rounded-xl">
                    <SelectItem value="all" className="text-xs">Semua Kelas</SelectItem>
                    {classes?.map((cls: any) => (
                      <SelectItem key={cls.id} value={cls.id} className="text-xs">{cls.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Status Awal</Label>
                <Select
                  value={materialFormData.status}
                  onValueChange={(val) => setMaterialFormData({ ...materialFormData, status: val })}
                >
                  <SelectTrigger className="bg-[var(--muted)]/50 border-[var(--border)] rounded-xl h-11 text-xs">
                    <SelectValue placeholder="Belum Ditugaskan" />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--card)] border-[var(--border)] rounded-xl">
                    <SelectItem value="BELUM_DITUGASKAN" className="text-xs">Belum Ditugaskan</SelectItem>
                    <SelectItem value="PROGRESS" className="text-xs">Progress</SelectItem>
                    <SelectItem value="SELESAI" className="text-xs">Selesai</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Attachments Section */}
            <div className="space-y-3 pt-2">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Lampiran URL (Opsional)</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Nama Lampiran"
                  value={newMatAttachName}
                  onChange={(e) => setNewMatAttachName(e.target.value)}
                  className="bg-[var(--muted)]/50 border-[var(--border)] rounded-xl h-10 text-xs flex-1"
                />
                <Input
                  placeholder="https://..."
                  value={newMatAttachUrl}
                  onChange={(e) => setNewMatAttachUrl(e.target.value)}
                  className="bg-[var(--muted)]/50 border-[var(--border)] rounded-xl h-10 text-xs flex-1"
                />
                <Button 
                  type="button" 
                  onClick={addMaterialAttachment}
                  className="bg-[#5483B3] hover:bg-[#5483B3]/90 text-white rounded-xl text-xs font-bold px-3 h-10"
                >
                  Tambah
                </Button>
              </div>

              {materialFormData.attachments && materialFormData.attachments.length > 0 && (
                <div className="space-y-1.5 max-h-32 overflow-y-auto pt-1">
                  {materialFormData.attachments.map((attach, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-[var(--muted)]/50 border border-[var(--border)] rounded-lg text-[11px]">
                      <span className="font-semibold truncate max-w-[200px]">{attach.name}</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-red-500 hover:bg-red-500/10 rounded"
                        onClick={() => removeMaterialAttachment(idx)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full h-11 bg-[#5483B3] hover:bg-[#5483B3]/90 text-white font-bold rounded-xl text-xs mt-4">
              {isSubmitting ? 'Menyimpan...' : 'Simpan Materi'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Material Dialog */}
      <Dialog open={isEditMaterialOpen} onOpenChange={setIsEditMaterialOpen}>
        <DialogContent className="bg-[var(--card)] border-[var(--border)] rounded-2xl text-[var(--foreground)] max-w-md shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Edit Materi Pembelajaran</DialogTitle>
            <DialogDescription className="text-xs text-[var(--muted-foreground)] mt-1">
              Perbarui detail atau lampiran materi pembelajaran ini.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditMaterialSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Judul Materi</Label>
              <Input
                required
                value={materialFormData.title}
                onChange={(e) => setMaterialFormData({ ...materialFormData, title: e.target.value })}
                className="bg-[var(--muted)]/50 border-[var(--border)] rounded-xl h-11 text-xs font-semibold focus-visible:ring-1"
                placeholder="Contoh: Modul Dasar JavaScript"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Deskripsi / Penjelasan</Label>
              <Textarea
                value={materialFormData.description}
                onChange={(e) => setMaterialFormData({ ...materialFormData, description: e.target.value })}
                className="bg-[var(--muted)]/50 border-[var(--border)] rounded-xl min-h-[100px] text-xs resize-none font-semibold focus-visible:ring-1"
                placeholder="Deskripsikan isi materi ini..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Sasaran Kelas</Label>
                <Select
                  value={materialFormData.classId || 'all'}
                  onValueChange={(val) => setMaterialFormData({ ...materialFormData, classId: val })}
                >
                  <SelectTrigger className="bg-[var(--muted)]/50 border-[var(--border)] rounded-xl h-11 text-xs">
                    <SelectValue placeholder="Semua Kelas" />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--card)] border-[var(--border)] rounded-xl">
                    <SelectItem value="all" className="text-xs">Semua Kelas</SelectItem>
                    {classes?.map((cls: any) => (
                      <SelectItem key={cls.id} value={cls.id} className="text-xs">{cls.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Status</Label>
                <Select
                  value={materialFormData.status}
                  onValueChange={(val) => setMaterialFormData({ ...materialFormData, status: val })}
                >
                  <SelectTrigger className="bg-[var(--muted)]/50 border-[var(--border)] rounded-xl h-11 text-xs">
                    <SelectValue placeholder="Belum Ditugaskan" />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--card)] border-[var(--border)] rounded-xl">
                    <SelectItem value="BELUM_DITUGASKAN" className="text-xs">Belum Ditugaskan</SelectItem>
                    <SelectItem value="PROGRESS" className="text-xs">Progress</SelectItem>
                    <SelectItem value="SELESAI" className="text-xs">Selesai</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Attachments Section */}
            <div className="space-y-3 pt-2">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Lampiran URL (Opsional)</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Nama Lampiran"
                  value={newMatAttachName}
                  onChange={(e) => setNewMatAttachName(e.target.value)}
                  className="bg-[var(--muted)]/50 border-[var(--border)] rounded-xl h-10 text-xs flex-1"
                />
                <Input
                  placeholder="https://..."
                  value={newMatAttachUrl}
                  onChange={(e) => setNewMatAttachUrl(e.target.value)}
                  className="bg-[var(--muted)]/50 border-[var(--border)] rounded-xl h-10 text-xs flex-1"
                />
                <Button 
                  type="button" 
                  onClick={addMaterialAttachment}
                  className="bg-[#5483B3] hover:bg-[#5483B3]/90 text-white rounded-xl text-xs font-bold px-3 h-10"
                >
                  Tambah
                </Button>
              </div>

              {materialFormData.attachments && materialFormData.attachments.length > 0 && (
                <div className="space-y-1.5 max-h-32 overflow-y-auto pt-1">
                  {materialFormData.attachments.map((attach, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-[var(--muted)]/50 border border-[var(--border)] rounded-lg text-[11px]">
                      <span className="font-semibold truncate max-w-[200px]">{attach.name}</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-red-500 hover:bg-red-500/10 rounded"
                        onClick={() => removeMaterialAttachment(idx)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full h-11 bg-[#5483B3] hover:bg-[#5483B3]/90 text-white font-bold rounded-xl text-xs mt-4">
              {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
