import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { RBAC } from "@/lib/rbac"
import { AdminOverview } from "@/components/dashboard/admin-overview"
import {
  KepalaSekolahDashboard,
  KetuaYayasanDashboard,
  WakasekKurikulumDashboard,
  WakasekKesiswaanDashboard,
  WakasekHubinDashboard,
  BendaharaSekolahDashboard,
  BendaharaYayasanDashboard,
  TataUsahaDashboard,
  KaprogDashboard,
  OperationalDashboard,
  WaliKelasDashboard,
  GuruBkDashboard,
} from "@/components/dashboard/role-dashboards"

export default async function Page() {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }

  const role = (session.user as any)?.role
  const userId = (session.user as any)?.id

  if (!RBAC.canAccessAdminDashboard(role)) {
    redirect("/dashboard?reason=unauthorized")
  }

  // === SHARED STATS (used by most roles) ===
  const [userCount, studentCount, teacherCount, subjectCount, classCount] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: { in: ['STUDENT', 'SISWA'] } } }),
    prisma.user.count({ where: { role: { in: ['TEACHER', 'GURU_MAPEL', 'WALI_KELAS'] } } }),
    prisma.subject.count(),
    prisma.class.count(),
  ])

  const baseStats = { userCount, studentCount, teacherCount, subjectCount, classCount }

  // === ROLE-SPECIFIC RENDERING ===

  // KETUA YAYASAN - Read-only macro view
  if (role === 'KETUA_YAYASAN') {
    const billings = await prisma.billing.groupBy({
      by: ['status'],
      _sum: { amount: true },
      _count: true
    })
    const financeSummary = {
      totalPaid: billings.find(b => b.status === 'PAID')?._sum.amount || 0,
      totalPending: billings.find(b => b.status === 'PENDING')?._sum.amount || 0,
      totalUnpaid: billings.find(b => b.status === 'UNPAID')?._sum.amount || 0,
    }
    return <KetuaYayasanDashboard stats={baseStats} financeSummary={financeSummary} />
  }

  // KEPALA SEKOLAH - School overview + teacher performance
  if (role === 'KEPALA_SEKOLAH') {
    const ekskulCount = await prisma.extracurricular.count()
    const teacherStats = await prisma.user.findMany({
      where: { role: { in: ['TEACHER', 'GURU_MAPEL'] } },
      select: { id: true, name: true, _count: { select: { teacherSubjects: true, teacherAssignments: true } } },
      take: 10
    })
    return <KepalaSekolahDashboard stats={{ ...baseStats, ekskulCount }} recentUsers={[]} teacherStats={teacherStats} />
  }

  // WAKASEK KURIKULUM - Curriculum management
  if (role === 'WAKASEK_KURIKULUM') {
    const scheduleCount = await prisma.classSchedule.count()
    const subjects = await prisma.subject.findMany({
      include: { teacher: { select: { name: true } }, _count: { select: { topics: true } } },
      orderBy: { name: 'asc' }
    })
    return <WakasekKurikulumDashboard stats={{ ...baseStats, scheduleCount }} schedules={[]} subjects={subjects} />
  }

  // WAKASEK KESISWAAN - Student affairs
  if (role === 'WAKASEK_KESISWAAN') {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const todayAttendance = await prisma.attendance.groupBy({
      by: ['status'],
      where: { date: { gte: today, lt: tomorrow } },
      _count: true
    })
    const attendanceSummary = {
      presentToday: todayAttendance.find(a => a.status === 'PRESENT')?._count || 0,
      absentToday: todayAttendance.find(a => a.status === 'ABSENT')?._count || 0,
      permissionToday: (todayAttendance.find(a => a.status === 'PERMISSION')?._count || 0) + (todayAttendance.find(a => a.status === 'SICK')?._count || 0),
    }
    const recentStudents = await prisma.user.findMany({
      where: { role: { in: ['STUDENT', 'SISWA'] } },
      include: { class: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 5
    })
    return <WakasekKesiswaanDashboard stats={baseStats} attendanceSummary={attendanceSummary} recentStudents={recentStudents} />
  }

  // WAKASEK HUBIN - External relations + alumni
  if (role === 'WAKASEK_HUBIN') {
    const [alumniCount, jobCount, workingCount, ekskulCount] = await Promise.all([
      prisma.alumniProfile.count(),
      prisma.jobPosting.count({ where: { isActive: true } }),
      prisma.alumniProfile.count({ where: { currentStatus: 'WORKING' } }),
      prisma.extracurricular.count(),
    ])
    return <WakasekHubinDashboard stats={baseStats} alumniStats={{ alumniCount, jobCount, workingCount }} ekskulCount={ekskulCount} />
  }

  // BENDAHARA SEKOLAH - Detailed billing
  if (role === 'BENDAHARA_SEKOLAH') {
    const billings = await prisma.billing.groupBy({
      by: ['status'],
      _sum: { amount: true },
      _count: true
    })
    const recentBillings = await prisma.billing.findMany({
      include: { student: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 10
    })
    const financeSummary = {
      totalPaid: billings.find(b => b.status === 'PAID')?._sum.amount || 0,
      totalPending: billings.find(b => b.status === 'PENDING')?._sum.amount || 0,
      totalUnpaid: billings.find(b => b.status === 'UNPAID')?._sum.amount || 0,
      pendingCount: billings.find(b => b.status === 'PENDING')?._count || 0,
      totalBillings: billings.reduce((sum, b) => sum + b._count, 0),
    }
    return <BendaharaSekolahDashboard financeSummary={financeSummary} recentBillings={recentBillings} />
  }

  // BENDAHARA YAYASAN - Macro finance view
  if (role === 'BENDAHARA_YAYASAN') {
    const billings = await prisma.billing.groupBy({
      by: ['status'],
      _sum: { amount: true },
      _count: true
    })
    const financeSummary = {
      totalPaid: billings.find(b => b.status === 'PAID')?._sum.amount || 0,
      totalPending: billings.find(b => b.status === 'PENDING')?._sum.amount || 0,
      totalUnpaid: billings.find(b => b.status === 'UNPAID')?._sum.amount || 0,
    }
    return <BendaharaYayasanDashboard financeSummary={financeSummary} stats={baseStats} />
  }

  // TATA USAHA - User management focus
  if (role === 'TATA_USAHA') {
    const recentUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    })
    return <TataUsahaDashboard stats={baseStats} recentUsers={recentUsers} />
  }

  // KAPROG - Department head
  if (role === 'KAPROG') {
    const subjects = await prisma.subject.findMany({
      include: { teacher: { select: { name: true } }, _count: { select: { topics: true } } },
      orderBy: { name: 'asc' }
    })
    return <KaprogDashboard stats={baseStats} subjects={subjects} />
  }

  // WALI KELAS - Class homeroom teacher
  if (role === 'WALI_KELAS') {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { classId: true } })
    const classStudents = user?.classId ? await prisma.user.findMany({
      where: { classId: user.classId, role: { in: ['STUDENT', 'SISWA'] } },
      select: { id: true, name: true, nis: true, email: true },
      orderBy: { name: 'asc' }
    }) : []
    const classInfo = user?.classId ? await prisma.class.findUnique({ where: { id: user.classId } }) : null
    const assignmentCount = user?.classId ? await prisma.assignment.count({ where: { classId: user.classId } }) : 0
    return <WaliKelasDashboard 
      stats={{ ...baseStats, avgAttendance: 0, assignmentCount, subjectCount }} 
      classStudents={classStudents} 
      className={classInfo?.name || ''} 
    />
  }

  // GURU BK - Counseling
  if (role === 'GURU_BK') {
    const noteCount = await prisma.userNote.count()
    const recentNotes = await prisma.userNote.findMany({
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 5
    })
    return <GuruBkDashboard stats={{ ...baseStats, noteCount }} recentNotes={recentNotes} />
  }

  // KEPALA LAB
  if (role === 'KEPALA_LAB') {
    return <OperationalDashboard roleName="Kepala Lab / Bengkel" roleDesc="Kelola jadwal lab, inventaris perangkat, dan log perbaikan alat" stats={baseStats} />
  }

  // STAF SARPRAS
  if (role === 'STAF_SARPRAS') {
    return <OperationalDashboard roleName="Staf Sarana Prasarana" roleDesc="Kelola inventaris barang, laporan kerusakan, dan pemeliharaan" stats={baseStats} />
  }

  // PANITIA PPDB
  if (role === 'PANITIA_PPDB') {
    return <OperationalDashboard roleName="Panitia PPDB" roleDesc="Kelola pendaftaran, validasi berkas, dan ujian masuk" stats={baseStats} />
  }

  // === DEFAULT: ADMIN / SUPER_ADMIN - Full admin overview ===
  const [recentUsers, roleDistribution] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    }),
    prisma.user.groupBy({
      by: ['role'],
      _count: { role: true }
    })
  ])

  const formatRole = (role: string) => {
    if (role === 'GURU_BK') return 'Guru BK'
    return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
  }

  const roleColors: Record<string, string> = {
    STUDENT: '#3b82f6', SISWA: '#3b82f6',
    TEACHER: '#10b981', GURU_MAPEL: '#10b981',
    PARENT: '#f59e0b', ORANG_TUA: '#f59e0b',
    COACH: '#8b5cf6',
    ADMIN: '#ef4444', SUPER_ADMIN: '#dc2626',
    WAKASEK_KURIKULUM: '#0ea5e9', WAKASEK_KESISWAAN: '#0284c7', WAKASEK_HUBIN: '#0369a1',
    KETUA_YAYASAN: '#6366f1', BENDAHARA_YAYASAN: '#4f46e5',
    KEPALA_SEKOLAH: '#8b5cf6',
    BENDAHARA_SEKOLAH: '#14b8a6', TATA_USAHA: '#f97316',
    WALI_KELAS: '#22c55e', GURU_BK: '#84cc16',
    KAPROG: '#eab308', KEPALA_LAB: '#d946ef', STAF_SARPRAS: '#ec4899',
    PANITIA_PPDB: '#f43f5e', PUSTAKAWAN: '#a855f7', PETUGAS_UKS: '#06b6d4',
    ALUMNI: '#64748b'
  }

  const chartData = roleDistribution.map(item => ({
    name: formatRole(item.role),
    value: item._count.role,
    fill: roleColors[item.role] || '#94a3b8'
  }))

  return (
    <AdminOverview 
      stats={baseStats}
      recentUsers={recentUsers}
      chartData={chartData}
    />
  )
}
