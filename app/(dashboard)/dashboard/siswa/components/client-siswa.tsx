'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, Filter, User, Calendar, 
  MessageSquare, ChevronRight, X, 
  TrendingUp, Clock, BookOpen, Target
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { formatDistanceToNow } from 'date-fns'
import { id as localeId } from 'date-fns/locale'

export function SiswaClient({ initialStudents, classes }: any) {
  const [search, setSearch] = React.useState('')
  const [selectedClass, setSelectedClass] = React.useState('ALL')
  const [selectedStudent, setSelectedStudent] = React.useState<any>(null)

  const filteredStudents = initialStudents.filter((s: any) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase())
    const matchesClass = selectedClass === 'ALL' || s.classId === selectedClass
    return matchesSearch && matchesClass
  })

  return (
    <div className="space-y-8 pb-10 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-bold tracking-tight text-white">Data Siswa</h1>
          <p className="text-white/50 text-lg mt-1">Pantau kemajuan individu siswa di kelasmu.</p>
        </motion.div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <Input 
            placeholder="Cari nama siswa..." 
            className="pl-10 h-12 bg-[#1C1C1E] border-[#3A3A3C] rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          <button 
            onClick={() => setSelectedClass('ALL')}
            className={cn("px-4 h-12 rounded-xl text-xs font-bold uppercase tracking-widest transition-all", selectedClass === 'ALL' ? "bg-primary text-white" : "bg-[#1C1C1E] border border-[#3A3A3C] text-white/40 hover:text-white")}
          >
            Semua Kelas
          </button>
          {classes.map((c: any) => (
            <button 
              key={c.id}
              onClick={() => setSelectedClass(c.id)}
              className={cn("px-4 h-12 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap", selectedClass === c.id ? "bg-primary text-white" : "bg-[#1C1C1E] border border-[#3A3A3C] text-white/40 hover:text-white")}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[32px] bg-[#1C1C1E] border border-[#3A3A3C] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#3A3A3C] text-white/40 text-xs uppercase tracking-widest font-bold">
                <th className="px-8 py-5">Nama Siswa</th>
                <th className="px-8 py-5">Kelas</th>
                <th className="px-8 py-5">Progress</th>
                <th className="px-8 py-5">Terakhir Aktif</th>
                <th className="px-8 py-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredStudents.map((s: any) => {
                const totalLogs = s.progressLogs.length
                const progress = Math.min(Math.floor(totalLogs * 8.5), 100)
                const lastActive = s.lastActiveAt ? formatDistanceToNow(new Date(s.lastActiveAt), { addSuffix: true, locale: localeId }) : 'Belum aktif'
                
                return (
                  <tr key={s.id} className="hover:bg-white/[0.02] transition-colors group cursor-pointer" onClick={() => setSelectedStudent(s)}>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center font-bold text-primary">
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{s.name}</p>
                          <p className="text-xs text-white/40">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <Badge variant="secondary" className="bg-black/40 text-white/60 border-white/5">{s.class?.name || '—'}</Badge>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4 min-w-[150px]">
                        <Progress value={progress} className="h-1.5 flex-1" style={{ '--progress-foreground': '#0A84FF' } as any} />
                        <span className="text-xs font-bold text-white">{progress}%</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-xs text-white/40 italic">{lastActive}</td>
                    <td className="px-8 py-5 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-white/20 hover:text-white">
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side Panel for Student Detail */}
      <AnimatePresence>
        {selectedStudent && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStudent(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 h-full w-full max-w-lg bg-[#1C1C1E] border-l border-[#3A3A3C] z-50 shadow-2xl overflow-y-auto"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-2xl font-bold text-white">Profil Siswa</h2>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedStudent(null)} className="h-10 w-10 rounded-full hover:bg-white/5">
                    <X className="h-6 w-6" />
                  </Button>
                </div>

                <div className="text-center mb-10">
                  <div className="h-24 w-24 rounded-full bg-primary/10 border-4 border-primary/20 flex items-center justify-center font-bold text-4xl text-primary mx-auto mb-4">
                    {selectedStudent.name.charAt(0)}
                  </div>
                  <h3 className="text-2xl font-bold text-white">{selectedStudent.name}</h3>
                  <p className="text-white/40">{selectedStudent.email}</p>
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-none">{selectedStudent.class?.name}</Badge>
                    <Badge variant="secondary" className="bg-white/5 text-white/40 border-none">{selectedStudent.school}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div className="p-6 rounded-3xl bg-black/20 border border-white/5">
                    <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-1">Total Jam</p>
                    <p className="text-2xl font-bold text-white">12.5 <span className="text-sm font-normal text-white/40">jam</span></p>
                  </div>
                  <div className="p-6 rounded-3xl bg-black/20 border border-white/5">
                    <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-1">Topik</p>
                    <p className="text-2xl font-bold text-white">8/12 <span className="text-sm font-normal text-white/40">topik</span></p>
                  </div>
                </div>

                <div className="space-y-8">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-white/30">Statistik Belajar</h4>
                  <div className="space-y-6">
                    {/* Reusing components but simplified for the panel */}
                    <div className="space-y-2">
                       <div className="flex justify-between text-xs">
                         <span className="text-white/60">Penguasaan Materi</span>
                         <span className="text-white font-bold">75%</span>
                       </div>
                       <Progress value={75} className="h-1.5" style={{ '--progress-foreground': '#0A84FF' } as any} />
                    </div>
                  </div>

                  <h4 className="text-sm font-bold uppercase tracking-widest text-white/30 mt-10">Aktivitas Terakhir</h4>
                  <div className="space-y-4">
                    {selectedStudent.progressLogs.slice(0, 3).map((log: any) => (
                      <div key={log.id} className="flex gap-4 p-4 rounded-2xl bg-black/10 border border-white/5">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                           <Clock className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-white font-medium">Belajar Topik {log.topicId || 'Materi'}</p>
                          <p className="text-xs text-white/40">{log.duration} menit • {formatDistanceToNow(new Date(log.loggedAt), { addSuffix: true })}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full h-14 rounded-2xl bg-white text-black font-bold text-lg mt-10 shadow-2xl">
                    <MessageSquare className="mr-2 h-5 w-5" /> Kirim Notifikasi
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
