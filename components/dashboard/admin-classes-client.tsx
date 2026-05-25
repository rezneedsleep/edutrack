'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Search, 
  GraduationCap, 
  Users, 
  Calendar,
  MoreVertical,
  Edit3,
  Trash2,
  Save,
  FileJson,
  ClipboardList,
  MessageSquare,
  Send,
  Paperclip,
  FileText,
  ChevronRight,
  Clock,
  DownloadCloud,
  UploadCloud,
  Link as LinkIcon
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"

export function AdminClassesClient({ initialClasses, role, subjects, unassignedStudents }: any) {
  const [classes, setClasses] = useState(initialClasses)
  const [search, setSearch] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isBulkOpen, setIsBulkOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false)
  const [selectedStudentToAdd, setSelectedStudentToAdd] = useState('')
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [selectedClass, setSelectedClass] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bulkJson, setBulkJson] = useState('')
  const [classAssignments, setClassAssignments] = useState<any[]>([])
  const [isLoadingAssignments, setIsLoadingAssignments] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  // Fetch assignments when class is selected
  const fetchClassAssignments = async (classId: string) => {
    setIsLoadingAssignments(true)
    try {
      const res = await fetch(`/api/assignments?classId=${classId}`)
      if (res.ok) {
        const data = await res.json()
        setClassAssignments(data)
      }
    } catch (error) {
      console.error("Failed to fetch assignments")
    } finally {
      setIsLoadingAssignments(false)
    }
  }

  useEffect(() => {
    if (selectedClass) {
      fetchClassAssignments(selectedClass.id)
    }
  }, [selectedClass])

  const handleDeleteAssignment = async () => {
    if (!deleteTargetId) return

    try {
      const res = await fetch(`/api/assignments/${deleteTargetId}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Tugas berhasil dihapus')
        setClassAssignments(classAssignments.filter(a => a.id !== deleteTargetId))
        setIsDeleteConfirmOpen(false)
        setDeleteTargetId(null)
      } else {
        toast.error('Gagal menghapus tugas')
      }
    } catch (error) {
      toast.error('Kesalahan sistem')
    }
  }

  const confirmDelete = (id: string) => {
    setDeleteTargetId(id)
    setIsDeleteConfirmOpen(true)
  }

  const [formData, setFormData] = useState({
    name: '',
    school: '',
    gradeYear: 10
  })

  // Classroom State
  const [assignmentData, setAssignmentData] = useState({
    title: '',
    description: '',
    subjectId: '',
    deadlineDate: '',
    deadlineTime: '23:59',
    maxScore: 100
  })

  const [attachments, setAttachments] = useState<any[]>([])
  const [newLink, setNewLink] = useState('')
  const [isAddingLink, setIsAddingLink] = useState(false)

  const addLink = () => {
    if (newLink) {
      setAttachments([...attachments, { type: 'link', url: newLink, name: newLink }])
      setNewLink('')
      setIsAddingLink(false)
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  // Real file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    const loadingToast = toast.loading(`Mengunggah ${file.name}...`)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setAttachments([...attachments, { type: 'file', name: file.name, url: data.url }])
        toast.success('File berhasil diunggah', { id: loadingToast })
      } else {
        toast.error(data.error || 'Gagal mengunggah file', { id: loadingToast })
      }
    } catch (error) {
      toast.error('Kesalahan koneksi saat mengunggah', { id: loadingToast })
    }
  }

  const filteredClasses = classes.filter((c: any) => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.school.toLowerCase().includes(search.toLowerCase())
  )

  const handlePostAssignment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!assignmentData.subjectId) {
      toast.error('Silakan pilih mata pelajaran terlebih dahulu')
      return
    }

    setIsSubmitting(true)
    
    const deadline = new Date(`${assignmentData.deadlineDate}T${assignmentData.deadlineTime}`)
    
    try {
      const res = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...assignmentData,
          deadline: deadline.toISOString(),
          classId: selectedClass.id,
          attachments
        })
      })
      
      if (res.ok) {
        toast.success('Tugas berhasil dipublikasikan!')
        setAssignmentData({
          title: '',
          description: '',
          subjectId: '',
          deadlineDate: '',
          deadlineTime: '23:59',
          maxScore: 100
        })
        setAttachments([])
        // Refresh the list
        fetchClassAssignments(selectedClass.id)
      } else {
        const errorData = await res.text()
        toast.error(`Gagal: ${errorData}`)
      }
    } catch (error) {
      toast.error('Terjadi kesalahan sistem')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddStudentToClass = async () => {
    if (!selectedStudentToAdd) return
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/admin/users/${selectedStudentToAdd}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classId: selectedClass.id })
      })
      if (res.ok) {
        const updatedStudent = await res.json()
        toast.success('Siswa berhasil ditambahkan ke kelas')
        
        // Update local state
        const updatedClass = {
          ...selectedClass,
          students: [...(selectedClass.students || []), updatedStudent]
        }
        setSelectedClass(updatedClass)
        
        // Update in classes list
        setClasses(classes.map((c: any) => c.id === updatedClass.id ? updatedClass : c))
        
        setIsAddStudentOpen(false)
        setSelectedStudentToAdd('')
      } else {
        toast.error('Gagal menambahkan siswa ke kelas')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemoveStudents = async () => {
    if (selectedStudents.length === 0) return
    setIsSubmitting(true)
    try {
      // Loop or bulk update
      const promises = selectedStudents.map(studentId => 
        fetch(`/api/admin/users/${studentId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ classId: null }) // remove from class
        })
      )
      await Promise.all(promises)
      
      toast.success(`${selectedStudents.length} siswa berhasil dihapus dari kelas`)
      
      // Update local state
      const updatedStudents = selectedClass.students.filter((s: any) => !selectedStudents.includes(s.id))
      const updatedClass = { ...selectedClass, students: updatedStudents }
      setSelectedClass(updatedClass)
      setClasses(classes.map((c: any) => c.id === updatedClass.id ? updatedClass : c))
      setSelectedStudents([])
    } catch (error) {
      toast.error('Gagal menghapus siswa')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/admin/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          gradeYear: parseInt(formData.gradeYear as any) || 10
        })
      })
      if (res.ok) {
        const newClass = await res.json()
        setClasses([...classes, newClass])
        toast.success('Kelas berhasil ditambahkan')
        setIsAddOpen(false)
        setFormData({ name: '', school: '', gradeYear: 10 })
      } else {
        toast.error('Gagal menambahkan kelas')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan sistem')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditClass = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/admin/classes/${selectedClass.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          gradeYear: parseInt(formData.gradeYear as any) || 10
        })
      })
      if (res.ok) {
        const updatedClass = await res.json()
        setClasses(classes.map((c: any) => c.id === selectedClass.id ? updatedClass : c))
        toast.success('Kelas berhasil diperbarui')
        setIsEditOpen(false)
      } else {
        toast.error('Gagal memperbarui kelas')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan sistem')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteClass = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/admin/classes/${selectedClass.id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setClasses(classes.filter((c: any) => c.id !== selectedClass.id))
        toast.success('Kelas berhasil dihapus')
        setIsDeleteOpen(false)
      } else {
        toast.error('Gagal menghapus kelas')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan sistem')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleExport = () => {
    const csvRows = [
      ['ID', 'Nama Kelas', 'Sekolah', 'Tingkat', 'Total Siswa'],
      ...classes.map((c: any) => [
        c.id,
        c.name,
        c.school,
        c.gradeYear,
        c.students?.length || 0
      ])
    ]

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "edutrack_classes_export.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Daftar kelas diekspor')
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
        const [name, school, gradeYear] = row.split(',').map(s => s.trim())
        if (!name) continue

        try {
          const res = await fetch('/api/admin/classes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name,
              school: school || 'SMKN 13 Bandung',
              gradeYear: parseInt(gradeYear) || 10
            })
          })
          if (res.ok) {
            const newClass = await res.json()
            setClasses((prev: any) => [newClass, ...prev])
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

  const handleBulkImport = async () => {
    if (!bulkJson.trim()) return
    setIsSubmitting(true)
    try {
      const data = JSON.parse(bulkJson)
      const classesToImport = Array.isArray(data) ? data : [data]
      
      let successCount = 0
      for (const c of classesToImport) {
        const res = await fetch('/api/admin/classes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(c)
        })
        if (res.ok) {
          const newClass = await res.json()
          setClasses((prev: any) => [...prev, newClass])
          successCount++
        }
      }
      toast.success(`Import selesai: ${successCount} kelas ditambahkan`)
      setIsBulkOpen(false)
      setBulkJson('')
    } catch (error) {
      toast.error('Format JSON tidak valid')
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEdit = (c: any) => {
    setSelectedClass(c)
    setFormData({
      name: c.name,
      school: c.school,
      gradeYear: c.gradeYear
    })
    setIsEditOpen(true)
  }

  const openDelete = (c: any) => {
    setSelectedClass(c)
    setIsDeleteOpen(true)
  }

  const openDetail = (c: any) => {
    setSelectedClass(c)
    setIsDetailOpen(true)
  }

  const isAdmin = role === 'ADMIN'

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <p className="text-[#5483B3] font-bold uppercase tracking-wider text-xs mb-2">Class Directory</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--foreground)]">Kelola Kelas</h1>
          <p className="text-[var(--muted-foreground)] font-medium mt-3">Pilih kelas untuk mengelola siswa dan membagikan tugas.</p>
        </motion.div>
        
        <div className="flex items-center gap-3">
           <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)] focus-within:text-[#5483B3] transition-colors" />
              <Input 
                placeholder="Cari nama kelas..." 
                className="bg-[var(--card)] border-[var(--border)] pl-10 h-11 text-sm rounded-xl w-64 focus-visible:ring-[#5483B3] transition-all shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>

           {isAdmin && (
              <>
                  <Button 
                     onClick={handleExport}
                     variant="outline"
                     className="border-[var(--border)] hover:bg-[var(--muted)] text-[var(--foreground)] rounded-xl h-11 px-4 font-bold text-xs shadow-sm gap-2"
                  >
                     <DownloadCloud className="h-4 w-4 text-[#5483B3]" /> Export
                  </Button>

                  <div className="relative">
                    <input 
                      type="file" 
                      id="class-csv-import" 
                      accept=".csv" 
                      className="hidden" 
                      onChange={handleImportCSV} 
                    />
                    <Button 
                         onClick={() => document.getElementById('class-csv-import')?.click()}
                         variant="outline"
                         className="border-[var(--border)] hover:bg-[var(--muted)] text-[var(--foreground)] rounded-xl h-11 px-4 font-bold text-xs shadow-sm gap-2"
                    >
                       <UploadCloud className="h-4 w-4 text-[#5483B3]" /> Import CSV
                    </Button>
                  </div>

                  <Button 
                     onClick={() => setIsBulkOpen(true)}
                     variant="outline"
                     className="border-[var(--border)] hover:bg-[var(--muted)] text-[var(--foreground)] rounded-xl h-11 px-4 font-bold text-xs shadow-sm gap-2"
                  >
                     <FileJson className="h-4 w-4 text-[#5483B3]" /> JSON
                  </Button>

                 <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#5483B3] hover:bg-[#3B6FA0] text-white rounded-xl font-bold text-sm h-11 px-6 shadow-md transition-all gap-2">
                        <Plus className="h-4 w-4" /> Tambah Kelas
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[var(--card)] border-[var(--border)] text-[var(--foreground)] max-w-md rounded-2xl shadow-xl">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-extrabold tracking-tight">Tambah Kelas Baru</DialogTitle>
                        <DialogDescription className="text-sm font-medium text-[var(--muted-foreground)]">Formulir untuk membuat kelas baru di dalam sistem.</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddClass} className="space-y-5 py-4">
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-[var(--foreground)]">Nama Kelas</Label>
                          <Input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]" placeholder="Contoh: XII RPL 1" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-[var(--foreground)]">Sekolah</Label>
                          <Input required value={formData.school} onChange={(e) => setFormData({...formData, school: e.target.value})} className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]" placeholder="Nama Sekolah" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-[var(--foreground)]">Tingkat (Grade)</Label>
                          <Input required type="number" value={Number.isNaN(formData.gradeYear) || formData.gradeYear === null || formData.gradeYear === undefined ? '' : formData.gradeYear} onChange={(e) => { const val = parseInt(e.target.value); setFormData({...formData, gradeYear: Number.isNaN(val) ? '' as any : val}); }} className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]" />
                        </div>
                        <Button disabled={isSubmitting} className="w-full h-12 bg-[#5483B3] hover:bg-[#3B6FA0] text-white font-bold rounded-xl text-sm shadow-md mt-4">
                          {isSubmitting ? 'Memproses...' : 'Simpan Kelas'}
                        </Button>
                      </form>
                    </DialogContent>
                 </Dialog>
              </>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((c: any, i: number) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => openDetail(c)}
            className="cursor-pointer h-full"
          >
            <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl hover:shadow-md transition-all group overflow-hidden h-full flex flex-col hover:-translate-y-1">
               <CardContent className="p-6 md:p-8 flex flex-col h-full space-y-6">
                  <div className="flex justify-between items-start">
                     <div className="h-12 w-12 bg-[#5483B3]/10 border border-[#5483B3]/20 rounded-xl flex items-center justify-center text-[#5483B3] transition-colors group-hover:bg-[#5483B3] group-hover:text-white">
                        <GraduationCap className="h-6 w-6" />
                     </div>
                     <Badge className="bg-[#5483B3]/10 text-[#5483B3] hover:bg-[#5483B3]/20 border-none rounded-md text-xs font-bold px-2.5 py-0.5">
                        Grade {c.gradeYear}
                     </Badge>
                  </div>

                  <div className="space-y-1.5 flex-1">
                     <h3 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--foreground)] group-hover:text-[#5483B3] transition-colors">{c.name}</h3>
                     <p className="text-sm font-medium text-[var(--muted-foreground)] leading-relaxed">{c.school}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-5 border-t border-[var(--border)]">
                     <div className="flex items-center gap-2.5 text-[var(--muted-foreground)]">
                        <div className="bg-[#5483B3]/10 p-1.5 rounded-md">
                           <Users className="h-3.5 w-3.5 text-[#5483B3]" />
                        </div>
                        <span className="text-xs font-bold">{c.students?.length || 0} Siswa</span>
                     </div>
                     <div className="flex items-center gap-2.5 text-[var(--muted-foreground)]">
                        <div className="bg-[#5483B3]/10 p-1.5 rounded-md">
                           <Calendar className="h-3.5 w-3.5 text-[#5483B3]" />
                        </div>
                        <span className="text-xs font-bold">{c.schedules?.length || 0} Jadwal</span>
                     </div>
                  </div>

                    {isAdmin && (
                       <div className="flex items-center justify-end gap-2 pt-4 border-t border-[var(--border)] mt-4">
                         <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-[var(--muted-foreground)] hover:text-[#5483B3] hover:bg-[#5483B3]/10 rounded-lg transition-colors" 
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                openEdit(c);
                            }}
                         >
                            <Edit3 className="h-4 w-4" />
                         </Button>
                         <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-[var(--muted-foreground)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" 
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                openDelete(c);
                            }}
                         >
                            <Trash2 className="h-4 w-4" />
                         </Button>
                      </div>
                    )}
               </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="bg-[var(--card)] border-[var(--border)] text-[var(--foreground)] max-w-4xl w-[95vw] rounded-2xl shadow-2xl p-0 overflow-hidden flex flex-col max-h-[90vh]">
            <DialogHeader className="p-6 md:p-8 border-b border-[var(--border)] bg-[#5483B3]/5 relative overflow-hidden shrink-0 flex flex-col justify-center">
              <div className="absolute -top-10 -right-10 opacity-10 pointer-events-none">
                  <GraduationCap className="h-48 w-48 text-[#5483B3] -rotate-12" />
              </div>
              <div className="flex items-center gap-5 md:gap-6 relative z-10">
                  <div className="h-16 w-16 bg-[#5483B3] rounded-2xl flex items-center justify-center shadow-md">
                      <GraduationCap className="h-8 w-8 text-white" />
                  </div>
                  <div className="space-y-1.5">
                      <DialogTitle className="text-3xl md:text-4xl font-extrabold tracking-tight">
                          {selectedClass?.name}
                      </DialogTitle>
                      <DialogDescription className="sr-only">Detail kelas, daftar siswa, dan feed tugas untuk {selectedClass?.name}.</DialogDescription>
                      <div className="flex items-center gap-3 text-xs font-bold text-[var(--muted-foreground)]">
                          <span>{selectedClass?.school}</span>
                          <span className="h-1 w-1 rounded-full bg-[#5483B3]/40" />
                          <span>Grade {selectedClass?.gradeYear}</span>
                      </div>
                  </div>
              </div>
            </DialogHeader>
 
            <div className="flex-1 overflow-hidden flex flex-col bg-[var(--background)]">
              <Tabs defaultValue="students" className="w-full flex flex-col h-full">
                 <TabsList className="bg-[var(--card)] border-b border-[var(--border)] w-full justify-start h-auto p-0 px-6 md:px-8 gap-6 md:gap-8 shrink-0 overflow-x-auto custom-scrollbar flex-nowrap">
                    <TabsTrigger 
                      value="students" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#5483B3] data-[state=active]:bg-transparent data-[state=active]:text-[#5483B3] text-[var(--muted-foreground)] font-bold text-sm py-4 px-1 transition-all whitespace-nowrap"
                    >
                      <Users className="h-4 w-4 mr-2.5" /> Daftar Siswa
                    </TabsTrigger>
                    <TabsTrigger 
                      value="classroom" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#5483B3] data-[state=active]:bg-transparent data-[state=active]:text-[#5483B3] text-[var(--muted-foreground)] font-bold text-sm py-4 px-1 transition-all whitespace-nowrap"
                    >
                      <ClipboardList className="h-4 w-4 mr-2.5" /> Classroom Feed
                    </TabsTrigger>
                 </TabsList>

             <div className="flex-1 overflow-y-auto custom-scrollbar">
                <TabsContent value="students" className="p-6 md:p-8 mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <h4 className="text-lg font-bold text-[var(--foreground)]">Siswa Kelas ({selectedClass?.students?.length || 0})</h4>
                        {selectedStudents.length > 0 && (
                          <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-200">
                            <Badge variant="secondary" className="bg-[#5483B3]/10 text-[#5483B3]">{selectedStudents.length} Terpilih</Badge>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={handleRemoveStudents}
                              disabled={isSubmitting}
                              className="h-7 text-[10px] rounded-md px-2"
                            >
                              <Trash2 className="h-3 w-3 mr-1" /> Hapus Terpilih
                            </Button>
                          </div>
                        )}
                      </div>
                      {isAdmin && (
                      <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
                        <DialogTrigger asChild>
                          <Button className="h-9 bg-[#5483B3] hover:bg-[#3B6FA0] text-white font-bold rounded-lg text-xs shadow-sm">
                            <Plus className="h-4 w-4 mr-2" /> Tambah Siswa
                          </Button>
                        </DialogTrigger>

                        <DialogContent className="bg-[var(--card)] border-[var(--border)] rounded-2xl max-w-md">
                          <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-[var(--foreground)]">Tambah Siswa ke Kelas</DialogTitle>
                            <DialogDescription className="text-sm text-[var(--muted-foreground)]">
                              Pilih siswa yang belum memiliki kelas untuk ditambahkan ke {selectedClass?.name}.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4 space-y-4">
                            <div className="space-y-2">
                              <Label className="text-xs font-bold text-[var(--foreground)]">Pilih Siswa</Label>
                              <Select value={selectedStudentToAdd} onValueChange={setSelectedStudentToAdd}>
                                <SelectTrigger className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]">
                                  <SelectValue placeholder="Pilih Siswa..." />
                                </SelectTrigger>
                                <SelectContent className="bg-[var(--card)] border-[var(--border)] rounded-xl shadow-lg max-h-[300px]">
                                  {unassignedStudents?.length > 0 ? (
                                    unassignedStudents.map((s: any) => (
                                      <SelectItem key={s.id} value={s.id}>{s.name} ({s.nis || s.email})</SelectItem>
                                    ))
                                  ) : (
                                    <div className="p-4 text-center text-sm text-[var(--muted-foreground)]">Tidak ada siswa yang belum memiliki kelas</div>
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                            <Button 
                              onClick={handleAddStudentToClass} 
                              disabled={!selectedStudentToAdd || isSubmitting}
                              className="w-full h-11 bg-[#5483B3] hover:bg-[#3B6FA0] text-white font-bold rounded-xl text-sm"
                            >
                              {isSubmitting ? 'Menambahkan...' : 'Tambahkan Siswa'}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      )}
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       {selectedClass?.students?.length > 0 ? (
                           selectedClass.students.map((student: any) => (
                               <div 
                                   key={student.id} 
                                   className={`flex items-center gap-4 p-4 bg-[var(--card)] border ${selectedStudents.includes(student.id) ? 'border-[#5483B3] ring-1 ring-[#5483B3]/20' : 'border-[var(--border)] hover:border-[#5483B3]/30'} rounded-2xl transition-all relative overflow-hidden group`}
                               >
                                   <div className="pt-1 self-start">
                                     <Checkbox 
                                       checked={selectedStudents.includes(student.id)}
                                       onCheckedChange={(checked) => {
                                         if (checked) setSelectedStudents([...selectedStudents, student.id])
                                         else setSelectedStudents(selectedStudents.filter(id => id !== student.id))
                                       }}
                                     />
                                   </div>
                                   <div 
                                     className="flex items-center gap-4 flex-1 min-w-0 cursor-pointer"
                                     onClick={() => window.location.href = `/dashboard/admin/users/${student.id}`}
                                   >
                                     <Avatar className="h-12 w-12 flex-shrink-0 border border-[var(--border)] shadow-sm">
                                         <AvatarImage src={student.image} className="object-cover" />
                                         <AvatarFallback className="bg-[var(--muted)] text-[var(--muted-foreground)] font-bold text-base">{student.name[0]}</AvatarFallback>
                                     </Avatar>
                                     <div className="min-w-0 flex-1">
                                         <p className="text-sm font-bold text-[var(--foreground)] truncate group-hover:text-[#5483B3] transition-colors">{student.name}</p>
                                         <p className="text-xs font-medium text-[var(--muted-foreground)] truncate mt-0.5">{student.email}</p>
                                     </div>
                                   </div>
                               </div>
                           ))
                       ) : (
                           <div className="col-span-1 sm:col-span-2 py-24 text-center border-2 border-dashed border-[var(--border)] rounded-2xl bg-[var(--card)]">
                               <div className="h-16 w-16 bg-[var(--muted)] rounded-full flex items-center justify-center mx-auto mb-4">
                                 <Users className="h-8 w-8 text-[var(--muted-foreground)] opacity-50" />
                               </div>
                               <h3 className="text-sm font-bold text-[var(--foreground)] mb-1">Belum ada siswa</h3>
                               <p className="text-xs font-medium text-[var(--muted-foreground)]">Tambahkan siswa ke kelas ini untuk memulai.</p>
                           </div>
                       )}
                   </div>
                </TabsContent>
  
               <TabsContent value="classroom" className="p-6 md:p-8 mt-0 space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
                  <div className="max-w-4xl mx-auto space-y-10">
                     <div className="flex items-center gap-5">
                        <div className="h-14 w-14 bg-[#5483B3]/10 rounded-2xl flex items-center justify-center">
                           <MessageSquare className="h-6 w-6 text-[#5483B3]" />
                        </div>
                        <div>
                           <h4 className="text-xl font-bold tracking-tight text-[var(--foreground)]">Bagikan Materi & Tugas</h4>
                           <p className="text-sm font-medium text-[var(--muted-foreground)] mt-1">Berikan pengumuman atau instruksi pengerjaan kepada siswa.</p>
                        </div>
                     </div>
  
                     <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-sm overflow-hidden">
                      <form onSubmit={handlePostAssignment}>
                        <CardContent className="p-6 md:p-8 space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <Label className="text-xs font-bold text-[var(--foreground)]">Judul Postingan</Label>
                                <Input 
                                  required
                                  value={assignmentData.title}
                                  onChange={(e) => setAssignmentData({...assignmentData, title: e.target.value})}
                                  placeholder="Misal: Materi Logaritma Dasar"
                                  className="bg-[var(--background)] border-[var(--border)] rounded-xl h-12 focus-visible:ring-[#5483B3] transition-all"
                                />
                             </div>
                             <div className="space-y-2">
                                <Label className="text-xs font-bold text-[var(--foreground)]">Pilih Mata Pelajaran</Label>
                                <Select 
                                  value={assignmentData.subjectId}
                                  onValueChange={(v) => setAssignmentData({...assignmentData, subjectId: v})}
                                  required
                                >
                                   <SelectTrigger className="bg-[var(--background)] border-[var(--border)] rounded-xl h-12 focus-visible:ring-[#5483B3]">
                                      <SelectValue placeholder="Pilih Mapel" />
                                   </SelectTrigger>
                                   <SelectContent className="bg-[var(--card)] border-[var(--border)] rounded-xl shadow-lg">
                                      {subjects?.map((s: any) => (
                                         <SelectItem key={s.id} value={s.id} className="font-medium text-sm">{s.name}</SelectItem>
                                      ))}
                                   </SelectContent>
                                </Select>
                             </div>
                          </div>
    
                          <div className="space-y-2">
                             <Label className="text-xs font-bold text-[var(--foreground)]">Detail / Instruksi Lengkap</Label>
                             <Textarea 
                               required
                               value={assignmentData.description}
                               onChange={(e) => setAssignmentData({...assignmentData, description: e.target.value})}
                               className="bg-[var(--background)] border-[var(--border)] rounded-xl min-h-[160px] p-4 text-sm focus-visible:ring-[#5483B3] resize-y custom-scrollbar"
                               placeholder="Tuliskan materi ringkas atau instruksi pengerjaan tugas di sini..."
                             />
                          </div>
    
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                             <div className="space-y-2">
                                <Label className="text-xs font-bold text-[#5483B3] flex items-center gap-1.5">
                                   <Calendar className="h-3.5 w-3.5" /> Deadline Tanggal
                                </Label>
                                <Input 
                                  type="date" 
                                  required
                                  value={assignmentData.deadlineDate}
                                  onChange={(e) => setAssignmentData({...assignmentData, deadlineDate: e.target.value})}
                                  className="bg-[var(--background)] border-[var(--border)] rounded-xl h-12 focus-visible:ring-[#5483B3] text-sm"
                                />
                             </div>
                             <div className="space-y-2">
                                <Label className="text-xs font-bold text-[#5483B3] flex items-center gap-1.5">
                                   <Clock className="h-3.5 w-3.5" /> Jam
                                </Label>
                                <Input 
                                  type="time" 
                                  required
                                  value={assignmentData.deadlineTime}
                                  onChange={(e) => setAssignmentData({...assignmentData, deadlineTime: e.target.value})}
                                  className="bg-[var(--background)] border-[var(--border)] rounded-xl h-12 focus-visible:ring-[#5483B3] text-sm"
                                />
                             </div>
                             <div className="space-y-2 col-span-2 md:col-span-1">
                                <Label className="text-xs font-bold text-[var(--foreground)]">Skor Maksimal</Label>
                                <Input 
                                  type="number" 
                                  required
                                  value={Number.isNaN(assignmentData.maxScore) || assignmentData.maxScore === null || assignmentData.maxScore === undefined ? '' : assignmentData.maxScore}
                                  onChange={(e) => { const val = parseInt(e.target.value); setAssignmentData({...assignmentData, maxScore: Number.isNaN(val) ? '' as any : val}); }}
                                  className="bg-[var(--background)] border-[var(--border)] rounded-xl h-12 focus-visible:ring-[#5483B3] text-sm"
                                />
                             </div>
                          </div>
    
                          <div className="space-y-4 pt-6 border-t border-[var(--border)]">
                             <Label className="text-xs font-bold text-[var(--foreground)]">File Lampiran & Link Materi ({attachments.length})</Label>
                             <div className="flex flex-wrap gap-3">
                                <input type="file" id="admin-file-upload" className="hidden" onChange={handleFileUpload} />
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  onClick={() => document.getElementById('admin-file-upload')?.click()}
                                  className="h-10 rounded-xl border-[var(--border)] hover:bg-[var(--muted)] text-xs font-bold gap-2"
                                >
                                   <Paperclip className="h-4 w-4" /> Tambah File
                                </Button>
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  onClick={() => setIsAddingLink(!isAddingLink)}
                                  className={`h-10 rounded-xl border-[var(--border)] text-xs font-bold gap-2 transition-colors ${isAddingLink ? 'bg-[#5483B3] text-white border-transparent hover:bg-[#3B6FA0]' : 'hover:bg-[var(--muted)]'}`}
                                >
                                   <LinkIcon className="h-4 w-4" /> {isAddingLink ? 'Batal Link' : 'Tambah Link'}
                                </Button>
                             </div>
    
                             {isAddingLink && (
                                <div className="flex gap-3 animate-in slide-in-from-top-2 duration-300">
                                   <Input value={newLink} onChange={(e) => setNewLink(e.target.value)} placeholder="https://..." className="bg-[var(--background)] border-[var(--border)] rounded-xl h-10 flex-1 text-sm focus-visible:ring-[#5483B3]" />
                                   <Button type="button" onClick={addLink} className="bg-[#5483B3] hover:bg-[#3B6FA0] text-white font-bold rounded-xl px-6 h-10 shadow-sm text-xs">Tambah</Button>
                                </div>
                             )}
    
                             {attachments.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                   {attachments.map((at, idx) => (
                                      <div key={idx} className="flex items-center justify-between p-3 bg-[var(--background)] border border-[var(--border)] rounded-xl group/at hover:border-[#5483B3]/30 transition-all">
                                         <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="h-8 w-8 bg-[#5483B3]/10 rounded-lg flex items-center justify-center text-[#5483B3]">
                                               {at.type === 'file' ? <FileText className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
                                            </div>
                                            <p className="text-xs font-bold text-[var(--foreground)] truncate">{at.name}</p>
                                         </div>
                                         <Button type="button" variant="ghost" size="icon" onClick={() => removeAttachment(idx)} className="h-8 w-8 text-[var(--muted-foreground)] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 className="h-4 w-4" />
                                         </Button>
                                      </div>
                                   ))}
                                </div>
                             )}
                          </div>
                        </CardContent>
                        <div className="p-6 md:p-8 pt-0 bg-[var(--card)]">
                          <Button disabled={isSubmitting} className="w-full h-12 bg-[#5483B3] hover:bg-[#3B6FA0] text-white font-bold rounded-xl shadow-md transition-all text-sm gap-2">
                             {isSubmitting ? 'Memposting...' : 'Publikasikan ke Classroom'}
                             <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </form>
                     </Card>
  
                     <div className="space-y-6 pt-6">
                        <div className="flex items-center justify-between">
                           <h3 className="text-xl font-bold tracking-tight text-[var(--foreground)]">Riwayat Classroom</h3>
                           <Badge className="bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]/80 border-none rounded-md text-xs font-bold px-2.5 py-0.5">
                              {classAssignments.length} Tugas
                           </Badge>
                        </div>
  
                        {isLoadingAssignments ? (
                           <div className="py-16 text-center text-[var(--muted-foreground)] font-medium text-sm animate-pulse">Memuat riwayat...</div>
                        ) : classAssignments.length > 0 ? (
                           <div className="space-y-3">
                              {classAssignments.map((asg) => (
                                 <div key={asg.id} className="group bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 flex items-center justify-between hover:shadow-md transition-all">
                                    <div className="flex items-center gap-4 md:gap-5 min-w-0">
                                       <div className="h-12 w-12 bg-[#5483B3]/10 rounded-xl flex items-center justify-center text-[#5483B3] shrink-0">
                                          <ClipboardList className="h-5 w-5" />
                                       </div>
                                       <div className="min-w-0">
                                          <div className="flex items-center gap-2 mb-1">
                                             <Badge variant="outline" className="rounded-md border-[#5483B3]/20 text-[#5483B3] bg-[#5483B3]/5 text-[10px] font-bold px-2 py-0.5 whitespace-nowrap">{asg.subject?.name || 'UMUM'}</Badge>
                                             <span className="text-xs font-medium text-[var(--muted-foreground)] whitespace-nowrap">{new Date(asg.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                          </div>
                                          <h4 className="text-sm font-bold text-[var(--foreground)] truncate group-hover:text-[#5483B3] transition-colors">{asg.title}</h4>
                                       </div>
                                    </div>
                                    <Button onClick={() => confirmDelete(asg.id)} variant="ghost" size="icon" className="h-10 w-10 text-[var(--muted-foreground)] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0 ml-4">
                                       <Trash2 className="h-4.5 w-4.5" />
                                    </Button>
                                 </div>
                              ))}
                           </div>
                        ) : (
                           <div className="py-16 border-2 border-dashed border-[var(--border)] rounded-2xl text-center bg-[var(--card)]">
                              <ClipboardList className="h-10 w-10 text-[var(--muted-foreground)] opacity-30 mx-auto mb-3" />
                              <p className="text-sm font-bold text-[var(--foreground)] mb-1">Belum ada riwayat</p>
                              <p className="text-xs font-medium text-[var(--muted-foreground)]">Postingan materi atau tugas akan muncul di sini.</p>
                           </div>
                        )}
                     </div>
                  </div>
               </TabsContent>
             </div>
           </Tabs>
            </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent className="bg-[var(--card)] border-[var(--border)] rounded-2xl text-[var(--foreground)] max-w-md p-6">
          <AlertDialogHeader>
            <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mb-2 mx-auto sm:mx-0">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <AlertDialogTitle className="text-xl font-bold">Hapus Tugas?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-[var(--muted-foreground)] leading-relaxed">
              Apakah Anda yakin ingin menghapus tugas ini? Tindakan ini tidak dapat dibatalkan dan semua data submisi siswa akan hilang secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 sm:space-x-3">
            <AlertDialogCancel className="rounded-xl border-[var(--border)] font-bold text-xs h-10 w-full sm:w-auto">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAssignment}
              className="rounded-xl bg-red-600 text-white hover:bg-red-700 font-bold text-xs h-10 w-full sm:w-auto"
            >
              Hapus Permanen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Class Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-[var(--card)] border-[var(--border)] text-[var(--foreground)] max-w-md rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-extrabold tracking-tight">Edit Kelas</DialogTitle>
            <DialogDescription className="text-sm font-medium text-[var(--muted-foreground)] mt-1">Ubah informasi nama sekolah atau tingkat kelas.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditClass} className="space-y-5 py-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-[var(--foreground)]">Nama Kelas</Label>
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]" 
                placeholder="X RPL 1" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-[var(--foreground)]">Sekolah</Label>
              <Input 
                value={formData.school} 
                onChange={(e) => setFormData({...formData, school: e.target.value})}
                className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]" 
                placeholder="SMKN 13 BANDUNG" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-[var(--foreground)]">Tingkat/Tahun</Label>
              <Input 
                type="number"
                value={Number.isNaN(formData.gradeYear) || formData.gradeYear === null || formData.gradeYear === undefined ? '' : formData.gradeYear} 
                onChange={(e) => { const val = parseInt(e.target.value); setFormData({...formData, gradeYear: Number.isNaN(val) ? '' as any : val}); }}
                className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]" 
                placeholder="10" 
                required 
              />
            </div>
            <Button disabled={isSubmitting} className="w-full h-12 bg-[#5483B3] hover:bg-[#3B6FA0] text-white font-bold rounded-xl text-sm shadow-md mt-4">
              {isSubmitting ? 'Memproses...' : 'Simpan Perubahan'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Class Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="bg-[var(--card)] border-[var(--border)] text-[var(--foreground)] max-w-sm rounded-2xl shadow-xl overflow-hidden p-0">
          <div className="p-6 md:p-8 text-center">
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="h-8 w-8 text-red-600" />
            </div>
            <DialogTitle className="text-xl font-bold mb-2">Hapus Kelas?</DialogTitle>
            <DialogDescription className="text-sm font-medium text-[var(--muted-foreground)] leading-relaxed">
               Tindakan ini tidak dapat dibatalkan. Seluruh data siswa dan tugas di kelas ini akan tetap ada namun tidak memiliki keterikatan kelas.
            </DialogDescription>
            
            <div className="py-4 mt-2">
              <p className="text-xs text-[var(--muted-foreground)] bg-[var(--muted)] p-3 rounded-xl border border-[var(--border)]">Menghapus kelas <span className="font-bold text-[var(--foreground)]">{selectedClass?.name}</span> secara permanen beserta semua referensinya.</p>
            </div>
            
            <div className="flex flex-col gap-3 mt-2">
              <Button disabled={isSubmitting} className="w-full rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs h-11 shadow-md" onClick={handleDeleteClass}>
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
