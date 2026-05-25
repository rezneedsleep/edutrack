'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ClipboardList, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileText,
  Send,
  ExternalLink,
  MessageSquare,
  Paperclip,
  Download,
  Link as LinkIcon,
  ChevronRight,
  Trash2,
  Pencil,
  X,
  BookOpen
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription
} from "@/components/ui/dialog"
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"

export function AssignmentsClient({ assignments, currentUserId }: any) {
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null)
  const [submissionContent, setSubmissionContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [comment, setComment] = useState('')
  const [submissionFile, setSubmissionFile] = useState<any>(null)
  const [isEditingSubmission, setIsEditingSubmission] = useState(false)
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editingCommentContent, setEditingCommentContent] = useState('')

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
        setSubmissionFile({ name: file.name, url: data.url })
        toast.success('File berhasil diunggah', { id: loadingToast })
      } else {
        toast.error(data.error || 'Gagal mengunggah file', { id: loadingToast })
      }
    } catch (error) {
      toast.error('Kesalahan koneksi saat mengunggah', { id: loadingToast })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch(`/api/assignments/${selectedAssignment.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: submissionContent,
          fileUrl: submissionFile?.url,
          fileName: submissionFile?.name
        })
      })

      if (res.ok) {
        toast.success('Tugas berhasil dikumpulkan!')
        setSelectedAssignment(null)
        setSubmissionContent('')
        setSubmissionFile(null)
        window.location.reload()
      } else {
        toast.error('Gagal mengumpulkan tugas')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan sistem')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateSubmission = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/assignments/${selectedAssignment.id}/submit`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: submissionContent, fileUrl: submissionFile?.url, fileName: submissionFile?.name })
      })
      if (res.ok) {
        toast.success('Pengumpulan berhasil diperbarui!')
        setIsEditingSubmission(false)
        setSubmissionContent('')
        setSubmissionFile(null)
        window.location.reload()
      } else { toast.error('Gagal memperbarui pengumpulan') }
    } catch { toast.error('Terjadi kesalahan sistem') } finally { setIsSubmitting(false) }
  }

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: comment, assignmentId: selectedAssignment.id })
      })
      if (res.ok) {
        const newComment = await res.json()
        setSelectedAssignment({ ...selectedAssignment, comments: [...(selectedAssignment.comments || []), newComment] })
        setComment('')
        toast.success('Komentar terkirim')
      }
    } catch { toast.error('Gagal mengirim komentar') }
  }

  const handleDeleteComment = async (commentId: string) => {
    try {
      const res = await fetch(`/api/comments/${commentId}`, { method: 'DELETE' })
      if (res.ok || res.status === 204) {
        setSelectedAssignment({
          ...selectedAssignment,
          comments: selectedAssignment.comments.filter((c: any) => c.id !== commentId)
        })
        toast.success('Komentar dihapus')
      } else { toast.error('Gagal menghapus komentar') }
    } catch { toast.error('Terjadi kesalahan') }
  }

  const handleEditComment = async (commentId: string) => {
    if (!editingCommentContent.trim()) return
    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editingCommentContent })
      })
      if (res.ok) {
        const updated = await res.json()
        setSelectedAssignment({
          ...selectedAssignment,
          comments: selectedAssignment.comments.map((c: any) => c.id === commentId ? updated : c)
        })
        setEditingCommentId(null)
        setEditingCommentContent('')
        toast.success('Komentar diperbarui')
      } else { toast.error('Gagal memperbarui komentar') }
    } catch { toast.error('Terjadi kesalahan') }
  }

  const getStatus = (as: any) => {
    const submission = as.submissions?.[0]
    if (submission) return { label: 'Diserahkan', color: 'bg-[#22C55E]/10 text-[#22C55E]', icon: CheckCircle2 }
    
    const isOverdue = new Date(as.deadline) < new Date()
    if (isOverdue) return { label: 'Terlambat', color: 'bg-[#EF4444]/10 text-[#EF4444]', icon: AlertCircle }
    
    return { label: 'Ditugaskan', color: 'bg-[#F59E0B]/10 text-[#F59E0B]', icon: Clock }
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)]">Daftar Tugas</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-2 font-medium">Kelola dan kumpulkan tugas sekolah Anda dengan mudah.</p>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-[var(--muted)] p-1 rounded-xl h-auto w-full md:w-auto inline-flex overflow-x-auto">
          <TabsTrigger value="all" className="rounded-lg px-6 py-2.5 text-xs font-bold transition-all data-[state=active]:bg-[var(--card)] data-[state=active]:text-[#5483B3] data-[state=active]:shadow-sm">Semua</TabsTrigger>
          <TabsTrigger value="pending" className="rounded-lg px-6 py-2.5 text-xs font-bold transition-all data-[state=active]:bg-[var(--card)] data-[state=active]:text-[#5483B3] data-[state=active]:shadow-sm">Belum Selesai</TabsTrigger>
          <TabsTrigger value="submitted" className="rounded-lg px-6 py-2.5 text-xs font-bold transition-all data-[state=active]:bg-[var(--card)] data-[state=active]:text-[#5483B3] data-[state=active]:shadow-sm">Dikumpulkan</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className={assignments.length === 0 ? "block" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"}>
          {assignments.length === 0 ? (
             <div className="flex flex-col items-center justify-center p-12 text-center bg-[var(--card)] border border-[var(--border)] rounded-2xl">
               <div className="h-20 w-20 bg-[#5483B3]/10 rounded-full flex items-center justify-center mb-4">
                 <ClipboardList className="h-10 w-10 text-[#5483B3]" />
               </div>
               <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">Belum Ada Tugas</h3>
               <p className="text-sm text-[var(--muted-foreground)] max-w-sm">Hore! Belum ada tugas yang ditugaskan ke Anda saat ini. Selamat bersantai!</p>
             </div>
          ) : (
            assignments.map((as: any, i: number) => {
              const status = getStatus(as)
              return (
                <motion.div
                  key={as.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card 
                    className="bg-[var(--card)] border-[var(--border)] rounded-2xl hover:border-[#5483B3]/30 hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col group overflow-hidden"
                    onClick={() => setSelectedAssignment(as)}
                  >
                    <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="h-10 w-10 bg-[#5483B3]/10 text-[#5483B3] rounded-xl flex items-center justify-center shrink-0">
                            <ClipboardList className="h-5 w-5" />
                          </div>
                          <Badge className={`${status.color} border-none rounded-lg text-[10px] font-bold px-2.5 py-1 flex items-center gap-1.5`}>
                            <status.icon className="h-3.5 w-3.5" />
                            {status.label}
                          </Badge>
                        </div>

                        <div>
                          <h3 className="text-base font-bold text-[var(--foreground)] group-hover:text-[#5483B3] transition-colors line-clamp-2 leading-tight">
                            {as.title}
                          </h3>
                          <div className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--muted-foreground)] mt-2">
                            <BookOpen className="h-3.5 w-3.5" />
                            <span className="truncate">{as.subject.name}</span>
                          </div>
                        </div>

                        <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 leading-relaxed">
                          {as.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs font-semibold text-[var(--muted-foreground)] pt-4 border-t border-[var(--border)]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-[#5483B3]" />
                          <span>{new Date(as.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MessageSquare className="h-4 w-4 text-[var(--muted-foreground)]" />
                          <span>{as.comments?.length || 0}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })
          )}
        </TabsContent>

        <TabsContent value="pending" className={assignments.filter((a: any) => !a.submissions?.[0]).length === 0 ? "block" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"}>
          {assignments.filter((a: any) => !a.submissions?.[0]).length === 0 ? (
             <div className="flex flex-col items-center justify-center p-12 text-center bg-[var(--card)] border border-[var(--border)] rounded-2xl">
               <div className="h-20 w-20 bg-[#22C55E]/10 rounded-full flex items-center justify-center mb-4">
                 <CheckCircle2 className="h-10 w-10 text-[#22C55E]" />
               </div>
               <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">Semua Tugas Selesai!</h3>
               <p className="text-sm text-[var(--muted-foreground)] max-w-sm">Luar biasa! Anda telah menyelesaikan semua tugas yang diberikan.</p>
             </div>
          ) : (
            assignments.filter((a: any) => !a.submissions?.[0]).map((as: any, i: number) => {
              const status = getStatus(as)
              return (
                <motion.div
                  key={as.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card 
                    className="bg-[var(--card)] border-[var(--border)] rounded-2xl hover:border-[#5483B3]/30 hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col group overflow-hidden"
                    onClick={() => setSelectedAssignment(as)}
                  >
                    <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="h-10 w-10 bg-[#5483B3]/10 text-[#5483B3] rounded-xl flex items-center justify-center shrink-0">
                            <ClipboardList className="h-5 w-5" />
                          </div>
                          <Badge className={`${status.color} border-none rounded-lg text-[10px] font-bold px-2.5 py-1 flex items-center gap-1.5`}>
                            <status.icon className="h-3.5 w-3.5" />
                            {status.label}
                          </Badge>
                        </div>

                        <div>
                          <h3 className="text-base font-bold text-[var(--foreground)] group-hover:text-[#5483B3] transition-colors line-clamp-2 leading-tight">
                            {as.title}
                          </h3>
                          <div className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--muted-foreground)] mt-2">
                            <BookOpen className="h-3.5 w-3.5" />
                            <span className="truncate">{as.subject.name}</span>
                          </div>
                        </div>

                        <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 leading-relaxed">
                          {as.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs font-semibold text-[var(--muted-foreground)] pt-4 border-t border-[var(--border)]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-[#5483B3]" />
                          <span>{new Date(as.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MessageSquare className="h-4 w-4 text-[var(--muted-foreground)]" />
                          <span>{as.comments?.length || 0}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })
          )}
        </TabsContent>

        <TabsContent value="submitted" className={assignments.filter((a: any) => a.submissions?.[0]).length === 0 ? "block" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"}>
          {assignments.filter((a: any) => a.submissions?.[0]).length === 0 ? (
             <div className="flex flex-col items-center justify-center p-12 text-center bg-[var(--card)] border border-[var(--border)] rounded-2xl">
               <div className="h-20 w-20 bg-[var(--muted)] rounded-full flex items-center justify-center mb-4">
                 <ClipboardList className="h-10 w-10 text-[var(--muted-foreground)] opacity-50" />
               </div>
               <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">Belum Ada Pengumpulan</h3>
               <p className="text-sm text-[var(--muted-foreground)] max-w-sm">Anda belum mengumpulkan tugas apa pun. Ayo mulai kerjakan!</p>
             </div>
          ) : (
            assignments.filter((a: any) => a.submissions?.[0]).map((as: any, i: number) => {
              const status = getStatus(as)
              return (
                <motion.div
                  key={as.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card 
                    className="bg-[var(--card)] border-[var(--border)] rounded-2xl hover:border-[#5483B3]/30 hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col group overflow-hidden"
                    onClick={() => setSelectedAssignment(as)}
                  >
                    <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="h-10 w-10 bg-[#5483B3]/10 text-[#5483B3] rounded-xl flex items-center justify-center shrink-0">
                            <ClipboardList className="h-5 w-5" />
                          </div>
                          <Badge className={`${status.color} border-none rounded-lg text-[10px] font-bold px-2.5 py-1 flex items-center gap-1.5`}>
                            <status.icon className="h-3.5 w-3.5" />
                            {status.label}
                          </Badge>
                        </div>

                        <div>
                          <h3 className="text-base font-bold text-[var(--foreground)] group-hover:text-[#5483B3] transition-colors line-clamp-2 leading-tight">
                            {as.title}
                          </h3>
                          <div className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--muted-foreground)] mt-2">
                            <BookOpen className="h-3.5 w-3.5" />
                            <span className="truncate">{as.subject.name}</span>
                          </div>
                        </div>

                        <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 leading-relaxed">
                          {as.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs font-semibold text-[var(--muted-foreground)] pt-4 border-t border-[var(--border)]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-[#5483B3]" />
                          <span>{new Date(as.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MessageSquare className="h-4 w-4 text-[var(--muted-foreground)]" />
                          <span>{as.comments?.length || 0}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })
          )}
        </TabsContent>
      </Tabs>

      {/* Assignment Detail Modal */}
      <Dialog open={!!selectedAssignment} onOpenChange={() => setSelectedAssignment(null)}>
        <DialogContent className="bg-[var(--card)] border-[var(--border)] rounded-2xl text-[var(--foreground)] max-w-5xl overflow-hidden p-0 flex flex-col md:flex-row h-[90vh] md:h-[80vh] shadow-2xl">
          {selectedAssignment && (
            <>
              {/* Left Column: Details & Discussion */}
              <div className="flex-1 flex flex-col overflow-hidden border-r border-[var(--border)]">
                 <div className="p-6 md:p-8 border-b border-[var(--border)] bg-[var(--muted)]/20">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                       <Badge className="bg-[#5483B3]/10 text-[#5483B3] border-none rounded-lg text-xs font-bold px-3 py-1">
                          {selectedAssignment.subject.name}
                       </Badge>
                       <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--muted-foreground)] bg-[var(--card)] border border-[var(--border)] px-3 py-1 rounded-lg">
                          <Clock className="h-3.5 w-3.5" /> Tenggat: {new Date(selectedAssignment.deadline).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                       </div>
                    </div>
                    
                    <DialogTitle className="text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--foreground)] leading-tight mb-4">
                      {selectedAssignment.title}
                    </DialogTitle>
                    <DialogDescription className="sr-only">Detail dan form pengumpulan tugas</DialogDescription>

                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border border-[var(--border)]">
                             <AvatarFallback className="bg-[var(--muted)] text-[var(--muted-foreground)] text-xs font-bold">TR</AvatarFallback>
                          </Avatar>
                          <div>
                             <p className="text-xs font-bold text-[var(--foreground)]">Guru Pengampu</p>
                             <p className="text-[10px] text-[var(--muted-foreground)]">Diposting {new Date(selectedAssignment.createdAt).toLocaleDateString('id-ID')}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-sm font-extrabold text-[#5483B3]">{selectedAssignment.maxScore} Poin</p>
                       </div>
                    </div>
                 </div>

                 <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                    {/* Instructions Section */}
                    <div className="space-y-4">
                       <h4 className="text-xs font-bold text-[var(--foreground)] flex items-center gap-2">
                          <FileText className="h-4 w-4 text-[#5483B3]" /> Instruksi Tugas
                       </h4>
                       <div className="text-sm text-[var(--muted-foreground)] leading-relaxed whitespace-pre-wrap">
                          {selectedAssignment.description}
                       </div>
                    </div>

                    {/* Attachments */}
                    {selectedAssignment.attachments?.length > 0 && (
                       <div className="space-y-4">
                          <h4 className="text-xs font-bold text-[var(--foreground)]">Materi Lampiran</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                             {selectedAssignment.attachments.map((at: any, idx: number) => (
                               <Button 
                                 key={idx}
                                 variant="outline" 
                                 className="h-auto py-3 bg-[var(--card)] border-[var(--border)] rounded-xl justify-start px-4 gap-3 hover:bg-[#5483B3]/5 hover:border-[#5483B3]/30 transition-all"
                                 onClick={() => window.open(at.url, '_blank')}
                               >
                                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${at.type === 'file' ? 'bg-[#EF4444]/10 text-[#EF4444]' : 'bg-[#5483B3]/10 text-[#5483B3]'}`}>
                                     {at.type === 'file' ? <FileText className="h-5 w-5" /> : <LinkIcon className="h-5 w-5" />}
                                  </div>
                                  <div className="text-left overflow-hidden">
                                     <p className="text-xs font-semibold text-[var(--foreground)] truncate">{at.name}</p>
                                     <p className="text-[10px] text-[var(--muted-foreground)] uppercase mt-0.5">{at.type}</p>
                                  </div>
                                  <Download className="h-4 w-4 ml-auto text-[var(--muted-foreground)]" />
                               </Button>
                             ))}
                          </div>
                       </div>
                    )}

                    {/* Discussion Section */}
                    <div className="space-y-6 pt-6 border-t border-[var(--border)]">
                       <div className="flex items-center gap-2">
                          <MessageSquare className="h-5 w-5 text-[#5483B3]" />
                          <h4 className="text-sm font-bold text-[var(--foreground)]">Komentar Kelas ({selectedAssignment.comments?.length || 0})</h4>
                       </div>

                       <div className="space-y-5">
                          {selectedAssignment.comments?.map((c: any) => (
                             <div key={c.id} className="flex gap-3 group">
                                <Avatar className="h-8 w-8 border border-[var(--border)] shrink-0">
                                   {c.author?.image && <AvatarImage src={c.author.image} />}
                                   <AvatarFallback className="bg-[var(--muted)] text-[10px] font-bold text-[var(--muted-foreground)]">{c.author?.name?.[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-1 min-w-0">
                                   <div className="flex items-center justify-between gap-2">
                                      <div className="flex items-center gap-2">
                                        <p className="text-xs font-bold text-[var(--foreground)]">{c.author?.name}</p>
                                        <span className="text-[10px] font-medium text-[var(--muted-foreground)]">{new Date(c.createdAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                                      </div>
                                      {c.authorId === currentUserId && (
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                          <Button variant="ghost" size="icon" className="h-6 w-6 text-[var(--muted-foreground)] hover:text-[#5483B3] hover:bg-[#5483B3]/10"
                                            onClick={() => { setEditingCommentId(c.id); setEditingCommentContent(c.content) }}>
                                            <Pencil className="h-3 w-3" />
                                          </Button>
                                          <Button variant="ghost" size="icon" className="h-6 w-6 text-[var(--muted-foreground)] hover:text-[#EF4444] hover:bg-[#EF4444]/10"
                                            onClick={() => handleDeleteComment(c.id)}>
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      )}
                                   </div>
                                   {editingCommentId === c.id ? (
                                     <div className="flex gap-2 mt-2">
                                       <Input value={editingCommentContent} onChange={(e) => setEditingCommentContent(e.target.value)}
                                         className="bg-[var(--muted)] border-transparent h-9 text-xs rounded-lg flex-1" />
                                       <Button size="icon" className="h-9 w-9 bg-[#5483B3] rounded-lg" onClick={() => handleEditComment(c.id)}>
                                         <Send className="h-3 w-3" /></Button>
                                       <Button size="icon" variant="ghost" className="h-9 w-9 rounded-lg" onClick={() => setEditingCommentId(null)}>
                                         <X className="h-3 w-3" /></Button>
                                     </div>
                                   ) : (
                                     <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">{c.content}</p>
                                   )}
                                </div>
                             </div>
                          ))}
                       </div>

                       <form onSubmit={handlePostComment} className="flex gap-3 mt-6">
                          <Avatar className="h-9 w-9 border border-[var(--border)] shrink-0 hidden sm:block">
                             <AvatarFallback className="bg-[var(--muted)] text-xs font-bold text-[var(--muted-foreground)]">U</AvatarFallback>
                          </Avatar>
                          <div className="relative flex-1">
                            <Input 
                               value={comment}
                               onChange={(e) => setComment(e.target.value)}
                               placeholder="Tambahkan komentar kelas..."
                               className="bg-[var(--muted)]/50 border-[var(--border)] h-11 pl-4 pr-12 rounded-xl text-xs focus-visible:ring-1 transition-all"
                            />
                            <Button type="submit" size="icon" className="absolute right-1.5 top-1.5 h-8 w-8 bg-[#5483B3] hover:bg-[#3B6FA0] rounded-lg shadow-sm">
                               <Send className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                       </form>
                    </div>
                 </div>
              </div>

              {/* Right Column: Submission Panel */}
              <div className="w-full md:w-[340px] bg-[var(--muted)]/30 flex flex-col">
                 <div className="p-6 border-b border-[var(--border)]">
                    <div className="flex justify-between items-center mb-1">
                       <h4 className="text-sm font-bold text-[var(--foreground)]">Tugas Anda</h4>
                       <Badge variant="outline" className={`${selectedAssignment.submissions?.[0] ? 'bg-[#22C55E]/10 border-transparent text-[#22C55E]' : 'bg-[#F59E0B]/10 border-transparent text-[#F59E0B]'} rounded-lg text-[10px] font-bold px-2 py-0.5`}>
                          {selectedAssignment.submissions?.[0] ? 'Diserahkan' : 'Belum Selesai'}
                       </Badge>
                    </div>
                 </div>

                 <div className="p-6 flex-1 overflow-y-auto">
                    {selectedAssignment.submissions?.[0] ? (
                       <div className="space-y-6">
                          <div className="p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-sm space-y-3">
                             <div className="flex items-center gap-2 text-[var(--foreground)]">
                                <FileText className="h-4 w-4 text-[#5483B3]" />
                                <span className="text-xs font-bold">Jawaban Terkirim</span>
                             </div>
                             <p className="text-xs text-[var(--muted-foreground)] leading-relaxed whitespace-pre-wrap break-words">{selectedAssignment.submissions[0].content}</p>
                             
                             {selectedAssignment.submissions[0].fileUrl && (
                               <a href={selectedAssignment.submissions[0].fileUrl} target="_blank" rel="noopener noreferrer" className="mt-3 block">
                                 <div className="flex items-center gap-2 p-2.5 rounded-lg border border-[var(--border)] bg-[var(--muted)]/50 hover:bg-[var(--muted)] transition-colors">
                                   <Paperclip className="h-4 w-4 text-[#5483B3] shrink-0" />
                                   <span className="text-xs font-medium text-[var(--foreground)] truncate">{selectedAssignment.submissions[0].fileName || 'Lampiran'}</span>
                                   <ExternalLink className="h-3.5 w-3.5 ml-auto text-[var(--muted-foreground)]" />
                                 </div>
                               </a>
                             )}
                          </div>

                          {selectedAssignment.submissions[0].score !== null && (
                             <div className="space-y-4 pt-2">
                                <div className="text-center p-5 bg-[#5483B3]/10 border border-[#5483B3]/20 rounded-xl">
                                   <p className="text-[11px] font-bold text-[#5483B3] mb-1 uppercase tracking-wider">Nilai Akhir</p>
                                   <p className="text-4xl font-extrabold text-[var(--foreground)]">{selectedAssignment.submissions[0].score}<span className="text-sm text-[var(--muted-foreground)]">/{selectedAssignment.maxScore}</span></p>
                                </div>
                                {selectedAssignment.submissions[0].feedback && (
                                  <div className="p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-sm">
                                     <p className="text-[10px] font-bold text-[var(--muted-foreground)] mb-2 uppercase tracking-wider">Feedback Guru</p>
                                     <p className="text-xs font-medium text-[var(--foreground)] leading-relaxed italic border-l-2 border-[#5483B3] pl-3">"{selectedAssignment.submissions[0].feedback}"</p>
                                  </div>
                                )}
                             </div>
                          )}
                          
                           {!isEditingSubmission && selectedAssignment.submissions[0].score === null && (
                             <Button variant="outline" onClick={() => { setIsEditingSubmission(true); setSubmissionContent(selectedAssignment.submissions[0].content) }}
                               className="w-full border-[var(--border)] hover:bg-[var(--muted)] text-xs font-semibold h-11 rounded-xl shadow-sm">
                               Batal Serahkan / Edit
                             </Button>
                           )}
                           
                           {isEditingSubmission && (
                             <form onSubmit={handleUpdateSubmission} className="space-y-4 pt-4 border-t border-[var(--border)]">
                               <p className="text-xs font-bold text-[var(--foreground)]">Edit Jawaban</p>
                               <Textarea required value={submissionContent} onChange={(e) => setSubmissionContent(e.target.value)}
                                 className="bg-[var(--card)] border-[var(--border)] rounded-xl min-h-[120px] p-3 text-xs" />
                               <div className="flex gap-2">
                                 <Button disabled={isSubmitting} className="flex-1 h-10 bg-[#5483B3] hover:bg-[#3B6FA0] text-white font-bold text-xs rounded-xl">
                                   {isSubmitting ? 'Loading...' : 'Simpan Perubahan'}
                                 </Button>
                                 <Button type="button" variant="outline" onClick={() => setIsEditingSubmission(false)}
                                   className="h-10 border-[var(--border)] text-xs font-semibold rounded-xl px-4">
                                   Batal
                                 </Button>
                               </div>
                             </form>
                           )}
                        </div>
                    ) : new Date(selectedAssignment.deadline) < new Date() ? (
                       <div className="flex flex-col items-center justify-center p-8 text-center bg-red-50 border border-red-100 rounded-xl">
                          <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                             <AlertCircle className="h-8 w-8 text-red-600" />
                          </div>
                          <h4 className="text-sm font-bold text-red-900 mb-1">Batas Waktu Berakhir</h4>
                          <p className="text-xs text-red-700/80 max-w-[250px]">Anda tidak dapat lagi mengumpulkan tugas ini karena batas waktu pengumpulan telah terlewat.</p>
                       </div>
                    ) : (
                       <form onSubmit={handleSubmit} className="space-y-5">
                          <div className="space-y-2">
                             <Label className="text-xs font-bold text-[var(--foreground)]">Ketik Jawaban atau Link Drive</Label>
                             <Textarea 
                                required
                                value={submissionContent}
                                onChange={(e) => setSubmissionContent(e.target.value)}
                                className="bg-[var(--card)] border-[var(--border)] rounded-xl min-h-[160px] p-4 text-xs leading-relaxed focus:border-[#5483B3] transition-colors shadow-sm"
                                placeholder="Ketik jawaban Anda di sini..."
                             />
                          </div>
                          
                          <div className="space-y-4">
                             {submissionFile && (
                                <div className="p-3 bg-[var(--card)] border border-[var(--border)] rounded-xl flex items-center justify-between shadow-sm">
                                   <div className="flex items-center gap-2.5 overflow-hidden">
                                      <div className="h-8 w-8 bg-[#5483B3]/10 text-[#5483B3] rounded-lg flex items-center justify-center shrink-0">
                                        <FileText className="h-4 w-4" />
                                      </div>
                                      <p className="text-xs font-semibold truncate text-[var(--foreground)]">{submissionFile.name}</p>
                                   </div>
                                   <Button type="button" variant="ghost" size="icon" onClick={() => setSubmissionFile(null)} className="h-8 w-8 text-[var(--muted-foreground)] hover:text-[#EF4444] hover:bg-[#EF4444]/10 shrink-0">
                                      <X className="h-4 w-4" />
                                   </Button>
                                </div>
                             )}

                             <input 
                               type="file" 
                               id="student-file-upload" 
                               className="hidden" 
                               onChange={handleFileUpload}
                             />
                             <Button 
                               type="button" 
                               variant="outline" 
                               onClick={() => document.getElementById('student-file-upload')?.click()}
                               className="w-full h-12 border-dashed border-[var(--border)] hover:border-[#5483B3]/50 hover:bg-[#5483B3]/5 rounded-xl text-xs font-bold text-[#5483B3] flex items-center justify-center gap-2 transition-all"
                             >
                                <Paperclip className="h-4 w-4" /> {submissionFile ? 'Ganti File Lampiran' : 'Unggah File (Opsional)'}
                             </Button>
                             
                             <Button disabled={isSubmitting} className="w-full h-12 bg-[#5483B3] hover:bg-[#3B6FA0] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#5483B3]/20 transition-all mt-2">
                                {isSubmitting ? 'Mengirim Tugas...' : 'Serahkan Tugas'}
                                <Send className="ml-2 h-4 w-4" />
                             </Button>
                          </div>
                       </form>
                    )}
                 </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
