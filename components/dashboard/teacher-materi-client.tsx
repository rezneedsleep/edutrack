'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, 
  Plus, 
  GripVertical, 
  Edit3, 
  Trash2, 
  ChevronRight,
  ArrowLeft,
  Save,
  Lock,
  Unlock,
  FileText,
  Clock,
  MessageSquare,
  Send,
  MoreVertical,
  Calendar,
  ClipboardList,
  FolderOpen,
  Users2,
  Paperclip,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Search,
  BookOpenCheck,
  GraduationCap,
  Info,
  X
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function TeacherMateriClient({ subjects, classes, canEditMaterials, role }: any) {
  const [localSubjects, setLocalSubjects] = useState(subjects || [])
  const [selectedSubject, setSelectedSubject] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'stream' | 'classwork' | 'people'>('stream')

  const searchParams = useSearchParams()
  const subjectIdParam = searchParams.get('subjectId')
  const topicIdParam = searchParams.get('topicId')

  // Keep selectedSubject synced with latest values from localSubjects
  const handleUpdateLocalSubject = (updatedSub: any) => {
    setLocalSubjects((prev: any) => prev.map((s: any) => s.id === updatedSub.id ? updatedSub : s))
    setSelectedSubject(updatedSub)
  }

  useEffect(() => {
    if (subjectIdParam && localSubjects) {
      const found = localSubjects.find((s: any) => s.id === subjectIdParam)
      if (found) {
        setSelectedSubject(found)
        setActiveTab('classwork')

        if (topicIdParam) {
          const topic = found.topics?.find((t: any) => t.id === topicIdParam)
          if (topic) {
            const newExpanded: Record<string, boolean> = {}
            if (topic.materials) {
              try {
                const parsed = typeof topic.materials === 'string' ? JSON.parse(topic.materials) : topic.materials
                if (Array.isArray(parsed)) {
                  parsed.forEach((_: any, idx: number) => {
                    newExpanded[`material-${topic.id}-${idx}`] = true
                  })
                }
              } catch (e) {}
            }
            const topicAssignments = found.assignments?.filter((a: any) => a.topicId === topic.id) || []
            topicAssignments.forEach((a: any) => {
              newExpanded[`assignment-${a.id}`] = true
            })
            setExpandedItems(newExpanded)
          }
        }
      }
    }
  }, [subjectIdParam, topicIdParam, localSubjects])
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  
  // Search state for people tab
  const [peopleSearch, setPeopleSearch] = useState('')

  // Stream state
  const [classroomPosts, setClassroomPosts] = useState<Record<string, any[]>>({})
  const [newAnnouncement, setNewAnnouncement] = useState('')
  const [isPosting, setIsPosting] = useState(false)

  // Dialog and API states
  const [isAddTopicOpen, setIsAddTopicOpen] = useState(false)
  const [isEditTopicOpen, setIsEditTopicOpen] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState<any>(null)
  const [newTopic, setNewTopic] = useState({ name: '', description: '', estimatedHours: 1 })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [topicMaterials, setTopicMaterials] = useState<any[]>([])
  const [isAddingLink, setIsAddingLink] = useState(false)
  const [newLink, setNewLink] = useState('')
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [activeArticleTopic, setActiveArticleTopic] = useState<any>(null)

  // Material CRUD states
  const [isAddMaterialOpen, setIsAddMaterialOpen] = useState(false)
  const [isEditMaterialOpen, setIsEditMaterialOpen] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null)
  const [materialFormData, setMaterialFormData] = useState({
    title: '',
    description: '',
    classId: 'all',
    status: 'BELUM_DITUGASKAN',
    attachments: [] as { name: string; url: string }[]
  })
  const [newMatAttachName, setNewMatAttachName] = useState('')
  const [newMatAttachUrl, setNewMatAttachUrl] = useState('')

  // Attachments handlers for material
  const addMaterialAttachment = () => {
    if (!newMatAttachName.trim() || !newMatAttachUrl.trim()) {
      toast.error('Lengkapi nama dan URL lampiran')
      return
    }
    let url = newMatAttachUrl.trim()
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url
    }
    setMaterialFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, { name: newMatAttachName.trim(), url }]
    }))
    setNewMatAttachName('')
    setNewMatAttachUrl('')
  }

  const removeMaterialAttachment = (index: number) => {
    setMaterialFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }))
  }

  // API materials integration
  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!materialFormData.title) {
      toast.error('Judul materi wajib diisi')
      return
    }
    setIsSubmitting(true)
    const toastId = toast.loading('Menambahkan materi...')
    try {
      const res = await fetch('/api/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...materialFormData,
          subjectId: selectedSubject.id
        })
      })
      if (res.ok) {
        const newMat = await res.json()
        toast.success('Materi berhasil ditambahkan', { id: toastId })
        setIsAddMaterialOpen(false)
        
        // Update local state
        const updatedSelected = {
          ...selectedSubject,
          materials: [newMat, ...(selectedSubject.materials || [])]
        }
        handleUpdateLocalSubject(updatedSelected)
      } else {
        const err = await res.text()
        toast.error(err || 'Gagal menambahkan materi', { id: toastId })
      }
    } catch (e) {
      toast.error('Kesalahan koneksi', { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditMaterialSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!materialFormData.title) {
      toast.error('Judul materi wajib diisi')
      return
    }
    setIsSubmitting(true)
    const toastId = toast.loading('Menyimpan materi...')
    try {
      const res = await fetch(`/api/materials/${selectedMaterial.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(materialFormData)
      })
      if (res.ok) {
        const updatedMat = await res.json()
        toast.success('Materi berhasil diperbarui', { id: toastId })
        setIsEditMaterialOpen(false)
        
        // Update local state
        const updatedSelected = {
          ...selectedSubject,
          materials: selectedSubject.materials.map((m: any) => m.id === selectedMaterial.id ? updatedMat : m)
        }
        handleUpdateLocalSubject(updatedSelected)
      } else {
        const err = await res.text()
        toast.error(err || 'Gagal memperbarui materi', { id: toastId })
      }
    } catch (e) {
      toast.error('Kesalahan koneksi', { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteMaterial = async (id: string) => {
    if (!confirm('Hapus materi ini?')) return
    const toastId = toast.loading('Menghapus materi...')
    try {
      const res = await fetch(`/api/materials/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Materi dihapus', { id: toastId })
        const updatedSelected = {
          ...selectedSubject,
          materials: selectedSubject.materials.filter((m: any) => m.id !== id)
        }
        handleUpdateLocalSubject(updatedSelected)
      } else {
        toast.error('Gagal menghapus materi', { id: toastId })
      }
    } catch (e) {
      toast.error('Kesalahan koneksi', { id: toastId })
    }
  }

  const openEditMaterial = (mat: any) => {
    setSelectedMaterial(mat)
    let parsedAttachments = []
    if (mat.attachments) {
      try {
        parsedAttachments = typeof mat.attachments === 'string'
          ? JSON.parse(mat.attachments)
          : mat.attachments
      } catch (e) {
        parsedAttachments = []
      }
    }
    setMaterialFormData({
      title: mat.title,
      description: mat.description || '',
      classId: mat.classId || 'all',
      status: mat.status || 'BELUM_DITUGASKAN',
      attachments: parsedAttachments
    })
    setIsEditMaterialOpen(true)
  }

  const openAddMaterial = () => {
    setMaterialFormData({
      title: '',
      description: '',
      classId: 'all',
      status: 'BELUM_DITUGASKAN',
      attachments: []
    })
    setNewMatAttachName('')
    setNewMatAttachUrl('')
    setIsAddMaterialOpen(true)
  }


  // Prepopulate stream announcements
  useEffect(() => {
    if (selectedSubject) {
      const subjectId = selectedSubject.id
      if (!classroomPosts[subjectId]) {
        const posts: any[] = [
          {
            id: 'welcome-post',
            author: { name: 'Saya (Guru)', role: 'TEACHER' },
            type: 'ANNOUNCEMENT',
            content: `Selamat datang di kelas digital ${selectedSubject.name}! Di sini kita akan mendiskusikan materi, mempublikasikan kisi-kisi pembelajaran, serta mengumumkan penugasan baru. Silakan periksa tab "Tugas Kelas" untuk melihat modul bab yang aktif.`,
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            comments: []
          }
        ]

        // Add auto notifications for materials (topics)
        const topics = selectedSubject.topics || []
        topics.forEach((topic: any, idx: number) => {
          posts.push({
            id: `auto-topic-${topic.id}`,
            author: { name: 'Saya (Guru)', role: 'TEACHER' },
            type: 'TOPIC_NOTIFICATION',
            content: `mempublikasikan bab pembelajaran baru: ${topic.name}.`,
            topic,
            createdAt: new Date(topic.createdAt || (Date.now() - (idx + 1) * 24 * 60 * 60 * 1000)),
            comments: []
          })
        })

        // Add auto notifications for assignments
        const assignments = selectedSubject.assignments || []
        assignments.forEach((as: any, idx: number) => {
          posts.push({
            id: `auto-assignment-${as.id}`,
            author: { name: 'Saya (Guru)', role: 'TEACHER' },
            type: 'ASSIGNMENT_NOTIFICATION',
            content: `membuat tugas kelas baru: ${as.title}.`,
            assignment: as,
            createdAt: new Date(as.createdAt || (Date.now() - idx * 12 * 60 * 60 * 1000)),
            comments: []
          })
        })

        posts.sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime())

        setClassroomPosts(prev => ({
          ...prev,
          [subjectId]: posts
        }))
      }
    }
  }, [selectedSubject])

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAnnouncement.trim()) return
    const subjectId = selectedSubject.id

    const newPost = {
      id: `custom-post-${Date.now()}`,
      author: { name: 'Saya (Guru)', role: 'TEACHER' },
      type: 'ANNOUNCEMENT',
      content: newAnnouncement,
      createdAt: new Date(),
      comments: []
    }

    setClassroomPosts(prev => ({
      ...prev,
      [subjectId]: [newPost, ...(prev[subjectId] || [])]
    }))

    setNewAnnouncement('')
    setIsPosting(false)
  }

  const handlePostComment = (postId: string, commentText: string) => {
    if (!commentText.trim()) return
    const subjectId = selectedSubject.id

    const newComment = {
      id: `comment-${Date.now()}`,
      author: { name: 'Saya (Guru)' },
      content: commentText,
      createdAt: new Date()
    }

    setClassroomPosts(prev => {
      const subjectPosts = prev[subjectId] || []
      const updatedPosts = subjectPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment]
          }
        }
        return post
      })
      return {
        ...prev,
        [subjectId]: updatedPosts
      }
    })
  }

  const toggleExpandItem = (itemId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }))
  }

  const handleAddTopic = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const res = await fetch('/api/admin/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newTopic, subjectId: selectedSubject.id })
      })

      if (res.ok) {
        toast.success('Topik berhasil ditambahkan!')
        setIsAddTopicOpen(false)
        setNewTopic({ name: '', description: '', estimatedHours: 1 })
        window.location.reload()
      } else {
        toast.error('Gagal menambahkan topik')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan sistem')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateTopic = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/admin/topics/${selectedTopic.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: selectedTopic.name,
          description: selectedTopic.description,
          estimatedHours: selectedTopic.estimatedHours,
          isLocked: selectedTopic.isLocked,
          materials: topicMaterials
        })
      })
      if (res.ok) {
        toast.success('Topik diperbarui')
        setIsEditTopicOpen(false)
        window.location.reload()
      }
    } catch (error) {
      toast.error('Gagal memperbarui topik')
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmDelete = (id: string) => {
    setDeleteTargetId(id)
    setIsDeleteConfirmOpen(true)
  }

  const handleDeleteTopic = async () => {
    if (!deleteTargetId) return
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/admin/topics/${deleteTargetId}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Topik berhasil dihapus')
        setIsDeleteConfirmOpen(false)
        setDeleteTargetId(null)
        window.location.reload()
      } else {
        toast.error('Gagal menghapus topik')
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

    const formData = new FormData()
    formData.append('file', file)
    const loadingToast = toast.loading(`Mengunggah ${file.name}...`)

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (res.ok) {
        setTopicMaterials([...topicMaterials, { type: 'file', name: file.name, url: data.url }])
        toast.success('File diunggah', { id: loadingToast })
      }
    } catch (error) {
      toast.error('Gagal mengunggah', { id: loadingToast })
    }
  }

  const addLink = () => {
    if (!newLink) return
    setTopicMaterials([...topicMaterials, { type: 'link', name: newLink, url: newLink }])
    setNewLink('')
    setIsAddingLink(false)
  }

  const handleUpdateArticle = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/admin/topics/${activeArticleTopic.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: activeArticleTopic.name,
          description: activeArticleTopic.description,
          estimatedHours: parseInt(activeArticleTopic.estimatedHours as any) || 0,
          isLocked: activeArticleTopic.isLocked,
          materials: topicMaterials
        })
      })
      if (res.ok) {
        toast.success('Artikel bab berhasil diperbarui')
        setActiveArticleTopic(null)
        window.location.reload()
      }
    } catch (error) {
      toast.error('Gagal memperbarui artikel')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getTopicItems = (topic: any) => {
    const materials = []
    if (topic.materials) {
      try {
        const parsed = typeof topic.materials === 'string' ? JSON.parse(topic.materials) : topic.materials
        if (Array.isArray(parsed)) {
          materials.push(...parsed.map((m: any, idx: number) => ({
            ...m,
            itemId: `material-${topic.id}-${idx}`,
            itemType: 'MATERIAL',
            title: m.name,
            createdAt: topic.createdAt
          })))
        }
      } catch (e) {
        console.error(e)
      }
    }

    const topicAssignments = selectedSubject?.assignments?.filter((a: any) => a.topicId === topic.id) || []
    const formattedAssignments = topicAssignments.map((a: any) => ({
      ...a,
      itemId: `assignment-${a.id}`,
      itemType: 'ASSIGNMENT',
      title: a.title,
      createdAt: a.createdAt
    }))

    return [...formattedAssignments, ...materials]
  }

  const getGeneralAssignments = () => {
    if (!selectedSubject) return []
    return selectedSubject.assignments?.filter((a: any) => !a.topicId) || []
  }

  // Enrolled Students list mapping
  const enrolledStudents = selectedSubject?.userSubjects?.map((us: any) => us.user).filter(Boolean) || []
  const filteredStudents = enrolledStudents.filter((s: any) => 
    s.name.toLowerCase().includes(peopleSearch.toLowerCase())
  )

  const getBannerPattern = (color: string) => {
    return {
      backgroundColor: color || '#5483B3',
      backgroundImage: `radial-gradient(circle at 100% 150%, rgba(255,255,255,0.15) 24%, transparent 24%), 
                        radial-gradient(circle at 0% 0%, rgba(255,255,255,0.1) 30%, transparent 30%), 
                        linear-gradient(135deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%)`
    }
  }

  // Premium Editor Page Render
  if (activeArticleTopic) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] animate-in fade-in duration-500">
        <div className="max-w-5xl mx-auto py-12 px-6 space-y-12">
          {/* Editor Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-8">
            <Button 
              variant="ghost" 
              onClick={() => setActiveArticleTopic(null)}
              className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] p-0 h-auto font-semibold text-xs gap-1.5 flex items-center self-start"
            >
              <ArrowLeft className="h-4 w-4" /> Batal & Kembali
            </Button>
            <div className="flex gap-3">
               <Button 
                onClick={() => setActiveArticleTopic({...activeArticleTopic, isLocked: !activeArticleTopic.isLocked})}
                variant="outline"
                className={`rounded-xl border-[var(--border)] font-bold text-xs h-11 px-4 flex items-center gap-2 ${
                  activeArticleTopic.isLocked ? 'text-red-500 hover:text-red-600' : 'text-[#22C55E] hover:text-[#22C55E]/90'
                }`}
               >
                 {activeArticleTopic.isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                 {activeArticleTopic.isLocked ? 'Draft (Locked)' : 'Published'}
               </Button>
               <Button 
                onClick={handleUpdateArticle}
                disabled={isSubmitting}
                className="bg-[#5483B3] hover:bg-[#5483B3]/90 text-white rounded-xl font-bold text-xs h-11 px-6 shadow-sm"
               >
                 {isSubmitting ? 'Menyimpan...' : 'Simpan Artikel'}
               </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Editor Input Area */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                 <input 
                   value={activeArticleTopic.name}
                   onChange={(e) => setActiveArticleTopic({...activeArticleTopic, name: e.target.value})}
                   className="w-full bg-transparent border-none text-4xl md:text-5xl font-extrabold tracking-tight focus:outline-none focus:ring-0 placeholder:text-[var(--muted-foreground)]/50 focus:border-none focus-visible:ring-0"
                   placeholder="JUDUL BAB / TOPIK"
                 />
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-[var(--card)] px-4 py-2 border border-[var(--border)] rounded-xl shadow-sm text-xs">
                       <Clock className="h-4 w-4 text-[#5483B3]" />
                       <input 
                         type="number"
                         value={Number.isNaN(activeArticleTopic.estimatedHours) || activeArticleTopic.estimatedHours === null || activeArticleTopic.estimatedHours === undefined ? '' : activeArticleTopic.estimatedHours}
                         onChange={(e) => { const val = parseInt(e.target.value); setActiveArticleTopic({...activeArticleTopic, estimatedHours: Number.isNaN(val) ? '' as any : val}); }}
                         className="bg-transparent border-none w-10 text-center font-bold focus:outline-none text-[var(--foreground)]"
                       />
                       <span className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">Jam Estimasi</span>
                    </div>
                    <Badge className="bg-[#5483B3]/10 text-[#5483B3] border-none rounded-xl text-[10px] font-bold px-4 py-2">
                       {selectedSubject.name}
                    </Badge>
                 </div>
              </div>

              <div className="relative group pt-4">
                 <Textarea 
                   value={activeArticleTopic.description || ''}
                   onChange={(e) => setActiveArticleTopic({...activeArticleTopic, description: e.target.value})}
                   className="w-full bg-transparent border-none min-h-[450px] text-base font-medium leading-relaxed resize-none focus:ring-0 focus:outline-none focus-visible:ring-0 placeholder:text-[var(--muted-foreground)]/30 p-0"
                   placeholder="Mulai menulis artikel pembelajaran di sini... Anda bisa menjelaskan konsep secara lengkap, kisi-kisi ujian, ringkasan bab, atau materi digital lainnya."
                 />
              </div>
            </div>

            {/* Materials & Files Attachments Manager */}
            <div className="space-y-6">
               <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-sm">
                  <CardHeader className="border-b border-[var(--border)] pb-4">
                     <CardTitle className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Lampiran & Media</CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 space-y-4 pt-4">
                     <div className="flex flex-col gap-2">
                        <input type="file" id="article-file-upload" className="hidden" onChange={handleFileUpload} />
                        <Button 
                          variant="outline" 
                          onClick={() => document.getElementById('article-file-upload')?.click()}
                          className="w-full h-12 rounded-xl border-dashed border-[var(--border)] hover:bg-[var(--muted)] text-xs font-bold gap-2"
                        >
                          <Plus className="h-4 w-4 text-[#5483B3]" /> Upload Dokumen
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsAddingLink(!isAddingLink)}
                          className={`w-full h-12 rounded-xl border-dashed border-[var(--border)] hover:bg-[var(--muted)] text-xs font-bold gap-2 ${isAddingLink ? 'bg-[#5483B3]/5 text-[#5483B3] border-[#5483B3]/30' : ''}`}
                        >
                          <Plus className="h-4 w-4 text-[#5483B3]" /> Link Referensi
                        </Button>
                     </div>

                     {isAddingLink && (
                       <div className="flex gap-2 animate-in slide-in-from-top-2">
                          <Input 
                            value={newLink}
                            onChange={(e) => setNewLink(e.target.value)}
                            placeholder="https://..."
                            className="bg-[var(--card)] border-[var(--border)] h-10 rounded-xl text-xs flex-1"
                          />
                          <Button onClick={addLink} className="bg-[#5483B3] hover:bg-[#5483B3]/95 text-white text-xs font-bold rounded-xl px-4">Add</Button>
                       </div>
                     )}

                     <div className="space-y-2">
                        {topicMaterials.map((mat, idx) => (
                           <div key={idx} className="flex items-center justify-between p-3 bg-[var(--muted)]/50 border border-[var(--border)] rounded-xl group text-xs">
                              <div className="flex items-center gap-3 overflow-hidden min-w-0">
                                 <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${mat.type === 'file' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                    {mat.type === 'file' ? <FileText className="h-4 w-4" /> : <Paperclip className="h-4 w-4" />}
                                 </div>
                                 <p className="font-semibold truncate text-[var(--foreground)]">{mat.name}</p>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 hover:text-red-500 transition-colors shrink-0"
                                onClick={() => setTopicMaterials(topicMaterials.filter((_, i) => i !== idx))}
                              >
                                 <Trash2 className="h-4 w-4" />
                              </Button>
                           </div>
                        ))}
                     </div>
                  </CardContent>
               </Card>

               <div className="p-5 bg-[var(--muted)]/40 border border-[var(--border)] border-l-4 border-l-[#5483B3] rounded-2xl text-xs">
                  <p className="font-bold text-[#5483B3] mb-1">Catatan Pengajar:</p>
                  <p className="text-[var(--muted-foreground)] leading-relaxed">Siswa dapat langsung mengunduh lampiran materi Anda pada halaman subjek mereka dan melacak progres pengerjaan.</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Classroom Detail View (Teacher perspective)
  if (selectedSubject) {
    const currentPosts = classroomPosts[selectedSubject.id] || []
    
    return (
      <div className="space-y-6">
        {/* Detail Header / Top Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[var(--border)]">
          <Button 
            variant="ghost" 
            onClick={() => {
              setSelectedSubject(null)
              setActiveTab('stream')
            }}
            className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] p-0 h-auto font-semibold text-xs gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Kelas
          </Button>

          {/* Navigation Tabs */}
          <div className="flex gap-1 bg-[var(--muted)] p-1 rounded-xl w-full sm:w-auto">
            {(['stream', 'classwork', 'people'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === tab 
                    ? 'bg-[var(--card)] text-[#5483B3] shadow-sm' 
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                }`}
              >
                {tab === 'stream' ? 'Stream' : tab === 'classwork' ? 'Tugas Kelas' : 'Anggota'}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'stream' && (
            <motion.div
              key="stream"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Classroom Hero Banner */}
              <div 
                className="relative rounded-2xl p-8 md:p-12 text-white overflow-hidden shadow-md"
                style={getBannerPattern(selectedSubject.color)}
              >
                <div className="relative z-10 max-w-2xl">
                  <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight drop-shadow-sm">{selectedSubject.name}</h1>
                  <p className="text-white/80 text-sm md:text-base mt-2 font-medium">
                    Kode Kelas: <span className="font-mono bg-black/10 px-2 py-0.5 rounded border border-white/10">{selectedSubject.id.substring(0, 8)}</span>
                  </p>
                  {selectedSubject.description && (
                    <p className="text-white/70 text-xs md:text-sm mt-4 italic line-clamp-2 max-w-xl font-medium bg-black/10 p-3 rounded-lg border border-white/5 backdrop-blur-sm">
                      "{selectedSubject.description}"
                    </p>
                  )}
                </div>
              </div>

              {/* Main Content Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left Sidebar (Class Status info) */}
                <div className="lg:col-span-1 space-y-4">
                  <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">Status Kelas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-xs">
                      <div className="flex justify-between items-center text-[var(--muted-foreground)]">
                        <span>Total Bab</span>
                        <span className="font-bold text-[var(--foreground)]">{selectedSubject.topics?.length || 0}</span>
                      </div>
                      <div className="flex justify-between items-center text-[var(--muted-foreground)] pt-2 border-t border-[var(--border)]">
                        <span>Tugas Kelas</span>
                        <span className="font-bold text-[var(--foreground)]">{selectedSubject.assignments?.length || 0}</span>
                      </div>
                      <div className="flex justify-between items-center text-[var(--muted-foreground)] pt-2 border-t border-[var(--border)]">
                        <span>Siswa Terdaftar</span>
                        <span className="font-bold text-[#5483B3]">{enrolledStudents.length} siswa</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Stream Feed Area */}
                <div className="lg:col-span-3 space-y-4">
                  {/* Share Announcement Card */}
                  <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-sm overflow-hidden">
                    <CardContent className="p-4">
                      {isPosting ? (
                        <form onSubmit={handlePostAnnouncement} className="space-y-3">
                          <Textarea
                            value={newAnnouncement}
                            onChange={(e) => setNewAnnouncement(e.target.value)}
                            placeholder={`Umumkan sesuatu ke kelas ${selectedSubject.name}...`}
                            className="bg-[var(--muted)] border-[var(--border)] min-h-[100px] text-xs resize-none rounded-xl"
                            required
                          />
                          <div className="flex justify-end gap-2">
                            <Button 
                              type="button" 
                              variant="ghost" 
                              onClick={() => {
                                setIsPosting(false)
                                setNewAnnouncement('')
                              }}
                              className="text-xs"
                            >
                              Batal
                            </Button>
                            <Button type="submit" className="bg-[#5483B3] hover:bg-[#5483B3]/90 text-white text-xs gap-1.5 rounded-xl px-4">
                              <Send className="h-3 w-3" /> Posting
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <div 
                          onClick={() => setIsPosting(true)} 
                          className="flex items-center gap-3 cursor-pointer p-2 hover:bg-[var(--muted)]/50 rounded-xl transition-all"
                        >
                          <Avatar className="h-8 w-8 border border-[var(--border)]">
                            <AvatarFallback className="bg-[var(--muted)] text-[10px] font-bold text-[var(--muted-foreground)]">G</AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-[var(--muted-foreground)] font-medium">Umumkan sesuatu ke kelas Anda...</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Stream Posts */}
                  <div className="space-y-4">
                    {currentPosts.map((post: any) => (
                      <Card key={post.id} className="bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-sm overflow-hidden">
                        <CardContent className="p-5 space-y-4">
                          {/* Post Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 border border-[var(--border)]">
                                <AvatarFallback className="bg-[#5483B3]/10 text-[#5483B3] text-xs font-bold">
                                  G
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="text-xs font-bold text-[var(--foreground)]">{post.author.name}</h4>
                                <p className="text-[10px] text-[var(--muted-foreground)] font-medium mt-0.5">
                                  {new Date(post.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--muted-foreground)]">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Post Content */}
                          <div className="text-xs leading-relaxed text-[var(--foreground)] whitespace-pre-wrap">
                            {post.type === 'ASSIGNMENT_NOTIFICATION' ? (
                              <div className="space-y-3">
                                <p>
                                  <span className="font-bold">{post.author.name}</span> {post.content}
                                </p>
                                <div 
                                  onClick={() => {
                                    setActiveTab('classwork')
                                    toggleExpandItem(`assignment-${post.assignment.id}`)
                                  }}
                                  className="flex items-center justify-between p-4 bg-[var(--muted)] border border-[var(--border)] rounded-xl hover:border-[#5483B3]/40 cursor-pointer group transition-all"
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="h-10 w-10 bg-[#5483B3]/10 rounded-lg flex items-center justify-center text-[#5483B3]">
                                      <ClipboardList className="h-5 w-5" />
                                    </div>
                                    <div className="min-w-0">
                                      <p className="font-bold truncate text-[var(--foreground)] group-hover:text-[#5483B3] transition-colors">{post.assignment.title}</p>
                                      <p className="text-[10px] text-[var(--muted-foreground)] font-medium mt-0.5 flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        Tenggat: {new Date(post.assignment.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                      </p>
                                    </div>
                                  </div>
                                  <ChevronRight className="h-4 w-4 text-[var(--muted-foreground)] group-hover:translate-x-1 transition-transform" />
                                </div>
                              </div>
                            ) : post.type === 'TOPIC_NOTIFICATION' ? (
                              <div className="space-y-3">
                                <p>
                                  <span className="font-bold">{post.author.name}</span> {post.content}
                                </p>
                                <div 
                                  onClick={() => {
                                    setActiveTab('classwork')
                                  }}
                                  className="flex items-center justify-between p-4 bg-[var(--muted)] border border-[var(--border)] rounded-xl hover:border-[#5483B3]/40 cursor-pointer group transition-all"
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="h-10 w-10 bg-[#22C55E]/10 rounded-lg flex items-center justify-center text-[#22C55E]">
                                      <BookOpen className="h-5 w-5" />
                                    </div>
                                    <div className="min-w-0">
                                      <p className="font-bold truncate text-[var(--foreground)] group-hover:text-[#5483B3] transition-colors">{post.topic.name}</p>
                                      <p className="text-[10px] text-[var(--muted-foreground)] font-medium mt-0.5">
                                        Materi Kelas • {post.topic.estimatedHours} jam belajar
                                      </p>
                                    </div>
                                  </div>
                                  <ChevronRight className="h-4 w-4 text-[var(--muted-foreground)] group-hover:translate-x-1 transition-transform" />
                                </div>
                              </div>
                            ) : (
                              <p className="font-medium text-[var(--foreground)]">{post.content}</p>
                            )}
                          </div>

                          {/* Comments Section */}
                          <div className="pt-4 border-t border-[var(--border)] space-y-4">
                            {post.comments?.length > 0 && (
                              <div className="space-y-3">
                                {post.comments.map((comment: any) => (
                                  <div key={comment.id} className="flex gap-3 text-xs">
                                    <Avatar className="h-6 w-6 border border-[var(--border)]">
                                      <AvatarFallback className="bg-[var(--muted)] text-[8px] font-bold text-[var(--muted-foreground)]">
                                        {comment.author.name?.[0]}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="bg-[var(--muted)]/50 p-2.5 rounded-xl flex-1 border border-[var(--border)]/30">
                                      <div className="flex justify-between items-center">
                                        <span className="font-bold text-[var(--foreground)]">{comment.author.name}</span>
                                        <span className="text-[8px] text-[var(--muted-foreground)]">
                                          {new Date(comment.createdAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                      </div>
                                      <p className="text-[var(--foreground)]/90 mt-1 font-medium leading-relaxed">{comment.content}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Add Comment Box */}
                            <form 
                              onSubmit={(e) => {
                                e.preventDefault()
                                const form = e.target as HTMLFormElement
                                const input = form.elements.namedItem('commentText') as HTMLInputElement
                                handlePostComment(post.id, input.value)
                                form.reset()
                              }}
                              className="flex gap-2"
                            >
                              <Input
                                name="commentText"
                                placeholder="Balas komentar kelas..."
                                className="bg-[var(--muted)]/50 border-[var(--border)] text-xs h-9 rounded-xl focus-visible:ring-1 flex-1"
                                required
                              />
                              <Button type="submit" size="icon" className="h-9 w-9 bg-[#5483B3] hover:bg-[#5483B3]/90 text-white rounded-xl">
                                <Send className="h-3.5 w-3.5" />
                              </Button>
                            </form>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'classwork' && (
            <motion.div
              key="classwork"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Teacher Actions Bar */}
              <div className="flex justify-between items-center bg-[var(--card)] border border-[var(--border)] p-4 rounded-2xl shadow-sm">
                <p className="text-xs text-[var(--muted-foreground)] font-medium">Buat kurikulum bab pembelajaran atau tugas kelas Anda di sini.</p>
                <div className="flex gap-2">
                   <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                         <Button className="bg-[#5483B3] hover:bg-[#5483B3]/90 text-white rounded-xl font-bold text-xs h-11 px-6 shadow-sm gap-2">
                            <Plus className="h-4 w-4" /> Buat Konten
                         </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[var(--card)] border-[var(--border)] rounded-xl text-xs">
                         <DropdownMenuItem 
                           onClick={() => setIsAddTopicOpen(true)}
                           className="font-bold cursor-pointer"
                         >
                           <BookOpenCheck className="h-4 w-4 mr-2 text-[#5483B3]" /> Tambah Bab / Topik
                         </DropdownMenuItem>
                         {canEditMaterials && (
                           <DropdownMenuItem 
                             onClick={openAddMaterial}
                             className="font-bold cursor-pointer"
                           >
                             <FileText className="h-4 w-4 mr-2 text-emerald-500" /> Tambah Materi Pembelajaran
                           </DropdownMenuItem>
                         )}
                         <DropdownMenuItem className="font-bold cursor-pointer" asChild>
                           <a href="/dashboard/tugas-guru" className="flex items-center w-full">
                             <ClipboardList className="h-4 w-4 mr-2 text-indigo-500" /> Buat Tugas Baru
                           </a>
                         </DropdownMenuItem>
                      </DropdownMenuContent>
                   </DropdownMenu>

                   <Dialog open={isAddTopicOpen} onOpenChange={setIsAddTopicOpen}>
                      <DialogContent className="bg-[var(--card)] border-[var(--border)] rounded-2xl text-[var(--foreground)] max-w-md shadow-lg">
                         <DialogHeader>
                            <DialogTitle className="text-lg font-bold">Tambah Topik / Bab Baru</DialogTitle>
                            <DialogDescription className="text-xs text-[var(--muted-foreground)] mt-1">Buat bab atau materi utama baru untuk mata pelajaran ini.</DialogDescription>
                         </DialogHeader>
                         <form onSubmit={handleAddTopic} className="space-y-6 py-4">
                            <div className="space-y-2">
                               <Label className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Nama Topik / Bab</Label>
                               <Input 
                                 required
                                 value={newTopic.name}
                                 onChange={(e) => setNewTopic({...newTopic, name: e.target.value})}
                                 className="bg-[var(--muted)] border-[var(--border)] rounded-xl h-11 text-xs font-semibold focus-visible:ring-1"
                                 placeholder="Contoh: Pemrograman Berorientasi Objek"
                               />
                            </div>
                            <Button type="submit" disabled={isSubmitting} className="w-full h-11 bg-[#5483B3] hover:bg-[#5483B3]/90 text-white font-bold rounded-xl text-xs">
                               {isSubmitting ? 'Menyimpan...' : 'Buat Topik Baru'}
                            </Button>
                         </form>
                      </DialogContent>
                   </Dialog>
                </div>
              </div>

              {/* General/Topicless Assignments (if any) */}
              {getGeneralAssignments().length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-[var(--muted-foreground)] uppercase tracking-wider">Tugas Tanpa Topik</h3>
                  <div className="space-y-2">
                    {getGeneralAssignments().map((as: any) => {
                      const isExpanded = !!expandedItems[`assignment-${as.id}`]
                      const submissionCount = as.submissions?.length || 0

                      return (
                        <Card key={as.id} className="bg-[var(--card)] border-[var(--border)] rounded-2xl overflow-hidden hover:border-[#5483B3]/25 transition-all shadow-sm">
                          <div 
                            onClick={() => toggleExpandItem(`assignment-${as.id}`)}
                            className="p-4 flex items-center justify-between cursor-pointer hover:bg-[var(--muted)]/20"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="h-9 w-9 bg-[#5483B3]/10 rounded-xl flex items-center justify-center text-[#5483B3] shrink-0">
                                <ClipboardList className="h-4 w-4" />
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-xs font-bold text-[var(--foreground)] truncate">{as.title}</h4>
                                <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">
                                  Tenggat: {new Date(as.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <Badge className="bg-[#5483B3]/10 text-[#5483B3] border-none text-[9px] font-bold rounded-lg px-2 py-0.5">
                                {submissionCount} Diserahkan
                              </Badge>
                              {isExpanded ? <ChevronUp className="h-4 w-4 text-[var(--muted-foreground)]" /> : <ChevronDown className="h-4 w-4 text-[var(--muted-foreground)]" />}
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="p-5 border-t border-[var(--border)] bg-[var(--muted)]/10 space-y-4">
                              <div className="text-xs leading-relaxed text-[var(--muted-foreground)]">
                                {as.description}
                              </div>

                              <div className="flex justify-between items-center pt-3 border-t border-[var(--border)]/50 text-[10px] text-[var(--muted-foreground)]">
                                <span>Nilai Maks: <strong>{as.maxScore}</strong></span>
                                <a href="/dashboard/tugas-guru">
                                  <Button size="sm" className="bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)] text-[10px] h-8 rounded-lg">
                                    Kelola Nilai & Tugas
                                  </Button>
                                </a>
                              </div>
                            </div>
                          )}
                        </Card>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Materi Pembelajaran Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[var(--muted-foreground)] uppercase tracking-wider">Materi Pembelajaran</h3>
                {selectedSubject.materials && selectedSubject.materials.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {selectedSubject.materials.map((mat: any) => {
                      let parsedAttachments = []
                      if (mat.attachments) {
                        try {
                          parsedAttachments = typeof mat.attachments === 'string'
                            ? JSON.parse(mat.attachments)
                            : mat.attachments
                        } catch (e) {
                          parsedAttachments = []
                        }
                      }
                      const classLabel = mat.class?.name || 'Semua Kelas'
                      const isExpanded = !!expandedItems[`material-obj-${mat.id}`]
                      
                      return (
                        <Card key={mat.id} className="bg-[var(--card)] border-[var(--border)] rounded-2xl overflow-hidden hover:border-[#5483B3]/25 transition-all shadow-sm animate-in fade-in duration-200">
                          <div 
                            onClick={() => toggleExpandItem(`material-obj-${mat.id}`)}
                            className="p-4 flex items-center justify-between cursor-pointer hover:bg-[var(--muted)]/20"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="h-9 w-9 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                                <FileText className="h-4 w-4" />
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-xs font-bold text-[var(--foreground)] truncate">{mat.title}</h4>
                                <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">
                                  Kelas: {classLabel} • Status: <span className="font-semibold">{mat.status}</span>
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                              {canEditMaterials && (
                                <>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => openEditMaterial(mat)}
                                    className="h-8 w-8 text-[var(--muted-foreground)] hover:text-[#5483B3]"
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handleDeleteMaterial(mat.id)}
                                    className="h-8 w-8 text-[var(--muted-foreground)] hover:text-red-500"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleExpandItem(`material-obj-${mat.id}`)}
                                className="h-8 w-8 text-[var(--muted-foreground)]"
                              >
                                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="p-5 border-t border-[var(--border)] bg-[var(--muted)]/10 space-y-4 text-xs">
                              {mat.description && (
                                <div className="text-[var(--muted-foreground)] leading-relaxed whitespace-pre-wrap">
                                  {mat.description}
                                </div>
                              )}
                              
                              {parsedAttachments && parsedAttachments.length > 0 && (
                                <div className="space-y-2 pt-2 border-t border-[var(--border)]/50">
                                  <p className="font-bold text-[var(--muted-foreground)] uppercase tracking-wider text-[10px]">Lampiran:</p>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {parsedAttachments.map((attach: any, idx: number) => (
                                      <div key={idx} className="flex items-center justify-between p-2.5 bg-[var(--card)] border border-[var(--border)] rounded-xl text-xs">
                                        <span className="truncate font-medium pr-2">{attach.name}</span>
                                        <a href={attach.url} target="_blank" rel="noopener noreferrer">
                                          <Button size="sm" variant="outline" className="h-7 text-[10px] rounded-lg">Buka</Button>
                                        </a>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </Card>
                      )
                    })}
                  </div>
                ) : (
                  <div className="py-6 text-center border border-dashed border-[var(--border)] rounded-2xl opacity-50 bg-[var(--card)]">
                    <Info className="h-6 w-6 mx-auto mb-2 text-[var(--muted-foreground)]" />
                    <p className="text-[10px] text-[var(--muted-foreground)] font-bold uppercase tracking-wider">Belum ada materi pembelajaran mandiri</p>
                  </div>
                )}
              </div>

              {/* Topics / Curriculum Accordion List */}
              <div className="space-y-6">
                {selectedSubject.topics.sort((a: any, b: any) => a.order - b.order).map((topic: any, i: number) => {
                  const items = getTopicItems(topic)

                  return (
                    <div key={topic.id} className="space-y-3">
                      {/* Topic Header bar */}
                      <div className="flex justify-between items-center border-b border-[#5483B3]/25 pb-2">
                        <div className="flex items-center gap-2">
                          <BookOpenCheck className="h-4.5 w-4.5 text-[#5483B3]" />
                          <h3 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider">{topic.name}</h3>
                          {topic.isLocked ? (
                            <Badge className="bg-red-500/10 text-red-500 border-none text-[8px] font-bold uppercase px-2 py-0.5 rounded-lg flex items-center gap-1">
                              <Lock className="h-3 w-3" /> Draft
                            </Badge>
                          ) : (
                            <Badge className="bg-green-500/10 text-green-500 border-none text-[8px] font-bold uppercase px-2 py-0.5 rounded-lg flex items-center gap-1">
                              <Unlock className="h-3 w-3" /> Published
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setActiveArticleTopic(topic)
                              setTopicMaterials(topic.materials || [])
                            }}
                            className="text-[10px] font-bold text-[#5483B3] hover:bg-[#5483B3]/5 h-8 px-3 rounded-lg flex items-center gap-1"
                          >
                            <Edit3 className="h-3.5 w-3.5" /> Kelola Artikel
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => confirmDelete(topic.id)}
                            className="h-8 w-8 text-[var(--muted-foreground)] hover:text-red-500 rounded-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Items under this topic */}
                      <div className="space-y-2">
                        {items.length > 0 ? (
                          items.map((item: any) => {
                            const isAssignment = item.itemType === 'ASSIGNMENT'
                            const isExpanded = !!expandedItems[item.itemId]
                            const submissionCount = isAssignment ? (item.submissions?.length || 0) : 0

                            return (
                              <Card key={item.itemId} className="bg-[var(--card)] border-[var(--border)] rounded-2xl overflow-hidden hover:border-[#5483B3]/25 transition-all shadow-sm">
                                <div 
                                  onClick={() => toggleExpandItem(item.itemId)}
                                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-[var(--muted)]/20"
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                                      isAssignment ? 'bg-[#5483B3]/10 text-[#5483B3]' : 'bg-[#22C55E]/10 text-[#22C55E]'
                                    }`}>
                                      {isAssignment ? <ClipboardList className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                                    </div>
                                    <div className="min-w-0">
                                      <h4 className="text-xs font-semibold text-[var(--foreground)] truncate">{item.title}</h4>
                                      <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">
                                        {isAssignment 
                                          ? `Tenggat: ${new Date(item.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}`
                                          : `Materi Pelajaran • ${item.type === 'file' ? 'Dokumen' : 'Link Web'}`
                                        }
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-3 shrink-0">
                                    {isAssignment && (
                                      <Badge className="bg-[#5483B3]/10 text-[#5483B3] border-none text-[9px] font-bold rounded-lg px-2 py-0.5">
                                        {submissionCount} Diserahkan
                                      </Badge>
                                    )}
                                    {isExpanded ? <ChevronUp className="h-4 w-4 text-[var(--muted-foreground)]" /> : <ChevronDown className="h-4 w-4 text-[var(--muted-foreground)]" />}
                                  </div>
                                </div>

                                {isExpanded && (
                                  <div className="p-5 border-t border-[var(--border)] bg-[var(--muted)]/10 space-y-4 text-xs">
                                    {isAssignment ? (
                                      <>
                                        <div className="text-[var(--muted-foreground)] leading-relaxed">
                                          {item.description || 'Tidak ada deskripsi instruksi.'}
                                        </div>
                                        <div className="flex justify-between items-center pt-3 border-t border-[var(--border)]/50 text-[10px] text-[var(--muted-foreground)]">
                                          <span>Nilai Maks: <strong>{item.maxScore}</strong></span>
                                          <a href="/dashboard/tugas-guru">
                                            <Button size="sm" className="bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)] text-[10px] h-8 rounded-lg">
                                              Kelola Penilaian
                                            </Button>
                                          </a>
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        {topic.description && (
                                          <div className="text-[var(--muted-foreground)] leading-relaxed italic border-l-2 border-[#5483B3] pl-3 mb-4">
                                            "{topic.description}"
                                          </div>
                                        )}
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                          <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 bg-[var(--muted)] rounded-lg flex items-center justify-center text-[var(--muted-foreground)]">
                                              {item.type === 'file' ? <FileText className="h-4 w-4" /> : <Paperclip className="h-4 w-4" />}
                                            </div>
                                            <div>
                                              <p className="font-semibold text-[var(--foreground)]">{item.name}</p>
                                              <p className="text-[9px] text-[var(--muted-foreground)]">{item.type === 'file' ? 'Format File' : 'URL Referensi'}</p>
                                            </div>
                                          </div>

                                          <a 
                                            href={item.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                          >
                                            <Button variant="outline" className="border-[var(--border)] text-xs h-9 gap-1.5 rounded-xl hover:bg-[var(--muted)]">
                                              {item.type === 'file' ? 'Buka File' : 'Kunjungi URL'}
                                            </Button>
                                          </a>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                )}
                              </Card>
                            )
                          })
                        ) : (
                          <div className="py-6 text-center border border-dashed border-[var(--border)] rounded-2xl opacity-50 bg-[var(--card)]">
                            <Info className="h-6 w-6 mx-auto mb-2 text-[var(--muted-foreground)]" />
                            <p className="text-[10px] text-[var(--muted-foreground)] font-bold uppercase tracking-wider">Belum ada materi atau tugas di bab ini</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'people' && (
            <motion.div
              key="people"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              {/* Teacher section */}
              <div className="space-y-4">
                <div className="border-b border-[#5483B3]/20 pb-3 flex justify-between items-center">
                  <h2 className="text-lg font-bold text-[#5483B3]">Pengajar</h2>
                  <Users2 className="h-5 w-5 text-[var(--muted-foreground)]" />
                </div>

                <div className="flex items-center gap-3 p-4 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm">
                  <Avatar className="h-10 w-10 border border-[#5483B3]/20">
                    <AvatarFallback className="bg-[#5483B3]/10 text-[#5483B3] text-sm font-bold">G</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-xs font-bold text-[var(--foreground)]">Saya (Guru Pengampu)</h4>
                    <p className="text-[10px] text-[var(--muted-foreground)] font-semibold mt-0.5">Pemilik Kelas / Pengajar Utama</p>
                  </div>
                </div>
              </div>

              {/* Registered Students Section */}
              <div className="space-y-4">
                <div className="border-b border-[var(--border)] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-[var(--foreground)]">Siswa Terdaftar</h2>
                    <Badge variant="outline" className="text-[10px] font-bold rounded-lg bg-[var(--muted)]/50 border-[var(--border)] text-[var(--muted-foreground)] px-2.5 py-0.5">
                      {enrolledStudents.length} Siswa
                    </Badge>
                  </div>

                  <div className="relative w-full sm:w-[260px]">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--muted-foreground)]" />
                    <Input
                      value={peopleSearch}
                      onChange={(e) => setPeopleSearch(e.target.value)}
                      placeholder="Cari siswa terdaftar..."
                      className="pl-9 bg-[var(--card)] border-[var(--border)] text-xs h-9 rounded-xl focus-visible:ring-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student: any) => (
                      <div 
                        key={student.id} 
                        className="flex items-center justify-between p-3 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm hover:border-[#5483B3]/25 transition-all group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar className="h-8 w-8 border border-[var(--border)] group-hover:border-[#5483B3]/40 transition-all">
                            {student.image && <AvatarImage src={student.image} />}
                            <AvatarFallback className="bg-[var(--muted)] text-[10px] font-bold text-[var(--muted-foreground)]">
                              {student.name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <h4 className="text-xs font-semibold text-[var(--foreground)] truncate">{student.name}</h4>
                            <p className="text-[9px] text-[var(--muted-foreground)] font-medium">NIS: {student.nis || '-'}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center border border-dashed border-[var(--border)] rounded-2xl opacity-40 bg-[var(--card)]">
                      <Users2 className="h-8 w-8 mx-auto mb-2 text-[var(--muted-foreground)]" />
                      <p className="text-xs text-[var(--muted-foreground)] font-bold">Tidak ada siswa terdaftar yang ditemukan</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation AlertDialog */}
        <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
           <AlertDialogContent className="bg-[var(--card)] border-[var(--border)] rounded-2xl text-[var(--foreground)]">
              <AlertDialogHeader>
                 <AlertDialogTitle className="text-lg font-bold">Hapus Bab / Topik ini?</AlertDialogTitle>
                 <AlertDialogDescription className="text-xs text-[var(--muted-foreground)] leading-relaxed mt-1">
                    Tindakan ini akan menghapus seluruh materi, lampiran, dan kisi-kisi di dalam topik ini secara permanen dari basis data. Siswa tidak akan bisa lagi mengakses materi ini.
                 </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-6 gap-3">
                 <AlertDialogCancel className="rounded-xl border-[var(--border)] bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]/80 font-bold text-xs h-11 flex-1">
                    Batal
                 </AlertDialogCancel>
                 <AlertDialogAction 
                   onClick={handleDeleteTopic}
                   className="rounded-xl bg-red-600 text-white hover:bg-red-700 font-bold text-xs h-11 flex-1 border-none"
                 >
                    Ya, Hapus Permanen
                 </AlertDialogAction>
              </AlertDialogFooter>
           </AlertDialogContent>
        </AlertDialog>

        {/* Add Material Dialog */}
        <Dialog open={isAddMaterialOpen} onOpenChange={setIsAddMaterialOpen}>
          <DialogContent className="bg-[var(--card)] border-[var(--border)] rounded-2xl text-[var(--foreground)] max-w-md shadow-lg">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Tambah Materi Pembelajaran Baru</DialogTitle>
              <DialogDescription className="text-xs text-[var(--muted-foreground)] mt-1">
                Unggah materi, modul, atau referensi digital untuk kelas ini.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddMaterial} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Judul Materi</Label>
                <Input
                  required
                  value={materialFormData.title}
                  onChange={(e) => setMaterialFormData({ ...materialFormData, title: e.target.value })}
                  className="bg-[var(--muted)]/50 border-[var(--border)] rounded-xl h-11 text-xs font-semibold focus-visible:ring-1"
                  placeholder="Contoh: Modul Dasar JavaScript"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Deskripsi / Penjelasan</Label>
                <Textarea
                  value={materialFormData.description}
                  onChange={(e) => setMaterialFormData({ ...materialFormData, description: e.target.value })}
                  className="bg-[var(--muted)]/50 border-[var(--border)] rounded-xl min-h-[100px] text-xs resize-none font-semibold focus-visible:ring-1"
                  placeholder="Deskripsikan isi materi ini..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Sasaran Kelas</Label>
                  <Select
                    value={materialFormData.classId || 'all'}
                    onValueChange={(val) => setMaterialFormData({ ...materialFormData, classId: val })}
                  >
                    <SelectTrigger className="bg-[var(--muted)]/50 border-[var(--border)] rounded-xl h-11 text-xs">
                      <SelectValue placeholder="Semua Kelas" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--card)] border-[var(--border)] rounded-xl">
                      <SelectItem value="all" className="text-xs">Semua Kelas</SelectItem>
                      {classes.map((cls: any) => (
                        <SelectItem key={cls.id} value={cls.id} className="text-xs">{cls.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Status Awal</Label>
                  <Select
                    value={materialFormData.status}
                    onValueChange={(val) => setMaterialFormData({ ...materialFormData, status: val })}
                  >
                    <SelectTrigger className="bg-[var(--muted)]/50 border-[var(--border)] rounded-xl h-11 text-xs">
                      <SelectValue placeholder="Belum Ditugaskan" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--card)] border-[var(--border)] rounded-xl">
                      <SelectItem value="BELUM_DITUGASKAN" className="text-xs">Belum Ditugaskan</SelectItem>
                      <SelectItem value="PROGRESS" className="text-xs">Progress</SelectItem>
                      <SelectItem value="SELESAI" className="text-xs">Selesai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Attachments Section */}
              <div className="space-y-3 pt-2">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Lampiran URL (Opsional)</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Nama Lampiran"
                    value={newMatAttachName}
                    onChange={(e) => setNewMatAttachName(e.target.value)}
                    className="bg-[var(--muted)]/50 border-[var(--border)] rounded-xl h-10 text-xs flex-1"
                  />
                  <Input
                    placeholder="https://..."
                    value={newMatAttachUrl}
                    onChange={(e) => setNewMatAttachUrl(e.target.value)}
                    className="bg-[var(--muted)]/50 border-[var(--border)] rounded-xl h-10 text-xs flex-1"
                  />
                  <Button 
                    type="button" 
                    onClick={addMaterialAttachment}
                    className="bg-[#5483B3] hover:bg-[#5483B3]/90 text-white rounded-xl text-xs font-bold px-3 h-10"
                  >
                    Tambah
                  </Button>
                </div>

                {materialFormData.attachments && materialFormData.attachments.length > 0 && (
                  <div className="space-y-1.5 max-h-32 overflow-y-auto pt-1">
                    {materialFormData.attachments.map((attach, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-[var(--muted)]/50 border border-[var(--border)] rounded-lg text-[11px]">
                        <span className="font-semibold truncate max-w-[200px]">{attach.name}</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-red-500 hover:bg-red-500/10 rounded"
                          onClick={() => removeMaterialAttachment(idx)}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full h-11 bg-[#5483B3] hover:bg-[#5483B3]/90 text-white font-bold rounded-xl text-xs mt-4">
                {isSubmitting ? 'Menyimpan...' : 'Simpan Materi'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Material Dialog */}
        <Dialog open={isEditMaterialOpen} onOpenChange={setIsEditMaterialOpen}>
          <DialogContent className="bg-[var(--card)] border-[var(--border)] rounded-2xl text-[var(--foreground)] max-w-md shadow-lg">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Edit Materi Pembelajaran</DialogTitle>
              <DialogDescription className="text-xs text-[var(--muted-foreground)] mt-1">
                Perbarui detail atau lampiran materi pembelajaran ini.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditMaterialSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Judul Materi</Label>
                <Input
                  required
                  value={materialFormData.title}
                  onChange={(e) => setMaterialFormData({ ...materialFormData, title: e.target.value })}
                  className="bg-[var(--muted)]/50 border-[var(--border)] rounded-xl h-11 text-xs font-semibold focus-visible:ring-1"
                  placeholder="Contoh: Modul Dasar JavaScript"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Deskripsi / Penjelasan</Label>
                <Textarea
                  value={materialFormData.description}
                  onChange={(e) => setMaterialFormData({ ...materialFormData, description: e.target.value })}
                  className="bg-[var(--muted)]/50 border-[var(--border)] rounded-xl min-h-[100px] text-xs resize-none font-semibold focus-visible:ring-1"
                  placeholder="Deskripsikan isi materi ini..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Sasaran Kelas</Label>
                  <Select
                    value={materialFormData.classId || 'all'}
                    onValueChange={(val) => setMaterialFormData({ ...materialFormData, classId: val })}
                  >
                    <SelectTrigger className="bg-[var(--muted)]/50 border-[var(--border)] rounded-xl h-11 text-xs">
                      <SelectValue placeholder="Semua Kelas" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--card)] border-[var(--border)] rounded-xl">
                      <SelectItem value="all" className="text-xs">Semua Kelas</SelectItem>
                      {classes.map((cls: any) => (
                        <SelectItem key={cls.id} value={cls.id} className="text-xs">{cls.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Status</Label>
                  <Select
                    value={materialFormData.status}
                    onValueChange={(val) => setMaterialFormData({ ...materialFormData, status: val })}
                  >
                    <SelectTrigger className="bg-[var(--muted)]/50 border-[var(--border)] rounded-xl h-11 text-xs">
                      <SelectValue placeholder="Belum Ditugaskan" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--card)] border-[var(--border)] rounded-xl">
                      <SelectItem value="BELUM_DITUGASKAN" className="text-xs">Belum Ditugaskan</SelectItem>
                      <SelectItem value="PROGRESS" className="text-xs">Progress</SelectItem>
                      <SelectItem value="SELESAI" className="text-xs">Selesai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Attachments Section */}
              <div className="space-y-3 pt-2">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Lampiran URL (Opsional)</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Nama Lampiran"
                    value={newMatAttachName}
                    onChange={(e) => setNewMatAttachName(e.target.value)}
                    className="bg-[var(--muted)]/50 border-[var(--border)] rounded-xl h-10 text-xs flex-1"
                  />
                  <Input
                    placeholder="https://..."
                    value={newMatAttachUrl}
                    onChange={(e) => setNewMatAttachUrl(e.target.value)}
                    className="bg-[var(--muted)]/50 border-[var(--border)] rounded-xl h-10 text-xs flex-1"
                  />
                  <Button 
                    type="button" 
                    onClick={addMaterialAttachment}
                    className="bg-[#5483B3] hover:bg-[#5483B3]/90 text-white rounded-xl text-xs font-bold px-3 h-10"
                  >
                    Tambah
                  </Button>
                </div>

                {materialFormData.attachments && materialFormData.attachments.length > 0 && (
                  <div className="space-y-1.5 max-h-32 overflow-y-auto pt-1">
                    {materialFormData.attachments.map((attach, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-[var(--muted)]/50 border border-[var(--border)] rounded-lg text-[11px]">
                        <span className="font-semibold truncate max-w-[200px]">{attach.name}</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-red-500 hover:bg-red-500/10 rounded"
                          onClick={() => removeMaterialAttachment(idx)}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full h-11 bg-[#5483B3] hover:bg-[#5483B3]/90 text-white font-bold rounded-xl text-xs mt-4">
                {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  if (localSubjects.length === 0) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div>
          <p className="text-[#5483B3] font-bold uppercase tracking-wider text-xs">Teacher Dashboard</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)] mt-1">Materi & Kelas Saya</h1>
          <p className="text-xs text-[var(--muted-foreground)] mt-1.5">Kelola kelas pengajaran, publikasikan kurikulum bab, dan bagikan lampiran belajar digital.</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 px-6 text-center bg-[var(--card)] border border-[var(--border)] rounded-3xl shadow-xl glass max-w-2xl mx-auto space-y-6"
        >
          <div className="h-16 w-16 bg-blue-500/10 text-[#5483B3] rounded-full flex items-center justify-center">
            <BookOpen className="h-8 w-8 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-[var(--foreground)]">Belum ada materi & kelas saya</h2>
            <p className="text-xs text-[var(--muted-foreground)] max-w-md leading-relaxed">
              Anda belum terdaftar atau ditugaskan ke kelas/mata pelajaran apa pun. Silakan hubungi Administrator untuk menambahkan kelas baru atau menetapkan Anda sebagai pengampu kelas.
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  // Teacher Dashboard Subject Grid view (Google Classroom courses)
  return (
    <div className="space-y-8">
      <div>
        <p className="text-[#5483B3] font-bold uppercase tracking-wider text-xs">Teacher Dashboard</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)] mt-1">Materi & Kelas Saya</h1>
        <p className="text-xs text-[var(--muted-foreground)] mt-1.5">Kelola kelas pengajaran, publikasikan kurikulum bab, dan bagikan lampiran belajar digital.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {localSubjects.map((sub: any, i: number) => {
          const studentCount = sub.userSubjects?.length || 0
          const topicsCount = sub.topics?.length || 0
          const assignmentsCount = sub.assignments?.length || 0

          return (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.3 }}
              className="h-full flex"
            >
              <Card 
                className="bg-[var(--card)] border-[var(--border)] rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col justify-between w-full shadow-sm"
                onClick={() => setSelectedSubject(sub)}
              >
                {/* Banner Header */}
                <div 
                  className="relative p-6 text-white h-[115px] flex flex-col justify-between"
                  style={getBannerPattern(sub.color)}
                >
                  <div className="pr-12">
                    <h3 className="text-lg font-bold tracking-tight line-clamp-1 leading-snug group-hover:underline">
                      {sub.name}
                    </h3>
                    <p className="text-[10px] text-white/80 font-medium mt-1 truncate">
                      {sub.description || 'Tidak ada deskripsi.'}
                    </p>
                  </div>
                  
                  {/* Overlapping Teacher icon avatar */}
                  <Avatar className="absolute right-5 bottom-0 translate-y-1/2 h-12 w-12 border-4 border-[var(--card)] shadow-md bg-white">
                    <AvatarFallback className="bg-[#5483B3]/10 text-[#5483B3] text-xs font-bold uppercase">
                      G
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Card body */}
                <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-5 min-h-[140px] pt-7">
                  {/* Course Quick stats summary */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-[var(--muted)]/40 p-2.5 rounded-xl border border-[var(--border)]/40">
                      <p className="text-base font-extrabold text-[var(--foreground)]">{studentCount}</p>
                      <p className="text-[9px] font-bold text-[var(--muted-foreground)] uppercase mt-0.5">Siswa</p>
                    </div>
                    <div className="bg-[var(--muted)]/40 p-2.5 rounded-xl border border-[var(--border)]/40">
                      <p className="text-base font-extrabold text-[var(--foreground)]">{topicsCount}</p>
                      <p className="text-[9px] font-bold text-[var(--muted-foreground)] uppercase mt-0.5">Bab</p>
                    </div>
                    <div className="bg-[var(--muted)]/40 p-2.5 rounded-xl border border-[var(--border)]/40">
                      <p className="text-base font-extrabold text-[var(--foreground)]">{assignmentsCount}</p>
                      <p className="text-[9px] font-bold text-[var(--muted-foreground)] uppercase mt-0.5">Tugas</p>
                    </div>
                  </div>

                  {/* Card footer details */}
                  <div className="space-y-4 pt-3 border-t border-[var(--border)]">
                    <div className="flex items-center justify-between text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider group-hover:text-[#5483B3] transition-colors">
                      <span className="flex items-center gap-1.5">
                        <GraduationCap className="h-4 w-4" />
                        Kelola Bab & Materi
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
