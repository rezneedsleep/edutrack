'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Users, Plus, Trophy, Calendar, MapPin, Trash2, ShieldCheck, CheckSquare } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from 'sonner'
import { Checkbox } from "@/components/ui/checkbox"

export function AdminExtracurricularDetailClient({ initialData, unassignedStudents }: any) {
  const [data, setData] = useState(initialData)
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false)
  const [selectedStudentToAdd, setSelectedStudentToAdd] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])

  const handleAddStudent = async () => {
    if (!selectedStudentToAdd) return
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/admin/extracurriculars/${data.id}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: selectedStudentToAdd })
      })
      if (res.ok) {
        const newMember = await res.json()
        setData({ ...data, members: [...data.members, newMember] })
        toast.success('Siswa berhasil ditambahkan ke Ekskul')
        setIsAddStudentOpen(false)
      } else {
        toast.error('Gagal menambahkan siswa')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan sistem')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemoveMembers = async () => {
    if (selectedStudents.length === 0) return
    setIsSubmitting(true)
    try {
      const promises = selectedStudents.map(studentId => 
        fetch(`/api/admin/extracurriculars/${data.id}/members?studentId=${studentId}`, { method: 'DELETE' })
      )
      await Promise.all(promises)
      toast.success(`${selectedStudents.length} siswa dihapus dari Ekskul`)
      setData({ ...data, members: data.members.filter((m: any) => !selectedStudents.includes(m.studentId)) })
      setSelectedStudents([])
    } catch (error) {
      toast.error('Gagal menghapus siswa')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/admin/extracurriculars">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:bg-[#5483B3]/10">
            <ArrowLeft className="h-5 w-5 text-[var(--muted-foreground)]" />
          </Button>
        </Link>
        <div>
          <p className="text-[#5483B3] font-bold uppercase tracking-wider text-xs flex items-center gap-2">
            <Trophy className="h-3.5 w-3.5" /> DETAIL EKSTRAKURIKULER
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--foreground)]">{data.name}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[var(--card)] border-[var(--border)] rounded-3xl shadow-sm">
           <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center"><Users className="h-6 w-6 text-blue-600" /></div>
              <div><p className="text-sm text-[var(--muted-foreground)] font-medium">Total Anggota</p><p className="text-2xl font-bold text-[var(--foreground)]">{data.members.length}</p></div>
           </CardContent>
        </Card>
        <Card className="bg-[var(--card)] border-[var(--border)] rounded-3xl shadow-sm">
           <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center"><Calendar className="h-6 w-6 text-green-600" /></div>
              <div><p className="text-sm text-[var(--muted-foreground)] font-medium">Jadwal Rutin</p><p className="text-lg font-bold text-[var(--foreground)] truncate">{data.schedule || 'Belum diatur'}</p></div>
           </CardContent>
        </Card>
        <Card className="bg-[var(--card)] border-[var(--border)] rounded-3xl shadow-sm">
           <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center"><ShieldCheck className="h-6 w-6 text-orange-600" /></div>
              <div className="min-w-0"><p className="text-sm text-[var(--muted-foreground)] font-medium">Guru Pembina</p><p className="text-lg font-bold text-[var(--foreground)] truncate">{data.coach?.name || 'Belum ada'}</p></div>
           </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="members" className="space-y-6">
        <TabsList className="bg-[var(--card)] border border-[var(--border)] p-1 rounded-2xl">
          <TabsTrigger value="members" className="rounded-xl data-[state=active]:bg-[#5483B3] data-[state=active]:text-white"><Users className="h-4 w-4 mr-2" /> Anggota</TabsTrigger>
          <TabsTrigger value="sessions" className="rounded-xl data-[state=active]:bg-[#5483B3] data-[state=active]:text-white"><CheckSquare className="h-4 w-4 mr-2" /> Pertemuan & Absensi</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-6">
           <div className="flex items-center justify-between">
              <div className="flex gap-4 items-center">
                {data.members.length > 0 && (
                  <div className="flex items-center gap-2 pr-4 border-r border-[var(--border)]">
                    <Checkbox 
                      checked={selectedStudents.length === data.members.length}
                      onCheckedChange={(c) => c ? setSelectedStudents(data.members.map((m: any) => m.studentId)) : setSelectedStudents([])}
                    />
                    <span className="text-sm font-medium text-[var(--muted-foreground)]">Pilih Semua</span>
                  </div>
                )}
                <h3 className="text-lg font-bold">Daftar Anggota Ekskul</h3>
                {selectedStudents.length === 1 && (
                  <Button size="sm" variant="outline" onClick={async () => {
                    setIsSubmitting(true)
                    try {
                      const res = await fetch(`/api/admin/extracurriculars/${data.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ leaderId: selectedStudents[0] })
                      })
                      if (res.ok) {
                        const updated = await res.json()
                        setData({ ...data, leaderId: updated.leaderId })
                        toast.success('Ketua berhasil diubah')
                        setSelectedStudents([])
                      }
                    } catch {
                      toast.error('Gagal mengubah ketua')
                    } finally {
                      setIsSubmitting(false)
                    }
                  }} disabled={isSubmitting} className="h-8 ml-2 border-[#5483B3] text-[#5483B3] hover:bg-[#5483B3]/10">
                    <ShieldCheck className="h-4 w-4 mr-2" /> Jadikan Ketua
                  </Button>
                )}
                {selectedStudents.length > 0 && (
                  <Button size="sm" variant="destructive" onClick={handleRemoveMembers} disabled={isSubmitting} className="h-8 ml-2">
                    <Trash2 className="h-4 w-4 mr-2" /> Hapus {selectedStudents.length} Anggota
                  </Button>
                )}
              </div>
              <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#5483B3] hover:bg-[#3B6FA0] text-white rounded-xl h-10"><Plus className="h-4 w-4 mr-2"/> Tambah Anggota</Button>
                </DialogTrigger>
                <DialogContent className="bg-[var(--card)] border-[var(--border)] rounded-2xl max-w-md">
                  <DialogHeader><DialogTitle>Tambah Anggota Ekskul</DialogTitle></DialogHeader>
                  <div className="py-4 space-y-4">
                    <div className="space-y-2">
                      <Label>Pilih Siswa</Label>
                      <Select value={selectedStudentToAdd} onValueChange={setSelectedStudentToAdd}>
                        <SelectTrigger className="bg-[var(--background)] rounded-xl h-11 border-[var(--border)] focus:ring-[#5483B3]"><SelectValue placeholder="Pilih Siswa..." /></SelectTrigger>
                        <SelectContent className="bg-[var(--card)] border-[var(--border)] rounded-xl shadow-lg max-h-60 z-[100]">
                          {unassignedStudents.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.name} {s.nis ? `(${s.nis})` : ''}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleAddStudent} disabled={!selectedStudentToAdd || isSubmitting} className="w-full h-11 bg-[#5483B3] text-white">Tambahkan</Button>
                  </div>
                </DialogContent>
              </Dialog>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.members.length > 0 ? data.members.map((m: any) => (
                 <div key={m.id} className={`flex items-center gap-4 p-4 bg-[var(--card)] border ${selectedStudents.includes(m.studentId) ? 'border-[#5483B3] ring-1 ring-[#5483B3]/20' : 'border-[var(--border)]'} rounded-2xl relative overflow-hidden`}>
                    <Checkbox 
                      checked={selectedStudents.includes(m.studentId)}
                      onCheckedChange={(c) => c ? setSelectedStudents([...selectedStudents, m.studentId]) : setSelectedStudents(selectedStudents.filter(id => id !== m.studentId))}
                    />
                    <Avatar className="h-10 w-10 border border-[var(--border)] shadow-sm">
                       <AvatarImage src={m.student.image} className="object-cover" />
                       <AvatarFallback className="bg-[var(--muted)]">{m.student.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                       <p className="text-sm font-bold text-[var(--foreground)] truncate">{m.student.name} {data.leaderId === m.studentId && <Badge variant="secondary" className="ml-2 text-[10px] py-0">Ketua</Badge>}</p>
                       <p className="text-xs text-[var(--muted-foreground)] truncate">{m.student.nis} • {m.student.email}</p>
                    </div>
                 </div>
              )) : (
                 <div className="col-span-full py-10 text-center border-2 border-dashed border-[var(--border)] rounded-2xl">
                    <p className="text-[var(--muted-foreground)] font-medium">Belum ada anggota.</p>
                 </div>
              )}
           </div>
        </TabsContent>

        <TabsContent value="sessions">
           <Card className="bg-[var(--card)] border-[var(--border)] rounded-3xl overflow-hidden p-6">
              <h3 className="text-lg font-bold mb-4">Riwayat Pertemuan</h3>
              {data.sessions.length > 0 ? (
                <div className="space-y-4">
                  {data.sessions.map((session: any) => (
                    <div key={session.id} className="p-4 border border-[var(--border)] rounded-2xl bg-[var(--muted)]/30 flex justify-between items-center">
                       <div>
                         <p className="font-bold text-[var(--foreground)]">{session.material}</p>
                         <p className="text-xs text-[var(--muted-foreground)] mt-1">{new Date(session.date).toLocaleDateString('id-ID')} • {session.time} • Ruang: {session.room}</p>
                       </div>
                       <Badge className="bg-[#5483B3]">{session.attendances.length} Hadir</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[var(--muted-foreground)] text-center py-10">Belum ada riwayat pertemuan yang dicatat pembina.</p>
              )}
           </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
