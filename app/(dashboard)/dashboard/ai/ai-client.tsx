'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, Send, Brain, Bot, User, Key, AlertCircle, 
  BookOpen, TrendingUp, ClipboardList, CheckCircle2, 
  ThumbsUp, AlertTriangle, GraduationCap, Clock, 
  Trash2, HelpCircle, RefreshCw, Star
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { chatWithAi, generateFeedbackAndScore, saveAssignmentGrade } from './actions'

interface Message {
  role: 'user' | 'model'
  text: string
  timestamp: Date
}

interface AiDashboardClientProps {
  context: any
  user: any
}

export function AiDashboardClient({ context, user }: AiDashboardClientProps) {
  const [activeTab, setActiveTab] = useState('chat')
  const [apiKey, setApiKey] = useState('')
  const [showKeyInput, setShowKeyInput] = useState(false)
  
  // Chat States
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoadingChat, setIsLoadingChat] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Grader States (Teacher)
  const [selectedSubmissionId, setSelectedSubmissionId] = useState('')
  const [gradingResult, setGradingResult] = useState<any>(null)
  const [isLoadingGrading, setIsLoadingGrading] = useState(false)
  const [finalScore, setFinalScore] = useState<number>(0)
  const [finalFeedback, setFinalFeedback] = useState<string>('')
  const [pendingSubmissions, setPendingSubmissions] = useState<any[]>(context.pendingSubmissions || [])

  // Quiz States (Student)
  const [selectedSubjectId, setSelectedSubjectId] = useState('')
  const [quizQuestions, setQuizQuestions] = useState<any[] | null>(null)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({})
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false)
  const [quizResult, setQuizResult] = useState<{ score: number; explanations: string[] } | null>(null)

  // Load API Key from local storage
  useEffect(() => {
    const savedKey = localStorage.getItem('edutrack_gemini_api_key')
    if (savedKey) {
      setApiKey(savedKey)
    } else if (!context.isServerKeySet) {
      setShowKeyInput(true)
    }
    
    // Set default initial greeting
    setChatMessages([
      {
        role: 'model',
        text: `Halo **${user.name}**! Saya adalah **EduTrack AI Assistant**. Bagaimana saya bisa membantu Anda hari ini?\n\n${
          user.role === 'TEACHER'
            ? 'Sebagai guru, Anda dapat meminta saya untuk menganalisis performa kelas, merancang draf materi, membuat kuis, atau masuk ke tab **Penilaian AI** untuk grading otomatis!'
            : 'Sebagai siswa, Anda dapat bertanya tentang materi pelajaran, berkonsultasi mengenai hambatan belajar Anda di tab **Analisis Progres**, atau mencoba kuis di tab **Kuis Mandiri AI**!'
        }`,
        timestamp: new Date()
      }
    ])
  }, [user.name, user.role, context.isServerKeySet])

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const saveApiKey = (key: string) => {
    localStorage.setItem('edutrack_gemini_api_key', key)
    setApiKey(key)
    setShowKeyInput(false)
    toast.success("API Key berhasil disimpan di browser Anda!")
  }

  const deleteApiKey = () => {
    localStorage.removeItem('edutrack_gemini_api_key')
    setApiKey('')
    setShowKeyInput(true)
    toast.success("API Key dihapus dari penyimpanan browser.")
  }

  // --- Handlers ---
  
  // 1. Send Message
  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || inputMessage
    if (!messageText.trim()) return

    if (!context.isServerKeySet && !apiKey) {
      toast.error("Silakan masukkan API Key Gemini terlebih dahulu!")
      setShowKeyInput(true)
      return
    }

    const newUserMessage: Message = {
      role: 'user',
      text: messageText,
      timestamp: new Date()
    }

    setChatMessages(prev => [...prev, newUserMessage])
    if (!textToSend) setInputMessage('')
    setIsLoadingChat(true)

    // Prepare history formatted for API
    const historyPayload = chatMessages.map(msg => ({
      role: msg.role,
      text: msg.text
    }))

    try {
      const response = await chatWithAi({
        prompt: messageText,
        customApiKey: apiKey || undefined,
        history: historyPayload
      })

      if (response.success && response.reply) {
        setChatMessages(prev => [...prev, {
          role: 'model',
          text: response.reply!,
          timestamp: new Date()
        }])
      } else {
        toast.error(response.error || "Gagal memproses pesan.")
      }
    } catch (err: any) {
      toast.error("Terjadi kesalahan koneksi.")
    } finally {
      setIsLoadingChat(false)
    }
  }

  // Quick Prompt click
  const handleQuickPrompt = (prompt: string) => {
    handleSendMessage(prompt)
  }

  // 2. Grader: Load AI Evaluation
  const handleGradeWithAi = async () => {
    if (!selectedSubmissionId) {
      toast.error("Silakan pilih salah satu tugas siswa.")
      return
    }

    if (!context.isServerKeySet && !apiKey) {
      toast.error("Silakan masukkan API key Gemini terlebih dahulu!")
      setShowKeyInput(true)
      return
    }

    setIsLoadingGrading(true)
    setGradingResult(null)

    try {
      const result = await generateFeedbackAndScore({
        submissionId: selectedSubmissionId,
        customApiKey: apiKey || undefined
      })

      if (result.success && result.data) {
        setGradingResult(result.data)
        setFinalScore(result.data.score)
        setFinalFeedback(result.data.feedback)
        toast.success("Analisis penilaian AI berhasil dibuat!")
      } else {
        toast.error(result.error || "Gagal memproses penilaian.")
      }
    } catch (err: any) {
      toast.error("Terjadi kesalahan saat memproses penilaian.")
    } finally {
      setIsLoadingGrading(false)
    }
  }

  // Save Graded Assignment to DB
  const handleSaveGrade = async () => {
    if (!selectedSubmissionId) return

    try {
      const res = await saveAssignmentGrade({
        submissionId: selectedSubmissionId,
        score: parseInt(finalScore as any) || 0,
        feedback: finalFeedback
      })

      if (res.success) {
        toast.success("Nilai & Feedback berhasil disimpan ke database!")
        // Remove from local list
        setPendingSubmissions(prev => prev.filter(sub => sub.id !== selectedSubmissionId))
        setSelectedSubmissionId('')
        setGradingResult(null)
      } else {
        toast.error("Gagal menyimpan nilai.")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan.")
    }
  }

  // 3. Quiz Mode: Generate questions
  const handleStartQuiz = async () => {
    if (!selectedSubjectId) {
      toast.error("Pilih mata pelajaran terlebih dahulu!")
      return
    }

    if (!context.isServerKeySet && !apiKey) {
      toast.error("API Key dibutuhkan untuk kuis AI!")
      setShowKeyInput(true)
      return
    }

    setIsLoadingQuiz(true)
    setQuizQuestions(null)
    setQuizResult(null)
    setQuizAnswers({})

    const selectedSubject = context.userSubjects.find((s: any) => s.subject.id === selectedSubjectId)
    const subjectName = selectedSubject?.subject.name || "Mata Pelajaran"

    const quizPrompt = `Buatlah kuis pilihan ganda interaktif dengan tepat 3 soal mengenai mata pelajaran "${subjectName}".
Setiap soal harus memiliki 4 pilihan (A, B, C, D) dan kunci jawaban yang jelas.
Keluarkan hasil dalam format JSON yang valid berupa array of objects dengan key sebagai berikut:
[
  {
    "id": 1,
    "question": "Pertanyaan mengenai mapel...",
    "options": {
      "A": "Pilihan A",
      "B": "Pilihan B",
      "C": "Pilihan C",
      "D": "Pilihan D"
    },
    "correctAnswer": "A",
    "explanation": "Penjelasan mengapa A benar..."
  }
]
Keluarkan HANYA teks JSON murni tanpa pembungkus markdown (\`\`\`json) agar dapat langsung di-parse.`

    try {
      const response = await chatWithAi({
        prompt: quizPrompt,
        customApiKey: apiKey || undefined
      })

      if (response.success && response.reply) {
        const cleanedReply = response.reply.replace(/```json/g, "").replace(/```/g, "").trim()
        const parsedQuestions = JSON.parse(cleanedReply)
        setQuizQuestions(parsedQuestions)
        toast.success("Kuis AI berhasil dibuat!")
      } else {
        toast.error(response.error || "Gagal membuat kuis.")
      }
    } catch (error) {
      toast.error("Gagal memproses soal kuis.")
    } finally {
      setIsLoadingQuiz(false)
    }
  }

  // Quiz submission evaluation
  const handleEvaluateQuiz = () => {
    if (!quizQuestions) return

    let correctCount = 0
    const explanations: string[] = []

    quizQuestions.forEach((q, idx) => {
      const userAnswer = quizAnswers[q.id]
      const isCorrect = userAnswer === q.correctAnswer
      if (isCorrect) correctCount++
      explanations.push(
        `Soal ${idx + 1}: Kunci Jawaban adalah ${q.correctAnswer}. Anda menjawab ${userAnswer || 'Tidak Diisi'}. ${isCorrect ? '✅ Benar!' : '❌ Salah.'} ${q.explanation}`
      )
    })

    const finalQuizScore = Math.round((correctCount / quizQuestions.length) * 100)
    setQuizResult({
      score: finalQuizScore,
      explanations
    })
    toast.success(`Kuis selesai! Skor Anda: ${finalQuizScore}/100`)
  }

  // --- Render Helpers ---

  // Renders simple markdown styling for bold & code blocks in chatbot responses
  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Bold syntax **text**
      let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Bullet points
      const isBullet = line.trim().startsWith('-') || line.trim().startsWith('*')
      if (isBullet) {
        formattedLine = `• ${line.trim().substring(1).trim()}`
      }
      return (
        <p 
          key={i} 
          className={`min-h-[1.25rem] text-sm leading-relaxed ${isBullet ? 'pl-2' : ''}`}
          dangerouslySetInnerHTML={{ __html: formattedLine }} 
        />
      )
    })
  }

  // Stats calculation for STUDENT
  const calculateStudentStats = () => {
    if (user.role !== 'STUDENT') return null
    const logs = context.progressLogs || []
    const totalDuration = logs.reduce((acc: number, log: any) => acc + log.duration, 0)
    const avgDifficulty = logs.length > 0 
      ? (logs.reduce((acc: number, log: any) => acc + log.difficulty, 0) / logs.length).toFixed(1)
      : '0'
    const hardTopics = logs.filter((log: any) => log.difficulty >= 4)

    return {
      totalDuration,
      avgDifficulty,
      hardTopicsCount: hardTopics.length,
      hardTopicsList: hardTopics
    }
  }
  const studentStats = calculateStudentStats()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      {/* LEFT SIDEBAR: API KEY & STATS OVERVIEW */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* Setup API Key Card */}
        <Card className="glass border-[#5483B3]/25 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-[var(--foreground)]">
              <Key className="h-4 w-4 text-[#5483B3]" />
              API Key Google Gemini
            </CardTitle>
            <CardDescription className="text-xs text-[var(--muted-foreground)]">
              Kunci API disimpan secara lokal di browser Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pb-4">
            {context.isServerKeySet ? (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  <strong>API Key Server Aktif!</strong> Server telah dikonfigurasi dengan API Key bawaan. Anda siap menggunakannya.
                </p>
              </div>
            ) : apiKey ? (
              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/25 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className="h-2 w-2 rounded-full bg-blue-500 animate-ping" />
                    <span className="text-xs font-semibold truncate text-[var(--foreground)]">
                      key: ••••••••••••
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={deleteApiKey}
                    className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-500/15"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  API Key tidak ditemukan. Anda perlu memasukkan API key dari Google AI Studio untuk mengaktifkan AI.
                </p>
              </div>
            )}

            {/* Manual API Key Input Button */}
            {!context.isServerKeySet && (
              <Button 
                onClick={() => setShowKeyInput(!showKeyInput)} 
                variant="outline" 
                size="sm" 
                className="w-full text-xs font-semibold py-1.5"
              >
                {showKeyInput ? 'Sembunyikan Pengaturan' : 'Masukkan API Key Manual'}
              </Button>
            )}

            {/* Input fields */}
            {showKeyInput && (
              <div className="space-y-2 pt-2 border-t border-[var(--border)]">
                <Input
                  type="password"
                  placeholder="AIzaSy..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="h-8 text-xs bg-[var(--background)]"
                />
                <Button 
                  onClick={() => saveApiKey(apiKey)} 
                  size="sm"
                  className="w-full text-xs bg-[#5483B3] hover:bg-[#5483B3]/90 text-white"
                >
                  Simpan Key
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Context / Dynamic Info panel */}
        {user.role === 'STUDENT' ? (
          <Card className="glass border-[#5483B3]/20 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Brain className="h-4 w-4 text-[#5483B3]" />
                Ringkasan Belajar Anda
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pb-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border)] text-center">
                  <div className="text-xs text-[var(--muted-foreground)] font-semibold mb-1">Durasi Belajar</div>
                  <div className="text-lg font-black text-[#5483B3] flex items-center justify-center gap-1">
                    <Clock className="h-4 w-4" />
                    {studentStats?.totalDuration}m
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border)] text-center">
                  <div className="text-xs text-[var(--muted-foreground)] font-semibold mb-1">Kesulitan Rata2</div>
                  <div className="text-lg font-black text-[#5483B3] flex items-center justify-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {studentStats?.avgDifficulty}/5
                  </div>
                </div>
              </div>

              {/* Hard topics suggestion */}
              {studentStats && studentStats.hardTopicsCount > 0 ? (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    Perlu Perhatian Lebih!
                  </div>
                  <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed">
                    Anda mencatat tingkat kesulitan tinggi (4 atau 5) pada beberapa materi. Tanyakan pada AI untuk penjelasannya!
                  </p>
                  <div className="space-y-1">
                    {studentStats.hardTopicsList.slice(0, 3).map((log: any) => (
                      <button
                        key={log.id}
                        onClick={() => handleQuickPrompt(`Jelaskan materi yang saya alami kesulitan: mapel ${log.topic.subject.name} topik ${log.topic.name}. Catatan kendala saya: ${log.notes || 'tidak ada catatan'}`)}
                        className="w-full text-left p-1.5 rounded-lg bg-[var(--card)] hover:bg-[var(--sidebar-hover)] border border-[var(--border)] text-[10px] font-medium flex items-center justify-between text-[var(--foreground)] hover:text-[#5483B3] transition-colors"
                      >
                        <span className="truncate max-w-[85%] font-semibold">{log.topic.name}</span>
                        <TrendingUp className="h-3 w-3 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4 shrink-0" />
                  Hebat! Tidak ada materi terhambat belakangan ini. Pertahankan prestasimu!
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="glass border-[#5483B3]/20 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-[#5483B3]" />
                Ringkasan Kelas Anda
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pb-4 text-xs text-[var(--muted-foreground)]">
              <div className="space-y-2">
                <div className="flex justify-between items-center py-1 border-b border-[var(--border)]">
                  <span>Total Murid Terdaftar:</span>
                  <span className="font-bold text-[var(--foreground)]">{(context.students || []).length} Siswa</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[var(--border)]">
                  <span>Mata Pelajaran Diajar:</span>
                  <span className="font-bold text-[var(--foreground)]">{(context.subjects || []).length} Mapel</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span>Butuh Dinilai (Pending):</span>
                  <span className="font-bold text-red-500">{pendingSubmissions.length} Tugas</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* RIGHT SIDE: DYNAMIC WORKSPACE TABS */}
      <div className="lg:col-span-3">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-2 mb-4 overflow-x-auto scrollbar-hide">
            <TabsList className="bg-[var(--card)] border border-[var(--border)] shadow-xs rounded-xl p-1 h-11 shrink-0">
              <TabsTrigger value="chat" className="px-4 py-2 text-xs md:text-sm font-bold flex items-center gap-1.5 rounded-lg transition-all">
                <Bot className="h-4 w-4" />
                Obrolan AI
              </TabsTrigger>
              {user.role === 'STUDENT' && (
                <>
                  <TabsTrigger value="insights" className="px-4 py-2 text-xs md:text-sm font-bold flex items-center gap-1.5 rounded-lg transition-all">
                    <TrendingUp className="h-4 w-4" />
                    Analisis Progres
                  </TabsTrigger>
                  <TabsTrigger value="quiz" className="px-4 py-2 text-xs md:text-sm font-bold flex items-center gap-1.5 rounded-lg transition-all">
                    <HelpCircle className="h-4 w-4" />
                    Kuis Mandiri AI
                  </TabsTrigger>
                </>
              )}
              {user.role === 'TEACHER' && (
                <>
                  <TabsTrigger value="insights" className="px-4 py-2 text-xs md:text-sm font-bold flex items-center gap-1.5 rounded-lg transition-all">
                    <Users className="h-4 w-4" />
                    Analisis Kelas
                  </TabsTrigger>
                  <TabsTrigger value="grader" className="px-4 py-2 text-xs md:text-sm font-bold flex items-center gap-1.5 rounded-lg transition-all">
                    <ClipboardList className="h-4 w-4" />
                    Penilaian AI
                  </TabsTrigger>
                </>
              )}
            </TabsList>
          </div>

          {/* TAB 1: GENERAL CHATBOT */}
          <TabsContent value="chat">
            <Card className="border border-[var(--border)] shadow-md flex flex-col h-[650px] overflow-hidden bg-card">
              
              {/* Chat Header */}
              <div className="p-4 bg-[var(--background)]/40 border-b border-[var(--border)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 bg-gradient-to-br from-[#5483B3] to-[#052659] rounded-lg flex items-center justify-center text-white">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[var(--foreground)]">Asisten Pintar EduTrack</h3>
                    <p className="text-[10px] text-emerald-500 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                      Aktif & Siap membantu
                    </p>
                  </div>
                </div>
                {chatMessages.length > 1 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setChatMessages([chatMessages[0]])
                      toast.success("Riwayat obrolan dibersihkan.")
                    }}
                    className="text-[11px] font-bold text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-lg h-8 px-2"
                  >
                    Hapus Chat
                  </Button>
                )}
              </div>

              {/* Chat Message Box */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-dot-pattern">
                {chatMessages.map((msg, index) => {
                  const isModel = msg.role === 'model'
                  return (
                    <div 
                      key={index} 
                      className={`flex ${isModel ? 'justify-start' : 'justify-end'} animate-fade-in`}
                    >
                      <div className={`flex gap-2.5 max-w-[85%] ${isModel ? 'flex-row' : 'flex-row-reverse'}`}>
                        {/* Avatar */}
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${
                          isModel 
                            ? 'bg-[#5483B3] text-white' 
                            : 'bg-[#C1E8FF] text-[#052659] font-bold text-xs'
                        }`}>
                          {isModel ? <Bot className="h-4.5 w-4.5" /> : <User className="h-4.5 w-4.5" />}
                        </div>
                        {/* Bubble */}
                        <div className={`p-3.5 rounded-2xl text-xs leading-relaxed space-y-2 border ${
                          isModel 
                            ? 'bg-[var(--card)] text-[var(--foreground)] border-[var(--border)] shadow-xs rounded-tl-xs' 
                            : 'bg-[#5483B3] text-white border-transparent shadow-xs rounded-tr-xs'
                        }`}>
                          {renderFormattedText(msg.text)}
                          <span className={`block text-[9px] text-right mt-1.5 ${isModel ? 'text-[var(--muted-foreground)]' : 'text-[#C1E8FF]'}`}>
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {isLoadingChat && (
                  <div className="flex justify-start">
                    <div className="flex gap-2.5 max-w-[80%]">
                      <div className="h-8 w-8 rounded-lg bg-[#5483B3] text-white flex items-center justify-center shrink-0">
                        <Bot className="h-4.5 w-4.5" />
                      </div>
                      <div className="p-3.5 rounded-2xl rounded-tl-xs bg-[var(--card)] border border-[var(--border)] shadow-xs flex items-center gap-2">
                        <div className="flex gap-1">
                          <span className="h-2 w-2 bg-[#5483B3] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="h-2 w-2 bg-[#5483B3] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="h-2 w-2 bg-[#5483B3] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-[10px] font-semibold text-[var(--muted-foreground)]">AI sedang berpikir...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Suggestion Row */}
              <div className="px-4 py-2 border-t border-[var(--border)] bg-[var(--background)]/20 flex gap-2 overflow-x-auto scrollbar-hide shrink-0">
                {user.role === 'STUDENT' ? (
                  <>
                    <button 
                      onClick={() => handleQuickPrompt("Berikan 3 tips belajar mandiri yang efektif agar saya cepat paham materi sulit.")}
                      className="whitespace-nowrap px-3 py-1.5 rounded-full border border-[#5483B3]/35 hover:bg-[#5483B3]/10 text-[10px] font-semibold text-[#5483B3] transition-colors"
                    >
                      💡 Tips Belajar
                    </button>
                    <button 
                      onClick={() => handleQuickPrompt("Jelaskan cara agar saya konsisten mencatat Progress Log dengan benar.")}
                      className="whitespace-nowrap px-3 py-1.5 rounded-full border border-[#5483B3]/35 hover:bg-[#5483B3]/10 text-[10px] font-semibold text-[#5483B3] transition-colors"
                    >
                      📊 Tips Progres Belajar
                    </button>
                    <button 
                      onClick={() => handleQuickPrompt("Bantu saya membuat rencana jadwal belajar mingguan yang seimbang.")}
                      className="whitespace-nowrap px-3 py-1.5 rounded-full border border-[#5483B3]/35 hover:bg-[#5483B3]/10 text-[10px] font-semibold text-[#5483B3] transition-colors"
                    >
                      📅 Susun Jadwal Belajar
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => handleQuickPrompt("Tolong rekomendasikan ide tugas kelas inovatif untuk materi minggu ini.")}
                      className="whitespace-nowrap px-3 py-1.5 rounded-full border border-[#5483B3]/35 hover:bg-[#5483B3]/10 text-[10px] font-semibold text-[#5483B3] transition-colors"
                    >
                      📝 Ide Pembuatan Tugas
                    </button>
                    <button 
                      onClick={() => handleQuickPrompt("Bagaimana mendampingi murid yang sering tertinggal mengumpulkan tugas secara bersahabat?")}
                      className="whitespace-nowrap px-3 py-1.5 rounded-full border border-[#5483B3]/35 hover:bg-[#5483B3]/10 text-[10px] font-semibold text-[#5483B3] transition-colors"
                    >
                      🤝 Pendampingan Siswa
                    </button>
                    <button 
                      onClick={() => handleQuickPrompt("Bagikan cara menyusun rencana topik pembelajaran agar asyik dibaca murid.")}
                      className="whitespace-nowrap px-3 py-1.5 rounded-full border border-[#5483B3]/35 hover:bg-[#5483B3]/10 text-[10px] font-semibold text-[#5483B3] transition-colors"
                    >
                      📚 Draf Rancangan Materi
                    </button>
                  </>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-[var(--background)]/35 border-t border-[var(--border)] shrink-0 flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ketik pesan Anda di sini (misal: 'Jelaskan arti fotosintesis')"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage()
                  }}
                  disabled={isLoadingChat}
                  className="flex-1 bg-[var(--card)] text-xs border-[var(--border)] focus:border-[#5483B3] focus:ring-1 focus:ring-[#5483B3] h-10 rounded-xl"
                />
                <Button 
                  onClick={() => handleSendMessage()}
                  disabled={isLoadingChat || !inputMessage.trim()}
                  className="bg-[#5483B3] text-white hover:bg-[#5483B3]/90 rounded-xl h-10 w-10 flex items-center justify-center shrink-0 p-0"
                >
                  <Send className="h-4.5 w-4.5" />
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* TAB 2: STUDENT INSIGHTS */}
          {user.role === 'STUDENT' && (
            <TabsContent value="insights">
              <div className="space-y-6">
                <Card className="border border-[var(--border)] shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold flex items-center gap-2 text-[var(--foreground)]">
                      <TrendingUp className="h-5 w-5 text-[#5483B3]" />
                      Analisis Pembelajaran Berdasarkan Data Progres
                    </CardTitle>
                    <CardDescription className="text-xs">
                      AI menganalisis data riwayat belajar Anda untuk melihat topik kesulitan dan waktu belajar optimal Anda.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    
                    {/* List enrolled subjects targets */}
                    <div>
                      <h4 className="text-xs font-bold text-[var(--foreground)] mb-2 uppercase tracking-wider">🎯 Target Belajar per Mata Pelajaran</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {context.userSubjects.map((s: any) => (
                          <div key={s.id} className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--background)]/30 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-lg bg-[#5483B3]/10 text-[#5483B3] flex items-center justify-center font-bold text-xs shrink-0">
                                <BookOpen className="h-4 w-4" />
                              </div>
                              <div>
                                <span className="text-xs font-bold block text-[var(--foreground)]">{s.subject.name}</span>
                                <span className="text-[10px] text-[var(--muted-foreground)]">Kebutuhan Target: {s.targetHours} Jam</span>
                              </div>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-[10px] h-7 px-2.5"
                              onClick={() => {
                                setActiveTab('chat')
                                handleQuickPrompt(`Bantu saya merancang rencana belajar mingguan khusus untuk mata pelajaran ${s.subject.name} agar saya bisa memenuhi target ${s.targetHours} jam belajar.`)
                              }}
                            >
                              Buat Tips
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Riwayat log detail */}
                    <div className="pt-2">
                      <h4 className="text-xs font-bold text-[var(--foreground)] mb-2 uppercase tracking-wider">⏱️ Riwayat Belajar & Kesulitan Terakhir</h4>
                      <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                        {context.progressLogs.length > 0 ? (
                          context.progressLogs.map((log: any) => (
                            <div 
                              key={log.id} 
                              className={`p-3 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs ${
                                log.difficulty >= 4 
                                  ? 'bg-amber-500/5 border-amber-500/20' 
                                  : 'bg-[var(--card)] border-[var(--border)]'
                              }`}
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-[var(--foreground)]">{log.topic.subject.name}</span>
                                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--border)] font-semibold text-[var(--muted-foreground)]">
                                    {log.topic.name}
                                  </span>
                                </div>
                                <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed">
                                  {log.notes ? `"${log.notes}"` : 'Tidak ada catatan tambahan.'}
                                </p>
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                <span className="text-[10px] text-[var(--muted-foreground)]">Durasi: {log.duration} menit</span>
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px] font-semibold text-[var(--muted-foreground)]">Kesulitan:</span>
                                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                    log.difficulty >= 4 ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
                                  }`}>
                                    {log.difficulty}/5
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-[var(--muted-foreground)] italic">Belum ada progres belajar yang dicatat.</p>
                        )}
                      </div>
                    </div>

                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}

          {/* TAB 2: TEACHER INSIGHTS */}
          {user.role === 'TEACHER' && (
            <TabsContent value="insights">
              <div className="space-y-6">
                <Card className="border border-[var(--border)] shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold flex items-center gap-2 text-[var(--foreground)]">
                      <Users className="h-5 w-5 text-[#5483B3]" />
                      Analisis & Manajemen Performa Kelas
                    </CardTitle>
                    <CardDescription className="text-xs">
                      AI mendeteksi keaktifan belajar siswa berdasarkan riwayat Progress Log mereka dan memberikan saran intervensi pembelajaran.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="border-b border-[var(--border)] bg-[var(--background)]/30 text-[var(--muted-foreground)]">
                            <th className="py-3 px-3 font-bold">Nama Murid</th>
                            <th className="py-3 px-3 font-bold">Kelas</th>
                            <th className="py-3 px-3 font-bold text-center">Progress Log</th>
                            <th className="py-3 px-3 font-bold text-center">Status Kesulitan</th>
                            <th className="py-3 px-3 font-bold text-right">Aksi AI</th>
                          </tr>
                        </thead>
                        <tbody>
                          {context.students.map((student: any) => {
                            const logs = student.progressLogs || []
                            const hardLogs = logs.filter((l: any) => l.difficulty >= 4)
                            const isAtRisk = hardLogs.length > 0

                            return (
                              <tr key={student.id} className="border-b border-[var(--border)] hover:bg-[var(--sidebar-hover)]/30 transition-colors">
                                <td className="py-3.5 px-3 font-semibold text-[var(--foreground)]">{student.name}</td>
                                <td className="py-3.5 px-3">{student.class?.name || 'Tidak ada kelas'}</td>
                                <td className="py-3.5 px-3 text-center font-medium">{logs.length} logged</td>
                                <td className="py-3.5 px-3 text-center">
                                  {isAtRisk ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-500 font-bold text-[10px]">
                                      <AlertTriangle className="h-3 w-3 shrink-0" />
                                      {hardLogs.length} Materi Terhambat
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-500 font-bold text-[10px]">
                                      <CheckCircle2 className="h-3 w-3 shrink-0" />
                                      Baik (Lancar)
                                    </span>
                                  )}
                                </td>
                                <td className="py-3.5 px-3 text-right">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-[10px] h-7 px-2.5 font-bold"
                                    onClick={() => {
                                      setActiveTab('chat')
                                      handleQuickPrompt(`Beri saya analisis performa untuk murid bernama ${student.name} berdasarkan riwayat belajarnya yang baru-baru ini mengalami tingkat kesulitan tinggi. Berikan juga rekomendasi metode ajar khusus untuk dia.`)
                                    }}
                                  >
                                    Analisis AI
                                  </Button>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}

          {/* TAB 3: TEACHER AUTO GRADER */}
          {user.role === 'TEACHER' && (
            <TabsContent value="grader">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Panel Kiri: Daftar Tugas Pending */}
                <div className="space-y-4">
                  <Card className="border border-[var(--border)] shadow-md">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                        <ClipboardList className="h-4.5 w-4.5 text-[#5483B3]" />
                        Pilih Tugas Siswa untuk Dinilai
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Daftar pengumpulan tugas siswa yang belum dinilai.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2.5 max-h-[500px] overflow-y-auto">
                      {pendingSubmissions.length > 0 ? (
                        pendingSubmissions.map((sub: any) => (
                          <div 
                            key={sub.id} 
                            onClick={() => {
                              setSelectedSubmissionId(sub.id)
                              setGradingResult(null)
                            }}
                            className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                              selectedSubmissionId === sub.id
                                ? 'border-[#5483B3] bg-[#5483B3]/5 shadow-xs'
                                : 'border-[var(--border)] bg-[var(--card)] hover:bg-[var(--sidebar-hover)]'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-bold text-[var(--foreground)]">{sub.student.name}</span>
                              <span className="text-[10px] text-[var(--muted-foreground)]">Kelas {sub.student.class?.name || '-'}</span>
                            </div>
                            <h4 className="font-semibold text-[#5483B3] mt-1 truncate">{sub.assignment.title}</h4>
                            <p className="text-[10px] text-[var(--muted-foreground)] truncate mt-0.5">
                              Mapel: {sub.assignment.subject.name}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-[var(--muted-foreground)] italic text-center py-4">Semua pengumpulan tugas telah dinilai! 🎉</p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Panel Kanan: Evaluasi AI & Aksi */}
                <div className="space-y-4">
                  <Card className="border border-[var(--border)] shadow-md">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                        <Sparkles className="h-4.5 w-4.5 text-amber-500" />
                        Analisis Penilaian AI
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedSubmissionId ? (
                        <>
                          {/* Info Detil Tugas Terpilih */}
                          {(() => {
                            const sub = pendingSubmissions.find(s => s.id === selectedSubmissionId)
                            if (!sub) return null
                            return (
                              <div className="p-3.5 rounded-xl bg-[var(--background)]/40 border border-[var(--border)] space-y-2 text-xs">
                                <div>
                                  <span className="text-[10px] text-[var(--muted-foreground)] block">Konten Tugas Siswa:</span>
                                  <div className="font-medium p-2.5 rounded-lg bg-[var(--card)] border border-[var(--border)] max-h-32 overflow-y-auto whitespace-pre-wrap leading-relaxed text-[11px] text-[var(--foreground)]">
                                    {sub.content}
                                  </div>
                                </div>
                                <div className="flex justify-between items-center text-[10px] pt-1">
                                  <span>Batas Maksimum Skor: <strong>{sub.assignment.maxScore}</strong></span>
                                  <span>Dikumpulkan: <strong>{new Date(sub.submittedAt).toLocaleDateString()}</strong></span>
                                </div>
                              </div>
                            )
                          })()}

                          {/* Tombol Mulai Penilaian AI */}
                          {!gradingResult && (
                            <Button
                              onClick={handleGradeWithAi}
                              disabled={isLoadingGrading}
                              className="w-full text-xs bg-amber-500 hover:bg-amber-600 text-white font-bold h-9"
                            >
                              {isLoadingGrading ? (
                                <>
                                  <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1.5" />
                                  AI sedang Menilai Tugas...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="h-3.5 w-3.5 mr-1.5 text-white" />
                                  Nilai Menggunakan AI
                                </>
                              )}
                            </Button>
                          )}

                          {/* Renders Grading Result Box */}
                          {gradingResult && (
                            <div className="space-y-4 animate-fade-in">
                              
                              <div className="grid grid-cols-3 gap-3 items-center">
                                <span className="text-xs font-semibold text-[var(--foreground)] col-span-2">Rekomendasi Skor AI:</span>
                                <Input
                                  type="number"
                                  value={Number.isNaN(finalScore) || finalScore === null || finalScore === undefined ? '' : finalScore}
                                  onChange={(e) => { const val = parseInt(e.target.value); setFinalScore(Number.isNaN(val) ? '' as any : val); }}
                                  className="h-8 text-xs font-bold text-center bg-[var(--card)]"
                                />
                              </div>

                              <div className="space-y-1 text-xs">
                                <span className="font-bold text-[var(--foreground)] block">Kekuatan Utama Siswa:</span>
                                <div className="p-2.5 rounded-lg border border-[var(--border)] bg-green-500/5 text-[11px] leading-relaxed">
                                  {gradingResult.strengths}
                                </div>
                              </div>

                              <div className="space-y-1 text-xs">
                                <span className="font-bold text-[var(--foreground)] block">Poin Perbaikan:</span>
                                <div className="p-2.5 rounded-lg border border-[var(--border)] bg-amber-500/5 text-[11px] leading-relaxed">
                                  {gradingResult.improvements}
                                </div>
                              </div>

                              <div className="space-y-1.5 text-xs">
                                <span className="font-bold text-[var(--foreground)] block">Teks Feedback untuk Siswa:</span>
                                <Textarea
                                  value={finalFeedback}
                                  onChange={(e) => setFinalFeedback(e.target.value)}
                                  rows={4}
                                  className="text-[11px] bg-[var(--card)]"
                                />
                              </div>

                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => setGradingResult(null)}
                                  className="flex-1 text-xs font-bold"
                                >
                                  Mulai Ulang
                                </Button>
                                <Button 
                                  size="sm" 
                                  onClick={handleSaveGrade}
                                  className="flex-1 text-xs font-bold bg-[#5483B3] hover:bg-[#5483B3]/90 text-white"
                                >
                                  Simpan Nilai & Kirim
                                </Button>
                              </div>

                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-center text-xs text-[var(--muted-foreground)]">
                          <Bot className="h-10 w-10 text-[var(--border)] mb-2" />
                          <p>Pilih tugas siswa di panel kiri untuk memulai analisis penilaian dengan kecerdasan buatan.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          )}

          {/* TAB 3: STUDENT INTERACTIVE QUIZ */}
          {user.role === 'STUDENT' && (
            <TabsContent value="quiz">
              <Card className="border border-[var(--border)] shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    Kuis Mandiri Interaktif AI
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Pilih Mata Pelajaran, lalu AI akan menyusun 3 soal kuis pilihan ganda interaktif beserta pembahasan.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  {/* Select Mapel */}
                  {!quizQuestions && (
                    <div className="flex flex-col md:flex-row items-end gap-3 max-w-lg">
                      <div className="flex-1 space-y-1.5">
                        <label className="text-xs font-bold text-[var(--foreground)]">Pilih Mata Pelajaran:</label>
                        <select 
                          value={selectedSubjectId} 
                          onChange={(e) => setSelectedSubjectId(e.target.value)}
                          className="w-full h-9 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 text-xs focus:ring-1 focus:ring-[#5483B3] outline-none text-[var(--foreground)]"
                        >
                          <option value="">-- Pilih Mapel --</option>
                          {context.userSubjects.map((s: any) => (
                            <option key={s.id} value={s.subject.id}>{s.subject.name}</option>
                          ))}
                        </select>
                      </div>
                      <Button
                        onClick={handleStartQuiz}
                        disabled={isLoadingQuiz || !selectedSubjectId}
                        className="bg-[#5483B3] hover:bg-[#5483B3]/90 text-white font-bold h-9 text-xs"
                      >
                        {isLoadingQuiz ? (
                          <>
                            <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1.5" />
                            Merumuskan Soal...
                          </>
                        ) : (
                          <>Buat Kuis AI</>
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Question Render Panel */}
                  {quizQuestions && !quizResult && (
                    <div className="space-y-6 pt-2 animate-fade-in">
                      {quizQuestions.map((q, idx) => (
                        <div key={q.id} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background)]/20 space-y-3">
                          <h4 className="text-xs font-bold text-[var(--foreground)] flex gap-1.5">
                            <span>{idx + 1}.</span>
                            <span>{q.question}</span>
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {Object.entries(q.options).map(([key, value]: any) => (
                              <button
                                key={key}
                                onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: key }))}
                                className={`p-3 rounded-lg border text-left text-xs transition-all flex items-center gap-2 font-medium ${
                                  quizAnswers[q.id] === key
                                    ? 'border-[#5483B3] bg-[#5483B3]/10 text-[#5483B3] font-bold shadow-xs'
                                    : 'border-[var(--border)] bg-[var(--card)] hover:bg-[var(--sidebar-hover)]/30 text-[var(--foreground)]'
                                }`}
                              >
                                <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                  quizAnswers[q.id] === key 
                                    ? 'bg-[#5483B3] text-white' 
                                    : 'bg-[var(--background)] text-[var(--muted-foreground)]'
                                }`}>
                                  {key}
                                </span>
                                <span>{value}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}

                      <div className="flex gap-2 justify-end pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setQuizQuestions(null)}
                          className="text-xs font-bold"
                        >
                          Batal
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleEvaluateQuiz}
                          disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs"
                        >
                          Kumpulkan Jawaban
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Render Quiz Result Panel */}
                  {quizResult && (
                    <div className="space-y-4 pt-2 animate-fade-in">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-[#5483B3]/10 to-[#C1E8FF]/10 border border-[#5483B3]/25 flex items-center justify-between gap-4">
                        <div>
                          <h4 className="text-sm font-bold text-[var(--foreground)]">Hasil Kuis Mandiri AI</h4>
                          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Penilaian otomatis selesai.</p>
                        </div>
                        <div className="text-center shrink-0">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted-foreground)]">Skor Anda</span>
                          <div className="text-3xl font-black text-[#5483B3]">{quizResult.score}/100</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h5 className="text-xs font-bold text-[var(--foreground)]">Pembahasan dan Evaluasi Soal:</h5>
                        {quizResult.explanations.map((exp, index) => (
                          <div key={index} className="p-3 rounded-lg border border-[var(--border)] bg-[var(--background)]/30 text-[11px] leading-relaxed text-[var(--foreground)]">
                            {exp}
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-end pt-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setQuizQuestions(null)
                            setQuizResult(null)
                            setQuizAnswers({})
                          }}
                          className="text-xs font-bold"
                        >
                          Coba Kuis Baru
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            setActiveTab('chat')
                            handleQuickPrompt(`Tolong jelaskan secara lebih mendalam tentang pembahasan materi kuis ${context.userSubjects.find((s: any) => s.subject.id === selectedSubjectId)?.subject.name} yang baru saja saya kerjakan.`)
                          }}
                          className="bg-[#5483B3] hover:bg-[#5483B3]/90 text-white font-bold text-xs"
                        >
                          Diskusikan dengan AI Tutor
                        </Button>
                      </div>
                    </div>
                  )}

                </CardContent>
              </Card>
            </TabsContent>
          )}

        </Tabs>
      </div>

    </div>
  )
}
