'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, BookOpen, Clock, Calendar } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function TeacherExamsClient({ subjects, classes }: any) {
  const [exams, setExams] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subjectId: '',
    classId: 'all',
    startTime: '',
    endTime: '',
    durationMin: 60,
    isStrict: true,
  })

  useEffect(() => {
    fetchExams()
  }, [])

  const fetchExams = async () => {
    try {
      const res = await fetch('/api/teacher/exams')
      if (res.ok) {
        const data = await res.json()
        setExams(data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/teacher/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        toast.success("Ujian berhasil dibuat")
        setIsAddOpen(false)
        fetchExams()
      } else {
        toast.error("Gagal membuat ujian")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Manajemen Ujian (CBT)</h1>
          <p className="text-sm text-[var(--muted-foreground)]">Buat dan kelola ujian online untuk siswa.</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="bg-[#5483B3] hover:bg-[#3b6086] text-white">
          <Plus className="h-4 w-4 mr-2" /> Buat Ujian Baru
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <p className="text-sm text-[var(--muted-foreground)]">Memuat ujian...</p>
        ) : exams.length > 0 ? (
          exams.map((exam: any) => (
            <Card key={exam.id} className="bg-[var(--card)] border-[var(--border)] rounded-2xl hover:shadow-md transition-all">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-[#5483B3]/10 rounded-lg">
                    <BookOpen className="h-5 w-5 text-[#5483B3]" />
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                    exam.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {exam.status === 'PUBLISHED' ? 'Aktif' : 'Draft'}
                  </span>
                </div>
                <h3 className="font-bold text-[var(--foreground)] text-lg mb-1">{exam.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 mb-4">{exam.description || 'Tidak ada deskripsi'}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-xs text-[var(--muted-foreground)]">
                    <Calendar className="h-3.5 w-3.5 mr-2 text-[#5483B3]" />
                    {new Date(exam.startTime).toLocaleDateString('id-ID')}
                  </div>
                  <div className="flex items-center text-xs text-[var(--muted-foreground)]">
                    <Clock className="h-3.5 w-3.5 mr-2 text-[#5483B3]" />
                    {exam.durationMin} Menit
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--border)] flex justify-between items-center">
                  <div className="text-xs text-[var(--muted-foreground)]">
                    <span className="font-bold text-[var(--foreground)]">{exam._count?.questions || 0}</span> Soal
                  </div>
                  {/* Detailed management to be implemented in a detail page if needed, for now just show a button */}
                  <Button variant="outline" size="sm" className="text-xs" disabled>Kelola Soal</Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-sm text-[var(--muted-foreground)]">Belum ada ujian yang dibuat.</p>
        )}
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[500px] bg-[var(--card)] border-[var(--border)] p-0 rounded-2xl overflow-hidden">
          <DialogHeader className="p-6 border-b border-[var(--border)] bg-[var(--muted)]/30">
            <DialogTitle className="text-xl font-extrabold text-[var(--foreground)]">Buat Ujian Baru</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="p-6 space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-[var(--foreground)]">Judul Ujian</Label>
              <Input 
                required 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                placeholder="Misal: Ujian Akhir Semester"
                className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-[var(--foreground)]">Mata Pelajaran</Label>
              <select 
                required 
                value={formData.subjectId} 
                onChange={e => setFormData({...formData, subjectId: e.target.value})}
                className="w-full h-11 bg-[var(--card)] border border-[var(--border)] rounded-xl px-3 text-sm"
              >
                <option value="">Pilih Mata Pelajaran...</option>
                {subjects.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-[var(--foreground)]">Waktu Mulai</Label>
                <Input 
                  type="datetime-local" 
                  required 
                  value={formData.startTime} 
                  onChange={e => setFormData({...formData, startTime: e.target.value})} 
                  className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-[var(--foreground)]">Waktu Selesai</Label>
                <Input 
                  type="datetime-local" 
                  required 
                  value={formData.endTime} 
                  onChange={e => setFormData({...formData, endTime: e.target.value})} 
                  className="bg-[var(--card)] border-[var(--border)] rounded-xl h-11"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-xl">Batal</Button>
              <Button type="submit" className="bg-[#5483B3] hover:bg-[#3b6086] text-white rounded-xl">Simpan Ujian</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
