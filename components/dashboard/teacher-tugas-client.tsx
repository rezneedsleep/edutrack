'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  ClipboardList, 
  Users, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MoreVertical,
  ChevronRight,
  ArrowLeft,
  FileText,
  Send,
  GraduationCap,
  MessageSquare,
  Paperclip,
  Download,
  Link as LinkIcon,
  Trash2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription 
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

export function TeacherTugasClient({ assignments, subjects, classes }: any) {
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null)
  const [gradeData, setGradeData] = useState({ score: '', feedback: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [commentContent, setCommentContent] = useState('')
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    subjectId: '',
    topicId: '',
    classId: '',
    deadlineDate: '',
    deadlineTime: '23:59',
    maxScore: 100
  })

  const [attachments, setAttachments] = useState<any[]>([])
  const [newLink, setNewLink] = useState('')
  const [isAddingLink, setIsAddingLink] = useState(false)

  // Auto-select subject if there's only one
  useEffect(() => {
    if (subjects?.length === 1 && !newAssignment.subjectId) {
      setNewAssignment(prev => ({ ...prev, subjectId: subjects[0].id }))
    }
  }, [subjects, newAssignment.subjectId])

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

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Combine date and time
    const deadline = new Date(`${newAssignment.deadlineDate}T${newAssignment.deadlineTime}`)

    try {
      const res = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newAssignment.title,
          description: newAssignment.description,
          subjectId: newAssignment.subjectId,
          topicId: newAssignment.topicId,
          classId: newAssignment.classId,
          deadline: deadline.toISOString(),
          maxScore: parseInt(newAssignment.maxScore as any) || 100,
          attachments: attachments
        })
      })
      if (res.ok) {
        toast.success('Tugas berhasil dibuat!')
        setIsAddModalOpen(false)
        setAttachments([])
        setNewAssignment({ title: '', description: '', subjectId: '', topicId: '', classId: '', deadlineDate: '', deadlineTime: '23:59', maxScore: 100 })
        window.location.reload()
      } else {
        toast.error('Gagal membuat tugas')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteAssignment = async () => {
    if (!deleteTargetId) return

    try {
      const res = await fetch(`/api/assignments/${deleteTargetId}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Tugas berhasil dihapus')
        setIsDeleteConfirmOpen(false)
        setDeleteTargetId(null)
        window.location.reload()
      } else {
        toast.error('Gagal menghapus tugas')
      }
    } catch (error) {
      toast.error('Kesalahan sistem')
    }
  }

  const confirmDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setDeleteTargetId(id)
    setIsDeleteConfirmOpen(true)
  }

  const handleSendComment = async (assignmentId: string) => {
    if (!commentContent.trim()) return
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: commentContent,
          assignmentId
        })
      })
      if (res.ok) {
        setCommentContent('')
        toast.success('Komentar terkirim')
        // Optimistic UI update or reload
        window.location.reload()
      }
    } catch (error) {
      toast.error('Gagal mengirim komentar')
    }
  }

  const handleGradeSubmission = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/submissions/${selectedSubmission.id}/grade`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gradeData)
      })
      if (res.ok) {
        toast.success('Nilai berhasil disimpan!')
        setIsGradeModalOpen(false)
        window.location.reload()
      } else {
        toast.error('Gagal menyimpan nilai')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan sistem')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (selectedAssignment) {
    return (
      <div className="space-y-8 pb-20">
        <Button 
          variant="ghost" 
          onClick={() => setSelectedAssignment(null)}
          className="text-zinc-500 hover:text-white p-0 h-auto font-black uppercase tracking-widest text-[10px]"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar Tugas
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b border-white/5 pb-8">
           <div className="space-y-4">
              <div className="flex items-center gap-4">
                 <div className="h-12 w-12 flex items-center justify-center border border-white/5 bg-zinc-900 text-primary">
                    <ClipboardList className="h-6 w-6" />
                 </div>
                 <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none">{selectedAssignment.title}</h1>
              </div>
              <div className="flex items-center gap-4 text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-4">
                 <div className="flex items-center gap-2"><GraduationCap className="h-4 w-4" /> Kelas: {selectedAssignment.class?.name}</div>
                 <div className="flex items-center gap-2 text-primary"><Calendar className="h-4 w-4" /> Deadline: {new Date(selectedAssignment.deadline).toLocaleString()}</div>
              </div>
           </div>
            <div className="flex items-center gap-3">
               <Button 
                  onClick={(e) => confirmDelete(e, selectedAssignment.id)}
                  variant="outline" 
                 className="h-12 border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white rounded-none font-black uppercase tracking-widest text-[10px] px-6 transition-all"
              >
                 <Trash2 className="mr-2 h-4 w-4" /> Hapus Tugas
              </Button>
           </div>
        </div>

        <Tabs defaultValue="instructions" className="w-full">
           <TabsList className="bg-transparent border-b border-white/5 w-full justify-start rounded-none h-auto p-0 gap-8">
              <TabsTrigger 
                value="instructions" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-white text-zinc-500 font-black uppercase tracking-widest text-xs py-4 px-0"
              >
                Instruksi
              </TabsTrigger>
              <TabsTrigger 
                value="work" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-white text-zinc-500 font-black uppercase tracking-widest text-xs py-4 px-0"
              >
                Pekerjaan Siswa ({selectedAssignment.submissions.length})
              </TabsTrigger>
           </TabsList>

           <TabsContent value="instructions" className="mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                 <div className="lg:col-span-8 space-y-8">
                    <div className="bg-zinc-950 p-8 border border-white/5 space-y-6">
                       <p className="text-zinc-400 text-lg leading-relaxed whitespace-pre-wrap">{selectedAssignment.description}</p>
                       
                       {selectedAssignment.attachments?.length > 0 && (
                          <div className="space-y-3">
                             <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Lampiran Materi</Label>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {selectedAssignment.attachments.map((file: any, idx: number) => (
                                   <div key={idx} className="flex items-center gap-3 bg-zinc-900 p-4 border border-white/5 hover:border-primary/50 transition-colors group cursor-pointer">
                                      <FileText className="h-5 w-5 text-zinc-600 group-hover:text-primary" />
                                      <div className="flex-1 min-w-0">
                                         <p className="text-xs font-bold text-zinc-300 truncate">{file.name}</p>
                                         <p className="text-[8px] font-black uppercase text-zinc-600">Document</p>
                                      </div>
                                      <Download className="h-4 w-4 text-zinc-800" />
                                   </div>
                                ))}
                             </div>
                          </div>
                       )}
                    </div>

                    <div className="space-y-6">
                       <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
                          <MessageSquare className="h-4 w-4 text-primary" />
                          Diskusi Kelas ({selectedAssignment.comments?.length || 0})
                       </h3>
                       
                       <div className="space-y-6">
                          {selectedAssignment.comments?.map((comment: any) => (
                             <div key={comment.id} className="flex gap-4 group">
                                <Avatar className="h-8 w-8">
                                   <AvatarImage src={comment.author.image} />
                                   <AvatarFallback className="bg-zinc-800 font-bold text-xs">{comment.author.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-1 flex-1">
                                   <div className="flex items-center gap-3">
                                      <span className="text-xs font-black uppercase tracking-tighter italic text-zinc-300">{comment.author.name}</span>
                                      <span className="text-[8px] font-bold text-zinc-600 uppercase">{new Date(comment.createdAt).toLocaleString()}</span>
                                   </div>
                                   <p className="text-xs text-zinc-400 leading-relaxed">{comment.content}</p>
                                </div>
                             </div>
                          ))}
                       </div>

                       <div className="pt-6 border-t border-white/5">
                          <div className="flex gap-4">
                             <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">Me</AvatarFallback>
                             </Avatar>
                             <div className="flex-1 flex gap-2">
                                <Input 
                                   placeholder="Tambahkan komentar kelas..."
                                   value={commentContent}
                                   onChange={(e) => setCommentContent(e.target.value)}
                                   onKeyDown={(e) => e.key === 'Enter' && handleSendComment(selectedAssignment.id)}
                                   className="bg-zinc-900 border-white/5 rounded-none h-10 text-xs focus:border-primary/50"
                                />
                                <Button 
                                  size="icon" 
                                  onClick={() => handleSendComment(selectedAssignment.id)}
                                  className="h-10 w-10 bg-primary hover:bg-zinc-900 text-white rounded-none transition-all"
                                >
                                   <Send className="h-4 w-4" />
                                </Button>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="lg:col-span-4 space-y-6">
                    <Card className="bg-zinc-950 border-white/5 rounded-none">
                       <CardHeader>
                          <CardTitle className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Summary Status</CardTitle>
                       </CardHeader>
                       <CardContent className="space-y-4">
                          <div className="flex justify-between items-center py-2 border-b border-white/5">
                             <span className="text-xs font-medium text-zinc-500">Terkumpul</span>
                             <span className="text-xl font-black italic">{selectedAssignment.submissions.length}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-white/5">
                             <span className="text-xs font-medium text-zinc-500">Menunggu Nilai</span>
                             <span className="text-xl font-black italic text-orange-500">
                                {selectedAssignment.submissions.filter((s: any) => s.score === null).length}
                             </span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                             <span className="text-xs font-medium text-zinc-500">Skor Maksimum</span>
                             <span className="text-xl font-black italic text-primary">{selectedAssignment.maxScore}</span>
                          </div>
                       </CardContent>
                    </Card>
                 </div>
              </div>
           </TabsContent>

           <TabsContent value="work" className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className="bg-zinc-950 border-white/5 rounded-none overflow-hidden">
                 <Table>
                    <TableHeader>
                       <TableRow className="border-white/5 hover:bg-transparent bg-zinc-900/50">
                          <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500 h-14">Siswa</TableHead>
                          <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Status</TableHead>
                          <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500">File</TableHead>
                          <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Nilai</TableHead>
                          <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Aksi</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       {selectedAssignment.submissions.length === 0 ? (
                          <TableRow>
                             <TableCell colSpan={5} className="h-40 text-center">
                                <div className="space-y-2 opacity-20">
                                   <Users className="h-8 w-8 mx-auto" />
                                   <p className="text-[10px] font-black uppercase tracking-widest">Belum ada submisi</p>
                                </div>
                             </TableCell>
                          </TableRow>
                       ) : (
                          selectedAssignment.submissions.map((sub: any) => (
                            <TableRow key={sub.id} className="border-white/5 hover:bg-white/5 transition-all">
                               <TableCell>
                                  <div className="flex items-center gap-3 py-2">
                                     <Avatar className="h-10 w-10">
                                        <AvatarImage src={sub.student.image} />
                                        <AvatarFallback className="bg-zinc-800 text-zinc-500 font-bold">{sub.student.name[0]}</AvatarFallback>
                                     </Avatar>
                                     <div className="flex flex-col">
                                        <span className="font-black uppercase italic tracking-tighter text-sm">{sub.student.name}</span>
                                        <span className="text-[8px] font-bold text-zinc-600 uppercase">{sub.student.email}</span>
                                     </div>
                                  </div>
                               </TableCell>
                               <TableCell>
                                  {sub.score !== null ? (
                                     <Badge className="bg-green-500/10 text-green-500 border-none rounded-none text-[8px] font-black uppercase px-3">Sudah Dinilai</Badge>
                                  ) : (
                                     <Badge className="bg-orange-500/10 text-orange-500 border-none rounded-none text-[8px] font-black uppercase px-3">Perlu Nilai</Badge>
                                  )}
                               </TableCell>
                               <TableCell>
                                  <Button variant="ghost" size="sm" className="h-8 gap-2 text-zinc-500 hover:text-primary">
                                     <Paperclip className="h-3 w-3" />
                                     <span className="text-[10px] font-black uppercase">View File</span>
                                  </Button>
                               </TableCell>
                               <TableCell className="font-black italic text-lg text-primary">
                                  {sub.score !== null ? `${sub.score}` : '-'}
                               </TableCell>
                               <TableCell className="text-right">
                                  <Button 
                                    className="bg-zinc-900 hover:bg-primary text-white rounded-none border border-white/5 text-[10px] font-black uppercase h-10 px-6 transition-all"
                                    onClick={() => {
                                      setSelectedSubmission(sub)
                                      setGradeData({ score: sub.score?.toString() || '', feedback: sub.feedback || '' })
                                      setIsGradeModalOpen(true)
                                    }}
                                  >
                                     {sub.score !== null ? 'Ubah Nilai' : 'Beri Nilai'}
                                  </Button>
                               </TableCell>
                            </TableRow>
                          ))
                       )}
                    </TableBody>
                 </Table>
              </Card>
           </TabsContent>
        </Tabs>

        {/* Grading Modal */}
        <Dialog open={isGradeModalOpen} onOpenChange={setIsGradeModalOpen}>
           <DialogContent className="bg-zinc-950 border-white/5 rounded-none text-white max-w-lg">
              <DialogHeader>
                 <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter">Penilaian Submisi</DialogTitle>
                 <CardDescription className="text-zinc-500">Memberikan evaluasi untuk {selectedSubmission?.student?.name}</CardDescription>
              </DialogHeader>
              {selectedSubmission && (
                <div className="space-y-6 py-4">
                   <div className="bg-zinc-900/50 p-6 border border-white/5 space-y-4">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Konten Jawaban</Label>
                      <p className="text-sm font-bold italic text-zinc-400 leading-relaxed italic">
                         "{selectedSubmission.content}"
                      </p>
                      <div className="flex gap-4 pt-4 border-t border-white/5">
                         <Button variant="outline" size="sm" className="h-10 rounded-none border-white/5 flex-1 gap-2 text-[10px] font-black uppercase">
                            <Download className="h-3 w-3" /> Download Lampiran
                         </Button>
                      </div>
                   </div>

                   <form onSubmit={handleGradeSubmission} className="space-y-6">
                      <div className="space-y-2">
                         <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Skor (Maks {selectedAssignment.maxScore})</Label>
                         <Input 
                           type="number"
                           required
                           max={selectedAssignment.maxScore}
                           value={gradeData.score}
                           onChange={(e) => setGradeData({...gradeData, score: e.target.value})}
                           className="bg-zinc-900 border-white/5 rounded-none h-14 text-xl font-black text-primary"
                         />
                      </div>
                      <div className="space-y-2">
                         <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Feedback Untuk Siswa</Label>
                         <Textarea 
                           value={gradeData.feedback}
                           onChange={(e) => setGradeData({...gradeData, feedback: e.target.value})}
                           className="bg-zinc-900 border-white/5 rounded-none min-h-[120px] p-4 text-xs font-medium leading-relaxed"
                           placeholder="Contoh: Sangat baik, namun perhatikan penggunaan tata bahasa..."
                         />
                      </div>
                      <Button type="submit" disabled={isSubmitting} className="w-full h-16 bg-primary hover:bg-zinc-900 text-white font-black uppercase tracking-[0.2em] rounded-none transition-all shadow-xl shadow-primary/20">
                         {isSubmitting ? 'Menyimpan...' : 'Submit Penilaian'}
                      </Button>
                   </form>
                </div>
              )}
           </DialogContent>
        </Dialog>
        <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
           <AlertDialogContent className="bg-zinc-950 border-white/5 rounded-none text-white">
             <AlertDialogHeader>
               <AlertDialogTitle className="text-2xl font-black uppercase italic tracking-tighter">Konfirmasi Hapus</AlertDialogTitle>
               <AlertDialogDescription className="text-zinc-500">
                 Apakah Anda yakin ingin menghapus tugas ini? Tindakan ini tidak dapat dibatalkan dan semua data submisi siswa akan hilang.
               </AlertDialogDescription>
             </AlertDialogHeader>
             <AlertDialogFooter>
               <AlertDialogCancel className="rounded-none border-white/5 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white uppercase font-black text-[10px] tracking-widest">
                 Batal
               </AlertDialogCancel>
               <AlertDialogAction 
                 onClick={handleDeleteAssignment}
                 className="rounded-none bg-red-600 text-white hover:bg-red-700 uppercase font-black text-[10px] tracking-widest"
               >
                 Hapus Permanen
               </AlertDialogAction>
             </AlertDialogFooter>
           </AlertDialogContent>
         </AlertDialog>
      </div>
    )
  }

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
        >
          <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-3 flex items-center gap-2">
            <span className="h-1 w-8 bg-primary block" />
            Classroom Management
          </p>
          <h1 className="text-7xl font-black uppercase italic tracking-tighter leading-none">Kelola Tugas.</h1>
          <p className="text-zinc-500 font-medium mt-4">Platform interaksi belajar-mengajar terpadu EduTrack.</p>
        </motion.div>
        
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
           <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-zinc-900 text-white rounded-none font-black uppercase tracking-[0.2em] h-16 px-10 shadow-2xl transition-all hover:-translate-y-1">
                 <Plus className="mr-2 h-6 w-6" /> Buat Tugas Baru
              </Button>
           </DialogTrigger>
           <DialogContent className="bg-zinc-950 border-white/5 rounded-none text-white max-w-2xl">
              <DialogHeader>
                 <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter">Publikasi Tugas</DialogTitle>
                 <CardDescription className="text-zinc-500">Kirim instruksi belajar ke seluruh siswa dalam satu kelas.</CardDescription>
              </DialogHeader>
              <form onSubmit={handleCreateAssignment} className="space-y-6 py-6">
                 <div className="space-y-2">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Judul Tugas</Label>
                       <Input 
                         required
                         placeholder="Contoh: Analisis Struktur Algoritma"
                         value={newAssignment.title}
                         onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                         className="bg-zinc-900 border-white/5 rounded-none h-14 font-bold"
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Deskripsi / Instruksi Detail</Label>
                    <Textarea 
                      required
                      placeholder="Jelaskan langkah-langkah pengerjaan tugas di sini..."
                      value={newAssignment.description}
                      onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                      className="bg-zinc-900 border-white/5 rounded-none min-h-[140px] p-6 text-sm font-medium leading-relaxed"
                    />
                 </div>

                 <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Lampiran Materi ({attachments.length})</Label>
                    
                    {attachments.length > 0 && (
                       <div className="grid grid-cols-2 gap-3 mb-4 animate-in fade-in slide-in-from-top-2">
                          {attachments.map((at, idx) => (
                             <div key={idx} className="flex items-center justify-between p-3 bg-zinc-900 border border-white/5 group">
                                <div className="flex items-center gap-3 overflow-hidden">
                                   <div className={`h-8 w-8 flex items-center justify-center ${at.type === 'file' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                      {at.type === 'file' ? <FileText className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
                                   </div>
                                   <p className="text-[10px] font-bold truncate text-zinc-400">{at.name}</p>
                                </div>
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => removeAttachment(idx)}
                                  className="h-8 w-8 text-zinc-800 hover:text-red-500"
                                >
                                   <Trash2 className="h-3 w-3" />
                                </Button>
                             </div>
                          ))}
                       </div>
                    )}

                    <div className="flex flex-col gap-3">
                        <div className="flex gap-3">
                           <input 
                             type="file" 
                             id="teacher-file-upload" 
                             className="hidden" 
                             onChange={handleFileUpload}
                           />
                           <Button 
                             type="button" 
                             variant="outline" 
                             onClick={() => document.getElementById('teacher-file-upload')?.click()}
                             className="h-14 flex-1 border-dashed border-white/10 rounded-none hover:bg-white/5 gap-2 text-[10px] font-black uppercase tracking-widest"
                           >
                              <Paperclip className="h-4 w-4 text-primary" /> Upload PDF/DOCX
                           </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsAddingLink(!isAddingLink)}
                            className={`h-14 flex-1 border-dashed border-white/10 rounded-none hover:bg-white/5 gap-2 text-[10px] font-black uppercase tracking-widest ${isAddingLink ? 'bg-primary/10 border-primary/30' : ''}`}
                          >
                             <LinkIcon className={`h-4 w-4 ${isAddingLink ? 'text-white' : 'text-primary'}`} /> {isAddingLink ? 'Batal' : 'Tambah Link'}
                          </Button>
                       </div>

                       {isAddingLink && (
                          <div className="flex gap-2 animate-in slide-in-from-left-2 duration-300">
                             <Input 
                               value={newLink}
                               onChange={(e) => setNewLink(e.target.value)}
                               placeholder="Tempel link materi di sini..."
                               className="bg-zinc-900 border-white/5 h-12 rounded-none text-xs"
                             />
                             <Button 
                               type="button" 
                               onClick={addLink}
                               className="bg-primary hover:bg-zinc-900 text-white font-black uppercase text-[10px] px-6 rounded-none h-12"
                             >
                               Tambah
                             </Button>
                          </div>
                       )}
                    </div>
                 </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Target Kelas</Label>
                       <Select 
                        value={newAssignment.classId} 
                        onValueChange={(v) => setNewAssignment({...newAssignment, classId: v})}
                        required
                       >
                          <SelectTrigger className="bg-zinc-900 border-white/5 rounded-none h-14">
                             <SelectValue placeholder="Kelas" />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-900 border-white/5 rounded-none text-white">
                             {classes.map((c: any) => (
                               <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                             ))}
                          </SelectContent>
                       </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Mata Pelajaran</Label>
                        <Select 
                         value={newAssignment.subjectId} 
                         onValueChange={(v) => setNewAssignment({...newAssignment, subjectId: v, topicId: ''})}
                         required
                        >
                           <SelectTrigger className="bg-zinc-900 border-white/5 rounded-none h-14">
                              <SelectValue placeholder="Mapel" />
                           </SelectTrigger>
                           <SelectContent className="bg-zinc-900 border-white/5 rounded-none text-white">
                              {subjects.map((s: any) => (
                                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                     </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                           <Calendar className="h-3 w-3" /> Tanggal
                        </Label>
                        <Input 
                          type="date"
                          required
                          value={newAssignment.deadlineDate}
                          onChange={(e) => setNewAssignment({...newAssignment, deadlineDate: e.target.value})}
                          className="bg-zinc-900 border-white/5 rounded-none h-14 font-bold text-primary"
                        />
                     </div>
                     <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                           <Clock className="h-3 w-3" /> Jam
                        </Label>
                        <Input 
                          type="time"
                          required
                          value={newAssignment.deadlineTime}
                          onChange={(e) => setNewAssignment({...newAssignment, deadlineTime: e.target.value})}
                          className="bg-zinc-900 border-white/5 rounded-none h-14 font-bold text-primary text-center"
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Topik Pembelajaran</Label>
                     <Select 
                      value={newAssignment.topicId} 
                      onValueChange={(v) => setNewAssignment({...newAssignment, topicId: v})}
                      required
                      disabled={!newAssignment.subjectId}
                     >
                        <SelectTrigger className="bg-zinc-900 border-white/5 rounded-none h-14">
                           <SelectValue placeholder={newAssignment.subjectId ? "Pilih Topik" : "Pilih Mapel Terlebih Dahulu"} />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-white/5 rounded-none text-white">
                           {subjects.find((s: any) => s.id === newAssignment.subjectId)?.topics?.map((t: any) => (
                             <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
                  <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right block">Skor</Label>
                        <Input 
                          type="number"
                          required
                          value={Number.isNaN(newAssignment.maxScore) || newAssignment.maxScore === null || newAssignment.maxScore === undefined ? '' : newAssignment.maxScore}
                          onChange={(e) => { const val = parseInt(e.target.value); setNewAssignment({...newAssignment, maxScore: Number.isNaN(val) ? '' as any : val}); }}
                          className="bg-zinc-900 border-white/5 rounded-none h-14 font-black text-center text-primary text-xl"
                        />
                  </div>

               <Button type="submit" disabled={isSubmitting} className="w-full h-18 bg-[var(--card)] hover:bg-zinc-200 text-[var(--foreground)] font-black uppercase tracking-[0.3em] rounded-none text-lg transition-all shadow-2xl">
                  {isSubmitting ? 'Sedang Memproses...' : 'Publish ke Seluruh Siswa'}
                  <Send className="ml-3 h-5 w-5" />
               </Button>
            </form>
         </DialogContent>
        </Dialog>
      </div>

      <div className={assignments.length === 0 ? "flex flex-col items-center justify-center py-20 text-center border border-white/5 bg-zinc-950 mt-8" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"}>
         {assignments.length === 0 ? (
            <div className="flex flex-col items-center">
              <div className="h-24 w-24 bg-primary/10 flex items-center justify-center mb-6 rounded-none border border-primary/20">
                <ClipboardList className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white mb-2">Belum Ada Tugas Publik</h3>
              <p className="text-zinc-500 font-medium max-w-md text-sm">Anda belum membuat tugas apa pun untuk kelas Anda. Klik "Buat Tugas Baru" di atas untuk mulai memberikan materi dan tugas.</p>
            </div>
         ) : assignments.map((as: any, i: number) => {
           const pendingCount = as.submissions.filter((s: any) => s.score === null).length
           return (
            <motion.div
              key={as.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card 
                className="bg-zinc-950 border-white/5 rounded-none group hover:border-primary/50 transition-all cursor-pointer h-full border-t-2 border-t-zinc-800"
                onClick={() => setSelectedAssignment(as)}
              >
                 <CardHeader className="space-y-6">
                    <div className="flex justify-between items-start">
                       <div className="px-3 py-1 bg-zinc-900 border border-white/5 text-[8px] font-black uppercase tracking-widest text-zinc-400">
                          {as.class?.name}
                       </div>
                       {pendingCount > 0 && (
                          <div className="px-3 py-1 bg-primary text-white text-[8px] font-black uppercase tracking-widest animate-pulse">
                             {pendingCount} Perlu Dinilai
                          </div>
                       )}
                    </div>
                    <div className="flex items-center gap-2">
                       <CardTitle className="text-3xl font-black uppercase italic tracking-tighter group-hover:text-primary transition-colors leading-none flex-1">{as.title}</CardTitle>
                       <Button 
                         onClick={(e) => confirmDelete(e, as.id)}
                         variant="ghost" 
                         size="icon" 
                         className="h-8 w-8 text-zinc-800 hover:text-red-500 hover:bg-red-500/10 rounded-none transition-all opacity-0 group-hover:opacity-100"
                       >
                          <Trash2 className="h-4 w-4" />
                       </Button>
                    </div>
                 </CardHeader>
                 <CardContent className="space-y-8">
                    <div className="flex items-center gap-4">
                       <div className="h-1 w-12 bg-primary/20" />
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">{as.subject.name}</p>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                       <div className="flex items-center gap-3 text-zinc-600">
                          <Clock className="h-4 w-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">
                             {new Date(as.deadline) > new Date() ? 'Aktif' : 'Berakhir'}
                          </span>
                       </div>
                       <div className="flex items-center gap-2 text-zinc-400 group-hover:text-primary transition-colors">
                          <span className="text-[10px] font-black uppercase tracking-widest">Detail</span>
                          <ChevronRight className="h-4 w-4" />
                       </div>
                    </div>
                 </CardContent>
              </Card>
            </motion.div>
           )
         })}
      </div>

       <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
         <AlertDialogContent className="bg-zinc-950 border-white/5 rounded-none text-white">
           <AlertDialogHeader>
             <AlertDialogTitle className="text-2xl font-black uppercase italic tracking-tighter">Konfirmasi Hapus</AlertDialogTitle>
             <AlertDialogDescription className="text-zinc-500">
               Apakah Anda yakin ingin menghapus tugas ini? Tindakan ini tidak dapat dibatalkan dan semua data submisi siswa akan hilang.
             </AlertDialogDescription>
           </AlertDialogHeader>
           <AlertDialogFooter>
             <AlertDialogCancel className="rounded-none border-white/5 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white uppercase font-black text-[10px] tracking-widest">
               Batal
             </AlertDialogCancel>
             <AlertDialogAction 
               onClick={handleDeleteAssignment}
               className="rounded-none bg-red-600 text-white hover:bg-red-700 uppercase font-black text-[10px] tracking-widest"
             >
               Hapus Permanen
             </AlertDialogAction>
           </AlertDialogFooter>
         </AlertDialogContent>
       </AlertDialog>
     </div>
   )
 }
