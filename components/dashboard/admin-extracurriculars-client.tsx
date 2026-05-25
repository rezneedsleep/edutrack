'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Trophy, Users, Calendar, MoreVertical, Edit3, Trash2, MapPin, User as UserIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function AdminExtracurricularsClient({ initialData, teachers, students }: any) {
  const [extracurriculars, setExtracurriculars] = useState(initialData)
  const [search, setSearch] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    schedule: '',
    coachId: '',
    leaderId: ''
  })

  const filteredItems = extracurriculars.filter((item: any) => 
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.coach?.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/admin/extracurriculars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        const newItem = await res.json()
        setExtracurriculars([newItem, ...extracurriculars])
        toast.success('Ekstrakurikuler berhasil ditambahkan')
        setIsAddOpen(false)
        setFormData({ name: '', description: '', schedule: '', coachId: '', leaderId: '' })
      } else {
        toast.error('Gagal menambahkan Ekstrakurikuler')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan sistem')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/admin/extracurriculars/${selectedItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        const updatedItem = await res.json()
        setExtracurriculars(extracurriculars.map((item: any) => item.id === selectedItem.id ? updatedItem : item))
        toast.success('Ekstrakurikuler berhasil diperbarui')
        setIsEditOpen(false)
      } else {
        toast.error('Gagal memperbarui Ekstrakurikuler')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan sistem')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/admin/extracurriculars/${selectedItem.id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setExtracurriculars(extracurriculars.filter((item: any) => item.id !== selectedItem.id))
        toast.success('Ekstrakurikuler berhasil dihapus')
        setIsDeleteOpen(false)
      } else {
        toast.error('Gagal menghapus Ekstrakurikuler')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan sistem')
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEdit = (item: any) => {
    setSelectedItem(item)
    setFormData({
      name: item.name,
      description: item.description || '',
      schedule: item.schedule || '',
      coachId: item.coachId || '',
      leaderId: item.leaderId || ''
    })
    setIsEditOpen(true)
  }

  const openDelete = (item: any) => {
    setSelectedItem(item)
    setIsDeleteOpen(true)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <p className="text-[#5483B3] font-bold uppercase tracking-wider text-xs mb-2 flex items-center gap-2">
            <Trophy className="h-4 w-4" /> EKSTRAKURIKULER
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">Kelola Ekskul</h1>
          <p className="text-sm text-[var(--muted-foreground)] font-medium mt-2">Daftar Ekstrakurikuler sekolah, pembina, dan anggota.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
            <Input placeholder="Cari ekstrakurikuler..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-[var(--card)] border-[var(--border)] pl-10 h-11 rounded-xl" />
          </div>
          <Dialog open={isAddOpen} onOpenChange={(open) => {
            setIsAddOpen(open)
            if (open) setFormData({ name: '', description: '', schedule: '', coachId: '', leaderId: '' })
          }}>
            <DialogTrigger asChild>
              <Button className="h-11 bg-[#5483B3] hover:bg-[#3B6FA0] text-white font-bold rounded-xl shadow-md">
                <Plus className="h-4 w-4 mr-2" /> Tambah Ekskul
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[var(--card)] border-[var(--border)] rounded-2xl max-w-md">
              <DialogHeader>
                <DialogTitle>Tambah Ekstrakurikuler</DialogTitle>
                <DialogDescription>Masukkan detail ekstrakurikuler baru.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="space-y-2">
                  <Label>Nama Ekskul</Label>
                  <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Contoh: Futsal, Paskibra" className="bg-[var(--background)] rounded-xl h-11" />
                </div>
                <div className="space-y-2">
                  <Label>Deskripsi</Label>
                  <Input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Penjelasan singkat" className="bg-[var(--background)] rounded-xl h-11" />
                </div>
                <div className="space-y-2">
                  <Label>Jadwal (Opsional)</Label>
                  <Input value={formData.schedule} onChange={e => setFormData({...formData, schedule: e.target.value})} placeholder="Selasa, 15:00 - 17:00" className="bg-[var(--background)] rounded-xl h-11" />
                </div>
                <div className="space-y-2">
                  <Label>Guru Pembina / Pelatih</Label>
                  <Select value={formData.coachId} onValueChange={v => setFormData({...formData, coachId: v})}>
                    <SelectTrigger className="bg-[var(--background)] rounded-xl h-11 border-[var(--border)] focus:ring-[#5483B3]"><SelectValue placeholder="Pilih Guru" /></SelectTrigger>
                    <SelectContent className="bg-[var(--card)] border-[var(--border)] rounded-xl shadow-lg max-h-60 z-50">
                      {teachers.map((t: any) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <Button disabled={isSubmitting} className="w-full h-11 bg-[#5483B3] hover:bg-[#3B6FA0] rounded-xl text-white font-bold">{isSubmitting ? 'Menyimpan...' : 'Simpan'}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item: any) => (
          <Card key={item.id} className="bg-[var(--card)] border-[var(--border)] rounded-3xl overflow-hidden hover:shadow-xl transition-all group flex flex-col cursor-pointer" onClick={() => window.location.href = `/dashboard/admin/extracurriculars/${item.id}`}>
            <div className="h-32 bg-gradient-to-br from-[#5483B3]/20 to-[#5483B3]/5 relative p-6 flex flex-col justify-between">
               <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" className="h-8 w-8 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full shadow-sm" onClick={(e) => { e.stopPropagation(); openEdit(item) }}><Edit3 className="h-4 w-4" /></Button>
                  <Button size="icon" className="h-8 w-8 bg-red-50 hover:bg-red-100 text-red-600 rounded-full shadow-sm" onClick={(e) => { e.stopPropagation(); openDelete(item) }}><Trash2 className="h-4 w-4" /></Button>
               </div>
               <div className="h-12 w-12 bg-white/60 dark:bg-black/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner mt-4 border border-white/20">
                  <Trophy className="h-6 w-6 text-[#5483B3]" />
               </div>
            </div>
            <CardContent className="p-6 flex-1 flex flex-col">
              <h3 className="font-bold text-lg text-[var(--foreground)] mb-1 group-hover:text-[#5483B3] transition-colors">{item.name}</h3>
              <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 mb-4">{item.description || 'Tidak ada deskripsi'}</p>
              
              <div className="space-y-3 mt-auto pt-4 border-t border-[var(--border)]">
                 <div className="flex items-center gap-3 text-sm">
                    <UserIcon className="h-4 w-4 text-[var(--muted-foreground)]" />
                    <span className="font-medium text-[var(--foreground)] truncate">{item.coach?.name || 'Belum ada pembina'}</span>
                 </div>
                 <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-[var(--muted-foreground)]" />
                    <span className="font-medium text-[var(--foreground)] truncate">{item.schedule || 'Belum ada jadwal'}</span>
                 </div>
                 <div className="flex items-center gap-3 text-sm">
                    <Users className="h-4 w-4 text-[var(--muted-foreground)]" />
                    <span className="font-medium text-[var(--foreground)] truncate">{item.members?.length || 0} Anggota</span>
                 </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredItems.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-[var(--border)] rounded-3xl bg-[var(--card)]">
            <Trophy className="h-12 w-12 text-[var(--muted-foreground)] opacity-50 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[var(--foreground)]">Tidak ada ekstrakurikuler</h3>
            <p className="text-[var(--muted-foreground)] mt-2">Tambahkan ekstrakurikuler baru untuk memulai.</p>
          </div>
        )}
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-[var(--card)] border-[var(--border)] rounded-2xl max-w-md">
          <DialogHeader><DialogTitle>Edit Ekstrakurikuler</DialogTitle></DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nama Ekskul</Label>
              <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-[var(--background)] rounded-xl h-11" />
            </div>
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="bg-[var(--background)] rounded-xl h-11" />
            </div>
            <div className="space-y-2">
              <Label>Jadwal (Opsional)</Label>
              <Input value={formData.schedule} onChange={e => setFormData({...formData, schedule: e.target.value})} className="bg-[var(--background)] rounded-xl h-11" />
            </div>
            <div className="space-y-2">
              <Label>Guru Pembina / Pelatih</Label>
              <Select value={formData.coachId} onValueChange={v => setFormData({...formData, coachId: v})}>
                  <SelectTrigger className="bg-[var(--background)] rounded-xl h-11 border-[var(--border)] focus:ring-[#5483B3]"><SelectValue placeholder="Pilih Guru" /></SelectTrigger>
                  <SelectContent className="bg-[var(--card)] border-[var(--border)] rounded-xl shadow-lg max-h-60 z-50">
                    <SelectItem value="none">Tidak ada pembina</SelectItem>
                    {teachers.map((t: any) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold text-[var(--foreground)]">Ketua Ekskul</Label>
                <Select value={formData.leaderId} onValueChange={v => setFormData({...formData, leaderId: v})}>
                  <SelectTrigger className="bg-[var(--background)] rounded-xl h-11 border-[var(--border)] focus:ring-[#5483B3]"><SelectValue placeholder="Pilih Siswa" /></SelectTrigger>
                  <SelectContent className="bg-[var(--card)] border-[var(--border)] rounded-xl shadow-lg max-h-60 z-50">
                    <SelectItem value="none">Tidak ada ketua</SelectItem>
                    {students.map((t: any) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                  </SelectContent>
              </Select>
            </div>
            <Button disabled={isSubmitting} className="w-full h-11 bg-[#5483B3] hover:bg-[#3B6FA0] rounded-xl text-white font-bold">{isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="bg-[var(--card)] border-[var(--border)] rounded-2xl max-w-sm text-center">
          <DialogTitle className="mt-4 text-[var(--foreground)]">Hapus {selectedItem?.name}?</DialogTitle>
          <DialogDescription className="text-[var(--muted-foreground)]">Tindakan ini tidak dapat dibatalkan. Semua data anggota dan absensi akan ikut terhapus.</DialogDescription>
          <div className="flex gap-3 mt-6 w-full">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} className="flex-1 rounded-xl h-11 border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]">Batal</Button>
            <Button onClick={handleDelete} disabled={isSubmitting} className="flex-1 rounded-xl h-11 bg-red-600 hover:bg-red-700 text-white font-bold">Hapus</Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
