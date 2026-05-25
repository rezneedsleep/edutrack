'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  Mail,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Save,
  Key,
  FileJson,
  AlertTriangle,
  X,
  GraduationCap,
  Eye,
  EyeOff,
  Filter,
  DownloadCloud,
  CheckSquare,
  Square,
  UploadCloud,
  UserCheck,
  Phone,
  MapPin,
  Fingerprint,
  User
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'

export function AdminUsersClient({ initialUsers, classes, subjects = [], fixedRole, title }: any) {
  const [users, setUsers] = useState(initialUsers)
  const [search, setSearch] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isBulkDeleteConfirmOpen, setIsBulkDeleteConfirmOpen] = useState(false)
  const [isBulkOpen, setIsBulkOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bulkJson, setBulkJson] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: fixedRole || 'STUDENT',
    school: 'SMKN 13 Bandung',
    classId: '',
    subjectId: '',
    image: '',
    nis: '',
    phone: '',
    gender: 'Laki-laki',
    address: '',
    position: '',
    affiliations: '',
    canEditMaterials: false,
    canEditAssignments: false
  })

  const [showPassword, setShowPassword] = useState(false)
  const [classFilter, setClassFilter] = useState('ALL')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const filteredUsers = users.filter((u: any) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                         u.email.toLowerCase().includes(search.toLowerCase()) ||
                         u.nis?.toLowerCase().includes(search.toLowerCase())
    const matchesClass = classFilter === 'ALL' || u.classId === classFilter
    const matchesRole = (!fixedRole && roleFilter !== 'ALL') ? u.role === roleFilter : (!fixedRole || u.role === fixedRole)
    return matchesSearch && matchesClass && matchesRole
  })

  const handleSelectAll = () => {
    if (selectedIds.length === filteredUsers.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredUsers.map((u: any) => u.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleExport = () => {
    const usersToExport = users.filter((u: any) => selectedIds.includes(u.id))
    if (usersToExport.length === 0) {
      toast.error('Pilih setidaknya satu pengguna untuk diekspor')
      return
    }

    const csvRows = [
      ['Nama', 'Email', 'Role', 'Kelas', 'NIS', 'Telepon', 'Sekolah'],
      ...usersToExport.map((u: any) => [
        u.name,
        u.email,
        u.role,
        u.class?.name || '-',
        u.nis || '-',
        u.phone || '-',
        u.school || '-'
      ])
    ]

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `edutrack_${fixedRole?.toLowerCase() || 'users'}_export.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success(`${usersToExport.length} Pengguna diekspor`)
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const payload = {
      ...formData,
      affiliations: typeof formData.affiliations === 'string' 
        ? formData.affiliations.split(',').map(a => a.trim()).filter(Boolean)
        : formData.affiliations
    }

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        const newUser = await res.json()
        setUsers([newUser, ...users])
        toast.success('User berhasil ditambahkan')
        setIsAddOpen(false)
        setFormData({ name: '', email: '', password: '', role: fixedRole || 'STUDENT', school: 'SMKN 13 Bandung', classId: '', subjectId: '', image: '', nis: '', phone: '', gender: 'Laki-laki', address: '', position: '', affiliations: '', canEditMaterials: false, canEditAssignments: false })
      } else {
        const err = await res.text()
        toast.error(err || 'Gagal menambahkan user')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan sistem')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formDataUpload = new FormData()
    formDataUpload.append('file', file)

    const loadingToast = toast.loading(`Mengunggah foto ${file.name}...`)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setFormData(prev => ({ ...prev, image: data.url }))
        toast.success('Foto profil berhasil diunggah', { id: loadingToast })
      } else {
        toast.error(data.error || 'Gagal mengunggah foto', { id: loadingToast })
      }
    } catch (error) {
      toast.error('Kesalahan koneksi saat mengunggah', { id: loadingToast })
    }
  }

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const payload = {
      ...formData,
      affiliations: typeof formData.affiliations === 'string' 
        ? formData.affiliations.split(',').map(a => a.trim()).filter(Boolean)
        : formData.affiliations
    }

    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        const updatedUser = await res.json()
        setUsers(users.map((u: any) => u.id === selectedUser.id ? updatedUser : u))
        toast.success('User berhasil diperbarui')
        setIsEditOpen(false)
      } else {
        toast.error('Gagal memperbarui user')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan sistem')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteUser = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setUsers(users.filter((u: any) => u.id !== selectedUser.id))
        toast.success('User berhasil dihapus permanent')
        setIsDeleteOpen(false)
      } else {
        toast.error('Gagal menghapus user. Pastikan data terkait sudah bersih.')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan sistem')
    } finally {
      setIsSubmitting(false)
    }
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

      // Skip header
      const dataRows = lines.slice(1)
      setIsSubmitting(true)
      
      let successCount = 0
      let failCount = 0

      for (const row of dataRows) {
        const [name, email, password, role, school, classId] = row.split(',').map(s => s.trim())
        if (!name || !email) continue

        try {
          const res = await fetch('/api/admin/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name,
              email,
              password: password || 'password123',
              role: role || 'STUDENT',
              school: school || 'SMKN 13 Bandung',
              classId: classId || ''
            })
          })
          if (res.ok) {
            const newUser = await res.json()
            setUsers((prev: any) => [newUser, ...prev])
            successCount++
          } else {
            failCount++
          }
        } catch (error) {
          failCount++
        }
      }

      toast.success(`Import CSV selesai: ${successCount} berhasil, ${failCount} gagal`)
      setIsSubmitting(false)
      // Reset input
      e.target.value = ''
    }
    reader.readAsText(file)
  }

  const handleBulkImport = async () => {
    if (!bulkJson.trim()) return
    setIsSubmitting(true)
    try {
      const data = JSON.parse(bulkJson)
      const usersToImport = Array.isArray(data) ? data : [data]
      
      let successCount = 0
      let failCount = 0

      for (const user of usersToImport) {
        const res = await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...user,
            password: user.password || 'password123'
          })
        })
        if (res.ok) {
          const newUser = await res.json()
          setUsers((prev: any) => [newUser, ...prev])
          successCount++
        } else {
          failCount++
        }
      }

      toast.success(`Import selesai: ${successCount} berhasil, ${failCount} gagal`)
      setIsBulkOpen(false)
      setBulkJson('')
    } catch (error) {
      toast.error('Format JSON tidak valid')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      })

      if (res.ok) {
        setUsers(users.map((u: any) => u.id === userId ? { ...u, isActive: !currentStatus } : u))
        toast.success('Status pengguna diperbarui')
      }
    } catch (error) {
      toast.error('Gagal memperbarui status')
    }
  }

  const openAdd = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: fixedRole || 'STUDENT',
      school: 'SMKN 13 Bandung',
      classId: '',
      subjectId: '',
      image: '',
      nis: '',
      phone: '',
      gender: 'Laki-laki',
      address: '',
      position: '',
      affiliations: '',
      canEditMaterials: false,
      canEditAssignments: false
    })
    setIsAddOpen(true)
  }

  const openEdit = (user: any) => {
    setSelectedUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      password: '', 
      role: user.role,
      school: user.school || 'SMKN 13 Bandung',
      classId: user.classId || '',
      subjectId: user.teacherSubjects?.[0]?.id || '',
      image: user.image || '',
      nis: user.nis || '',
      phone: user.phone || '',
      gender: user.gender || 'Laki-laki',
      address: user.address || '',
      position: user.position || '',
      affiliations: user.affiliations?.join(', ') || '',
      canEditMaterials: user.canEditMaterials || false,
      canEditAssignments: user.canEditAssignments || false
    })
    setIsEditOpen(true)
  }

  const openDelete = (user: any) => {
    setSelectedUser(user)
    setIsDeleteOpen(true)
  }

  const confirmBulkDelete = () => {
    if (selectedIds.length === 0) return
    setIsBulkDeleteConfirmOpen(true)
  }

  const executeBulkDelete = async () => {
    setIsBulkDeleteConfirmOpen(false)
    setIsSubmitting(true)
    const toastId = toast.loading(`Menghapus ${selectedIds.length} pengguna...`)
    try {
      const res = await fetch('/api/admin/users/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds })
      })
      
      if (res.ok) {
        setUsers(users.filter((u: any) => !selectedIds.includes(u.id)))
        setSelectedIds([])
        toast.success(`${selectedIds.length} Pengguna berhasil dihapus`, { id: toastId })
      } else {
        toast.error('Gagal menghapus beberapa pengguna', { id: toastId })
      }
    } catch (error) {
      toast.error('Terjadi kesalahan sistem', { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10 pb-20"
    >
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
        >
          <p className="text-[#5483B3] font-bold uppercase tracking-wider text-xs mb-3 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            {fixedRole ? `${fixedRole} MANAGEMENT` : 'USER MANAGEMENT'}
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
            {title || 'Kelola Pengguna'}
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] font-medium mt-3 flex items-center gap-3">
            Platform monitoring dan kontrol akses sistem EduTrack.
            <Badge className="bg-[var(--muted)] text-[var(--muted-foreground)] border-none text-xs font-bold px-2.5 py-0.5">{filteredUsers.length} Terdaftar</Badge>
          </p>
        </motion.div>
        
        <div className="flex flex-wrap items-center gap-3">
           <div className="relative group flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)] group-focus-within:text-[#5483B3] transition-colors" />
              <Input 
                placeholder="Cari nama, email, atau NIS..." 
                className="bg-[var(--card)] border-[var(--border)] pl-10 h-11 text-xs rounded-xl w-full focus-visible:ring-[#5483B3] transition-all shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>
           
           {!fixedRole && (
             <div className="flex gap-2">
                 <div className="relative group">
                    <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)] group-focus-within:text-[#5483B3] transition-colors" />
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                       <SelectTrigger className="bg-[var(--card)] border-[var(--border)] pl-10 h-11 text-xs font-semibold rounded-xl w-40 focus-visible:ring-[#5483B3] transition-all shadow-sm">
                          <SelectValue placeholder="Filter Role" />
                       </SelectTrigger>
                       <SelectContent className="bg-[var(--card)] border-[var(--border)] rounded-xl shadow-lg z-50">
                          <SelectItem value="ALL">Semua Peran</SelectItem>
                          <SelectItem value="STUDENT">Siswa</SelectItem>
                          <SelectItem value="TEACHER">Guru</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>
                 <div className="relative group">
                    <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)] group-focus-within:text-[#5483B3] transition-colors" />
                    <Select value={classFilter} onValueChange={setClassFilter}>
                       <SelectTrigger className="bg-[var(--card)] border-[var(--border)] pl-10 h-11 text-xs font-semibold rounded-xl w-48 focus-visible:ring-[#5483B3] transition-all shadow-sm">
                          <SelectValue placeholder="Filter Kelas" />
                       </SelectTrigger>
                       <SelectContent className="bg-[var(--card)] border-[var(--border)] rounded-xl shadow-lg z-50">
                          <SelectItem value="ALL">Semua Kelas</SelectItem>
                          {classes.map((c: any) => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                          ))}
                       </SelectContent>
                    </Select>
                 </div>
             </div>
           )}

           <div className="flex items-center gap-2">
              <Button 
                   onClick={handleExport}
                   variant="outline"
                   disabled={selectedIds.length === 0}
                   className="border-[var(--border)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] rounded-xl h-11 px-4 font-bold text-xs gap-2 shadow-sm"
              >
                 <DownloadCloud className="h-4 w-4 text-[#5483B3]" /> Export
              </Button>

              <Button 
                   onClick={() => setIsBulkOpen(true)}
                   variant="outline"
                   className="border-[var(--border)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] rounded-xl h-11 px-4 font-bold text-xs gap-2 shadow-sm"
              >
                 <FileJson className="h-4 w-4 text-[#5483B3]" /> JSON
              </Button>
           </div>

           <Button 
             onClick={openAdd}
             className="bg-[#5483B3] hover:bg-[#3B6FA0] text-white rounded-xl font-bold text-xs h-11 px-6 shadow-md transition-all gap-2 ml-auto lg:ml-0"
           >
             <Plus className="h-4 w-4" /> Tambah {fixedRole === 'STUDENT' ? 'Siswa' : fixedRole === 'TEACHER' ? 'Guru' : 'User'}
           </Button>
           
           <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
               <DialogContent className="bg-[var(--card)] border-[var(--border)] text-[var(--foreground)] max-w-3xl rounded-2xl shadow-xl p-0 overflow-hidden max-h-[90vh]">
                 <div className="p-6 md:p-8 overflow-y-auto max-h-[85vh] custom-scrollbar">
                  <DialogHeader className="mb-6">
                    <DialogTitle className="text-2xl font-extrabold tracking-tight">
                      Registrasi {fixedRole === 'STUDENT' ? 'Siswa' : fixedRole === 'TEACHER' ? 'Guru' : 'User'}
                    </DialogTitle>
                    <DialogDescription className="text-sm font-medium mt-1">Lengkapi formulir di bawah untuk menambahkan data ke sistem.</DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleAddUser} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Left: Avatar Upload */}
                      <div className="flex flex-col items-center gap-4 p-5 bg-[var(--muted)]/30 border border-[var(--border)] rounded-xl">
                         <Avatar className="h-32 w-32 rounded-2xl border-4 border-[var(--card)] shadow-sm group relative overflow-hidden bg-[var(--muted)]">
                            {formData.image ? (
                              <AvatarImage src={formData.image} className="object-cover" />
                            ) : (
                              <AvatarFallback className="bg-[var(--muted)] text-[var(--muted-foreground)] font-extrabold text-4xl">?</AvatarFallback>
                            )}
                         </Avatar>
                         <div className="w-full space-y-2">
                            <input type="file" id="add-user-photo" className="hidden" accept="image/*" onChange={handleFileUpload} />
                            <Button 
                              type="button" 
                              variant="outline" 
                              className="w-full rounded-xl border-[var(--border)] text-xs font-bold h-10 hover:bg-[var(--muted)] transition-all gap-2"
                              onClick={() => document.getElementById('add-user-photo')?.click()}
                            >
                               <UploadCloud className="h-4 w-4" /> Upload Foto
                            </Button>
                            {formData.image && (
                              <Button 
                                type="button" 
                                variant="ghost" 
                                className="w-full text-red-500 text-xs font-bold hover:bg-red-500/10 rounded-xl"
                                onClick={() => setFormData({...formData, image: ''})}
                              >
                                Hapus
                              </Button>
                            )}
                         </div>
                      </div>

                      {/* Right: Basic Info */}
                      <div className="md:col-span-2 space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="space-y-2">
                              <Label className="text-xs font-bold text-[var(--foreground)] flex items-center gap-2">
                                <User className="h-3.5 w-3.5 text-[#5483B3]" /> Nama Lengkap
                              </Label>
                              <Input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]" placeholder="Masukkan nama lengkap" />
                          </div>
                          <div className="space-y-2">
                              <Label className="text-xs font-bold text-[var(--foreground)] flex items-center gap-2">
                                <Mail className="h-3.5 w-3.5 text-[#5483B3]" /> Email
                              </Label>
                              <Input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]" placeholder="Masukkan email aktif" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <Label className="text-xs font-bold text-[var(--foreground)] flex items-center gap-2">
                              <Fingerprint className="h-3.5 w-3.5 text-[#5483B3]" /> {fixedRole === 'STUDENT' ? 'NIS' : 'NIP / ID'}
                            </Label>
                            <Input value={formData.nis} onChange={(e) => setFormData({...formData, nis: e.target.value})} className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]" placeholder={fixedRole === 'STUDENT' ? "Masukkan NIS" : "Masukkan NIP"} />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-bold text-[var(--foreground)] flex items-center gap-2">
                              <Phone className="h-3.5 w-3.5 text-[#5483B3]" /> Nomor Telepon
                            </Label>
                            <Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]" placeholder="08xxxxxxxxxx" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-[var(--foreground)]">Jenis Kelamin</Label>
                        <Select value={formData.gender} onValueChange={(v) => setFormData({...formData, gender: v})}>
                          <SelectTrigger className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]">
                            <SelectValue placeholder="Pilih Gender" />
                          </SelectTrigger>
                          <SelectContent className="bg-[var(--card)] border-[var(--border)] rounded-xl shadow-lg">
                            <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                            <SelectItem value="Perempuan">Perempuan</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {!fixedRole ? (
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-[var(--foreground)]">Peran</Label>
                          <Select value={formData.role} onValueChange={(v) => setFormData({...formData, role: v})}>
                            <SelectTrigger className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]">
                              <SelectValue placeholder="Pilih Peran" />
                            </SelectTrigger>
                            <SelectContent className="bg-[var(--card)] border-[var(--border)] rounded-xl shadow-lg z-50">
                              <SelectItem value="STUDENT">Siswa</SelectItem>
                              <SelectItem value="TEACHER">Guru</SelectItem>
                              <SelectItem value="COACH">Pelatih</SelectItem>
                              <SelectItem value="ADMIN">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-[var(--foreground)]">Afiliasi</Label>
                          {fixedRole === 'STUDENT' ? (
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
                          ) : (
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
                          )}
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-[var(--foreground)]">Password</Label>
                        <div className="relative">
                           <Input 
                              required 
                              type={showPassword ? "text" : "password"} 
                              value={formData.password} 
                              onChange={(e) => setFormData({...formData, password: e.target.value})} 
                              className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 pr-10 text-sm focus-visible:ring-[#5483B3]" 
                              placeholder="••••••••"
                           />
                           <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[#5483B3] transition-colors">
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                           </button>
                        </div>
                      </div>
                      </div>

                      {(formData.role === 'TEACHER' || formData.role === 'COACH') && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                          <div className="space-y-2">
                              <Label className="text-xs font-bold text-[var(--foreground)]">Jabatan Opsional</Label>
                              <Input value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]" placeholder="Contoh: Pembina Pramuka" />
                          </div>
                          <div className="space-y-2">
                              <Label className="text-xs font-bold text-[var(--foreground)]">Keterangan Afiliasi</Label>
                              <Input value={formData.affiliations} onChange={(e) => setFormData({...formData, affiliations: e.target.value})} className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]" placeholder="Pisahkan dengan koma" />
                          </div>
                        </div>
                      )}

                      {formData.role === 'TEACHER' && (
                        <div className="space-y-4 mt-5">
                          <div className="flex items-center justify-between p-4 bg-[var(--muted)]/30 border border-[var(--border)] rounded-xl">
                            <div className="space-y-0.5">
                              <Label className="text-sm font-bold text-[var(--foreground)]">Bisa Edit Materi</Label>
                              <p className="text-xs text-[var(--muted-foreground)]">Izinkan guru ini untuk menambah, menyunting, dan menghapus materinya sendiri.</p>
                            </div>
                            <Switch 
                              checked={!!formData.canEditMaterials} 
                              onCheckedChange={(checked) => setFormData({...formData, canEditMaterials: checked})} 
                            />
                          </div>

                          <div className="flex items-center justify-between p-4 bg-[var(--muted)]/30 border border-[var(--border)] rounded-xl">
                            <div className="space-y-0.5">
                              <Label className="text-sm font-bold text-[var(--foreground)]">Bisa Edit Tugas</Label>
                              <p className="text-xs text-[var(--muted-foreground)]">Izinkan guru ini untuk menambah, menyunting, dan menghapus tugasnya sendiri.</p>
                            </div>
                            <Switch 
                              checked={!!formData.canEditAssignments} 
                              onCheckedChange={(checked) => setFormData({...formData, canEditAssignments: checked})} 
                            />
                          </div>
                        </div>
                      )}

                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-[var(--foreground)] flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-[#5483B3]" /> Alamat Lengkap
                      </Label>
                      <Textarea value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="bg-[var(--card)] border-[var(--border)] rounded-xl min-h-[100px] text-sm focus-visible:ring-[#5483B3] p-3" placeholder="Jl. Raya No. 123..." />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)} className="flex-1 h-12 rounded-xl font-bold text-xs bg-[var(--muted)] hover:bg-[var(--muted)]/80">Batal</Button>
                      <Button disabled={isSubmitting} className="flex-[2] h-12 bg-[#5483B3] text-white font-bold rounded-xl hover:bg-[#3B6FA0] transition-all shadow-md text-xs">
                        {isSubmitting ? 'Memproses...' : `Simpan ${fixedRole === 'STUDENT' ? 'Siswa' : 'Data'}`}
                      </Button>
                    </div>
                  </form>
                </div>
              </DialogContent>
           </Dialog>
        </div>
      </div>

      <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
         <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                 <TableHeader>
                    <TableRow className="border-[var(--border)] hover:bg-transparent bg-[var(--muted)]/30">
                        <TableHead className="w-16 pl-4 md:pl-6 py-4">
                          <div className="flex items-center gap-3">
                             <button onClick={handleSelectAll} className="text-[var(--muted-foreground)] hover:text-[#5483B3] transition-colors">
                                {selectedIds.length === filteredUsers.length && filteredUsers.length > 0 ? <CheckSquare className="h-4.5 w-4.5 text-[#5483B3]" /> : <Square className="h-4.5 w-4.5" />}
                             </button>
                             <AnimatePresence>
                                {selectedIds.length > 0 && (
                                   <motion.button 
                                     initial={{ opacity: 0, scale: 0.8 }}
                                     animate={{ opacity: 1, scale: 1 }}
                                     exit={{ opacity: 0, scale: 0.8 }}
                                     onClick={confirmBulkDelete}
                                     className="text-red-500 hover:bg-red-500/10 p-1.5 rounded-lg transition-colors"
                                     title={`Hapus ${selectedIds.length} pengguna`}
                                   >
                                      <Trash2 className="h-4 w-4" />
                                   </motion.button>
                                )}
                             </AnimatePresence>
                          </div>
                        </TableHead>
                        <TableHead className="text-xs font-bold text-[var(--muted-foreground)]">Pengguna</TableHead>
                        {fixedRole === 'STUDENT' && (
                          <TableHead className="text-xs font-bold text-[var(--muted-foreground)]">NIS</TableHead>
                        )}
                        {!fixedRole && <TableHead className="text-xs font-bold text-[var(--muted-foreground)]">Role</TableHead>}
                        <TableHead className="text-xs font-bold text-[var(--muted-foreground)]">Afiliasi</TableHead>
                        <TableHead className="text-xs font-bold text-[var(--muted-foreground)]">Kontak</TableHead>
                        <TableHead className="text-xs font-bold text-[var(--muted-foreground)]">Status</TableHead>
                        <TableHead className="text-xs font-bold text-[var(--muted-foreground)] text-right pr-4 md:pr-6">Kontrol</TableHead>
                    </TableRow>
                 </TableHeader>
                 <TableBody>
                    <AnimatePresence mode='popLayout'>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                          <TableCell colSpan={fixedRole === 'STUDENT' ? 7 : 6} className="h-64 text-center">
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                              >
                                <Users className="h-12 w-12 text-[var(--muted-foreground)] opacity-50 mx-auto mb-4" />
                                <p className="text-sm font-bold text-[var(--muted-foreground)]">Tidak ada pengguna ditemukan</p>
                              </motion.div>
                          </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user: any, index: number) => (
                          <motion.tr 
                              layout
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ delay: index * 0.03 }}
                              key={user.id} 
                              className={cn("border-[var(--border)] hover:bg-[var(--muted)]/50 transition-colors group", selectedIds.includes(user.id) && "bg-[#5483B3]/5")}
                          >
                              <TableCell className="pl-4 md:pl-6">
                                 <button onClick={() => toggleSelect(user.id)} className={cn("transition-colors", selectedIds.includes(user.id) ? "text-[#5483B3]" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]")}>
                                    {selectedIds.includes(user.id) ? <CheckSquare className="h-4.5 w-4.5" /> : <Square className="h-4.5 w-4.5" />}
                                 </button>
                              </TableCell>
                              <TableCell>
                                 <div className="flex items-center gap-4 py-3">
                                    <div className="relative shrink-0">
                                       <Avatar className="h-10 w-10 border border-[var(--border)] rounded-xl">
                                           {user.image && <AvatarImage src={user.image} className="object-cover" />}
                                           <AvatarFallback className="bg-[var(--muted)] text-[var(--muted-foreground)] font-bold rounded-xl">{user.name[0]}</AvatarFallback>
                                       </Avatar>
                                       {user.isActive && (
                                           <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 bg-[#22C55E] border-2 border-[var(--card)] rounded-full" />
                                       )}
                                    </div>
                                    <div 
                                      className="cursor-pointer group/user min-w-0"
                                      onClick={() => window.location.href = `/dashboard/admin/users/${user.id}`}
                                    >
                                       <h4 className="text-sm font-bold text-[var(--foreground)] truncate group-hover/user:text-[#5483B3] transition-colors">{user.name}</h4>
                                       <p className="text-xs font-medium text-[var(--muted-foreground)] flex items-center gap-1.5 mt-0.5 truncate">
                                           <Mail className="h-3 w-3 shrink-0" />
                                           {user.email}
                                       </p>
                                    </div>
                                 </div>
                              </TableCell>
                              {fixedRole === 'STUDENT' && (
                                <TableCell>
                                   <code className="text-[11px] font-mono text-[var(--muted-foreground)] bg-[var(--muted)] px-2 py-1 rounded-md">{user.nis || '-'}</code>
                                </TableCell>
                              )}
                              {!fixedRole && (
                                <TableCell>
                                  <Badge className={`rounded-md border-none text-[10px] font-bold px-2 py-0.5 ${
                                    user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 
                                    user.role === 'TEACHER' ? 'bg-[#5483B3]/10 text-[#5483B3]' : 
                                    user.role === 'COACH' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                                  }`}>
                                     {user.role === 'STUDENT' ? 'Siswa' : user.role === 'TEACHER' ? 'Guru' : user.role === 'COACH' ? 'Pelatih' : 'Admin'}
                                  </Badge>
                                </TableCell>
                              )}
                              <TableCell>
                                 <p className="text-xs font-bold text-[var(--foreground)] truncate max-w-[120px]">{user.school || '-'}</p>
                                 <p className="text-[11px] font-medium text-[var(--muted-foreground)] mt-1 flex items-center gap-1.5 truncate max-w-[120px]">
                                    <GraduationCap className="h-3.5 w-3.5 text-[#5483B3]" />
                                    {user.role === 'TEACHER' ? (user.teacherSubjects?.[0]?.name || 'Belum Ada Mapel') : user.role === 'COACH' ? 'Pelatih Ekskul' : (user.class?.name || 'Belum Ada Kelas')}
                                 </p>
                              </TableCell>
                              <TableCell>
                                 <div className="space-y-1.5">
                                    <p className="text-xs font-medium text-[var(--muted-foreground)] flex items-center gap-2 truncate max-w-[120px]">
                                      <Phone className="h-3.5 w-3.5" /> {user.phone || '-'}
                                    </p>
                                    <p className="text-xs font-medium text-[var(--muted-foreground)] flex items-center gap-2 truncate max-w-[120px]">
                                      <MapPin className="h-3.5 w-3.5 shrink-0" /> {user.address || '-'}
                                    </p>
                                 </div>
                              </TableCell>
                              <TableCell>
                                 <button 
                                   onClick={() => toggleStatus(user.id, user.isActive)}
                                   className={cn(
                                       "px-2.5 py-1 text-[10px] font-bold rounded-md transition-colors",
                                       user.isActive ? "bg-[#22C55E]/10 text-[#22C55E] hover:bg-[#22C55E]/20" : "bg-red-100 text-red-600 hover:bg-red-200"
                                   )}
                                 >
                                   {user.isActive ? 'Active' : 'Suspended'}
                                 </button>
                              </TableCell>
                              <TableCell className="text-right pr-4 md:pr-6">
                                 <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button 
                                       variant="ghost" 
                                       size="icon" 
                                       className="h-8 w-8 rounded-lg hover:bg-[var(--muted)] hover:text-[#5483B3] transition-colors"
                                       onClick={() => openEdit(user)}
                                    >
                                       <Edit3 className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                       variant="ghost" 
                                       size="icon" 
                                       className="h-8 w-8 rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors"
                                       onClick={() => openDelete(user)}
                                    >
                                       <Trash2 className="h-4 w-4" />
                                    </Button>
                                 </div>
                              </TableCell>
                          </motion.tr>
                        ))
                    )}
                    </AnimatePresence>
                 </TableBody>
              </Table>
            </div>
         </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-[var(--card)] border-[var(--border)] text-[var(--foreground)] max-w-3xl rounded-2xl shadow-xl p-0 overflow-hidden max-h-[90vh]">
          <div className="p-6 md:p-8 overflow-y-auto max-h-[85vh] custom-scrollbar">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-extrabold tracking-tight">Edit Profil</DialogTitle>
              <DialogDescription className="text-sm font-medium mt-1">Perbarui informasi pengguna untuk akun {selectedUser?.name}.</DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleEditUser} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left: Avatar Upload */}
                <div className="flex flex-col items-center gap-4 p-5 bg-[var(--muted)]/30 border border-[var(--border)] rounded-xl">
                   <Avatar className="h-32 w-32 rounded-2xl border-4 border-[var(--card)] shadow-sm group relative overflow-hidden bg-[var(--muted)]">
                      {formData.image ? (
                        <AvatarImage src={formData.image} className="object-cover" />
                      ) : (
                        <AvatarFallback className="bg-[var(--muted)] text-[var(--muted-foreground)] font-extrabold text-4xl">{selectedUser?.name?.[0] || '?'}</AvatarFallback>
                      )}
                   </Avatar>
                   <div className="w-full space-y-2">
                      <input type="file" id="edit-user-photo" className="hidden" accept="image/*" onChange={handleFileUpload} />
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full rounded-xl border-[var(--border)] text-xs font-bold h-10 hover:bg-[var(--muted)] transition-all gap-2"
                        onClick={() => document.getElementById('edit-user-photo')?.click()}
                      >
                         <UploadCloud className="h-4 w-4" /> Ganti Foto
                      </Button>
                      {formData.image && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          className="w-full text-red-500 text-xs font-bold hover:bg-red-500/10 rounded-xl"
                          onClick={() => setFormData({...formData, image: ''})}
                        >
                          Hapus
                        </Button>
                      )}
                   </div>
                </div>

                {/* Right: Basic Info */}
                <div className="md:col-span-2 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-[var(--foreground)] flex items-center gap-2">
                          <User className="h-3.5 w-3.5 text-[#5483B3]" /> Nama Lengkap
                        </Label>
                        <Input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-[var(--foreground)] flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 text-[#5483B3]" /> Email
                        </Label>
                        <Input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-[var(--foreground)] flex items-center gap-2">
                        <Fingerprint className="h-3.5 w-3.5 text-[#5483B3]" /> {selectedUser?.role === 'STUDENT' ? 'NIS' : 'NIP / ID'}
                      </Label>
                      <Input value={formData.nis} onChange={(e) => setFormData({...formData, nis: e.target.value})} className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-[var(--foreground)] flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-[#5483B3]" /> Nomor Telepon
                      </Label>
                      <Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-[var(--foreground)]">Gender</Label>
                  <Select value={formData.gender} onValueChange={(v) => setFormData({...formData, gender: v})}>
                    <SelectTrigger className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]">
                      <SelectValue placeholder="Pilih Gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--card)] border-[var(--border)] rounded-xl shadow-lg">
                      <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                      <SelectItem value="Perempuan">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {!fixedRole ? (
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-[var(--foreground)]">Role</Label>
                    <Select value={formData.role} onValueChange={(v) => setFormData({...formData, role: v})}>
                      <SelectTrigger className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]">
                        <SelectValue placeholder="Pilih Role" />
                      </SelectTrigger>
                      <SelectContent className="bg-[var(--card)] border-[var(--border)] rounded-xl shadow-lg">
                        <SelectItem value="STUDENT">STUDENT</SelectItem>
                        <SelectItem value="TEACHER">TEACHER</SelectItem>
                        <SelectItem value="ADMIN">ADMIN</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-[var(--foreground)]">Afiliasi</Label>
                    {fixedRole === 'STUDENT' ? (
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
                    ) : (
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
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-[var(--foreground)]">Password Baru (Opsional)</Label>
                  <div className="relative">
                     <Input 
                        type={showPassword ? "text" : "password"} 
                        value={formData.password} 
                        onChange={(e) => setFormData({...formData, password: e.target.value})} 
                        className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 pr-10 text-sm focus-visible:ring-[#5483B3]" 
                        placeholder="Kosongkan jika tidak diubah"
                     />
                     <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[#5483B3] transition-colors">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                     </button>
                  </div>
                </div>
              </div>

              {(fixedRole === 'TEACHER' || (!fixedRole && formData.role === 'TEACHER')) && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-[var(--foreground)]">Jabatan (Custom)</Label>
                      <Input 
                        value={formData.position} 
                        onChange={(e) => setFormData({...formData, position: e.target.value})} 
                        className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]" 
                        placeholder="Contoh: Kepala Sekolah" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-[var(--foreground)]">Afiliasi (Koma pisahkan)</Label>
                      <Input 
                        value={formData.affiliations} 
                        onChange={(e) => setFormData({...formData, affiliations: e.target.value})} 
                        className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#5483B3]" 
                        placeholder="Wali Kelas X, Guru Mapel" 
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-[var(--muted)]/30 border border-[var(--border)] rounded-xl">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-bold text-[var(--foreground)]">Bisa Edit Materi</Label>
                        <p className="text-xs text-[var(--muted-foreground)]">Izinkan guru ini untuk menambah, menyunting, dan menghapus materinya sendiri.</p>
                      </div>
                      <Switch 
                        checked={!!formData.canEditMaterials} 
                        onCheckedChange={(checked) => setFormData({...formData, canEditMaterials: checked})} 
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[var(--muted)]/30 border border-[var(--border)] rounded-xl">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-bold text-[var(--foreground)]">Bisa Edit Tugas</Label>
                        <p className="text-xs text-[var(--muted-foreground)]">Izinkan guru ini untuk menambah, menyunting, dan menghapus tugasnya sendiri.</p>
                      </div>
                      <Switch 
                        checked={!!formData.canEditAssignments} 
                        onCheckedChange={(checked) => setFormData({...formData, canEditAssignments: checked})} 
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-xs font-bold text-[var(--foreground)] flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-[#5483B3]" /> Alamat Lengkap
                </Label>
                <Textarea value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="bg-[var(--card)] border-[var(--border)] rounded-xl min-h-[100px] text-sm focus-visible:ring-[#5483B3] p-3" />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)} className="flex-1 h-12 rounded-xl font-bold text-xs bg-[var(--muted)] hover:bg-[var(--muted)]/80">Batal</Button>
                <Button disabled={isSubmitting} className="flex-[2] h-12 bg-[#5483B3] text-white font-bold rounded-xl hover:bg-[#3B6FA0] transition-all shadow-md text-xs">
                  {isSubmitting ? 'Memproses...' : 'Simpan Perubahan'}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

       {/* Delete Confirm Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="bg-[var(--card)] border-[var(--border)] text-[var(--foreground)] rounded-2xl max-w-md p-0 overflow-hidden shadow-xl">
          <div className="p-8 text-center">
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <DialogTitle className="text-xl font-bold mb-2 text-center">Konfirmasi Hapus</DialogTitle>
            <p className="text-[var(--muted-foreground)] text-sm mb-6 leading-relaxed">
              Apakah Anda yakin ingin menghapus <span className="text-[var(--foreground)] font-bold">{selectedUser?.name}</span>? 
              Tindakan ini tidak dapat dibatalkan dan semua data terkait akan hilang.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)} className="flex-1 h-11 rounded-xl font-bold text-xs border-[var(--border)]">Batal</Button>
              <Button onClick={handleDeleteUser} disabled={isSubmitting} className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-md">
                {isSubmitting ? 'Menghapus...' : 'Ya, Hapus'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
 
      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={isBulkDeleteConfirmOpen} onOpenChange={setIsBulkDeleteConfirmOpen}>
        <DialogContent className="bg-[var(--card)] border-[var(--border)] text-[var(--foreground)] max-w-md rounded-2xl shadow-xl overflow-hidden p-0">
          <div className="p-8 pb-6">
            <div className="flex flex-col items-center mb-6">
              <div className="h-16 w-16 bg-red-100 flex items-center justify-center rounded-full mb-4">
                 <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <DialogTitle className="text-xl font-bold text-center">Hapus Massal</DialogTitle>
              <DialogDescription className="text-sm font-medium text-[var(--muted-foreground)] mt-2 text-center leading-relaxed">
                 Anda akan menghapus <span className="text-[var(--foreground)] font-bold">{selectedIds.length} pengguna</span> secara permanen dari basis data EduTrack.
              </DialogDescription>
            </div>
            
            <div className="space-y-6">
              <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
                  <p className="text-xs font-semibold text-red-700 leading-relaxed text-center">
                      ⚠️ PERINGATAN: Tindakan ini tidak dapat dibatalkan. Seluruh log aktivitas, nilai, dan akses pengguna terkait akan dihapus selamanya.
                  </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                  <Button 
                      variant="outline" 
                      className="h-11 rounded-xl border-[var(--border)] font-bold text-xs"
                      onClick={() => setIsBulkDeleteConfirmOpen(false)}
                  >
                      Batal
                  </Button>
                  <Button 
                      disabled={isSubmitting} 
                      className="h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md"
                      onClick={executeBulkDelete}
                  >
                      {isSubmitting ? 'Menghapus...' : 'Konfirmasi Hapus'}
                  </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Import Dialog */}
      <Dialog open={isBulkOpen} onOpenChange={setIsBulkOpen}>
        <DialogContent className="bg-[var(--card)] border-[var(--border)] text-[var(--foreground)] max-w-2xl rounded-2xl shadow-xl">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-xl font-bold">Bulk JSON Import</DialogTitle>
            <DialogDescription className="text-sm font-medium text-[var(--muted-foreground)] mt-1">
                Gunakan format array of objects. Contoh: <br/><code className="bg-[var(--muted)] text-[var(--foreground)] px-2 py-1 rounded-md text-xs mt-1 inline-block">[ {"{"} "name": "John", "email": "john@test.com", "role": "STUDENT" {"}"} ]</code>
            </DialogDescription>
          </DialogHeader>
          <div className="py-2 space-y-4">
            <textarea 
                value={bulkJson}
                onChange={(e) => setBulkJson(e.target.value)}
                placeholder='[ { "name": "Siswa A", "email": "siswaA@edu.com", "role": "STUDENT" } ]'
                className="w-full h-64 bg-[var(--card)] border border-[var(--border)] p-4 font-mono text-xs focus:ring-[#5483B3] focus:border-[#5483B3] transition-all rounded-xl outline-none"
            />
            <Button 
                disabled={isSubmitting || !bulkJson} 
                onClick={handleBulkImport}
                className="w-full h-12 bg-[#5483B3] hover:bg-[#3B6FA0] text-white font-bold rounded-xl text-sm shadow-md"
            >
              {isSubmitting ? 'Mengimport...' : 'Mulai Import Data'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
