'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ClipboardList,
  Search,
  Plus,
  Edit3,
  Trash2,
  Lock,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  CheckSquare,
  Square,
  Sparkles,
  Link as LinkIcon,
  X,
  UserCheck,
  GraduationCap,
  ShieldAlert,
  ArrowRight,
  HelpCircle,
  Calendar
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

export function KelolaTugasClient({
  initialAssignments,
  subjects,
  classes,
  teachers: initialTeachers,
  canEditAssignments,
  role
}: any) {
  const [assignments, setAssignments] = useState(initialAssignments)
  const [teachers, setTeachers] = useState(initialTeachers || [])
  const [activeTab, setActiveTab] = useState<'tugas' | 'izin-guru'>('tugas')
  const [search, setSearch] = useState('')
  const [teacherSearch, setTeacherSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'DRAFT' | 'PUBLISHED' | 'CLOSED'>('ALL')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  
  // Dialog States
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subjectId: '',
    classId: 'all',
    deadline: '',
    maxScore: 100,
    status: 'DRAFT',
    attachments: [] as { name: string; url: string }[]
  })

  // Attachment input temp states
  const [newAttachmentName, setNewAttachmentName] = useState('')
  const [newAttachmentUrl, setNewAttachmentUrl] = useState('')

  // Helper date formatter for datetime-local input
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const pad = (n: number) => n.toString().padStart(2, '0')
    const yyyy = date.getFullYear()
    const mm = pad(date.getMonth() + 1)
    const dd = pad(date.getDate())
    const hh = pad(date.getHours())
    const min = pad(date.getMinutes())
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`
  }

  // Filter assignments
  const filteredAssignments = assignments.filter((a: any) => {
    const matchesSearch = 
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase()) ||
      a.subject.name.toLowerCase().includes(search.toLowerCase()) ||
      (a.class?.name || 'Semua Kelas').toLowerCase().includes(search.toLowerCase()) ||
      a.teacher.name.toLowerCase().includes(search.toLowerCase())
    
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Filter teachers
  const filteredTeachers = teachers.filter((t: any) => 
    t.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
    t.email.toLowerCase().includes(teacherSearch.toLowerCase())
  )

  const handleSelectAll = () => {
    if (selectedIds.length === filteredAssignments.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredAssignments.map((a: any) => a.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  // Bulk Actions
  const handleBulkStatusUpdate = async (status: string) => {
    if (selectedIds.length === 0) return
    setIsSubmitting(true)
    const toastId = toast.loading(`Mengubah status ${selectedIds.length} tugas...`)

    try {
      const res = await fetch('/api/assignments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds, status })
      })

      if (res.ok) {
        setAssignments(assignments.map((a: any) => 
          selectedIds.includes(a.id) ? { ...a, status } : a
        ))
        toast.success(`Status ${selectedIds.length} tugas berhasil diperbarui`, { id: toastId })
        setSelectedIds([])
      } else {
        const err = await res.text()
        toast.error(err || 'Gagal memperbarui status secara massal', { id: toastId })
      }
    } catch (error) {
      toast.error('Terjadi kesalahan jaringan', { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return
    if (!confirm(`Apakah Anda yakin ingin menghapus ${selectedIds.length} tugas terpilih?`)) return
    
    setIsSubmitting(true)
    const toastId = toast.loading(`Menghapus ${selectedIds.length} tugas...`)

    try {
      const res = await fetch('/api/assignments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds })
      })

      if (res.ok) {
        setAssignments(assignments.filter((a: any) => !selectedIds.includes(a.id)))
        toast.success(`${selectedIds.length} tugas berhasil dihapus`, { id: toastId })
        setSelectedIds([])
      } else {
        const err = await res.text()
        toast.error(err || 'Gagal menghapus tugas secara massal', { id: toastId })
      }
    } catch (error) {
      toast.error('Terjadi kesalahan jaringan', { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Single Actions
  const openAdd = () => {
    if (!canEditAssignments) {
      toast.error('Akses ditolak: Anda tidak memiliki izin untuk mengedit tugas')
      return
    }
    
    // Set default deadline to tomorrow at 23:59
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(23, 59, 0, 0)

    setFormData({
      title: '',
      description: '',
      subjectId: subjects[0]?.id || '',
      classId: 'all',
      deadline: formatDateForInput(tomorrow.toISOString()),
      maxScore: 100,
      status: 'DRAFT',
      attachments: []
    })
    setNewAttachmentName('')
    setNewAttachmentUrl('')
    setIsAddOpen(true)
  }

  const openEdit = (assignment: any) => {
    if (!canEditAssignments) {
      toast.error('Akses ditolak: Anda tidak memiliki izin untuk mengedit tugas')
      return
    }
    setSelectedAssignment(assignment)
    
    let parsedAttachments = []
    if (assignment.attachments) {
      try {
        parsedAttachments = typeof assignment.attachments === 'string' 
          ? JSON.parse(assignment.attachments) 
          : assignment.attachments
      } catch (e) {
        parsedAttachments = []
      }
    }

    setFormData({
      title: assignment.title,
      description: assignment.description,
      subjectId: assignment.subjectId,
      classId: assignment.classId || 'all',
      deadline: formatDateForInput(assignment.deadline),
      maxScore: assignment.maxScore || 100,
      status: assignment.status,
      attachments: parsedAttachments
    })
    setNewAttachmentName('')
    setNewAttachmentUrl('')
    setIsEditOpen(true)
  }

  const openDelete = (assignment: any) => {
    if (!canEditAssignments) {
      toast.error('Akses ditolak: Anda tidak memiliki izin untuk menghapus tugas')
      return
    }
    setSelectedAssignment(assignment)
    setIsDeleteOpen(true)
  }

  // Handle Attachments
  const addAttachment = () => {
    if (!newAttachmentName.trim() || !newAttachmentUrl.trim()) {
      toast.error('Lengkapi nama dan URL lampiran')
      return
    }
    let url = newAttachmentUrl.trim()
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url
    }
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, { name: newAttachmentName.trim(), url }]
    }))
    setNewAttachmentName('')
    setNewAttachmentUrl('')
  }

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }))
  }

  // API Form Actions
  const handleAddAssignment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.subjectId || !formData.deadline) {
      toast.error('Judul, Mata Pelajaran, dan Tenggat Waktu wajib diisi')
      return
    }

    setIsSubmitting(true)
    const toastId = toast.loading('Membuat tugas baru...')

    try {
      const res = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        const newAsg = await res.json()
        setAssignments([newAsg, ...assignments])
        toast.success('Tugas berhasil dibuat', { id: toastId })
        setIsAddOpen(false)
      } else {
        const err = await res.text()
        toast.error(err || 'Gagal membuat tugas', { id: toastId })
      }
    } catch (error) {
      toast.error('Terjadi kesalahan jaringan', { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditAssignment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.subjectId || !formData.deadline) {
      toast.error('Judul, Mata Pelajaran, dan Tenggat Waktu wajib diisi')
      return
    }

    setIsSubmitting(true)
    const toastId = toast.loading('Menyimpan perubahan...')

    try {
      const res = await fetch(`/api/assignments/${selectedAssignment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        const updatedAsg = await res.json()
        setAssignments(assignments.map((a: any) => a.id === selectedAssignment.id ? updatedAsg : a))
        toast.success('Tugas berhasil diperbarui', { id: toastId })
        setIsEditOpen(false)
      } else {
        const err = await res.text()
        toast.error(err || 'Gagal memperbarui tugas', { id: toastId })
      }
    } catch (error) {
      toast.error('Terjadi kesalahan jaringan', { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteAssignment = async () => {
    setIsSubmitting(true)
    const toastId = toast.loading('Menghapus tugas...')

    try {
      const res = await fetch(`/api/assignments/${selectedAssignment.id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        setAssignments(assignments.filter((a: any) => a.id !== selectedAssignment.id))
        toast.success('Tugas berhasil dihapus', { id: toastId })
        setIsDeleteOpen(false)
      } else {
        const err = await res.text()
        toast.error(err || 'Gagal menghapus tugas', { id: toastId })
      }
    } catch (error) {
      toast.error('Terjadi kesalahan jaringan', { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Admin Permission Toggle
  const handlePermissionToggle = async (teacherId: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus
    const toastId = toast.loading('Memperbarui izin guru...')

    try {
      const res = await fetch(`/api/admin/users/${teacherId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ canEditAssignments: nextStatus })
      })

      if (res.ok) {
        setTeachers(teachers.map((t: any) => 
          t.id === teacherId ? { ...t, canEditAssignments: nextStatus } : t
        ))
        toast.success('Izin edit tugas berhasil diperbarui', { id: toastId })
      } else {
        toast.error('Gagal memperbarui izin', { id: toastId })
      }
    } catch (error) {
      toast.error('Terjadi kesalahan koneksi', { id: toastId })
    }
  }

  // Status Badge render helpers
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return (
          <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 w-fit">
            <CheckCircle2 className="h-3.5 w-3.5" /> Published
          </Badge>
        )
      case 'CLOSED':
        return (
          <Badge className="bg-red-500/10 text-red-500 border border-red-500/20 px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 w-fit">
            <X className="h-3.5 w-3.5" /> Closed
          </Badge>
        )
      default:
        return (
          <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 w-fit">
            <Clock className="h-3.5 w-3.5" /> Draft
          </Badge>
        )
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-24"
    >
      {/* Header Panel */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <p className="text-[#5483B3] font-bold uppercase tracking-wider text-xs mb-2.5 flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            PANEL KONTROL
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
            Kelola Tugas & Evaluasi
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] font-medium mt-2 flex items-center gap-3">
            Manajemen draf tugas, status publikasi, tenggat waktu, dan nilai maksimal tugas.
            <Badge className="bg-[var(--muted)] text-[var(--muted-foreground)] border-none text-xs font-bold px-2.5 py-0.5">
              {filteredAssignments.length} Tugas
            </Badge>
          </p>
        </div>

        {canEditAssignments && (
          <Button
            onClick={openAdd}
            className="bg-[#5483B3] hover:bg-[#3B6FA0] text-white rounded-xl font-bold text-xs h-11 px-6 shadow-md transition-all gap-2 self-start lg:self-auto"
          >
            <Plus className="h-4 w-4" /> Buat Tugas Baru
          </Button>
        )}
      </div>

      {/* Access Denied Warning Banner for Teachers without permissions */}
      {!canEditAssignments && role === 'TEACHER' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-2xl flex items-start gap-4"
        >
          <ShieldAlert className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[var(--foreground)]">Akses Penugasan Terkunci</h4>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              Anda tidak memiliki izin mengedit tugas dari Administrator. Anda hanya dapat melihat daftar tugas milik Anda sendiri. Silakan hubungi admin sekolah untuk mengaktifkan izin "Bisa Edit Tugas".
            </p>
          </div>
        </motion.div>
      )}

      {/* Tab Switcher for Admin only */}
      {role === 'ADMIN' && (
        <div className="flex border-b border-[var(--border)] gap-6">
          <button
            onClick={() => setActiveTab('tugas')}
            className={`pb-4 text-sm font-bold transition-all relative ${
              activeTab === 'tugas'
                ? 'text-[#5483B3] font-extrabold'
                : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            Daftar Tugas
            {activeTab === 'tugas' && (
              <motion.div
                layoutId="active-tugas-tab-indicator"
                className="absolute bottom-0 inset-x-0 h-0.5 bg-[#5483B3] rounded-full"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('izin-guru')}
            className={`pb-4 text-sm font-bold transition-all relative flex items-center gap-2 ${
              activeTab === 'izin-guru'
                ? 'text-[#5483B3] font-extrabold'
                : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            <UserCheck className="h-4 w-4" />
            Manajemen Izin Guru
            {activeTab === 'izin-guru' && (
              <motion.div
                layoutId="active-tugas-tab-indicator"
                className="absolute bottom-0 inset-x-0 h-0.5 bg-[#5483B3] rounded-full"
              />
            )}
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === 'tugas' ? (
          <motion.div
            key="tugas-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Filter Tabs */}
              <div className="flex bg-[var(--muted)]/50 p-1 rounded-xl border border-[var(--border)] w-full md:w-auto overflow-x-auto scrollbar-hide">
                {(['ALL', 'DRAFT', 'PUBLISHED', 'CLOSED'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status)
                      setSelectedIds([])
                    }}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                      statusFilter === status
                        ? 'bg-[var(--card)] text-[#5483B3] shadow-sm'
                        : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    {status === 'ALL' ? 'Semua' : status === 'DRAFT' ? 'Draft' : status === 'PUBLISHED' ? 'Published' : 'Closed'}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative group w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)] group-focus-within:text-[#5483B3] transition-colors" />
                <Input
                  placeholder="Cari tugas, mapel, kelas..."
                  className="bg-[var(--card)] border-[var(--border)] pl-10 h-11 text-xs rounded-xl w-full focus-visible:ring-[#5483B3] transition-all shadow-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Assignments Table */}
            <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-[var(--border)] hover:bg-transparent bg-[var(--muted)]/30">
                        {canEditAssignments && (
                          <TableHead className="w-16 pl-4 md:pl-6 py-4">
                            <button
                              onClick={handleSelectAll}
                              className="text-[var(--muted-foreground)] hover:text-[#5483B3] transition-colors"
                            >
                              {selectedIds.length === filteredAssignments.length && filteredAssignments.length > 0 ? (
                                <CheckSquare className="h-4.5 w-4.5 text-[#5483B3]" />
                              ) : (
                                <Square className="h-4.5 w-4.5" />
                              )}
                            </button>
                          </TableHead>
                        )}
                        <TableHead className="text-xs font-bold text-[var(--muted-foreground)]">Judul Tugas</TableHead>
                        <TableHead className="text-xs font-bold text-[var(--muted-foreground)]">Mata Pelajaran</TableHead>
                        <TableHead className="text-xs font-bold text-[var(--muted-foreground)]">Kelas Sasaran</TableHead>
                        <TableHead className="text-xs font-bold text-[var(--muted-foreground)]">Tenggat Waktu</TableHead>
                        <TableHead className="text-xs font-bold text-[var(--muted-foreground)]">Nilai Maks</TableHead>
                        {role === 'ADMIN' && (
                          <TableHead className="text-xs font-bold text-[var(--muted-foreground)]">Guru Pengampu</TableHead>
                        )}
                        <TableHead className="text-xs font-bold text-[var(--muted-foreground)]">Status</TableHead>
                        <TableHead className="text-xs font-bold text-[var(--muted-foreground)]">Lampiran</TableHead>
                        {canEditAssignments && (
                          <TableHead className="text-xs font-bold text-[var(--muted-foreground)] text-right pr-4 md:pr-6">Tindakan</TableHead>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAssignments.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={canEditAssignments ? (role === 'ADMIN' ? 10 : 9) : (role === 'ADMIN' ? 9 : 8)}
                            className="h-64 text-center"
                          >
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                              <ClipboardList className="h-12 w-12 text-[var(--muted-foreground)] opacity-50 mx-auto mb-4" />
                              <p className="text-sm font-bold text-[var(--muted-foreground)]">Tidak ada tugas ditemukan</p>
                            </motion.div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredAssignments.map((asg: any, index: number) => {
                          let attachmentsList = []
                          if (asg.attachments) {
                            try {
                              attachmentsList = typeof asg.attachments === 'string'
                                ? JSON.parse(asg.attachments)
                                : asg.attachments
                            } catch (e) {
                              attachmentsList = []
                            }
                          }

                          return (
                            <motion.tr
                              layout
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ delay: index * 0.02 }}
                              key={asg.id}
                              className={`border-[var(--border)] hover:bg-[var(--muted)]/30 transition-colors group ${
                                selectedIds.includes(asg.id) ? 'bg-[#5483B3]/5' : ''
                              }`}
                            >
                              {canEditAssignments && (
                                <TableCell className="pl-4 md:pl-6">
                                  <button
                                    onClick={() => toggleSelect(asg.id)}
                                    className={`transition-colors ${
                                      selectedIds.includes(asg.id) ? 'text-[#5483B3]' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                                    }`}
                                  >
                                    {selectedIds.includes(asg.id) ? <CheckSquare className="h-4.5 w-4.5" /> : <Square className="h-4.5 w-4.5" />}
                                  </button>
                                </TableCell>
                              )}
                              <TableCell className="max-w-xs md:max-w-sm">
                                <div className="py-2.5">
                                  <h4 className="text-sm font-bold text-[var(--foreground)] leading-snug">{asg.title}</h4>
                                  <p className="text-xs text-[var(--muted-foreground)] mt-1 truncate max-w-sm">
                                    {asg.description || 'Tidak ada deskripsi instruksi.'}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="text-xs font-semibold text-[var(--foreground)]">
                                  {asg.subject?.name}
                                </span>
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-[var(--muted)] border-none text-[var(--muted-foreground)] text-[10px] font-bold px-2 py-0.5 rounded">
                                  <GraduationCap className="h-3 w-3 shrink-0 mr-1 inline-block" />
                                  {asg.class?.name || 'Semua Kelas'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <span className="text-xs font-bold text-[var(--foreground)] flex items-center gap-1.5">
                                  <Calendar className="h-3.5 w-3.5 text-[#5483B3] shrink-0" />
                                  {new Date(asg.deadline).toLocaleDateString('id-ID', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </TableCell>
                              <TableCell>
                                <span className="text-xs font-bold text-[var(--foreground)] bg-[var(--muted)]/80 px-2 py-1 rounded border border-[var(--border)]">
                                  {asg.maxScore}
                                </span>
                              </TableCell>
                              {role === 'ADMIN' && (
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-7 w-7 rounded-full border border-[var(--border)]">
                                      <AvatarImage src={asg.teacher?.image} />
                                      <AvatarFallback className="bg-[var(--muted)] text-[var(--muted-foreground)] text-[10px] font-bold rounded-full">
                                        {asg.teacher?.name?.[0]}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs font-medium text-[var(--muted-foreground)] truncate max-w-[100px]">
                                      {asg.teacher?.name}
                                    </span>
                                  </div>
                                </TableCell>
                              )}
                              <TableCell>{getStatusBadge(asg.status)}</TableCell>
                              <TableCell>
                                <div className="flex flex-col gap-1 max-w-[150px]">
                                  {attachmentsList.length === 0 ? (
                                    <span className="text-xs text-[var(--muted-foreground)]">-</span>
                                  ) : (
                                    attachmentsList.map((attach: any, i: number) => (
                                      <a
                                        key={i}
                                        href={attach.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[11px] font-bold text-[#5483B3] hover:underline flex items-center gap-1 truncate"
                                      >
                                        <LinkIcon className="h-3 w-3 shrink-0 text-[#5483B3]" />
                                        {attach.name}
                                      </a>
                                    ))
                                  )}
                                </div>
                              </TableCell>
                              {canEditAssignments && (
                                <TableCell className="text-right pr-4 md:pr-6">
                                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 rounded-lg hover:bg-[var(--muted)] hover:text-[#5483B3]"
                                      onClick={() => openEdit(asg)}
                                    >
                                      <Edit3 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 rounded-lg hover:bg-red-500/10 hover:text-red-500"
                                      onClick={() => openDelete(asg)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              )}
                            </motion.tr>
                          )
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Bulk Actions Floating Bar */}
            <AnimatePresence>
              {selectedIds.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 50, scale: 0.95 }}
                  className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 glass border border-[var(--border)] px-6 py-4 rounded-2xl flex flex-col md:flex-row items-center gap-4 shadow-2xl w-[90%] max-w-3xl"
                >
                  <div className="flex items-center gap-3">
                    <span className="h-6 w-6 bg-[#5483B3]/10 text-[#5483B3] rounded-full flex items-center justify-center text-xs font-bold">
                      {selectedIds.length}
                    </span>
                    <p className="text-xs font-bold text-[var(--foreground)]">Tugas Terpilih</p>
                  </div>
                  <div className="h-4 w-px bg-[var(--border)] hidden md:block" />
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto md:ml-auto justify-center">
                    <Button
                      variant="outline"
                      disabled={isSubmitting}
                      className="border-[var(--border)] hover:bg-[var(--muted)] text-[11px] font-bold h-9 px-3 rounded-lg flex items-center gap-1.5"
                      onClick={() => handleBulkStatusUpdate('DRAFT')}
                    >
                      <Clock className="h-3.5 w-3.5 text-amber-500" /> Draft
                    </Button>
                    <Button
                      variant="outline"
                      disabled={isSubmitting}
                      className="border-[var(--border)] hover:bg-[var(--muted)] text-[11px] font-bold h-9 px-3 rounded-lg flex items-center gap-1.5"
                      onClick={() => handleBulkStatusUpdate('PUBLISHED')}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Publish
                    </Button>
                    <Button
                      variant="outline"
                      disabled={isSubmitting}
                      className="border-[var(--border)] hover:bg-[var(--muted)] text-[11px] font-bold h-9 px-3 rounded-lg flex items-center gap-1.5"
                      onClick={() => handleBulkStatusUpdate('CLOSED')}
                    >
                      <X className="h-3.5 w-3.5 text-red-500" /> Tutup
                    </Button>
                    <Button
                      variant="destructive"
                      disabled={isSubmitting}
                      className="bg-red-500 hover:bg-red-600 text-white text-[11px] font-bold h-9 px-3 rounded-lg flex items-center gap-1.5"
                      onClick={handleBulkDelete}
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Hapus
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Teacher Permissions Tab for Admin */
          <motion.div
            key="izin-guru-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="relative group w-full max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)] group-focus-within:text-[#5483B3] transition-colors" />
                <Input
                  placeholder="Cari guru berdasarkan nama atau email..."
                  className="bg-[var(--card)] border-[var(--border)] pl-10 h-11 text-xs rounded-xl w-full focus-visible:ring-[#5483B3] transition-all shadow-sm"
                  value={teacherSearch}
                  onChange={(e) => setTeacherSearch(e.target.value)}
                />
              </div>
            </div>

            <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[var(--border)] hover:bg-transparent bg-[var(--muted)]/30">
                      <TableHead className="text-xs font-bold text-[var(--muted-foreground)] pl-6 py-4">Guru</TableHead>
                      <TableHead className="text-xs font-bold text-[var(--muted-foreground)]">Email</TableHead>
                      <TableHead className="text-xs font-bold text-[var(--muted-foreground)] text-right pr-6">Izin Edit Tugas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeachers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="h-64 text-center">
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <UserCheck className="h-12 w-12 text-[var(--muted-foreground)] opacity-50 mx-auto mb-4" />
                            <p className="text-sm font-bold text-[var(--muted-foreground)]">Tidak ada guru ditemukan</p>
                          </motion.div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTeachers.map((teach: any) => (
                        <TableRow key={teach.id} className="border-[var(--border)] hover:bg-[var(--muted)]/20 transition-colors">
                          <TableCell className="pl-6 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9 rounded-full border border-[var(--border)]">
                                <AvatarImage src={teach.image} />
                                <AvatarFallback className="bg-[var(--muted)] text-[var(--muted-foreground)] text-xs font-bold rounded-full">
                                  {teach.name?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-bold text-[var(--foreground)]">{teach.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-xs text-[var(--muted-foreground)]">{teach.email}</span>
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <div className="flex items-center justify-end gap-3">
                              <span className={`text-xs font-semibold ${teach.canEditAssignments ? 'text-[#5483B3]' : 'text-[var(--muted-foreground)]'}`}>
                                {teach.canEditAssignments ? 'Diizinkan' : 'Terkunci'}
                              </span>
                              <Switch
                                checked={teach.canEditAssignments}
                                onCheckedChange={() => handlePermissionToggle(teach.id, teach.canEditAssignments)}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dialogs */}

      {/* 1. Add Assignment Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="bg-[var(--card)] border-[var(--border)] text-[var(--foreground)] max-w-2xl rounded-2xl shadow-xl p-0 overflow-hidden max-h-[90vh]">
          <div className="p-6 md:p-8 overflow-y-auto max-h-[85vh] custom-scrollbar">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-extrabold tracking-tight">Buat Penugasan Baru</DialogTitle>
              <DialogDescription className="text-sm font-medium mt-1">Lengkapi data di bawah untuk mempublikasikan tugas ke kelas.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAddAssignment} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-[var(--foreground)]">Judul Tugas</Label>
                  <Input
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]"
                    placeholder="Masukkan judul tugas..."
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-[var(--foreground)]">Instruksi Penugasan</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-[var(--card)] border-[var(--border)] rounded-xl min-h-[100px] text-sm focus-visible:ring-[#5483B3] p-3"
                    placeholder="Tulis deskripsi instruksi, petunjuk pengerjaan, atau kriteria penilaian tugas..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-[var(--foreground)]">Mata Pelajaran</Label>
                    <Select
                      value={formData.subjectId}
                      onValueChange={(v) => setFormData({ ...formData, subjectId: v })}
                    >
                      <SelectTrigger className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]">
                        <SelectValue placeholder="Pilih Mapel" />
                      </SelectTrigger>
                      <SelectContent className="bg-[var(--card)] border-[var(--border)] rounded-xl shadow-lg z-50">
                        {subjects.map((sub: any) => (
                          <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-[var(--foreground)]">Kelas Sasaran</Label>
                    <Select
                      value={formData.classId}
                      onValueChange={(v) => setFormData({ ...formData, classId: v })}
                    >
                      <SelectTrigger className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]">
                        <SelectValue placeholder="Semua Kelas" />
                      </SelectTrigger>
                      <SelectContent className="bg-[var(--card)] border-[var(--border)] rounded-xl shadow-lg z-50">
                        <SelectItem value="all">Semua Kelas</SelectItem>
                        {classes.map((cls: any) => (
                          <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-[var(--foreground)]">Tanggal Tenggat (Deadline)</Label>
                    <Input
                      type="datetime-local"
                      required
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-[var(--foreground)]">Nilai Maksimal</Label>
                    <Input
                      type="number"
                      required
                      min={1}
                      max={1000}
                      value={formData.maxScore}
                      onChange={(e) => setFormData({ ...formData, maxScore: parseInt(e.target.value) || 100 })}
                      className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-[var(--foreground)]">Status Awal</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(v) => setFormData({ ...formData, status: v })}
                  >
                    <SelectTrigger className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]">
                      <SelectValue placeholder="Draft" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--card)] border-[var(--border)] rounded-xl shadow-lg z-50">
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="PUBLISHED">Published (Publikasikan Langsung)</SelectItem>
                      <SelectItem value="CLOSED">Closed (Ditutup)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Attachments Section */}
                <div className="space-y-3 pt-2">
                  <Label className="text-xs font-bold text-[var(--foreground)] flex items-center gap-1.5">
                    <LinkIcon className="h-4 w-4 text-[#5483B3]" /> Lampiran Dokumen / Link Pendukung
                  </Label>

                  {/* List existing */}
                  <div className="space-y-2">
                    {formData.attachments.map((attach, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-[var(--muted)]/50 border border-[var(--border)] rounded-xl text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <LinkIcon className="h-3.5 w-3.5 text-[#5483B3] shrink-0" />
                          <span className="font-semibold truncate max-w-[200px]">{attach.name}</span>
                          <span className="text-[var(--muted-foreground)] truncate max-w-[200px]">({attach.url})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(i)}
                          className="text-red-500 hover:bg-red-500/10 p-1 rounded-lg transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add attachment form row */}
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 items-end bg-[var(--muted)]/20 p-3.5 border border-[var(--border)] border-dashed rounded-xl">
                    <div className="sm:col-span-2 space-y-1.5">
                      <Label className="text-[10px] font-bold text-[var(--muted-foreground)]">Nama Link</Label>
                      <Input
                        value={newAttachmentName}
                        onChange={(e) => setNewAttachmentName(e.target.value)}
                        placeholder="e.g. Kisi-kisi PDF, Soal GDrive"
                        className="bg-[var(--card)] border-[var(--border)] h-9 text-xs rounded-lg focus-visible:ring-[#5483B3]"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-1.5">
                      <Label className="text-[10px] font-bold text-[var(--muted-foreground)]">URL Tautan</Label>
                      <Input
                        value={newAttachmentUrl}
                        onChange={(e) => setNewAttachmentUrl(e.target.value)}
                        placeholder="e.g. drive.google.com/..."
                        className="bg-[var(--card)] border-[var(--border)] h-9 text-xs rounded-lg focus-visible:ring-[#5483B3]"
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={addAttachment}
                      className="bg-transparent border border-[#5483B3] text-[#5483B3] hover:bg-[#5483B3]/10 h-9 text-[11px] font-bold rounded-lg w-full flex items-center justify-center gap-1.5"
                    >
                      <Plus className="h-3.5 w-3.5" /> Tambah
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-[var(--border)]">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 h-12 rounded-xl font-bold text-xs bg-[var(--muted)] hover:bg-[var(--muted)]/80"
                >
                  Batal
                </Button>
                <Button
                  disabled={isSubmitting}
                  className="flex-[2] h-12 bg-[#5483B3] text-white font-bold rounded-xl hover:bg-[#3B6FA0] transition-all shadow-md text-xs"
                >
                  {isSubmitting ? 'Memproses...' : 'Buat Tugas'}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* 2. Edit Assignment Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-[var(--card)] border-[var(--border)] text-[var(--foreground)] max-w-2xl rounded-2xl shadow-xl p-0 overflow-hidden max-h-[90vh]">
          <div className="p-6 md:p-8 overflow-y-auto max-h-[85vh] custom-scrollbar">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-extrabold tracking-tight">Edit Penugasan</DialogTitle>
              <DialogDescription className="text-sm font-medium mt-1">Perbarui data, tenggat waktu, atau lampiran pendukung tugas.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleEditAssignment} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-[var(--foreground)]">Judul Tugas</Label>
                  <Input
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-[var(--foreground)]">Instruksi Penugasan</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-[var(--card)] border-[var(--border)] rounded-xl min-h-[100px] text-sm focus-visible:ring-[#5483B3] p-3"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-[var(--foreground)]">Mata Pelajaran</Label>
                    <Select
                      value={formData.subjectId}
                      onValueChange={(v) => setFormData({ ...formData, subjectId: v })}
                    >
                      <SelectTrigger className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]">
                        <SelectValue placeholder="Pilih Mapel" />
                      </SelectTrigger>
                      <SelectContent className="bg-[var(--card)] border-[var(--border)] rounded-xl shadow-lg z-50">
                        {subjects.map((sub: any) => (
                          <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-[var(--foreground)]">Kelas Sasaran</Label>
                    <Select
                      value={formData.classId}
                      onValueChange={(v) => setFormData({ ...formData, classId: v })}
                    >
                      <SelectTrigger className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]">
                        <SelectValue placeholder="Semua Kelas" />
                      </SelectTrigger>
                      <SelectContent className="bg-[var(--card)] border-[var(--border)] rounded-xl shadow-lg z-50">
                        <SelectItem value="all">Semua Kelas</SelectItem>
                        {classes.map((cls: any) => (
                          <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-[var(--foreground)]">Tanggal Tenggat (Deadline)</Label>
                    <Input
                      type="datetime-local"
                      required
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-[var(--foreground)]">Nilai Maksimal</Label>
                    <Input
                      type="number"
                      required
                      min={1}
                      max={1000}
                      value={formData.maxScore}
                      onChange={(e) => setFormData({ ...formData, maxScore: parseInt(e.target.value) || 100 })}
                      className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-[var(--foreground)]">Status Penugasan</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(v) => setFormData({ ...formData, status: v })}
                  >
                    <SelectTrigger className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]">
                      <SelectValue placeholder="Draft" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--card)] border-[var(--border)] rounded-xl shadow-lg z-50">
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="PUBLISHED">Published (Publikasikan)</SelectItem>
                      <SelectItem value="CLOSED">Closed (Tutup)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Attachments Section */}
                <div className="space-y-3 pt-2">
                  <Label className="text-xs font-bold text-[var(--foreground)] flex items-center gap-1.5">
                    <LinkIcon className="h-4 w-4 text-[#5483B3]" /> Lampiran Dokumen / Link Pendukung
                  </Label>

                  {/* List existing */}
                  <div className="space-y-2">
                    {formData.attachments.map((attach, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-[var(--muted)]/50 border border-[var(--border)] rounded-xl text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <LinkIcon className="h-3.5 w-3.5 text-[#5483B3] shrink-0" />
                          <span className="font-semibold truncate max-w-[200px]">{attach.name}</span>
                          <span className="text-[var(--muted-foreground)] truncate max-w-[200px]">({attach.url})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(i)}
                          className="text-red-500 hover:bg-red-500/10 p-1 rounded-lg transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add attachment form row */}
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 items-end bg-[var(--muted)]/20 p-3.5 border border-[var(--border)] border-dashed rounded-xl">
                    <div className="sm:col-span-2 space-y-1.5">
                      <Label className="text-[10px] font-bold text-[var(--muted-foreground)]">Nama Link</Label>
                      <Input
                        value={newAttachmentName}
                        onChange={(e) => setNewAttachmentName(e.target.value)}
                        placeholder="e.g. Kisi-kisi PDF, Soal GDrive"
                        className="bg-[var(--card)] border-[var(--border)] h-9 text-xs rounded-lg focus-visible:ring-[#5483B3]"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-1.5">
                      <Label className="text-[10px] font-bold text-[var(--muted-foreground)]">URL Tautan</Label>
                      <Input
                        value={newAttachmentUrl}
                        onChange={(e) => setNewAttachmentUrl(e.target.value)}
                        placeholder="e.g. drive.google.com/..."
                        className="bg-[var(--card)] border-[var(--border)] h-9 text-xs rounded-lg focus-visible:ring-[#5483B3]"
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={addAttachment}
                      className="bg-transparent border border-[#5483B3] text-[#5483B3] hover:bg-[#5483B3]/10 h-9 text-[11px] font-bold rounded-lg w-full flex items-center justify-center gap-1.5"
                    >
                      <Plus className="h-3.5 w-3.5" /> Tambah
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-[var(--border)]">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 h-12 rounded-xl font-bold text-xs bg-[var(--muted)] hover:bg-[var(--muted)]/80"
                >
                  Batal
                </Button>
                <Button
                  disabled={isSubmitting}
                  className="flex-[2] h-12 bg-[#5483B3] text-white font-bold rounded-xl hover:bg-[#3B6FA0] transition-all shadow-md text-xs"
                >
                  {isSubmitting ? 'Memproses...' : 'Simpan Perubahan'}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* 3. Delete Assignment Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="bg-[var(--card)] border-[var(--border)] text-[var(--foreground)] rounded-2xl max-w-md p-0 overflow-hidden shadow-xl">
          <div className="p-8 text-center">
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="h-8 w-8 text-red-600" />
            </div>
            <DialogTitle className="text-xl font-bold mb-2 text-center">Hapus Penugasan</DialogTitle>
            <p className="text-[var(--muted-foreground)] text-sm mb-6 leading-relaxed">
              Apakah Anda yakin ingin menghapus tugas <span className="text-[var(--foreground)] font-bold">{selectedAssignment?.title}</span>?
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsDeleteOpen(false)}
                className="flex-1 h-11 rounded-xl font-bold text-xs border-[var(--border)]"
              >
                Batal
              </Button>
              <Button
                onClick={handleDeleteAssignment}
                disabled={isSubmitting}
                className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-md"
              >
                {isSubmitting ? 'Menghapus...' : 'Ya, Hapus'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
