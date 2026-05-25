'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Search, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  MoreVertical,
  ChevronRight,
  ArrowLeft,
  Mail,
  GraduationCap,
  Calendar,
  Download,
  ClipboardList,
  FileText
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

export function TeacherSiswaClient({ students }: any) {
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [search, setSearch] = useState('')

  const filteredStudents = students.filter((s: any) => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.class?.name.toLowerCase().includes(search.toLowerCase())
  )

  if (selectedStudent) {
    return (
      <div className="space-y-12">
        <Button 
          variant="ghost" 
          onClick={() => setSelectedStudent(null)}
          className="text-zinc-500 hover:text-white p-0 h-auto font-black uppercase tracking-widest text-[10px]"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar Siswa
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
           <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border-2 border-primary/20">
                 <AvatarImage src={selectedStudent.image} />
                 <AvatarFallback className="bg-zinc-800 text-zinc-500 text-2xl font-black">{selectedStudent.name[0]}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                 <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none">{selectedStudent.name}</h1>
                 <div className="flex items-center gap-4 text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                    <span className="flex items-center gap-1"><GraduationCap className="h-4 w-4" /> {selectedStudent.class?.name || 'No Class'}</span>
                    <span className="flex items-center gap-1"><Mail className="h-4 w-4" /> {selectedStudent.email}</span>
                 </div>
              </div>
           </div>
           
           <div className="flex gap-4">
              <Button 
                onClick={() => window.print()}
                className="bg-[var(--card)] hover:bg-zinc-200 text-[var(--foreground)] rounded-none font-black uppercase text-[10px] h-12 shadow-xl shadow-white/5 px-8"
              >
                <Download className="mr-2 h-4 w-4" /> Unduh Laporan PDF
              </Button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-12">
              <Card className="bg-zinc-900 border-white/5 rounded-none shadow-2xl">
                 <CardHeader className="border-b border-white/5 pb-6">
                    <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-primary">Progres Mata Pelajaran</CardTitle>
                 </CardHeader>
                 <CardContent className="p-8 space-y-8">
                    {selectedStudent.userSubjects.map((us: any) => {
                      const subjectTopics = us.subject.topics?.length || 0
                      const subjectCompleted = new Set(selectedStudent.progressLogs.filter((l: any) => l.topic?.subjectId === us.subjectId).map((l: any) => l.topicId)).size
                      const subProgress = subjectTopics > 0 ? Math.round((subjectCompleted / subjectTopics) * 100) : 0
                      return (
                        <div key={us.id} className="group">
                           <div className="flex justify-between items-center mb-3">
                              <p className="text-sm font-black uppercase italic tracking-tighter group-hover:text-primary transition-colors">{us.subject.name}</p>
                              <span className="text-[10px] font-black uppercase tracking-widest text-primary">{subProgress}% Selesai</span>
                           </div>
                           <Progress value={subProgress} className="h-1 rounded-none bg-black" indicatorClassName="bg-primary" />
                        </div>
                      )
                    })}
                 </CardContent>
              </Card>

              <div className="space-y-6">
                 <div className="flex items-center gap-3">
                    <ClipboardList className="h-5 w-5 text-primary" />
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400">Riwayat Pengerjaan Tugas</h3>
                 </div>
                 <div className="grid grid-cols-1 gap-4">
                    {selectedStudent.studentSubmissions?.length > 0 ? (
                      selectedStudent.studentSubmissions.map((sub: any) => (
                        <Card key={sub.id} className="bg-zinc-900 border-white/5 rounded-none hover:border-primary/20 transition-all group">
                           <CardContent className="p-6 flex items-center justify-between">
                              <div className="flex items-center gap-6">
                                 <div className="h-12 w-12 bg-black border border-white/5 flex items-center justify-center text-primary">
                                    <FileText className="h-5 w-5" />
                                 </div>
                                 <div>
                                    <h4 className="text-sm font-black uppercase italic tracking-tighter group-hover:text-primary transition-colors">{sub.assignment.title}</h4>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mt-1">
                                       {sub.assignment.subject.name} • Diserahkan {new Date(sub.submittedAt).toLocaleDateString('id-ID')}
                                    </p>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <p className="text-xl font-black italic tracking-tighter text-primary">{sub.score || 'N/A'}</p>
                                 <p className="text-[8px] font-black uppercase tracking-widest text-zinc-700">Skor Akhir</p>
                              </div>
                           </CardContent>
                        </Card>
                      ))
                    ) : (
                       <div className="py-12 bg-zinc-900/30 border border-dashed border-white/5 text-center">
                          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-700">Belum ada riwayat tugas</p>
                       </div>
                    )}
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400">Log Belajar Terbaru</h3>
                 </div>
                 <div className="grid grid-cols-1 gap-4">
                  {selectedStudent.progressLogs.map((log: any, i: number) => (
                    <Card key={i} className="bg-zinc-900 border-white/5 rounded-none">
                       <CardContent className="p-6 flex items-center justify-between">
                          <div className="flex items-center gap-6">
                             <div className="text-center w-12 border-r border-white/5 pr-4">
                                <p className="text-[10px] font-black uppercase text-zinc-500">{new Date(log.loggedAt).toLocaleDateString('id-ID', { month: 'short' })}</p>
                                <p className="text-lg font-black">{new Date(log.loggedAt).getDate()}</p>
                             </div>
                             <div>
                                <h4 className="text-sm font-black uppercase italic tracking-tighter">{log.topic.name}</h4>
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mt-1">{log.topic.subject.name} • {log.duration} Menit</p>
                             </div>
                          </div>
                          <Badge className="bg-primary/10 text-primary border-none rounded-none text-[8px] font-black uppercase">Level {log.difficulty}</Badge>
                       </CardContent>
                    </Card>
                  ))}
                 </div>
              </div>
           </div>

           <div className="space-y-8">
              <Card className="bg-zinc-900 border-white/5 rounded-none shadow-2xl">
                 <CardHeader className="border-b border-white/5 pb-6">
                    <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-primary">Ringkasan Analitik</CardTitle>
                 </CardHeader>
                 <CardContent className="p-8 space-y-6">
                    {(() => {
                       const totalMins = selectedStudent.progressLogs.reduce((acc: number, l: any) => acc + (Number(l.duration) || 0), 0)
                       const submissionsWithScore = selectedStudent.studentSubmissions?.filter((s: any) => s.score !== null && !isNaN(Number(s.score))) || []
                       const avgScore = submissionsWithScore.length > 0
                          ? (submissionsWithScore.reduce((acc: number, s: any) => acc + (Number(s.score) || 0), 0) / submissionsWithScore.length).toFixed(1)
                          : 0
                       return (
                          <>
                            <div className="bg-black p-8 border border-white/5 text-center group hover:border-primary/30 transition-all">
                               <Clock className="h-8 w-8 text-primary mx-auto mb-4" />
                               <p className="text-4xl font-black italic tracking-tighter">{(totalMins / 60).toFixed(1)}h</p>
                               <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mt-2">Total Jam Belajar</p>
                            </div>
                            <div className="bg-black p-8 border border-white/5 text-center group hover:border-primary/30 transition-all">
                               <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-4" />
                               <p className="text-4xl font-black italic tracking-tighter">{avgScore}</p>
                               <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mt-2">Skor Rata-rata Tugas</p>
                            </div>
                          </>
                       )
                    })()}
                 </CardContent>
              </Card>
           </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-primary font-black uppercase tracking-widest text-xs mb-2">Student Directory</p>
          <h1 className="text-5xl font-black uppercase italic tracking-tighter">Data Siswa.</h1>
          <p className="text-zinc-500 font-medium mt-2">Monitor profil dan progres akademik siswa Anda secara detail.</p>
        </div>
        
        <div className="relative w-64">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
           <Input 
             placeholder="Cari siswa atau kelas..." 
             className="bg-zinc-900 border-white/5 pl-10 h-14 text-xs rounded-none"
             value={search}
             onChange={(e) => setSearch(e.target.value)}
           />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredStudents.map((student: any, i: number) => {
            // Calculate real progress
            const totalTopics = student.userSubjects.reduce((acc: number, us: any) => acc + (us.subject.topics?.length || 0), 0)
            const completedTopics = new Set(student.progressLogs.map((log: any) => log.topicId)).size
            const progress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0

            return (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card 
                  className="bg-zinc-900 border-white/5 rounded-none hover:border-primary/30 transition-all group cursor-pointer h-full"
                  onClick={() => setSelectedStudent(student)}
                >
                   <CardContent className="p-8 text-center space-y-6">
                      <div className="relative inline-block">
                         <Avatar className="h-20 w-20 mx-auto border-2 border-white/5 group-hover:border-primary/50 transition-all">
                            <AvatarImage src={student.image} />
                            <AvatarFallback className="bg-black text-zinc-500 font-black text-xl">{student.name[0]}</AvatarFallback>
                         </Avatar>
                         <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-500 border-4 border-zinc-900 rounded-full" />
                      </div>
                      
                      <div>
                         <h3 className="font-black uppercase italic tracking-tighter text-lg leading-none group-hover:text-primary transition-colors">{student.name}</h3>
                         <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mt-3">{student.class?.name || 'No Class'}</p>
                      </div>
   
                      <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                         <div className="text-left">
                            <p className="text-sm font-black italic tracking-tighter text-white">{progress}%</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Avg. Progres</p>
                         </div>
                         <ChevronRight className="h-5 w-5 text-zinc-800 group-hover:text-primary transition-colors" />
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
