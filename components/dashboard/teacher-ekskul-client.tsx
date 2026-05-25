'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Users, Calendar, Plus, Save, Clock, MapPin, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from 'sonner'

export function TeacherEkskulClient({ initialData }: any) {
  const [data, setData] = useState(initialData)
  const [selectedEkskul, setSelectedEkskul] = useState(initialData[0] || null)
  
  const [isAddSessionOpen, setIsAddSessionOpen] = useState(false)
  const [sessionForm, setSessionForm] = useState({ date: '', material: '', time: '', room: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/coach/ekskul-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...sessionForm, extracurricularId: selectedEkskul.id })
      })
      if (res.ok) {
        const newSession = await res.json()
        const updatedEkskul = { ...selectedEkskul, sessions: [newSession, ...selectedEkskul.sessions] }
        setSelectedEkskul(updatedEkskul)
        setData(data.map((d: any) => d.id === updatedEkskul.id ? updatedEkskul : d))
        toast.success('Pertemuan berhasil ditambahkan')
        setIsAddSessionOpen(false)
        setSessionForm({ date: '', material: '', time: '', room: '' })
      } else {
        toast.error('Gagal menambahkan pertemuan')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan sistem')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAttendance = async (sessionId: string, studentId: string, status: string) => {
    try {
      const res = await fetch(`/api/coach/ekskul-sessions/${sessionId}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, status })
      })
      if (res.ok) {
        const updatedAttendance = await res.json()
        
        // Update local state
        const updatedSessions = selectedEkskul.sessions.map((s: any) => {
          if (s.id === sessionId) {
            const filteredAttendances = s.attendances?.filter((a: any) => a.studentId !== studentId) || []
            return { ...s, attendances: [...filteredAttendances, updatedAttendance] }
          }
          return s
        })
        const updatedEkskul = { ...selectedEkskul, sessions: updatedSessions }
        setSelectedEkskul(updatedEkskul)
        setData(data.map((d: any) => d.id === updatedEkskul.id ? updatedEkskul : d))
        
        toast.success('Absensi disimpan')
      }
    } catch (error) {
      toast.error('Gagal menyimpan absensi')
    }
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="h-24 w-24 bg-[var(--muted)] rounded-full flex items-center justify-center mb-4">
          <Trophy className="h-12 w-12 text-[var(--muted-foreground)] opacity-50" />
        </div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Anda belum menjadi pembina ekskul</h1>
        <p className="text-[var(--muted-foreground)]">Hubungi admin untuk menugaskan Anda sebagai pembina ekstrakurikuler.</p>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-20">
      <div>
        <p className="text-[#5483B3] font-bold uppercase tracking-wider text-xs flex items-center gap-2 mb-2">
          <Trophy className="h-3.5 w-3.5" /> EKSKUL SAYA
        </p>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">Pembina Ekskul</h1>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {data.map((ekskul: any) => (
          <Button 
            key={ekskul.id} 
            variant={selectedEkskul.id === ekskul.id ? 'default' : 'outline'}
            onClick={() => setSelectedEkskul(ekskul)}
            className={`rounded-xl h-11 px-6 whitespace-nowrap ${selectedEkskul.id === ekskul.id ? 'bg-[#5483B3] text-white hover:bg-[#3B6FA0]' : ''}`}
          >
            <Trophy className="h-4 w-4 mr-2" /> {ekskul.name}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[var(--card)] border-[var(--border)] rounded-3xl shadow-sm">
           <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center"><Users className="h-6 w-6 text-blue-600" /></div>
              <div><p className="text-sm text-[var(--muted-foreground)] font-medium">Total Anggota</p><p className="text-2xl font-bold text-[var(--foreground)]">{selectedEkskul.members.length}</p></div>
           </CardContent>
        </Card>
        <Card className="bg-[var(--card)] border-[var(--border)] rounded-3xl shadow-sm">
           <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center"><Calendar className="h-6 w-6 text-green-600" /></div>
              <div><p className="text-sm text-[var(--muted-foreground)] font-medium">Jadwal Rutin</p><p className="text-lg font-bold text-[var(--foreground)] truncate">{selectedEkskul.schedule || 'Belum diatur'}</p></div>
           </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sessions" className="space-y-6">
        <TabsList className="bg-[var(--card)] border border-[var(--border)] p-1 rounded-2xl">
          <TabsTrigger value="sessions" className="rounded-xl data-[state=active]:bg-[#5483B3] data-[state=active]:text-white">Pertemuan & Absensi</TabsTrigger>
          <TabsTrigger value="members" className="rounded-xl data-[state=active]:bg-[#5483B3] data-[state=active]:text-white">Daftar Anggota</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Jadwal Pertemuan</h3>
            <Dialog open={isAddSessionOpen} onOpenChange={setIsAddSessionOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#5483B3] hover:bg-[#3B6FA0] text-white rounded-xl h-10"><Plus className="h-4 w-4 mr-2"/> Tambah Pertemuan</Button>
              </DialogTrigger>
              <DialogContent className="bg-[var(--card)] border-[var(--border)] rounded-2xl max-w-md">
                <DialogHeader><DialogTitle>Tambah Pertemuan</DialogTitle></DialogHeader>
                <form onSubmit={handleAddSession} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Tanggal</Label>
                    <Input type="date" required value={sessionForm.date} onChange={e => setSessionForm({...sessionForm, date: e.target.value})} className="bg-[var(--background)] rounded-xl h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label>Jam</Label>
                    <Input type="time" required value={sessionForm.time} onChange={e => setSessionForm({...sessionForm, time: e.target.value})} className="bg-[var(--background)] rounded-xl h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label>Materi / Kegiatan</Label>
                    <Input required value={sessionForm.material} onChange={e => setSessionForm({...sessionForm, material: e.target.value})} placeholder="Contoh: Latihan fisik dasar" className="bg-[var(--background)] rounded-xl h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label>Ruangan / Lokasi</Label>
                    <Input required value={sessionForm.room} onChange={e => setSessionForm({...sessionForm, room: e.target.value})} placeholder="Lapangan Utama" className="bg-[var(--background)] rounded-xl h-11" />
                  </div>
                  <Button disabled={isSubmitting} className="w-full h-11 bg-[#5483B3] hover:bg-[#3B6FA0] text-white rounded-xl font-bold">Simpan Pertemuan</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {selectedEkskul.sessions.map((session: any) => (
              <Card key={session.id} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden">
                <CardHeader className="bg-[var(--muted)]/30 border-b border-[var(--border)] pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-bold text-[var(--foreground)]">{session.material}</CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-[var(--muted-foreground)] font-medium">
                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5"/> {new Date(session.date).toLocaleDateString('id-ID')}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5"/> {session.time}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5"/> {session.room}</span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-white/80 dark:bg-black/20 text-[var(--foreground)] border border-[var(--border)]">
                      {session.attendances?.length || 0} / {selectedEkskul.members.length} Hadir
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-[var(--border)]">
                    {selectedEkskul.members.map((member: any) => {
                      const attendance = session.attendances?.find((a: any) => a.studentId === member.studentId)
                      const status = attendance?.status || null
                      
                      return (
                        <div key={member.id} className="flex items-center justify-between p-4 hover:bg-[var(--muted)]/20 transition-colors">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8"><AvatarImage src={member.student.image}/><AvatarFallback>{member.student.name[0]}</AvatarFallback></Avatar>
                            <div>
                              <p className="text-sm font-bold text-[var(--foreground)]">{member.student.name}</p>
                              <p className="text-[10px] text-[var(--muted-foreground)]">{member.student.nis}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm" 
                              variant={status === 'PRESENT' ? 'default' : 'outline'} 
                              className={`h-8 w-8 p-0 rounded-lg ${status === 'PRESENT' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
                              onClick={() => handleAttendance(session.id, member.studentId, 'PRESENT')}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant={status === 'SICK' ? 'default' : 'outline'} 
                              className={`h-8 w-8 p-0 rounded-lg ${status === 'SICK' ? 'bg-orange-500 hover:bg-orange-600 text-white' : ''}`}
                              onClick={() => handleAttendance(session.id, member.studentId, 'SICK')}
                            >
                              <AlertCircle className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant={status === 'ABSENT' ? 'default' : 'outline'} 
                              className={`h-8 w-8 p-0 rounded-lg ${status === 'ABSENT' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}`}
                              onClick={() => handleAttendance(session.id, member.studentId, 'ABSENT')}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
            {selectedEkskul.sessions.length === 0 && (
              <div className="py-20 text-center border-2 border-dashed border-[var(--border)] rounded-2xl">
                <Calendar className="h-10 w-10 text-[var(--muted-foreground)] opacity-50 mx-auto mb-2" />
                <p className="font-bold text-[var(--foreground)]">Belum ada pertemuan</p>
                <p className="text-sm text-[var(--muted-foreground)]">Catat jadwal kegiatan untuk mulai mengisi absen.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
           <Card className="bg-[var(--card)] border-[var(--border)] rounded-3xl overflow-hidden">
             <CardHeader><CardTitle className="text-lg">Daftar Anggota</CardTitle></CardHeader>
             <CardContent className="p-0">
               <div className="divide-y divide-[var(--border)]">
                  {selectedEkskul.members.map((m: any) => (
                    <div key={m.id} className="flex items-center gap-4 p-4">
                      <Avatar className="h-10 w-10"><AvatarImage src={m.student.image}/><AvatarFallback>{m.student.name[0]}</AvatarFallback></Avatar>
                      <div>
                        <p className="text-sm font-bold text-[var(--foreground)]">{m.student.name} {selectedEkskul.leaderId === m.studentId && <Badge variant="secondary" className="ml-2 text-[10px]">Ketua</Badge>}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">{m.student.nis} • Kelas {m.student.class?.name || '-'}</p>
                      </div>
                    </div>
                  ))}
                  {selectedEkskul.members.length === 0 && (
                    <div className="p-8 text-center text-sm text-[var(--muted-foreground)]">Belum ada anggota terdaftar. Minta admin untuk menambahkan anggota ekskul.</div>
                  )}
               </div>
             </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
