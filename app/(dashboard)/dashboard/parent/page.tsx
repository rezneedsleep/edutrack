import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  Calendar, 
  FileText, 
  TrendingUp, 
  BookOpen, 
  School, 
  Mail, 
  Phone,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import { format } from "date-fns"
import { id as idLocale } from "date-fns/locale"

export const dynamic = 'force-dynamic'

export default async function ParentDashboardPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }

  const role = (session.user as any)?.role
  const studentId = (session.user as any)?.id

  if (role !== 'PARENT') {
    redirect("/dashboard")
  }

  const student = await prisma.user.findUnique({
    where: { id: studentId },
    include: {
      class: true,
      studentSubmissions: {
        include: {
          assignment: {
            include: {
              subject: true
            }
          }
        },
        orderBy: { submittedAt: 'desc' }
      },
      progressLogs: {
        include: {
          topic: {
            include: {
              subject: true
            }
          }
        },
        orderBy: { loggedAt: 'desc' }
      },
      userSubjects: {
        include: {
          subject: true
        }
      },
      userNotes: {
        include: {
          author: true
        },
        orderBy: { createdAt: 'desc' }
      },
      attendances: {
        orderBy: { date: 'desc' }
      }
    }
  })

  if (!student) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-500">Data siswa tidak ditemukan</h2>
        <p className="text-sm text-[var(--muted-foreground)] mt-2">Silakan hubungi administrator sekolah.</p>
      </div>
    )
  }

  // Calculate statistics
  const totalSubmissions = student.studentSubmissions?.length || 0
  const gradedSubmissions = student.studentSubmissions?.filter((s: any) => s.score !== null).length || 0
  const averageScore = gradedSubmissions > 0 
    ? Math.round(student.studentSubmissions.reduce((acc: number, s: any) => acc + (s.score || 0), 0) / gradedSubmissions)
    : 0

  const totalLearningHours = student.progressLogs?.reduce((acc: number, log: any) => acc + (Number(log.duration) || 0), 0) || 0

  const sickCount = student.attendances?.filter((a: any) => a.status === 'SICK').length || 0
  const permissionCount = student.attendances?.filter((a: any) => a.status === 'PERMISSION').length || 0
  const absentCount = student.attendances?.filter((a: any) => a.status === 'ABSENT').length || 0
  const presentCount = student.attendances?.filter((a: any) => a.status === 'PRESENT').length || 0
  const totalDays = student.attendances?.length || 0
  const attendanceRate = totalDays > 0 ? Math.round((presentCount / totalDays) * 100) : 100

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#5483B3] to-[#3B6FA0] p-8 text-white shadow-lg">
        <div className="relative z-10 space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-[#B3C8E3]">Portal Wali Murid</p>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Selamat Datang, Bapak/Ibu Wali</h1>
          <p className="text-sm text-[#E2ECF6] max-w-xl">
            Pantau perkembangan akademis, aktivitas belajar mandiri, dan kehadiran putra/putri Anda secara langsung di platform EduTrack.
          </p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 skew-x-12 translate-x-10 pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Child Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden">
            <div className="h-2 bg-[#5483B3]" />
            <CardContent className="p-6 space-y-6">
              <div className="text-center space-y-3">
                <div className="h-24 w-24 bg-[var(--muted)] border-2 border-[var(--border)] shadow-md mx-auto rounded-full flex items-center justify-center overflow-hidden">
                  {student.image ? (
                    <img src={student.image} alt={student.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-3xl font-extrabold text-[#5483B3]">{student.name.substring(0,2).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[var(--foreground)]">{student.name}</h3>
                  <Badge className="bg-[#5483B3]/10 text-[#5483B3] border-none font-bold uppercase text-[10px] tracking-wider mt-1 px-2.5 py-0.5">
                    {student.class?.name || "Belum ada kelas"}
                  </Badge>
                </div>
              </div>

              <div className="border-t border-[var(--border)] pt-4 space-y-4 text-xs font-medium">
                <div className="flex justify-between items-center py-1">
                  <span className="text-[var(--muted-foreground)]">NIS Siswa</span>
                  <span className="text-[var(--foreground)] font-bold">{student.nis || "-"}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-[var(--muted-foreground)]">Sekolah</span>
                  <span className="text-[var(--foreground)] font-semibold">{student.school || "-"}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-[var(--muted-foreground)]">Rata-rata Nilai</span>
                  <span className="text-green-600 font-extrabold">{averageScore}%</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-[var(--muted-foreground)]">Rasio Kehadiran</span>
                  <span className="text-blue-600 font-extrabold">{attendanceRate}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Panels */}
        <div className="lg:col-span-3 space-y-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-600">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-[var(--foreground)]">{totalSubmissions}</p>
                  <p className="text-xs text-[var(--muted-foreground)] font-bold uppercase tracking-wider mt-0.5">Tugas Dikumpulkan</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-[var(--foreground)]">{totalLearningHours} Menit</p>
                  <p className="text-xs text-[var(--muted-foreground)] font-bold uppercase tracking-wider mt-0.5">Total Belajar Mandiri</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-600">
                  <UserCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-[var(--foreground)]">{presentCount} Hari</p>
                  <p className="text-xs text-[var(--muted-foreground)] font-bold uppercase tracking-wider mt-0.5">Hadir di Kelas</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Attendance Detail */}
          <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm">
            <CardHeader className="border-b border-[var(--border)] pb-4">
              <CardTitle className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#5483B3]" /> Kehadiran & Ketidakhadiran
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-3 divide-x divide-[var(--border)] text-center">
              <div className="space-y-1">
                <p className="text-3xl font-extrabold text-yellow-600">{sickCount}</p>
                <p className="text-xs text-[var(--muted-foreground)] font-bold">Sakit</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-extrabold text-blue-600">{permissionCount}</p>
                <p className="text-xs text-[var(--muted-foreground)] font-bold">Izin</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-extrabold text-red-600">{absentCount}</p>
                <p className="text-xs text-[var(--muted-foreground)] font-bold">Tanpa Keterangan</p>
              </div>
            </CardContent>
          </Card>

          {/* Grades and Progress */}
          <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm">
            <CardHeader className="border-b border-[var(--border)] pb-4">
              <CardTitle className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[#5483B3]" /> Progress Mata Pelajaran
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              {student.userSubjects?.map((us: any) => (
                <div key={us.id} className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <p className="font-semibold text-[var(--foreground)]">{us.subject.name}</p>
                    <p className="font-bold text-[#5483B3] bg-[#5483B3]/10 px-2 py-0.5 rounded-md">
                      {Math.min(100, Math.round((totalLearningHours / (us.targetHours || 10)) * 100))}%
                    </p>
                  </div>
                  <Progress value={Math.min(100, Math.round((totalLearningHours / (us.targetHours || 10)) * 100))} className="h-2" indicatorClassName="bg-[#5483B3]" />
                </div>
              ))}
              {!student.userSubjects?.length && (
                <div className="py-8 text-center text-xs text-[var(--muted-foreground)]">
                  Belum ada mata pelajaran terdaftar.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assignments */}
          <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm">
            <CardHeader className="border-b border-[var(--border)] pb-4">
              <CardTitle className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#5483B3]" /> Evaluasi Tugas & Nilai
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-[var(--border)]">
                {student.studentSubmissions?.slice(0, 5).map((sub: any) => (
                  <div key={sub.id} className="flex items-center justify-between p-5 hover:bg-[var(--muted)]/50 transition-colors">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-1 block">
                        {sub.assignment.subject.name}
                      </span>
                      <p className="text-sm font-bold text-[var(--foreground)]">{sub.assignment.title}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-extrabold text-[#5483B3]">{sub.score !== null ? sub.score : "-"}</p>
                      <p className="text-[9px] font-bold text-[var(--muted-foreground)] uppercase">Skor diperoleh</p>
                    </div>
                  </div>
                ))}
                {!student.studentSubmissions?.length && (
                  <div className="text-center py-12 text-xs text-[var(--muted-foreground)]">
                    Belum ada riwayat pengumpulan tugas.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Class Notes */}
          <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm">
            <CardHeader className="border-b border-[var(--border)] pb-4">
              <CardTitle className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-[#5483B3]" /> Catatan Perkembangan Siswa
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-[var(--border)]">
                {student.userNotes?.map((note: any) => (
                  <div key={note.id} className="p-6 space-y-3 hover:bg-[var(--muted)]/50 transition-colors">
                    <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                      <Badge className="bg-[var(--muted)] text-[var(--muted-foreground)] border-[var(--border)] rounded-md font-bold uppercase text-[9px]">
                        {note.type}
                      </Badge>
                      <span>•</span>
                      <span>{format(new Date(note.createdAt), 'dd MMMM yyyy', { locale: idLocale })}</span>
                      <span>•</span>
                      <span>Oleh: <strong className="text-[var(--foreground)] font-bold">{note.author.name}</strong></span>
                    </div>
                    <p className="text-sm font-medium text-[var(--foreground)] bg-[var(--muted)] p-4 rounded-xl leading-relaxed italic">
                      "{note.content}"
                    </p>
                  </div>
                ))}
                {!student.userNotes?.length && (
                  <div className="py-12 text-center text-xs text-[var(--muted-foreground)]">
                    Belum ada catatan khusus mengenai perkembangan putra/putri Anda.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
