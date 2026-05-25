'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, 
  User, 
  CheckCircle2, 
  Circle, 
  ChevronRight,
  ArrowLeft,
  Info,
  FileText,
  ExternalLink,
  Download,
  Link as LinkIcon,
  MessageSquare,
  Send,
  MoreVertical,
  Calendar,
  ClipboardList,
  FolderOpen,
  Plus,
  Users2,
  Paperclip,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Search,
  BookOpenCheck
} from 'lucide-react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export function SubjectsClient({ subjects, classmates }: any) {
  const [selectedSubject, setSelectedSubject] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'stream' | 'classwork' | 'people'>('stream')
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const [selectedTopic, setSelectedTopic] = useState<any>(null)
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false)
  
  // Search state for people tab
  const [peopleSearch, setPeopleSearch] = useState('')
  
  // Custom announcements state per subject id
  const [classroomPosts, setClassroomPosts] = useState<Record<string, any[]>>({})
  const [newAnnouncement, setNewAnnouncement] = useState('')
  const [isPosting, setIsPosting] = useState(false)

  // Prepopulate announcements with mock posts and database tasks on subject selection
  useEffect(() => {
    if (selectedSubject) {
      const subjectId = selectedSubject.subject.id
      if (!classroomPosts[subjectId]) {
        const posts: any[] = [
          {
            id: 'welcome-post',
            author: selectedSubject.subject.teacher || { name: 'Guru Pengampu' },
            type: 'ANNOUNCEMENT',
            content: `Selamat datang di kelas ${selectedSubject.subject.name}! Silakan periksa tab "Tugas Kelas" untuk melihat materi kurikulum dan tugas terlampir. Pastikan selalu mencatat progres belajar Anda secara berkala.`,
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            comments: []
          }
        ]

        // Add auto notifications for assignments
        const assignments = selectedSubject.subject.assignments || []
        assignments.forEach((as: any, idx: number) => {
          posts.push({
            id: `auto-assignment-${as.id}`,
            author: selectedSubject.subject.teacher || { name: 'Guru Pengampu' },
            type: 'ASSIGNMENT_NOTIFICATION',
            content: `memposting tugas baru di bawah modul pembelajaran.`,
            assignment: as,
            createdAt: new Date(as.createdAt || (Date.now() - idx * 12 * 60 * 60 * 1000)),
            comments: []
          })
        })

        // Sort posts by date (newest first)
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
    const subjectId = selectedSubject.subject.id

    const newPost = {
      id: `custom-post-${Date.now()}`,
      author: { name: 'Saya (Siswa)', role: 'STUDENT' },
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
    const subjectId = selectedSubject.subject.id

    const newComment = {
      id: `comment-${Date.now()}`,
      author: { name: 'Saya (Siswa)' },
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

  const getSubjectStats = (sub: any) => {
    const topics = sub.subject.topics || []
    const totalTopics = topics.length
    if (totalTopics === 0) return { percent: 0, completed: 0, total: 0, sessions: 0, hours: 0 }
    
    let completedCount = 0
    let totalSessions = 0
    let totalMinutes = 0

    topics.forEach((t: any) => {
      if (t.logs?.length > 0) {
        completedCount++
        totalSessions += t.logs.length
        totalMinutes += t.logs.reduce((acc: number, l: any) => acc + (l.duration || 0), 0)
      }
    })

    return {
      percent: Math.round((completedCount / totalTopics) * 100),
      completed: completedCount,
      total: totalTopics,
      sessions: totalSessions,
      hours: (totalMinutes / 60).toFixed(1)
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

    const topicAssignments = selectedSubject.subject.assignments?.filter((a: any) => a.topicId === topic.id) || []
    const formattedAssignments = topicAssignments.map((a: any) => ({
      ...a,
      itemId: `assignment-${a.id}`,
      itemType: 'ASSIGNMENT',
      title: a.title,
      createdAt: a.createdAt
    }))

    return [...formattedAssignments, ...materials]
  }

  // Find assignments without topic
  const getGeneralAssignments = () => {
    if (!selectedSubject) return []
    return selectedSubject.subject.assignments?.filter((a: any) => !a.topicId) || []
  }

  // Filter classmates
  const filteredClassmates = classmates?.filter((c: any) => 
    c.name.toLowerCase().includes(peopleSearch.toLowerCase())
  ) || []

  // Geometric banner styling helper
  const getBannerPattern = (color: string) => {
    return {
      backgroundColor: color || '#5483B3',
      backgroundImage: `radial-gradient(circle at 100% 150%, rgba(255,255,255,0.15) 24%, transparent 24%), 
                        radial-gradient(circle at 0% 0%, rgba(255,255,255,0.1) 30%, transparent 30%), 
                        linear-gradient(135deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%)`
    }
  }

  if (selectedSubject) {
    const stats = getSubjectStats(selectedSubject)
    const currentPosts = classroomPosts[selectedSubject.subject.id] || []
    const pendingAssignments = selectedSubject.subject.assignments?.filter((a: any) => 
      !a.submissions || a.submissions.length === 0
    ) || []

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
                style={getBannerPattern(selectedSubject.subject.color)}
              >
                <div className="relative z-10 max-w-2xl">
                  <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight drop-shadow-sm">{selectedSubject.subject.name}</h1>
                  <p className="text-white/80 text-sm md:text-base mt-2 font-medium">
                    Guru: {selectedSubject.subject.teacher?.name || 'Belum ditentukan'}
                  </p>
                  {selectedSubject.subject.description && (
                    <p className="text-white/70 text-xs md:text-sm mt-4 italic line-clamp-2 max-w-xl font-medium bg-black/10 p-3 rounded-lg border border-white/5 backdrop-blur-sm">
                      "{selectedSubject.subject.description}"
                    </p>
                  )}
                </div>
              </div>

              {/* Main Content Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left Sidebar (Upcoming assignments checklist) */}
                <div className="lg:col-span-1 space-y-4">
                  <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">Tugas Mendatang</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {pendingAssignments.length > 0 ? (
                        pendingAssignments.slice(0, 3).map((as: any, idx: number) => (
                          <div key={idx} className="text-xs space-y-1 group">
                            <p className="font-semibold text-[var(--foreground)] group-hover:text-[#5483B3] transition-colors truncate">
                              {as.title}
                            </p>
                            <p className="text-[10px] text-red-500 font-medium flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Tenggat: {new Date(as.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="py-4 text-center">
                          <CheckCircle2 className="h-8 w-8 text-[#22C55E] mx-auto mb-2 opacity-80" />
                          <p className="text-xs text-[var(--muted-foreground)] font-medium">Hore, tidak ada tugas terdekat! 🎉</p>
                        </div>
                      )}
                      {pendingAssignments.length > 0 && (
                        <Button 
                          onClick={() => setActiveTab('classwork')} 
                          variant="ghost" 
                          className="w-full text-left justify-start p-0 h-auto text-xs text-[#5483B3] font-semibold hover:bg-transparent"
                        >
                          Lihat semua tugas
                        </Button>
                      )}
                    </CardContent>
                  </Card>

                  {/* Class Stats Summary */}
                  <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-sm">
                    <CardContent className="p-4 space-y-3 text-xs">
                      <div className="flex justify-between items-center text-[var(--muted-foreground)]">
                        <span>Total Progres</span>
                        <span className="font-bold text-[#5483B3]">{stats.percent}%</span>
                      </div>
                      <Progress value={stats.percent} className="h-2 rounded-full" />
                      <div className="flex justify-between text-[11px] text-[var(--muted-foreground)] pt-1 border-t border-[var(--border)]">
                        <span>Sesi: <strong>{stats.sessions}</strong></span>
                        <span>Estimasi: <strong>{stats.hours} jam</strong></span>
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
                            placeholder={`Umumkan sesuatu ke kelas ${selectedSubject.subject.name}...`}
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
                            <AvatarFallback className="bg-[var(--muted)] text-[10px] font-bold text-[var(--muted-foreground)]">U</AvatarFallback>
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
                                  {post.author.name?.[0] || 'G'}
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
                                {/* Mini Card Link to Assignment */}
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
                            <CommentInput onSubmitComment={(text) => handlePostComment(post.id, text)} />
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
              {/* General/Topicless Assignments (if any) */}
              {getGeneralAssignments().length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-[var(--muted-foreground)] uppercase tracking-wider">Umum</h3>
                  <div className="space-y-2">
                    {getGeneralAssignments().map((as: any) => {
                      const isExpanded = !!expandedItems[`assignment-${as.id}`]
                      const isSubmitted = as.submissions && as.submissions.length > 0
                      const score = isSubmitted ? as.submissions[0].score : null
                      const submissionDate = isSubmitted ? as.submissions[0].submittedAt : null

                      return (
                        <Card key={as.id} className="bg-[var(--card)] border-[var(--border)] rounded-2xl overflow-hidden hover:border-[#5483B3]/20 transition-all shadow-sm">
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
                              {isSubmitted ? (
                                <Badge className="bg-[#22C55E]/10 text-[#22C55E] border-none text-[9px] font-bold rounded-lg px-2 py-0.5">
                                  Diserahkan
                                </Badge>
                              ) : (
                                <Badge className="bg-amber-500/10 text-amber-500 border-none text-[9px] font-bold rounded-lg px-2 py-0.5">
                                  Ditugaskan
                                </Badge>
                              )}
                              {isExpanded ? <ChevronUp className="h-4 w-4 text-[var(--muted-foreground)]" /> : <ChevronDown className="h-4 w-4 text-[var(--muted-foreground)]" />}
                            </div>
                          </div>

                          {/* Expanded Content */}
                          {isExpanded && (
                            <div className="p-5 border-t border-[var(--border)] bg-[var(--muted)]/10 space-y-4">
                              <div className="text-xs leading-relaxed text-[var(--muted-foreground)]">
                                {as.description}
                              </div>

                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-3 border-t border-[var(--border)]/50">
                                <div className="text-[10px] text-[var(--muted-foreground)] space-y-1">
                                  <p>Nilai Maksimal: <strong className="text-[var(--foreground)]">{as.maxScore}</strong></p>
                                  {isSubmitted && (
                                    <p>Nilai Diperoleh: <strong className="text-[#22C55E]">{score !== null ? `${score}/${as.maxScore}` : 'Belum dinilai'}</strong></p>
                                  )}
                                </div>
                                <Button className="bg-[#5483B3] hover:bg-[#5483B3]/90 text-white rounded-xl text-xs font-semibold h-9 px-5 gap-1 shadow-sm">
                                  Buka Tugas <ExternalLink className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </Card>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Topics Curriculum List */}
              <div className="space-y-6">
                {selectedSubject.subject.topics.sort((a: any, b: any) => a.order - b.order).map((topic: any) => {
                  const items = getTopicItems(topic)
                  const completedTopicsLogs = topic.logs || []
                  const isTopicCompleted = completedTopicsLogs.length > 0

                  return (
                    <div key={topic.id} className="space-y-3">
                      {/* Topic Header Section */}
                      <div className="flex justify-between items-center border-b border-[#5483B3]/25 pb-2">
                        <div className="flex items-center gap-2">
                          <BookOpenCheck className="h-4.5 w-4.5 text-[#5483B3]" />
                          <h3 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider">{topic.name}</h3>
                        </div>
                        <div className="flex items-center gap-3">
                          {isTopicCompleted ? (
                            <Badge className="bg-[#22C55E]/10 text-[#22C55E] border-none text-[8px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" /> Selesai Pelajari
                            </Badge>
                          ) : (
                            <Button 
                              variant="ghost"
                              size="sm" 
                              onClick={() => {
                                setSelectedTopic(topic)
                                setIsTopicModalOpen(true)
                              }}
                              className="text-[10px] font-black uppercase text-[#5483B3] hover:bg-[#5483B3]/5 h-7 px-3 rounded-lg"
                            >
                              Catat Belajar
                            </Button>
                          )}
                          <span className="text-[10px] text-[var(--muted-foreground)] font-semibold">{topic.estimatedHours} jam estimasi</span>
                        </div>
                      </div>

                      {/* Topic Items Container */}
                      <div className="space-y-2">
                        {items.length > 0 ? (
                          items.map((item: any) => {
                            const isAssignment = item.itemType === 'ASSIGNMENT'
                            const isExpanded = !!expandedItems[item.itemId]
                            const isSubmitted = isAssignment && item.submissions && item.submissions.length > 0
                            const score = isSubmitted ? item.submissions[0].score : null

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
                                      isSubmitted ? (
                                        <Badge className="bg-[#22C55E]/10 text-[#22C55E] border-none text-[9px] font-bold rounded-lg px-2 py-0.5">
                                          Diserahkan
                                        </Badge>
                                      ) : (
                                        <Badge className="bg-amber-500/10 text-amber-500 border-none text-[9px] font-bold rounded-lg px-2 py-0.5">
                                          Ditugaskan
                                        </Badge>
                                      )
                                    )}
                                    {isExpanded ? <ChevronUp className="h-4 w-4 text-[var(--muted-foreground)]" /> : <ChevronDown className="h-4 w-4 text-[var(--muted-foreground)]" />}
                                  </div>
                                </div>

                                {/* Expanded Detail Drawer */}
                                {isExpanded && (
                                  <div className="p-5 border-t border-[var(--border)] bg-[var(--muted)]/10 space-y-4 text-xs">
                                    {isAssignment ? (
                                      <>
                                        <div className="text-[var(--muted-foreground)] leading-relaxed whitespace-pre-wrap">
                                          {item.description || 'Tidak ada deskripsi instruksi.'}
                                        </div>

                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-3 border-t border-[var(--border)]/50">
                                          <div className="text-[10px] text-[var(--muted-foreground)] space-y-1">
                                            <p>Nilai Maksimal: <strong className="text-[var(--foreground)]">{item.maxScore}</strong></p>
                                            {isSubmitted && (
                                              <p>Nilai Diperoleh: <strong className="text-[#22C55E]">{score !== null ? `${score}/${item.maxScore}` : 'Belum dinilai'}</strong></p>
                                            )}
                                          </div>
                                          <Button className="bg-[#5483B3] hover:bg-[#5483B3]/90 text-white rounded-xl text-xs font-semibold h-9 px-5 gap-1">
                                            Buka Tugas <ExternalLink className="h-3 w-3" />
                                          </Button>
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
                                              {item.type === 'file' ? <FileText className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
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
                                            <Button variant="outline" className="border-[var(--border)] text-xs h-9 gap-1.5 rounded-xl hover:bg-[#22C55E]/5 hover:text-[#22C55E] hover:border-[#22C55E]/20">
                                              {item.type === 'file' ? (
                                                <>Unduh <Download className="h-3.5 w-3.5" /></>
                                              ) : (
                                                <>Buka Link <ExternalLink className="h-3.5 w-3.5" /></>
                                              )}
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
              {/* Teacher Section */}
              <div className="space-y-4">
                <div className="border-b border-[#5483B3]/20 pb-3 flex justify-between items-center">
                  <h2 className="text-lg font-bold text-[#5483B3]">Pengajar</h2>
                  <Users2 className="h-5 w-5 text-[var(--muted-foreground)]" />
                </div>

                <div className="flex items-center gap-3 p-4 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm">
                  <Avatar className="h-10 w-10 border border-[#5483B3]/20">
                    <AvatarFallback className="bg-[#5483B3]/10 text-[#5483B3] text-sm font-bold">
                      {selectedSubject.subject.teacher?.name?.[0] || 'T'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-xs font-bold text-[var(--foreground)]">{selectedSubject.subject.teacher?.name || 'TBA'}</h4>
                    <p className="text-[10px] text-[var(--muted-foreground)] font-semibold mt-0.5">Guru Pengampu Utama</p>
                  </div>
                </div>
              </div>

              {/* Classmates Section */}
              <div className="space-y-4">
                <div className="border-b border-[var(--border)] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-[var(--foreground)]">Teman Sekelas</h2>
                    <Badge variant="outline" className="text-[10px] font-bold rounded-lg bg-[var(--muted)]/50 border-[var(--border)] text-[var(--muted-foreground)] px-2.5 py-0.5">
                      {classmates?.length || 0} Siswa
                    </Badge>
                  </div>

                  {/* Search bar */}
                  <div className="relative w-full sm:w-[260px]">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--muted-foreground)]" />
                    <Input
                      value={peopleSearch}
                      onChange={(e) => setPeopleSearch(e.target.value)}
                      placeholder="Cari nama teman..."
                      className="pl-9 bg-[var(--card)] border-[var(--border)] text-xs h-9 rounded-xl focus-visible:ring-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredClassmates.length > 0 ? (
                    filteredClassmates.map((student: any) => (
                      <div 
                        key={student.id} 
                        className="flex items-center gap-3 p-3 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm hover:border-[#5483B3]/25 transition-all group"
                      >
                        <Avatar className="h-8 w-8 border border-[var(--border)] group-hover:border-[#5483B3]/40 transition-all">
                          {student.image && <AvatarImage src={student.image} />}
                          <AvatarFallback className="bg-[var(--muted)] text-[10px] font-bold text-[var(--muted-foreground)]">
                            {student.name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-[var(--foreground)] truncate">{student.name}</h4>
                          <p className="text-[9px] text-[var(--muted-foreground)] font-medium">Siswa</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center border border-dashed border-[var(--border)] rounded-2xl opacity-40 bg-[var(--card)]">
                      <Users2 className="h-8 w-8 mx-auto mb-2 text-[var(--muted-foreground)]" />
                      <p className="text-xs text-[var(--muted-foreground)] font-bold">Tidak ada rekan kelas ditemukan</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Catat Belajar */}
        <Dialog open={isTopicModalOpen} onOpenChange={setIsTopicModalOpen}>
          <DialogContent className="bg-[var(--card)] border-[var(--border)] rounded-2xl text-[var(--foreground)] max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Catat Progres Belajar</DialogTitle>
              <DialogDescription className="text-xs text-[var(--muted-foreground)] mt-1">
                Catat sesi belajar Anda untuk bab <strong>{selectedTopic?.name}</strong>.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4 text-xs">
              <p className="leading-relaxed text-[var(--muted-foreground)] bg-[var(--muted)]/40 p-3.5 rounded-xl border border-[var(--border)] italic">
                Fitur catat belajar ini akan mencatat aktivitas Anda pada linimasa progres belajar personal Anda.
              </p>
              <div className="flex gap-3">
                <Button 
                  onClick={() => setIsTopicModalOpen(false)} 
                  variant="outline"
                  className="flex-1 rounded-xl h-11 border-[var(--border)] text-xs font-semibold"
                >
                  Batal
                </Button>
                <a href="/dashboard/progress" className="flex-1">
                  <Button className="w-full bg-[#5483B3] hover:bg-[#5483B3]/90 text-white rounded-xl h-11 text-xs font-semibold">
                    Ke Menu Progres
                  </Button>
                </a>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // Dashboard List (Google Classroom Style Courses Grid)
  return (
    <div className="space-y-8">
      <div>
        <p className="text-[#5483B3] font-bold uppercase tracking-wider text-xs">My Classroom</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)] mt-1">Mata Pelajaran & Kelas</h1>
        <p className="text-xs text-[var(--muted-foreground)] mt-1.5">Akses materi pengajaran, tugas, dan berinteraksi dalam ruang kelas Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((sub: any, i: number) => {
          const stats = getSubjectStats(sub)
          const subAssignments = sub.subject.assignments || []
          const pendingSubAssignments = subAssignments.filter((a: any) => 
            !a.submissions || a.submissions.length === 0
          )

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
                  style={getBannerPattern(sub.subject.color)}
                >
                  <div className="pr-12">
                    <h3 className="text-lg font-bold tracking-tight line-clamp-1 leading-snug group-hover:underline">
                      {sub.subject.name}
                    </h3>
                    <p className="text-[10px] text-white/80 font-medium mt-1 truncate">
                      {sub.subject.teacher?.name || 'TBA'}
                    </p>
                  </div>
                  
                  {/* Floating Teacher Avatar overlapping banner */}
                  <Avatar className="absolute right-5 bottom-0 translate-y-1/2 h-12 w-12 border-4 border-[var(--card)] shadow-md bg-white">
                    <AvatarFallback className="bg-[#5483B3]/10 text-[#5483B3] text-xs font-bold uppercase">
                      {sub.subject.teacher?.name?.[0] || 'T'}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Card Content body */}
                <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-5 min-h-[140px] pt-7">
                  {/* Subject Details & Upcoming Tasks */}
                  <div className="space-y-4">
                    {pendingSubAssignments.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">Tugas Terdekat</p>
                        {pendingSubAssignments.slice(0, 2).map((as: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center text-xs group/item">
                            <span className="font-semibold text-[var(--foreground)] truncate max-w-[150px] group-hover/item:text-[#5483B3] transition-colors">{as.title}</span>
                            <span className="text-[9px] font-semibold text-red-500 bg-red-500/5 px-1.5 py-0.5 rounded border border-red-500/10 shrink-0">
                              {new Date(as.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-2.5 text-center bg-[var(--muted)]/30 rounded-xl border border-dashed border-[var(--border)]">
                        <p className="text-[10px] text-[var(--muted-foreground)] font-medium">Bebas tugas! Tidak ada tugas terdekat 🎉</p>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar & Footer info */}
                  <div className="space-y-4 pt-3 border-t border-[var(--border)]">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[9px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
                        <span>Progres Belajar</span>
                        <span className="text-[#5483B3]">{stats.percent}%</span>
                      </div>
                      <Progress value={stats.percent} className="h-1.5 rounded-full" />
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider group-hover:text-[#5483B3] transition-colors">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5" />
                        {stats.total} Bab Pembelajaran
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

// Inner helper component for comments input box
function CommentInput({ onSubmitComment }: { onSubmitComment: (text: string) => void }) {
  const [commentText, setCommentText] = useState('')

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return
    onSubmitComment(commentText)
    setCommentText('')
  }

  return (
    <form onSubmit={handlePost} className="flex gap-2">
      <Input
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Tambahkan komentar kelas..."
        className="bg-[var(--muted)]/50 border-[var(--border)] text-xs h-9 rounded-xl focus-visible:ring-1 flex-1"
        required
      />
      <Button type="submit" size="icon" className="h-9 w-9 bg-[#5483B3] hover:bg-[#5483B3]/90 text-white rounded-xl">
        <Send className="h-3.5 w-3.5" />
      </Button>
    </form>
  )
}
