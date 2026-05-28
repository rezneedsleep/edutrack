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
  User,
  FileText,
  Heart,
  MoreHorizontal,
  List,
  LayoutGrid,
  MessageCircle,
  Star,
  LayoutDashboard,
  Calendar,
  MessageSquare,
  Settings,
  Bell
} from 'lucide-react'
import Link from 'next/link'
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

const ALL_ROLES = [
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "KETUA_YAYASAN", label: "Ketua Yayasan" },
  { value: "KEPALA_SEKOLAH", label: "Kepala Sekolah" },
  { value: "WAKASEK_KURIKULUM", label: "Wakasek Kurikulum" },
  { value: "WAKASEK_KESISWAAN", label: "Wakasek Kesiswaan" },
  { value: "WAKASEK_HUBIN", label: "Wakasek Hubin" },
  { value: "KAPROG", label: "Kaprog" },
  { value: "KEPALA_LAB", label: "Kepala Lab" },
  { value: "TATA_USAHA", label: "Tata Usaha" },
  { value: "BENDAHARA_YAYASAN", label: "Bendahara Yayasan" },
  { value: "BENDAHARA_SEKOLAH", label: "Bendahara Sekolah" },
  { value: "PANITIA_PPDB", label: "Panitia PPDB" },
  { value: "GURU_MAPEL", label: "Guru Mapel" },
  { value: "WALI_KELAS", label: "Wali Kelas" },
  { value: "GURU_BK", label: "Guru BK" },
  { value: "PUSTAKAWAN", label: "Pustakawan" },
  { value: "PETUGAS_UKS", label: "Petugas UKS" },
  { value: "STAF_SARPRAS", label: "Staf Sarpras" },
  { value: "SISWA", label: "Siswa" },
  { value: "ORANG_TUA", label: "Orang Tua" },
  { value: "ALUMNI", label: "Alumni" },
  { value: "STUDENT", label: "Student (Legacy)" },
  { value: "TEACHER", label: "Teacher (Legacy)" },
  { value: "ADMIN", label: "Admin (Legacy)" },
  { value: "COACH", label: "Coach (Legacy)" }
];

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
    parentPin: '123456',
    noAbsen: '',
    phone: '',
    gender: 'Laki-laki',
    address: '',
    position: '',
    affiliations: '',
    canEditMaterials: false,
    canEditAssignments: false
  })

  const [showPassword, setShowPassword] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [tabFilter, setTabFilter] = useState('ALL')
  const [classFilter, setClassFilter] = useState<string>('ALL')
  const [roleFilter, setRoleFilter] = useState<string>('ALL')

  const searchFilteredUsers = users.filter((u: any) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                         u.email.toLowerCase().includes(search.toLowerCase()) ||
                         u.nis?.toLowerCase().includes(search.toLowerCase())
    const matchesClass = classFilter === 'ALL' || u.classId === classFilter
    const matchesRole = (!fixedRole && roleFilter !== 'ALL') ? u.role === roleFilter : (!fixedRole || u.role === fixedRole)
    return matchesSearch && matchesClass && matchesRole
  })

  const filteredUsers = searchFilteredUsers.filter((u: any) => {
    if (tabFilter === 'ALL') return true;
    if (tabFilter === 'ACTIVE') return u.isActive !== false;
    if (tabFilter === 'INACTIVE') return u.isActive === false;
    return true;
  });

  const displayedUsers = filteredUsers;

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
        setFormData({ name: '', email: '', password: '', role: fixedRole || 'STUDENT', school: 'SMKN 13 Bandung', classId: '', subjectId: '', image: '', nis: '', parentPin: '123456', noAbsen: '', phone: '', gender: 'Laki-laki', address: '', position: '', affiliations: '', canEditMaterials: false, canEditAssignments: false })
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
      parentPin: '123456',
      noAbsen: '',
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
      name: user.name || '',
      email: user.email || '',
      password: '', 
      role: user.role || 'STUDENT',
      school: user.school || 'SMKN 13 Bandung',
      classId: user.classId || '',
      subjectId: user.teacherSubjects?.[0]?.id || '',
      image: user.image || '',
      nis: user.nis || '',
      parentPin: user.parentPin || '123456',
      noAbsen: user.noAbsen?.toString() || '',
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
    <div className="flex flex-col space-y-6 pb-20 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 bg-white rounded-2xl shadow-sm border border-gray-100/50">
        
        {/* TOP HEADER */}
        <div className="h-auto md:h-16 py-4 md:py-0 border-b border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between px-4 md:px-6 gap-4">
          <div className="flex items-center gap-3 font-semibold text-gray-700">
            <Users className="h-5 w-5 text-gray-400" />
            <span className="text-gray-400">/</span>
            <span>{fixedRole ? fixedRole : 'Pengguna'}</span>
          </div>
          
          <div className="flex-1 w-full md:max-w-xl mx-0 md:mx-8 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-xl h-10 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          <div className="flex items-center gap-4">
          </div>
        </div>

        {/* SUB HEADER (TOOLBAR) */}
        <div className="h-auto md:h-16 py-4 md:py-0 flex flex-col lg:flex-row items-start lg:items-center justify-between px-4 md:px-6 gap-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 w-full lg:w-auto">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Cari..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-48 border border-gray-200 rounded-lg h-9 pl-9 pr-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
            
            <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200">
              <button className="p-1.5 bg-white shadow-sm rounded-md"><List className="h-4 w-4 text-gray-700" /></button>
              <button className="p-1.5 text-gray-400 hover:text-gray-700"><LayoutGrid className="h-4 w-4" /></button>
            </div>

            <div className="flex gap-1 text-sm font-semibold overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
              <button onClick={() => setTabFilter('ALL')} className={cn("px-4 py-2 transition-colors", tabFilter === 'ALL' ? "border-b-2 border-purple-600 text-gray-900" : "text-gray-500 hover:text-gray-900")}>Semua</button>
              <button onClick={() => setTabFilter('ACTIVE')} className={cn("px-4 py-2 transition-colors", tabFilter === 'ACTIVE' ? "border-b-2 border-purple-600 text-gray-900" : "text-gray-500 hover:text-gray-900")}>Aktif</button>
              <button onClick={() => setTabFilter('INACTIVE')} className={cn("px-4 py-2 transition-colors", tabFilter === 'INACTIVE' ? "border-b-2 border-purple-600 text-gray-900" : "text-gray-500 hover:text-gray-900")}>Nonaktif</button>
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto justify-end">
            <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4" /> Filter
            </button>
            <button onClick={openAdd} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-sm">
              <Plus className="h-4 w-4" /> Tambah Pengguna
            </button>
          </div>
        </div>

        <div className="overflow-x-auto w-full">
        <div className="min-w-[1000px]">
        {/* TABLE HEADER */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-y border-gray-100 bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider items-center">
          <div className="col-span-1 flex items-center gap-3">
            <button onClick={handleSelectAll}>
              {selectedIds.length === filteredUsers.length && filteredUsers.length > 0 ? (
                <CheckSquare className="h-4 w-4 text-purple-600" />
              ) : (
                <Square className="h-4 w-4 text-gray-300" />
              )}
            </button>
            <span>ID</span>
          </div>
          <div className="col-span-3">Name</div>
          <div className="col-span-2">Peran / Jabatan</div>
          <div className="col-span-2">Email</div>
          <div className="col-span-1">Telepon</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-1">Kelas/Mapel</div>
          <div className="col-span-1 text-right">Aksi</div>
        </div>

        {/* TABLE BODY */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative pb-20">
          <AnimatePresence>
            {filteredUsers.map((u: any) => (
              <motion.div 
                key={u.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={cn(
                  "grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-50 items-center transition-colors hover:bg-gray-50/80 group",
                  selectedIds.includes(u.id) && "bg-purple-50/30"
                )}
              >
                <div className="col-span-1 flex items-center gap-3">
                  <button onClick={() => toggleSelect(u.id)}>
                    {selectedIds.includes(u.id) ? (
                      <CheckSquare className="h-4 w-4 text-purple-600" />
                    ) : (
                      <Square className="h-4 w-4 text-gray-300" />
                    )}
                  </button>
                  <span className="text-xs font-medium text-gray-500">#{u.id.substring(0, 4)}</span>
                </div>
                
                <div className="col-span-3 flex items-center gap-3">
                  <Avatar className="h-8 w-8 rounded-full border border-gray-100 shadow-sm">
                    {u.image ? (
                      <AvatarImage src={u.image} className="object-cover" />
                    ) : (
                      <AvatarFallback className="bg-purple-100 text-purple-700 text-xs font-bold">
                        {u.name?.substring(0,2).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-gray-900 truncate">{u.name}</span>
                    {u.gender === 'Perempuan' ? (
                      <span className="text-pink-500 font-bold text-lg leading-none mt-0.5">♀</span>
                    ) : (
                      <span className="text-blue-500 font-bold text-lg leading-none mt-0.5">♂</span>
                    )}
                  </div>
                </div>

                <div className="col-span-2">
                  <span className="font-semibold text-gray-700 text-xs">
                    {ALL_ROLES.find(r => r.value === u.role)?.label || u.role}
                  </span>
                </div>

                <div className="col-span-2">
                  <a href={`mailto:${u.email}`} className="text-xs font-semibold text-blue-500 hover:underline truncate block">
                    {u.email}
                  </a>
                </div>

                <div className="col-span-1">
                  <span className="text-xs font-semibold text-blue-500 hover:underline">
                    {u.phone || '-'}
                  </span>
                </div>

                <div className="col-span-1 text-center">
                  <Badge className={cn(
                    "rounded-full px-2.5 py-0.5 text-[10px] font-bold border-none capitalize inline-flex gap-1.5 items-center",
                    u.isActive !== false ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"
                  )}>
                    <div className={cn("w-1.5 h-1.5 rounded-full", u.isActive !== false ? "bg-emerald-500" : "bg-gray-400")} />
                    {u.isActive !== false ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="col-span-1 flex items-center gap-2">
                  {u.class?.name || (u.teacherSubjects && u.teacherSubjects.length > 0 ? u.teacherSubjects[0].name : '-')}
                </div>

                <div className="col-span-1 flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-gray-400 hover:text-red-500 transition-colors">
                    <Heart className="h-4 w-4" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-700 transition-colors" onClick={() => openEdit(u)}>
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredUsers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Users className="h-12 w-12 mb-4 opacity-20" />
              <p className="font-medium text-sm">Tidak ada pengguna ditemukan.</p>
            </div>
          )}
        </div>
      </div>

      </div>
      </div>

      {/* FLOATING ACTION BAR FOR SELECTION */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#2E1065] text-white rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-6 z-50"
          >
            <div className="flex items-center gap-4 border-r border-white/20 pr-6">
              <span className="font-bold">{selectedIds.length} Pengguna terpilih</span>
              <button onClick={() => setSelectedIds([])} className="text-sm text-white/70 hover:text-white font-medium">Unselect</button>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors">
                <Users className="h-4 w-4" /> Add Group
              </button>
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors">
                <Heart className="h-4 w-4" /> Favorite
              </button>
              <button onClick={confirmBulkDelete} className="px-4 py-2 bg-red-500/20 text-red-300 hover:bg-red-500/30 hover:text-red-200 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors">
                <XCircle className="h-4 w-4" /> Terminate
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING CHAT ICON */}
      <button className="fixed bottom-8 right-8 h-14 w-14 bg-purple-600 rounded-full shadow-lg shadow-purple-600/30 flex items-center justify-center text-white hover:scale-105 transition-transform z-40">
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Dialogs mapping */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
               <DialogContent className="bg-[var(--card)] border-[var(--border)] text-[var(--foreground)] sm:max-w-3xl md:max-w-4xl rounded-2xl shadow-xl p-0 overflow-hidden max-h-[90vh]">
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
                                <User className="h-3.5 w-3.5 text-[#9333ea]" /> Nama Lengkap
                              </Label>
                              <Input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#9333ea]" placeholder="Masukkan nama lengkap" />
                          </div>
                          <div className="space-y-2">
                              <Label className="text-xs font-bold text-[var(--foreground)] flex items-center gap-2">
                                <Mail className="h-3.5 w-3.5 text-[#9333ea]" /> Email
                              </Label>
                              <Input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#9333ea]" placeholder="Masukkan email aktif" />
                          </div>
                        </div>

                        <div className={cn("grid grid-cols-1 gap-5", formData.role === 'STUDENT' ? "md:grid-cols-4" : "md:grid-cols-2")}>
                          <div className="space-y-2">
                            <Label className="text-xs font-bold text-[var(--foreground)] flex items-center gap-2">
                              <Fingerprint className="h-3.5 w-3.5 text-[#9333ea]" /> {fixedRole === 'STUDENT' ? 'NIS' : 'NIP / ID'}
                            </Label>
                            <Input value={formData.nis} onChange={(e) => setFormData({...formData, nis: e.target.value})} className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#9333ea]" placeholder={fixedRole === 'STUDENT' ? "Masukkan NIS" : "Masukkan NIP"} />
                          </div>
                          {formData.role === 'STUDENT' && (
                            <div className="space-y-2">
                              <Label className="text-xs font-bold text-[var(--foreground)] flex items-center gap-2">
                                <Fingerprint className="h-3.5 w-3.5 text-[#9333ea]" /> No Absen
                              </Label>
                              <Input type="number" value={formData.noAbsen} onChange={(e) => setFormData({...formData, noAbsen: e.target.value})} className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#9333ea]" placeholder="No Absen" />
                            </div>
                          )}
                          <div className="space-y-2">
                            <Label className="text-xs font-bold text-[var(--foreground)] flex items-center gap-2">
                              <Phone className="h-3.5 w-3.5 text-[#9333ea]" /> Nomor Telepon
                            </Label>
                            <Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#9333ea]" placeholder="08xxxxxxxxxx" />
                          </div>
                          {formData.role === 'STUDENT' && (
                            <div className="space-y-2">
                              <Label className="text-xs font-bold text-[var(--foreground)] flex items-center gap-2">
                                <Key className="h-3.5 w-3.5 text-[#9333ea]" /> PIN Orang Tua
                              </Label>
                              <Input value={formData.parentPin} onChange={(e) => setFormData({...formData, parentPin: e.target.value})} className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#9333ea]" placeholder="123456" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-[var(--foreground)]">Jenis Kelamin</Label>
                        <Select value={formData.gender} onValueChange={(v) => setFormData({...formData, gender: v})}>
                          <SelectTrigger className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#9333ea]">
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
                            <SelectTrigger className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#9333ea]">
                              <SelectValue placeholder="Pilih Peran" />
                            </SelectTrigger>
                            <SelectContent className="bg-[var(--card)] border-[var(--border)] rounded-xl shadow-lg z-50">
                              {ALL_ROLES.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-[var(--foreground)]">Afiliasi</Label>
                          {fixedRole === 'STUDENT' ? (
                            <Select value={formData.classId} onValueChange={(v) => setFormData({...formData, classId: v})}>
                              <SelectTrigger className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#9333ea]">
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
                              <SelectTrigger className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#9333ea]">
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
                              className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 pr-10 text-sm focus-visible:ring-[#9333ea]" 
                              placeholder="ΓÇóΓÇóΓÇóΓÇóΓÇóΓÇóΓÇóΓÇó"
                           />
                           <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[#9333ea] transition-colors">
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                           </button>
                        </div>
                      </div>
                      </div>

                      {(formData.role === 'TEACHER' || formData.role === 'COACH') && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                          <div className="space-y-2">
                              <Label className="text-xs font-bold text-[var(--foreground)]">Jabatan Opsional</Label>
                              <Input value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#9333ea]" placeholder="Contoh: Pembina Pramuka" />
                          </div>
                          <div className="space-y-2">
                              <Label className="text-xs font-bold text-[var(--foreground)]">Keterangan Afiliasi</Label>
                              <Input value={formData.affiliations} onChange={(e) => setFormData({...formData, affiliations: e.target.value})} className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#9333ea]" placeholder="Pisahkan dengan koma" />
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
                        <MapPin className="h-3.5 w-3.5 text-[#9333ea]" /> Alamat Lengkap
                      </Label>
                      <Textarea value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="bg-[var(--card)] border-[var(--border)] rounded-xl min-h-[100px] text-sm focus-visible:ring-[#9333ea] p-3" placeholder="Jl. Raya No. 123..." />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)} className="flex-1 h-12 rounded-xl font-bold text-xs bg-[var(--muted)] hover:bg-[var(--muted)]/80">Batal</Button>
                      <Button disabled={isSubmitting} className="flex-[2] h-12 bg-[#9333ea] text-white font-bold rounded-xl hover:bg-[#7e22ce] transition-all shadow-md text-xs">
                        {isSubmitting ? 'Memproses...' : `Simpan ${fixedRole === 'STUDENT' ? 'Siswa' : 'Data'}`}
                      </Button>
                    </div>
                  </form>
                </div>
              </DialogContent>
           </Dialog>
      
      <Dialog open={isBulkDeleteConfirmOpen} onOpenChange={setIsBulkDeleteConfirmOpen}>
        <DialogContent className="bg-white rounded-2xl p-6">
          <DialogHeader><DialogTitle className="text-red-600">Konfirmasi Hapus</DialogTitle></DialogHeader>
          <p className="text-sm text-gray-600">Anda yakin ingin menghapus {selectedIds.length} pengguna terpilih?</p>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setIsBulkDeleteConfirmOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={executeBulkDelete} disabled={isSubmitting}>{isSubmitting ? 'Menghapus...' : 'Ya, Hapus'}</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-[var(--card)] border-[var(--border)] text-[var(--foreground)] sm:max-w-3xl md:max-w-4xl rounded-2xl shadow-xl p-0 overflow-hidden max-h-[90vh]">
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
                          <User className="h-3.5 w-3.5 text-[#9333ea]" /> Nama Lengkap
                        </Label>
                        <Input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#9333ea]" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-[var(--foreground)] flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 text-[#9333ea]" /> Email
                        </Label>
                        <Input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#9333ea]" />
                    </div>
                  </div>

                  <div className={cn("grid grid-cols-1 gap-5", selectedUser?.role === 'STUDENT' ? "md:grid-cols-4" : "md:grid-cols-2")}>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-[var(--foreground)] flex items-center gap-2">
                        <Fingerprint className="h-3.5 w-3.5 text-[#9333ea]" /> {selectedUser?.role === 'STUDENT' ? 'NIS' : 'NIP / ID'}
                      </Label>
                      <Input value={formData.nis} onChange={(e) => setFormData({...formData, nis: e.target.value})} className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#9333ea]" />
                    </div>
                    {selectedUser?.role === 'STUDENT' && (
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-[var(--foreground)] flex items-center gap-2">
                          <Fingerprint className="h-3.5 w-3.5 text-[#9333ea]" /> No Absen
                        </Label>
                        <Input type="number" value={formData.noAbsen} onChange={(e) => setFormData({...formData, noAbsen: e.target.value})} className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#9333ea]" placeholder="No Absen" />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-[var(--foreground)] flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-[#9333ea]" /> Nomor Telepon
                      </Label>
                      <Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#9333ea]" />
                    </div>
                    {selectedUser?.role === 'STUDENT' && (
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-[var(--foreground)] flex items-center gap-2">
                          <Key className="h-3.5 w-3.5 text-[#9333ea]" /> PIN Orang Tua
                        </Label>
                        <Input value={formData.parentPin} onChange={(e) => setFormData({...formData, parentPin: e.target.value})} className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#9333ea]" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-[var(--foreground)]">Gender</Label>
                  <Select value={formData.gender} onValueChange={(v) => setFormData({...formData, gender: v})}>
                    <SelectTrigger className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#9333ea]">
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
                      <SelectTrigger className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#9333ea]">
                        <SelectValue placeholder="Pilih Role" />
                      </SelectTrigger>
                      <SelectContent className="bg-[var(--card)] border-[var(--border)] rounded-xl shadow-lg max-h-60 overflow-y-auto">
                        {ALL_ROLES.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-[var(--foreground)]">Afiliasi</Label>
                    {fixedRole === 'STUDENT' ? (
                      <Select value={formData.classId} onValueChange={(v) => setFormData({...formData, classId: v})}>
                        <SelectTrigger className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#9333ea]">
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
                        <SelectTrigger className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#9333ea]">
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
                        className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 pr-10 text-sm focus-visible:ring-[#9333ea]" 
                        placeholder="Kosongkan jika tidak diubah"
                     />
                     <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[#9333ea] transition-colors">
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
                        className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#9333ea]" 
                        placeholder="Contoh: Kepala Sekolah" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-[var(--foreground)]">Afiliasi (Koma pisahkan)</Label>
                      <Input 
                        value={formData.affiliations} 
                        onChange={(e) => setFormData({...formData, affiliations: e.target.value})} 
                        className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11 text-sm focus-visible:ring-[#9333ea]" 
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
                  <MapPin className="h-3.5 w-3.5 text-[#9333ea]" /> Alamat Lengkap
                </Label>
                <Textarea value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="bg-[var(--card)] border-[var(--border)] rounded-xl min-h-[100px] text-sm focus-visible:ring-[#9333ea] p-3" />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)} className="flex-1 h-12 rounded-xl font-bold text-xs bg-[var(--muted)] hover:bg-[var(--muted)]/80">Batal</Button>
                <Button disabled={isSubmitting} className="flex-[2] h-12 bg-[#9333ea] text-white font-bold rounded-xl hover:bg-[#7e22ce] transition-all shadow-md text-xs">
                  {isSubmitting ? 'Memproses...' : 'Simpan Perubahan'}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="bg-white rounded-2xl p-6">
          <DialogHeader><DialogTitle className="text-red-600">Hapus Permanen</DialogTitle></DialogHeader>
          <p className="text-sm text-gray-600">Anda yakin ingin menghapus {selectedUser?.name}?</p>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleDeleteUser} disabled={isSubmitting}>{isSubmitting ? 'Menghapus...' : 'Ya, Hapus'}</Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}
