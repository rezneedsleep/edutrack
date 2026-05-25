'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Megaphone, Send, Bell, Info, AlertCircle, Trash2, Clock, History } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { cn } from '@/lib/utils'
import { useEffect } from 'react'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

export function AdminAnnouncementsClient() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'SYSTEM'
  })
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    id: string;
  }>({
    isOpen: false,
    id: ''
  })

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/admin/announcements')
      if (res.ok) {
        const data = await res.json()
        setAnnouncements(data)
      }
    } catch (error) {
      console.error("Failed to fetch announcements")
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        const data = await res.json()
        toast.success(`Pengumuman berhasil dikirim ke ${data.count} pengguna`)
        setFormData({ title: '', message: '', type: 'SYSTEM' })
        fetchAnnouncements()
      } else {
        toast.error('Gagal mengirim pengumuman')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan sistem')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeleteConfirm({ isOpen: true, id })
  }

  const confirmDelete = async () => {
    const id = deleteConfirm.id
    try {
      const res = await fetch(`/api/admin/announcements/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setAnnouncements(announcements.filter(a => a.id !== id))
        toast.success('Pengumuman berhasil dihapus')
      } else {
        toast.error('Gagal menghapus pengumuman')
      }
    } catch (error) {
      toast.error('Kesalahan sistem')
    } finally {
      setDeleteConfirm({ isOpen: false, id: '' })
    }
  }

  return (
    <div className="space-y-10 pb-20 max-w-6xl">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <p className="text-[#5483B3] font-bold uppercase tracking-wider text-xs mb-2">
          Communication Center
        </p>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">Pengumuman</h1>
        <p className="text-sm font-medium text-[var(--muted-foreground)] mt-2">Kirim pesan siaran ke seluruh civitas EduTrack.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-sm h-full overflow-hidden">
            <CardHeader className="p-6 md:p-8 border-b border-[var(--border)] bg-[var(--muted)]/30">
               <CardTitle className="text-xl font-extrabold tracking-tight flex items-center gap-3">
                 <div className="h-10 w-10 bg-[#5483B3]/10 rounded-lg flex items-center justify-center">
                    <Megaphone className="h-5 w-5 text-[#5483B3]" />
                 </div>
                 Buat Siaran Baru
               </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
               <form onSubmit={handleSend} className="space-y-6">
                  <div className="space-y-5">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-[var(--foreground)]">Judul Pengumuman</Label>
                        <Input 
                            required 
                            value={formData.title} 
                            onChange={(e) => setFormData({...formData, title: e.target.value})} 
                            className="bg-[var(--background)] border-[var(--border)] rounded-xl h-12 focus-visible:ring-[#5483B3] font-medium shadow-sm" 
                            placeholder="Contoh: Libur Nasional Semester Ganjil"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-[var(--foreground)]">Tipe Notifikasi</Label>
                        <Select value={formData.type} onValueChange={(v) => setFormData({...formData, type: v})}>
                            <SelectTrigger className="bg-[var(--background)] border-[var(--border)] rounded-xl h-12 focus-visible:ring-[#5483B3] font-medium shadow-sm">
                                <SelectValue placeholder="Pilih Tipe" />
                            </SelectTrigger>
                            <SelectContent className="bg-[var(--card)] border-[var(--border)] rounded-xl shadow-lg">
                                <SelectItem value="SYSTEM">INFO SISTEM</SelectItem>
                                <SelectItem value="ASSIGNMENT_NEW">UPDATE PENTING</SelectItem>
                                <SelectItem value="STUDENT_LAGGING">PERINGATAN KRITIS</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-[var(--foreground)]">Pesan Pengumuman</Label>
                    <RichTextEditor 
                        value={formData.message} 
                        onChange={(value) => setFormData({...formData, message: value})} 
                        placeholder="Tulis detail pengumuman di sini..."
                    />
                  </div>

                  <Button 
                    disabled={isSubmitting} 
                    className="w-full bg-[#5483B3] hover:bg-[#3B6FA0] text-white rounded-xl font-bold text-sm h-12 transition-all shadow-md gap-2"
                  >
                    {isSubmitting ? 'Mengirim...' : 'Kirim Siaran'}
                    <Send className="h-4 w-4" />
                  </Button>
               </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-5">
           <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-sm h-full flex flex-col overflow-hidden">
              <CardHeader className="p-6 md:p-8 border-b border-[var(--border)] bg-[var(--muted)]/30 flex flex-row items-center justify-between">
                 <div>
                    <CardTitle className="text-xl font-extrabold tracking-tight">Riwayat</CardTitle>
                    <CardDescription className="text-sm font-medium text-[var(--muted-foreground)] mt-1">Daftar pengumuman terkirim</CardDescription>
                 </div>
                 <div className="h-10 w-10 bg-[var(--background)] border border-[var(--border)] rounded-lg flex items-center justify-center shadow-sm">
                    <History className="h-5 w-5 text-[var(--muted-foreground)]" />
                 </div>
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-y-auto max-h-[600px] custom-scrollbar">
                 {announcements.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center justify-center h-full">
                       <div className="h-16 w-16 bg-[var(--muted)] rounded-full flex items-center justify-center mb-4">
                         <Megaphone className="h-8 w-8 text-[var(--muted-foreground)] opacity-50" />
                       </div>
                       <p className="text-sm font-bold text-[var(--foreground)] mb-1">Belum ada riwayat</p>
                       <p className="text-xs font-medium text-[var(--muted-foreground)]">Pengumuman yang dikirim akan muncul di sini.</p>
                    </div>
                 ) : (
                    <div className="divide-y divide-[var(--border)]">
                       {announcements.map((a) => (
                          <div key={a.id} className="p-6 hover:bg-[var(--muted)]/30 transition-colors group">
                             <div className="flex justify-between items-start mb-3">
                                <div className="space-y-1.5">
                                   <h4 className="font-bold text-[var(--foreground)] text-sm group-hover:text-[#5483B3] transition-colors">{a.title}</h4>
                                   <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--muted-foreground)]">
                                      <Clock className="h-3.5 w-3.5" />
                                      {format(new Date(a.createdAt), 'dd MMM yyyy HH:mm', { locale: idLocale })}
                                   </div>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-[var(--muted-foreground)] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                  onClick={() => handleDelete(a.id)}
                                >
                                   <Trash2 className="h-4 w-4" />
                                </Button>
                             </div>
                             <div 
                               className="text-sm text-[var(--muted-foreground)] font-medium leading-relaxed line-clamp-2 prose prose-sm max-w-none dark:prose-invert"
                               dangerouslySetInnerHTML={{ __html: a.message }}
                             />
                          </div>
                       ))}
                    </div>
                 )}
      </CardContent>
            </Card>
         </div>
       </div>

       <AlertDialog open={deleteConfirm.isOpen} onOpenChange={(open) => setDeleteConfirm(prev => ({ ...prev, isOpen: open }))}>
        <AlertDialogContent className="bg-[var(--card)] border-[var(--border)] text-[var(--foreground)] rounded-2xl max-w-sm p-6">
          <AlertDialogHeader>
             <div className="flex flex-col items-center gap-3 mb-2">
                <div className="h-12 w-12 rounded-full flex items-center justify-center bg-red-100 text-red-600 mb-1">
                   <AlertCircle className="h-6 w-6" />
                </div>
                <AlertDialogTitle className="text-xl font-bold text-center">Hapus Pengumuman?</AlertDialogTitle>
             </div>
            <AlertDialogDescription className="text-[var(--muted-foreground)] text-sm font-medium leading-relaxed text-center">
              Apakah Anda yakin ingin menghapus pengumuman ini? Notifikasi di semua pengguna juga akan hilang secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 sm:space-x-3">
            <AlertDialogCancel className="rounded-xl border-[var(--border)] font-bold text-xs h-10 w-full sm:w-auto">Batal</AlertDialogCancel>
            <AlertDialogAction 
               onClick={confirmDelete}
               className="rounded-xl font-bold text-xs h-10 w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white shadow-md"
            >
               Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
