'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Search, Send, MessageCircle, Clock, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import useSWR from 'swr'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function DiscussionForumClient() {
  const [search, setSearch] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null)
  
  const [newThread, setNewThread] = useState({ title: '', content: '' })
  const [replyContent, setReplyContent] = useState('')

  const { data: threads, mutate } = useSWR('/api/discussions', fetcher, { refreshInterval: 10000 })

  const filteredThreads = threads?.filter((t: any) => 
    t.title.toLowerCase().includes(search.toLowerCase()) || 
    t.content.toLowerCase().includes(search.toLowerCase())
  ) || []

  const activeThread = threads?.find((t: any) => t.id === activeThreadId)

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newThread.title || !newThread.content) return

    try {
      const res = await fetch('/api/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newThread)
      })
      if (res.ok) {
        toast.success('Diskusi berhasil dibuat')
        setNewThread({ title: '', content: '' })
        setIsCreating(false)
        mutate()
      } else {
        toast.error('Gagal membuat diskusi')
      }
    } catch (error) {
      toast.error('Kesalahan sistem')
    }
  }

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyContent || !activeThreadId) return

    try {
      const res = await fetch(`/api/discussions/${activeThreadId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: replyContent })
      })
      if (res.ok) {
        toast.success('Balasan terkirim')
        setReplyContent('')
        mutate()
      } else {
        toast.error('Gagal mengirim balasan')
      }
    } catch (error) {
      toast.error('Kesalahan sistem')
    }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <p className="text-[#5483B3] font-bold uppercase tracking-wider text-xs mb-2">
            Interactive Learning
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">Forum Diskusi</h1>
          <p className="text-sm font-medium text-[var(--muted-foreground)] mt-2">Ruang obrolan publik untuk bertanya dan berdiskusi materi pelajaran.</p>
        </div>
        {!isCreating && !activeThreadId && (
          <Button 
            onClick={() => setIsCreating(true)}
            className="bg-[#5483B3] hover:bg-[#3B6FA0] text-white rounded-xl font-bold h-11 px-6 shadow-md"
          >
            <Plus className="mr-2 h-4 w-4" /> Mulai Diskusi
          </Button>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Thread List */}
        <div className={`lg:col-span-4 ${activeThreadId || isCreating ? 'hidden lg:block' : 'block'}`}>
          <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-sm h-[700px] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-[var(--border)] bg-[var(--muted)]/30">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                <Input 
                  placeholder="Cari topik diskusi..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-10 bg-[var(--background)] border-[var(--border)] rounded-xl focus-visible:ring-[#5483B3]"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
              {!threads ? (
                <div className="p-8 text-center text-sm text-[var(--muted-foreground)]">Memuat...</div>
              ) : filteredThreads.length === 0 ? (
                <div className="p-8 text-center flex flex-col items-center">
                  <MessageSquare className="h-8 w-8 text-[var(--muted)] mb-2" />
                  <p className="text-sm text-[var(--muted-foreground)]">Belum ada topik diskusi.</p>
                </div>
              ) : (
                filteredThreads.map((thread: any) => (
                  <div 
                    key={thread.id}
                    onClick={() => { setActiveThreadId(thread.id); setIsCreating(false); }}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${activeThreadId === thread.id ? 'bg-[#5483B3]/10 border border-[#5483B3]/20' : 'hover:bg-[var(--muted)] border border-transparent'}`}
                  >
                    <h3 className={`font-bold text-sm mb-1 line-clamp-2 ${activeThreadId === thread.id ? 'text-[#5483B3]' : 'text-[var(--foreground)]'}`}>{thread.title}</h3>
                    <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 mb-3">{thread.content}</p>
                    <div className="flex items-center justify-between text-[10px] font-medium text-[var(--muted-foreground)]">
                      <div className="flex items-center gap-1.5">
                        <Avatar className="h-4 w-4">
                          <AvatarImage src={thread.author.image} />
                          <AvatarFallback className="bg-[#5483B3]/20 text-[#5483B3] text-[8px]">{thread.author.name[0]}</AvatarFallback>
                        </Avatar>
                        <span>{thread.author.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" /> {thread.replies.length}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatDistanceToNow(new Date(thread.updatedAt), { locale: idLocale })}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Right Side: Active Thread or Create Form */}
        <div className={`lg:col-span-8 ${!activeThreadId && !isCreating ? 'hidden lg:block' : 'block'}`}>
          {isCreating ? (
            <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-sm h-[700px] flex flex-col">
              <CardHeader className="border-b border-[var(--border)] p-6 bg-[var(--muted)]/30">
                <CardTitle className="text-xl font-extrabold flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-[#5483B3]" />
                  Mulai Diskusi Baru
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                <form onSubmit={handleCreateThread} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[var(--foreground)]">Judul Topik</label>
                    <Input 
                      required
                      placeholder="Contoh: Pertanyaan Rumus Pythagoras"
                      value={newThread.title}
                      onChange={(e) => setNewThread({...newThread, title: e.target.value})}
                      className="h-12 bg-[var(--background)] rounded-xl focus-visible:ring-[#5483B3]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[var(--foreground)]">Isi Pertanyaan/Diskusi</label>
                    <Textarea 
                      required
                      placeholder="Tuliskan secara detail apa yang ingin Anda diskusikan..."
                      value={newThread.content}
                      onChange={(e) => setNewThread({...newThread, content: e.target.value})}
                      className="min-h-[200px] bg-[var(--background)] rounded-xl focus-visible:ring-[#5483B3] resize-y p-4"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={() => setIsCreating(false)} className="flex-1 h-12 rounded-xl font-bold">Batal</Button>
                    <Button type="submit" className="flex-1 h-12 rounded-xl bg-[#5483B3] hover:bg-[#3B6FA0] text-white font-bold shadow-md">
                      Kirim Diskusi
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : activeThread ? (
            <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-sm h-[700px] flex flex-col overflow-hidden">
              <div className="p-6 border-b border-[var(--border)] bg-[var(--background)] flex-shrink-0">
                <Button variant="ghost" onClick={() => setActiveThreadId(null)} className="lg:hidden mb-4 -ml-2 h-8 px-2 text-[var(--muted-foreground)]">
                   Kembali
                </Button>
                <h2 className="text-2xl font-extrabold text-[var(--foreground)] mb-4">{activeThread.title}</h2>
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10 ring-2 ring-[var(--border)]">
                    <AvatarImage src={activeThread.author.image} />
                    <AvatarFallback className="bg-[#5483B3] text-white font-bold">{activeThread.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-[var(--foreground)]">{activeThread.author.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[var(--muted)] text-[var(--muted-foreground)] font-semibold uppercase">{activeThread.author.role}</span>
                      <span className="text-xs text-[var(--muted-foreground)] ml-auto">{formatDistanceToNow(new Date(activeThread.createdAt), { locale: idLocale, addSuffix: true })}</span>
                    </div>
                    <p className="text-sm text-[var(--foreground)] leading-relaxed whitespace-pre-wrap">{activeThread.content}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[var(--muted)]/20 space-y-6">
                {activeThread.replies.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center text-sm text-[var(--muted-foreground)] italic">
                    Belum ada balasan. Jadilah yang pertama membalas!
                  </div>
                ) : (
                  activeThread.replies.map((reply: any) => (
                    <div key={reply.id} className="flex items-start gap-4">
                      <Avatar className="h-8 w-8 ring-1 ring-[var(--border)] mt-1">
                        <AvatarImage src={reply.author.image} />
                        <AvatarFallback className="bg-[var(--muted)] text-[var(--muted-foreground)] font-bold text-xs">{reply.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 bg-[var(--card)] border border-[var(--border)] rounded-2xl rounded-tl-sm p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[var(--foreground)]">{reply.author.name}</span>
                            {reply.author.role === 'TEACHER' && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-bold uppercase">Guru</span>
                            )}
                          </div>
                          <span className="text-[10px] text-[var(--muted-foreground)]">{formatDistanceToNow(new Date(reply.createdAt), { locale: idLocale })}</span>
                        </div>
                        <p className="text-sm text-[var(--foreground)] leading-relaxed whitespace-pre-wrap">{reply.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-4 border-t border-[var(--border)] bg-[var(--background)] flex-shrink-0">
                <form onSubmit={handleReply} className="flex items-end gap-3">
                  <Textarea 
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Tulis balasan Anda..."
                    className="min-h-[60px] max-h-[120px] bg-[var(--muted)]/50 border-[var(--border)] rounded-xl resize-y focus-visible:ring-[#5483B3]"
                  />
                  <Button disabled={!replyContent} type="submit" size="icon" className="h-12 w-12 rounded-xl bg-[#5483B3] hover:bg-[#3B6FA0] text-white shadow-md flex-shrink-0">
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </Card>
          ) : (
            <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-sm h-[700px] flex flex-col items-center justify-center text-center p-12">
              <div className="h-24 w-24 bg-[#5483B3]/10 rounded-full flex items-center justify-center mb-6">
                <MessageCircle className="h-12 w-12 text-[#5483B3]" />
              </div>
              <h2 className="text-2xl font-extrabold text-[var(--foreground)] mb-2">Pilih Topik Diskusi</h2>
              <p className="text-[var(--muted-foreground)] text-sm max-w-sm">Pilih topik dari daftar di sebelah kiri untuk melihat percakapan, atau buat topik baru untuk mulai berdiskusi.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
