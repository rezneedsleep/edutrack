'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  GraduationCap, 
  BookOpen, 
  ClipboardCheck, 
  Clock, 
  Calendar,
  Mail,
  School,
  FileText,
  TrendingUp,
  Award,
  AlertCircle,
  Phone,
  MapPin,
  Fingerprint,
  Users as UsersIcon
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import Link from 'next/link'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

export function StudentDetailClient({ student }: any) {
  const [activeTab, setActiveTab] = useState('overview')

  // Calculate some stats
  const totalSubmissions = student.studentSubmissions?.length || 0
  const gradedSubmissions = student.studentSubmissions?.filter((s: any) => s.score !== null).length || 0
  const averageScore = gradedSubmissions > 0 
    ? Math.round(student.studentSubmissions.reduce((acc: number, s: any) => acc + (s.score || 0), 0) / gradedSubmissions)
    : 0

  const totalLearningHours = student.progressLogs?.reduce((acc: number, log: any) => acc + (Number(log.duration) || 0), 0) || 0

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/admin/users">
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-[var(--border)] hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] shadow-sm transition-all">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <p className="text-[#5483B3] font-bold uppercase tracking-widest text-xs mb-1">Profil Pengguna</p>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)]">{student.name}</h1>
          </motion.div>
        </div>
        <div className="flex items-center gap-3">
          {student.role === 'STUDENT' && (
            <Link href={`/dashboard/reports/${student.id}/print`} target="_blank">
              <Button className="bg-[#5483B3] hover:bg-[#3B6FA0] text-white rounded-xl font-bold text-xs h-10 px-4 shadow-sm flex items-center gap-2">
                <FileText className="h-4 w-4" /> Cetak Rapor Digital
              </Button>
            </Link>
          )}
          <Badge className="bg-[#5483B3]/10 text-[#5483B3] hover:bg-[#5483B3]/20 border-none rounded-lg text-[11px] font-bold uppercase px-3 py-1.5 shadow-sm transition-colors">
            ID: {student.id.substring(0, 8)}
          </Badge>
          <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-none rounded-lg text-[11px] font-bold uppercase px-3 py-1.5 shadow-sm transition-colors">
            Active Student
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar: Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-xl shadow-[#5483B3]/5 overflow-hidden">
            <div className="h-2 bg-[#5483B3]" />
            <CardContent className="p-8 space-y-8">
              <div className="h-32 w-32 bg-[var(--muted)] border-4 border-white shadow-lg mx-auto rounded-full flex items-center justify-center overflow-hidden">
                {student.image ? (
                  <img src={student.image} alt={student.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-4xl font-extrabold text-[#5483B3]">{student.name.substring(0,2).toUpperCase()}</span>
                )}
              </div>
              
              <div className="space-y-6 text-center lg:text-left">
                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] flex items-center justify-center lg:justify-start gap-2">
                    <Mail className="h-3.5 w-3.5 text-[#5483B3]" /> Alamat Email
                  </p>
                  <p className="text-sm font-semibold text-[var(--foreground)] truncate bg-[var(--muted)] py-2 px-3 rounded-xl">{student.email}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] flex items-center justify-center lg:justify-start gap-2">
                    <School className="h-3.5 w-3.5 text-[#5483B3]" /> Institusi
                  </p>
                  <p className="text-sm font-semibold text-[var(--foreground)]">{student.school || 'Belum diatur'}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] flex items-center justify-center lg:justify-start gap-2">
                    <GraduationCap className="h-3.5 w-3.5 text-[#5483B3]" /> {student.role === 'TEACHER' ? 'Mata Pelajaran' : 'Kelas'}
                  </p>
                  <p className="text-sm font-bold text-[#5483B3] uppercase bg-[#5483B3]/10 py-1.5 px-3 rounded-lg inline-flex">
                    {student.role === 'TEACHER' 
                      ? (student.teacherSubjects?.[0]?.name || 'No Subject') 
                      : (student.class?.name || 'No Class')}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] flex items-center justify-center lg:justify-start gap-2">
                    <Fingerprint className="h-3.5 w-3.5 text-[#5483B3]" /> {student.role === 'STUDENT' ? 'NIS' : 'NIP / ID'}
                  </p>
                  <p className="text-sm font-semibold text-[var(--foreground)] uppercase">{student.nis || '-'}</p>
                </div>
                {student.role === 'STUDENT' && (
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] flex items-center justify-center lg:justify-start gap-2">
                      <Fingerprint className="h-3.5 w-3.5 text-[#5483B3]" /> PIN Orang Tua
                    </p>
                    <p className="text-sm font-mono font-semibold text-[var(--foreground)]">{student.parentPin || '123456'}</p>
                  </div>
                )}
                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] flex items-center justify-center lg:justify-start gap-2">
                    <Phone className="h-3.5 w-3.5 text-[#5483B3]" /> Nomor Telepon
                  </p>
                  {student.phone ? (
                    <a href={`tel:${student.phone}`} className="text-sm font-semibold text-[#5483B3] hover:underline">{student.phone}</a>
                  ) : (
                    <p className="text-sm font-semibold text-[var(--foreground)]">-</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] flex items-center justify-center lg:justify-start gap-2">
                    <UsersIcon className="h-3.5 w-3.5 text-[#5483B3]" /> Jenis Kelamin
                  </p>
                  <p className="text-sm font-semibold text-[var(--foreground)]">{student.gender || '-'}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] flex items-center justify-center lg:justify-start gap-2">
                    <MapPin className="h-3.5 w-3.5 text-[#5483B3]" /> Alamat
                  </p>
                  <p className="text-xs font-medium text-[var(--foreground)] leading-relaxed p-3 bg-[var(--muted)] rounded-xl">{student.address || '-'}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-[var(--border)] space-y-4">
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Statistik Singkat</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#5483B3]/5 p-4 rounded-xl border border-[#5483B3]/10 text-center transition-all hover:-translate-y-1 hover:shadow-md">
                    <p className="text-2xl font-extrabold text-[#5483B3]">{averageScore}%</p>
                    <p className="text-[10px] font-bold uppercase text-[var(--foreground)] mt-1">Nilai Rata-rata</p>
                  </div>
                  <div className="bg-[#5483B3]/5 p-4 rounded-xl border border-[#5483B3]/10 text-center transition-all hover:-translate-y-1 hover:shadow-md">
                    <p className="text-2xl font-extrabold text-[#5483B3]">{totalSubmissions}</p>
                    <p className="text-[10px] font-bold uppercase text-[var(--foreground)] mt-1">Tugas Selesai</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Content: Tabs */}
        <div className="lg:col-span-3 space-y-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-[var(--muted)] border border-[var(--border)] p-1.5 rounded-2xl mb-8 w-full justify-start overflow-x-auto shadow-sm gap-2">
              <TabsTrigger value="overview" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-[#5483B3] data-[state=active]:shadow-sm font-bold text-xs px-6 py-2.5 transition-all text-[var(--muted-foreground)]">Ikhtisar</TabsTrigger>
              <TabsTrigger value="assignments" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-[#5483B3] data-[state=active]:shadow-sm font-bold text-xs px-6 py-2.5 transition-all text-[var(--muted-foreground)]">Tugas</TabsTrigger>
              <TabsTrigger value="progress" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-[#5483B3] data-[state=active]:shadow-sm font-bold text-xs px-6 py-2.5 transition-all text-[var(--muted-foreground)]">Progress</TabsTrigger>
              <TabsTrigger value="attendance" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-[#5483B3] data-[state=active]:shadow-sm font-bold text-xs px-6 py-2.5 transition-all text-[var(--muted-foreground)]">Absensi</TabsTrigger>
              <TabsTrigger value="notes" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-[#5483B3] data-[state=active]:shadow-sm font-bold text-xs px-6 py-2.5 transition-all text-[var(--muted-foreground)]">Catatan</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="border-b border-[var(--border)] pb-4">
                    <CardTitle className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-[#5483B3]/10 flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-[#5483B3]" />
                      </div>
                      Progress Pembelajaran
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-5">
                      {student.userSubjects?.map((us: any) => (
                        <div key={us.id} className="space-y-2.5">
                          <div className="flex justify-between items-center">
                            <p className="text-xs font-semibold text-[var(--foreground)]">{us.subject.name}</p>
                            <p className="text-xs font-extrabold text-[#5483B3] bg-[#5483B3]/10 px-2 py-0.5 rounded-md">{Math.min(100, Math.round((totalLearningHours / (us.targetHours || 10)) * 100))}%</p>
                          </div>
                          <Progress value={Math.min(100, Math.round((totalLearningHours / (us.targetHours || 10)) * 100))} className="h-2 bg-[var(--muted)]" indicatorClassName="bg-[#5483B3]" />
                        </div>
                      ))}
                      {!student.userSubjects?.length && (
                        <div className="py-8 text-center bg-[var(--muted)] rounded-xl border border-dashed border-[var(--border)]">
                           <p className="text-xs text-[var(--muted-foreground)] font-medium">Belum ada mata pelajaran terdaftar</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="border-b border-[var(--border)] pb-4">
                    <CardTitle className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                        <Award className="h-4 w-4 text-yellow-600" />
                      </div>
                      Pencapaian Terbaru
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-sm hover:shadow-md transition-all group">
                      <div className="h-12 w-12 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-600 group-hover:scale-110 transition-transform">
                        <Award className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[var(--foreground)]">Top 10 Leaderboard</p>
                        <p className="text-xs text-[var(--muted-foreground)] font-medium mt-0.5">Pencapaian Minggu Ini</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-sm opacity-60 grayscale hover:grayscale-0 transition-all group">
                      <div className="h-12 w-12 bg-[#5483B3]/10 rounded-xl flex items-center justify-center text-[#5483B3] group-hover:scale-110 transition-transform">
                        <Clock className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[var(--foreground)]">Early Bird</p>
                        <p className="text-xs text-[var(--muted-foreground)] font-medium mt-0.5">Selesaikan 5 Tugas Tepat Waktu</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                 <CardHeader className="border-b border-[var(--border)] pb-4">
                    <CardTitle className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
                       <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                          <ClipboardCheck className="h-4 w-4 text-green-600" />
                       </div>
                       Tugas Terakhir Diselesaikan
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="p-0">
                    <div className="divide-y divide-[var(--border)]">
                       {student.studentSubmissions?.slice(0, 3).map((sub: any) => (
                          <div key={sub.id} className="flex items-center justify-between p-6 bg-[var(--card)] hover:bg-[var(--muted)] transition-colors">
                             <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                                   <FileText className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                   <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-1">{sub.assignment.subject.name}</p>
                                   <p className="text-sm font-bold text-[var(--foreground)]">{sub.assignment.title}</p>
                                </div>
                             </div>
                             <div className="text-right">
                                <p className="text-2xl font-extrabold text-[#5483B3]">{sub.score || '-'}</p>
                                <p className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase">Skor</p>
                             </div>
                          </div>
                       ))}
                       {!student.studentSubmissions?.length && (
                          <div className="text-center py-12">
                             <div className="h-16 w-16 bg-[var(--muted)] rounded-2xl flex items-center justify-center mx-auto mb-4">
                               <FileText className="h-8 w-8 text-[var(--muted-foreground)]" />
                             </div>
                             <p className="text-sm font-bold text-[var(--foreground)]">Belum ada tugas</p>
                             <p className="text-xs text-[var(--muted-foreground)] mt-1">Siswa ini belum mengumpulkan tugas apapun.</p>
                          </div>
                       )}
                    </div>
                 </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assignments" className="mt-0 space-y-6">
               <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden">
                  <CardContent className="p-0">
                     <div className="grid grid-cols-1 divide-y divide-[var(--border)]">
                        {student.studentSubmissions?.map((sub: any) => (
                           <div key={sub.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[var(--muted)] transition-all">
                              <div className="flex items-start sm:items-center gap-5">
                                 <div className="h-14 w-14 bg-[#5483B3]/10 border border-[#5483B3]/20 rounded-xl flex items-center justify-center text-[#5483B3] font-extrabold text-lg shadow-sm">
                                    {sub.score || '?'}
                                 </div>
                                 <div>
                                    <Badge variant="outline" className="text-[10px] font-bold uppercase text-[var(--muted-foreground)] border-[var(--border)] mb-2">
                                       {sub.assignment.subject.name}
                                    </Badge>
                                    <h4 className="text-base font-bold text-[var(--foreground)] mb-1">{sub.assignment.title}</h4>
                                    <p className="text-xs text-[var(--muted-foreground)] font-medium flex items-center gap-1.5">
                                       <Calendar className="h-3.5 w-3.5" /> Dikumpulkan: {format(new Date(sub.submittedAt), 'dd MMMM yyyy', { locale: idLocale })}
                                    </p>
                                 </div>
                              </div>
                              <Button variant="outline" className="w-full sm:w-auto rounded-xl border-[var(--border)] text-xs font-bold hover:bg-[var(--muted)] hover:text-[#5483B3] h-10 px-6 shadow-sm">Lihat Jawaban</Button>
                           </div>
                        ))}
                        {!student.studentSubmissions?.length && (
                           <div className="py-20 text-center">
                              <div className="h-16 w-16 bg-[var(--muted)] rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <FileText className="h-8 w-8 text-[var(--muted-foreground)]" />
                              </div>
                              <p className="text-sm font-bold text-[var(--foreground)]">Daftar tugas kosong</p>
                              <p className="text-xs text-[var(--muted-foreground)] mt-1">Siswa ini belum mengumpulkan tugas apapun.</p>
                           </div>
                        )}
                     </div>
                  </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="progress" className="mt-0 space-y-6">
               <div className="grid grid-cols-1 gap-4">
                  {student.progressLogs?.map((log: any) => (
                     <Card key={log.id} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl hover:shadow-md hover:border-[#5483B3]/30 transition-all group overflow-hidden">
                        <CardContent className="p-0 flex flex-col sm:flex-row items-stretch">
                           <div className="bg-[#5483B3]/5 p-6 flex flex-col justify-center items-center sm:items-start min-w-[160px] border-b sm:border-b-0 sm:border-r border-[var(--border)]">
                              <p className="text-xs font-bold text-[var(--muted-foreground)] uppercase mb-1">{format(new Date(log.loggedAt), 'EEEE', { locale: idLocale })}</p>
                              <p className="text-sm font-extrabold text-[#5483B3] text-center sm:text-left">{format(new Date(log.loggedAt), 'dd MMM yyyy', { locale: idLocale })}</p>
                           </div>
                           <div className="p-6 flex-1 flex flex-col justify-center">
                              <div className="flex items-center gap-2 mb-3 flex-wrap">
                                 <Badge className="bg-[#5483B3]/10 text-[#5483B3] border-none text-[10px] font-bold">{log.topic.subject.name}</Badge>
                                 <Badge variant="outline" className="border-[var(--border)] text-[var(--muted-foreground)] text-[10px] font-bold">{log.topic.name}</Badge>
                              </div>
                              <h4 className="text-base font-bold text-[var(--foreground)] flex items-center gap-2">
                                 <BookOpen className="h-4 w-4 text-[#5483B3]" /> Belajar {log.duration} Menit
                              </h4>
                              {log.notes && (
                                 <p className="text-sm text-[var(--muted-foreground)] mt-3 bg-[var(--muted)] p-3 rounded-xl italic">"{log.notes}"</p>
                              )}
                           </div>
                        </CardContent>
                     </Card>
                  ))}
                  {!student.progressLogs?.length && (
                     <div className="py-20 text-center bg-[var(--card)] rounded-2xl border border-dashed border-[var(--border)]">
                        <div className="h-16 w-16 bg-[var(--muted)] rounded-2xl flex items-center justify-center mx-auto mb-4">
                           <TrendingUp className="h-8 w-8 text-[var(--muted-foreground)]" />
                        </div>
                        <p className="text-sm font-bold text-[var(--foreground)]">Belum ada aktivitas</p>
                        <p className="text-xs text-[var(--muted-foreground)] mt-1">Siswa ini belum memiliki log progres belajar.</p>
                     </div>
                  )}
               </div>
            </TabsContent>

            <TabsContent value="attendance" className="mt-0 space-y-6">
               <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden">
                  <div className="h-1.5 w-full bg-yellow-400" />
                  <CardHeader className="border-b border-[var(--border)] pb-4">
                     <CardTitle className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-yellow-400/10 flex items-center justify-center">
                           <AlertCircle className="h-4 w-4 text-yellow-600" />
                        </div>
                        Ringkasan Kehadiran
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[var(--border)] p-0">
                     <div className="p-8 bg-[var(--card)] text-center hover:bg-[var(--muted)] transition-colors">
                        <p className="text-5xl font-extrabold text-[var(--foreground)]">
                            {student.attendances?.filter((a: any) => a.status === 'SICK').length || 0}
                        </p>
                        <Badge className="bg-yellow-400/10 text-yellow-600 border-none mt-4 font-bold">Sakit (S)</Badge>
                     </div>
                     <div className="p-8 bg-[var(--card)] text-center hover:bg-[var(--muted)] transition-colors">
                        <p className="text-5xl font-extrabold text-[var(--foreground)]">
                            {student.attendances?.filter((a: any) => a.status === 'PERMISSION').length || 0}
                        </p>
                        <Badge className="bg-blue-500/10 text-blue-600 border-none mt-4 font-bold">Izin (I)</Badge>
                     </div>
                     <div className="p-8 bg-[var(--card)] text-center hover:bg-[var(--muted)] transition-colors">
                        <p className="text-5xl font-extrabold text-[var(--foreground)]">
                            {student.attendances?.filter((a: any) => a.status === 'ABSENT').length || 0}
                        </p>
                        <Badge className="bg-red-500/10 text-red-600 border-none mt-4 font-bold">Tanpa Keterangan (A)</Badge>
                     </div>
                  </CardContent>
               </Card>
               
               <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm">
                  <CardHeader className="border-b border-[var(--border)] pb-4">
                     <CardTitle className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-[#5483B3]/10 flex items-center justify-center">
                           <Calendar className="h-4 w-4 text-[#5483B3]" />
                        </div>
                        Riwayat Absensi Lengkap
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                     <div className="divide-y divide-[var(--border)]">
                        {student.attendances?.map((att: any) => (
                           <div key={att.id} className="flex items-center justify-between p-4 hover:bg-[var(--muted)] transition-colors">
                              <div className="flex items-center gap-3">
                                 <div className="h-10 w-10 bg-[var(--card)] border border-[var(--border)] rounded-xl flex items-center justify-center shadow-sm">
                                    <Calendar className="h-4 w-4 text-[var(--muted-foreground)]" />
                                 </div>
                                 <p className="text-sm font-bold text-[var(--foreground)]">{format(new Date(att.date), 'dd MMMM yyyy', { locale: idLocale })}</p>
                              </div>
                              <Badge className={`rounded-lg font-bold text-[10px] uppercase px-3 py-1 shadow-sm border-none ${
                                 att.status === 'PRESENT' ? 'bg-green-500/10 text-green-600' :
                                 att.status === 'SICK' ? 'bg-yellow-400/10 text-yellow-600' :
                                 att.status === 'PERMISSION' ? 'bg-blue-500/10 text-blue-600' :
                                 'bg-red-500/10 text-red-600'
                              }`}>
                                 {att.status}
                              </Badge>
                           </div>
                        ))}
                        {!student.attendances?.length && (
                           <div className="p-8 text-center">
                              <p className="text-sm text-[var(--muted-foreground)] font-medium">Belum ada riwayat absensi.</p>
                           </div>
                        )}
                     </div>
                  </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="notes" className="mt-0 space-y-6">
               <div className="space-y-4">
                  <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm">
                     <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--border)] pb-4 gap-4">
                        <CardTitle className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
                           <div className="h-8 w-8 rounded-lg bg-[#5483B3]/10 flex items-center justify-center">
                              <FileText className="h-4 w-4 text-[#5483B3]" />
                           </div>
                           Catatan Wali Kelas / Admin
                        </CardTitle>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button size="sm" className="rounded-xl bg-[#5483B3] hover:bg-[#3B6FA0] text-white shadow-sm font-bold text-xs h-9">
                                  + Tambah Catatan
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-2xl p-6">
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-bold text-[var(--foreground)]">Tambah Catatan Baru</DialogTitle>
                                    <DialogDescription className="text-sm text-[var(--muted-foreground)] font-medium">
                                        Tambahkan evaluasi atau catatan khusus untuk profil siswa ini.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="py-4 space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-[var(--foreground)]">Isi Catatan</Label>
                                        <textarea 
                                            id="note-content"
                                            className="w-full h-32 bg-[var(--muted)] border border-transparent p-4 font-medium text-sm text-[var(--foreground)] focus:bg-white focus:border-[#5483B3] focus:ring-2 focus:ring-[#5483B3]/20 transition-all rounded-xl outline-none resize-none"
                                            placeholder="Tulis catatan mengenai siswa di sini..."
                                        />
                                    </div>
                                    <Button 
                                        onClick={async () => {
                                            const content = (document.getElementById('note-content') as HTMLTextAreaElement).value;
                                            if (!content) return;
                                            const res = await fetch(`/api/admin/users/${student.id}/notes`, {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ content })
                                            });
                                            if (res.ok) {
                                                window.location.reload();
                                            }
                                        }}
                                        className="w-full h-12 bg-[#5483B3] hover:bg-[#3B6FA0] text-white font-bold rounded-xl shadow-lg shadow-[#5483B3]/20 transition-all"
                                    >
                                        Simpan Catatan
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                     </CardHeader>
                     <CardContent className="p-0">
                        <div className="divide-y divide-[var(--border)]">
                           {student.userNotes?.map((note: any) => (
                              <div key={note.id} className="p-6 space-y-3 hover:bg-[var(--muted)]/50 transition-colors">
                                 <div className="flex flex-wrap items-center gap-3">
                                    <Badge className="bg-[var(--muted)] text-[var(--muted-foreground)] border-[var(--border)] rounded-md text-[10px] font-bold uppercase">{note.type}</Badge>
                                    <span className="text-xs text-[var(--muted-foreground)] font-medium flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {format(new Date(note.createdAt), 'dd MMMM yyyy', { locale: idLocale })}
                                    </span>
                                    <span className="text-xs text-[var(--muted-foreground)] font-medium flex items-center gap-1.5 ml-auto sm:ml-0">
                                        <UsersIcon className="h-3.5 w-3.5" />
                                        Oleh: <span className="font-bold text-[var(--foreground)]">{note.author.name}</span>
                                    </span>
                                 </div>
                                 <p className="text-sm font-medium text-[var(--foreground)] bg-[var(--muted)] p-4 rounded-xl leading-relaxed border border-[var(--border)] shadow-sm">"{note.content}"</p>
                              </div>
                           ))}
                           {!student.userNotes?.length && (
                              <div className="py-16 text-center">
                                 <div className="h-16 w-16 bg-[var(--muted)] rounded-2xl flex items-center justify-center mx-auto mb-4">
                                   <FileText className="h-8 w-8 text-[var(--muted-foreground)]" />
                                 </div>
                                 <p className="text-sm font-bold text-[var(--foreground)]">Belum ada catatan</p>
                                 <p className="text-xs text-[var(--muted-foreground)] mt-1">Belum ada evaluasi atau catatan khusus untuk siswa ini.</p>
                              </div>
                           )}
                        </div>
                     </CardContent>
                  </Card>
               </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

