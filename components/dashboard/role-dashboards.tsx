'use client'

import { motion } from 'framer-motion'
import { 
  Users, GraduationCap, BookOpen, ShieldCheck, TrendingUp, 
  Activity, School, ChevronRight, Calendar, FileBarChart,
  Wallet, ClipboardList, UserCheck, CheckCircle2, AlertCircle,
  BarChart3, PieChart, Clock, Building2, Trophy, Star
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

// ============================================================
// KEPALA SEKOLAH DASHBOARD
// ============================================================
export function KepalaSekolahDashboard({ stats, recentUsers, teacherStats }: any) {
  const statCards = [
    { label: 'Total Pengguna', value: stats.userCount, icon: Users, color: '#5483B3' },
    { label: 'Siswa Aktif', value: stats.studentCount, icon: GraduationCap, color: '#22C55E' },
    { label: 'Total Guru', value: stats.teacherCount, icon: ShieldCheck, color: '#8B5CF6' },
    { label: 'Mata Pelajaran', value: stats.subjectCount, icon: BookOpen, color: '#F59E0B' },
    { label: 'Kelas', value: stats.classCount, icon: School, color: '#EF4444' },
    { label: 'Ekskul', value: stats.ekskulCount || 0, icon: Trophy, color: '#06B6D4' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Dashboard Kepala Sekolah</h1>
        <p className="text-sm text-[var(--muted-foreground)]">Pantau kinerja sekolah dan otorisasi keputusan strategis</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl">
              <CardContent className="p-4 text-center">
                <div className="mx-auto h-10 w-10 rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
                  {(() => { const Icon = card.icon; return <Icon className="h-5 w-5" / />; })()}
                </div>
                <p className="text-2xl font-extrabold text-[var(--foreground)]">{card.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] mt-1">{card.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Kinerja Guru */}
      <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl">
        <CardHeader className="border-b border-[var(--border)]">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#8B5CF6]" /> Pemantauan Kinerja Guru
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-[var(--border)]">
            {(teacherStats || []).slice(0, 8).map((t: any) => (
              <div key={t.id} className="flex items-center justify-between p-4 hover:bg-[var(--muted)]/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] font-bold text-xs">
                    {t.name?.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--foreground)]">{t.name}</p>
                    <p className="text-[10px] text-[var(--muted-foreground)]">{t._count?.teacherSubjects || 0} mapel • {t._count?.teacherAssignments || 0} tugas dibuat</p>
                  </div>
                </div>
                <Badge className="bg-green-500/10 text-green-600 border-none text-[10px] font-bold">Aktif</Badge>
              </div>
            ))}
            {(!teacherStats || teacherStats.length === 0) && (
              <div className="p-8 text-center text-sm text-[var(--muted-foreground)]">Belum ada data guru.</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Kelola Pengguna', href: '/dashboard/admin/users', icon: Users },
          { label: 'Laporan Akademik', href: '/dashboard/admin/reports', icon: FileBarChart },
          { label: 'Pengaturan', href: '/dashboard/admin/settings', icon: Activity },
          { label: 'Pengumuman', href: '/dashboard/admin/announcements', icon: ClipboardList },
        ].map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl hover:border-[#5483B3]/50 transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                {(() => { const Icon = link.icon; return <Icon className="h-5 w-5 text-[#5483B3]" / />; })()}
                <span className="text-sm font-bold text-[var(--foreground)]">{link.label}</span>
                <ChevronRight className="h-4 w-4 ml-auto text-[var(--muted-foreground)]" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// KETUA YAYASAN DASHBOARD (Read-Only Macro View)
// ============================================================
export function KetuaYayasanDashboard({ stats, financeSummary }: any) {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge className="bg-amber-500/10 text-amber-600 border-none text-[10px] font-bold uppercase">Read-Only</Badge>
        </div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Dashboard Ketua Yayasan</h1>
        <p className="text-sm text-[var(--muted-foreground)]">Laporan makro keuangan dan pertumbuhan sekolah</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Siswa', value: stats.studentCount, icon: GraduationCap, color: '#22C55E' },
          { label: 'Total Guru', value: stats.teacherCount, icon: ShieldCheck, color: '#8B5CF6' },
          { label: 'Total Kelas', value: stats.classCount, icon: School, color: '#F59E0B' },
          { label: 'Total Pengguna', value: stats.userCount, icon: Users, color: '#5483B3' },
        ].map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl">
              <CardContent className="p-5 text-center">
                <div className="mx-auto h-12 w-12 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
                  {(() => { const Icon = card.icon; return <Icon className="h-6 w-6" / />; })()}
                </div>
                <p className="text-3xl font-extrabold text-[var(--foreground)]">{card.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] mt-1">{card.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Ringkasan Keuangan */}
      <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl">
        <CardHeader className="border-b border-[var(--border)]">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Wallet className="h-4 w-4 text-green-600" /> Ringkasan Keuangan Sekolah
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-3 divide-x divide-[var(--border)] text-center">
          <div className="space-y-1">
            <p className="text-2xl font-extrabold text-green-600">Rp {((financeSummary?.totalPaid || 0) / 1000000).toFixed(1)}jt</p>
            <p className="text-xs font-bold text-[var(--muted-foreground)]">Total Terbayar</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-extrabold text-yellow-600">Rp {((financeSummary?.totalPending || 0) / 1000000).toFixed(1)}jt</p>
            <p className="text-xs font-bold text-[var(--muted-foreground)]">Menunggu Verifikasi</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-extrabold text-red-600">Rp {((financeSummary?.totalUnpaid || 0) / 1000000).toFixed(1)}jt</p>
            <p className="text-xs font-bold text-[var(--muted-foreground)]">Belum Dibayar</p>
          </div>
        </CardContent>
      </Card>

      <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-700 dark:text-amber-400">
          <strong>Mode Read-Only:</strong> Sebagai Ketua Yayasan, Anda dapat memantau seluruh data tanpa dapat mengubah data operasional harian.
        </div>
      </div>
    </div>
  )
}

// ============================================================
// WAKASEK KURIKULUM DASHBOARD
// ============================================================
export function WakasekKurikulumDashboard({ stats, schedules, subjects }: any) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Dashboard Wakasek Kurikulum</h1>
        <p className="text-sm text-[var(--muted-foreground)]">Kelola jadwal pelajaran, KKM, dan pembagian jam mengajar</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Mata Pelajaran', value: stats.subjectCount, icon: BookOpen, color: '#5483B3' },
          { label: 'Jadwal Aktif', value: stats.scheduleCount || 0, icon: Calendar, color: '#22C55E' },
          { label: 'Total Guru', value: stats.teacherCount, icon: ShieldCheck, color: '#8B5CF6' },
          { label: 'Total Kelas', value: stats.classCount, icon: School, color: '#F59E0B' },
        ].map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl">
              <CardContent className="p-4 text-center">
                <div className="mx-auto h-10 w-10 rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
                  {(() => { const Icon = card.icon; return <Icon className="h-5 w-5" / />; })()}
                </div>
                <p className="text-2xl font-extrabold">{card.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] mt-1">{card.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Kelola Jadwal', desc: 'Atur jadwal pelajaran per kelas', href: '/dashboard/admin/schedules', icon: Calendar, color: '#22C55E' },
          { label: 'Kelola Mapel', desc: 'Tambah & edit mata pelajaran', href: '/dashboard/admin/subjects', icon: BookOpen, color: '#5483B3' },
          { label: 'Laporan Akademik', desc: 'Lihat rekap nilai dan rapor', href: '/dashboard/admin/reports', icon: FileBarChart, color: '#8B5CF6' },
        ].map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl hover:border-[#5483B3]/50 transition-all cursor-pointer h-full">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                  {(() => { const Icon = item.icon; return <Icon className="h-5 w-5" / />; })()}
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--foreground)]">{item.label}</p>
                  <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{item.desc}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Subject List */}
      <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl">
        <CardHeader className="border-b border-[var(--border)]">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[#5483B3]" /> Daftar Mata Pelajaran
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-[var(--border)]">
            {(subjects || []).slice(0, 10).map((s: any) => (
              <div key={s.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: s.color || '#5483B3' }}>
                    {s.name?.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--foreground)]">{s.name}</p>
                    <p className="text-[10px] text-[var(--muted-foreground)]">Guru: {s.teacher?.name || 'Belum ditugaskan'}</p>
                  </div>
                </div>
                <Badge className="bg-[var(--muted)] text-[var(--muted-foreground)] border-none text-[10px]">
                  {s._count?.topics || 0} topik
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ============================================================
// WAKASEK KESISWAAN DASHBOARD
// ============================================================
export function WakasekKesiswaanDashboard({ stats, attendanceSummary, recentStudents }: any) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Dashboard Wakasek Kesiswaan</h1>
        <p className="text-sm text-[var(--muted-foreground)]">Pantau absensi global, data poin, dan program OSIS</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Siswa', value: stats.studentCount, icon: GraduationCap, color: '#5483B3' },
          { label: 'Hadir Hari Ini', value: attendanceSummary?.presentToday || 0, icon: CheckCircle2, color: '#22C55E' },
          { label: 'Tidak Hadir', value: attendanceSummary?.absentToday || 0, icon: AlertCircle, color: '#EF4444' },
          { label: 'Izin / Sakit', value: attendanceSummary?.permissionToday || 0, icon: Clock, color: '#F59E0B' },
        ].map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl">
              <CardContent className="p-4 text-center">
                <div className="mx-auto h-10 w-10 rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
                  {(() => { const Icon = card.icon; return <Icon className="h-5 w-5" / />; })()}
                </div>
                <p className="text-2xl font-extrabold">{card.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] mt-1">{card.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Kehadiran & Izin */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/dashboard/admin/students">
          <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl hover:border-[#5483B3]/50 transition-colors cursor-pointer">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold">Kelola Data Siswa</p>
                <p className="text-xs text-[var(--muted-foreground)]">Lihat profil dan data siswa aktif</p>
              </div>
              <ChevronRight className="h-4 w-4 ml-auto text-[var(--muted-foreground)]" />
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/teacher/requests">
          <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl hover:border-[#5483B3]/50 transition-colors cursor-pointer">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-600">
                <UserCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold">Verifikasi Izin Siswa</p>
                <p className="text-xs text-[var(--muted-foreground)]">Proses pengajuan izin & sakit</p>
              </div>
              <ChevronRight className="h-4 w-4 ml-auto text-[var(--muted-foreground)]" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Siswa Terdaftar Terbaru */}
      <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl">
        <CardHeader className="border-b border-[var(--border)]">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-[#5483B3]" /> Siswa Terdaftar Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-[var(--border)]">
            {(recentStudents || []).slice(0, 5).map((s: any) => (
              <div key={s.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-[#5483B3]/10 flex items-center justify-center text-[#5483B3] font-bold text-xs">
                    {s.name?.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{s.name}</p>
                    <p className="text-[10px] text-[var(--muted-foreground)]">{s.class?.name || 'Tanpa kelas'} • NIS: {s.nis || '-'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ============================================================
// WAKASEK HUBIN DASHBOARD
// ============================================================
export function WakasekHubinDashboard({ stats, alumniStats, ekskulCount }: any) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Dashboard Wakasek Hubin / Humas</h1>
        <p className="text-sm text-[var(--muted-foreground)]">Kemitraan industri, program BKK, dan penempatan PKL</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Alumni', value: alumniStats?.alumniCount || 0, icon: GraduationCap, color: '#5483B3' },
          { label: 'Lowongan Aktif', value: alumniStats?.jobCount || 0, icon: Building2, color: '#22C55E' },
          { label: 'Alumni Bekerja', value: alumniStats?.workingCount || 0, icon: Star, color: '#F59E0B' },
          { label: 'Ekskul Aktif', value: ekskulCount || 0, icon: Trophy, color: '#8B5CF6' },
        ].map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl">
              <CardContent className="p-4 text-center">
                <div className="mx-auto h-10 w-10 rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
                  {(() => { const Icon = card.icon; return <Icon className="h-5 w-5" / />; })()}
                </div>
                <p className="text-2xl font-extrabold">{card.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] mt-1">{card.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/dashboard/alumni">
          <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl hover:border-[#5483B3]/50 transition-colors cursor-pointer">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600"><GraduationCap className="h-6 w-6" /></div>
              <div>
                <p className="text-sm font-bold">Portal Alumni</p>
                <p className="text-xs text-[var(--muted-foreground)]">Tracer study & lowongan kerja</p>
              </div>
              <ChevronRight className="h-4 w-4 ml-auto text-[var(--muted-foreground)]" />
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/admin/extracurriculars">
          <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl hover:border-[#5483B3]/50 transition-colors cursor-pointer">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600"><Trophy className="h-6 w-6" /></div>
              <div>
                <p className="text-sm font-bold">Kelola Ekskul</p>
                <p className="text-xs text-[var(--muted-foreground)]">Program ekstrakurikuler</p>
              </div>
              <ChevronRight className="h-4 w-4 ml-auto text-[var(--muted-foreground)]" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}

// ============================================================
// BENDAHARA SEKOLAH DASHBOARD
// ============================================================
export function BendaharaSekolahDashboard({ financeSummary, recentBillings }: any) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Dashboard Bendahara Sekolah</h1>
        <p className="text-sm text-[var(--muted-foreground)]">Kelola tagihan SPP, konfirmasi pembayaran, dan rekap kas</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Terbayar', value: `Rp ${((financeSummary?.totalPaid || 0) / 1000000).toFixed(1)}jt`, icon: CheckCircle2, color: '#22C55E' },
          { label: 'Menunggu Verifikasi', value: financeSummary?.pendingCount || 0, icon: Clock, color: '#F59E0B' },
          { label: 'Belum Dibayar', value: `Rp ${((financeSummary?.totalUnpaid || 0) / 1000000).toFixed(1)}jt`, icon: AlertCircle, color: '#EF4444' },
          { label: 'Total Tagihan', value: financeSummary?.totalBillings || 0, icon: Wallet, color: '#5483B3' },
        ].map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl">
              <CardContent className="p-4 text-center">
                <div className="mx-auto h-10 w-10 rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
                  {(() => { const Icon = card.icon; return <Icon className="h-5 w-5" / />; })()}
                </div>
                <p className="text-xl font-extrabold">{card.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] mt-1">{card.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Billings */}
      <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl">
        <CardHeader className="border-b border-[var(--border)] flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Wallet className="h-4 w-4 text-[#5483B3]" /> Tagihan Terbaru
          </CardTitle>
          <Link href="/dashboard/admin/billing" className="text-xs text-[#5483B3] font-bold hover:underline">Lihat Semua →</Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-[var(--border)]">
            {(recentBillings || []).slice(0, 8).map((b: any) => (
              <div key={b.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-bold">{b.title}</p>
                  <p className="text-[10px] text-[var(--muted-foreground)]">{b.student?.name || 'Unknown'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-extrabold">Rp {(b.amount || 0).toLocaleString('id-ID')}</p>
                  <Badge className={`border-none text-[10px] font-bold ${
                    b.status === 'PAID' ? 'bg-green-500/10 text-green-600' :
                    b.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-600' :
                    'bg-red-500/10 text-red-600'
                  }`}>{b.status === 'PAID' ? 'Lunas' : b.status === 'PENDING' ? 'Proses' : 'Belum Bayar'}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ============================================================
// BENDAHARA YAYASAN DASHBOARD
// ============================================================
export function BendaharaYayasanDashboard({ financeSummary, stats }: any) {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge className="bg-amber-500/10 text-amber-600 border-none text-[10px] font-bold uppercase">Level Yayasan</Badge>
        </div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Dashboard Bendahara Yayasan</h1>
        <p className="text-sm text-[var(--muted-foreground)]">Laporan keuangan terintegrasi dan persetujuan anggaran</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-2xl">
          <CardContent className="p-6 text-center">
            <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-3xl font-extrabold text-green-600">Rp {((financeSummary?.totalPaid || 0) / 1000000).toFixed(1)}jt</p>
            <p className="text-xs font-bold text-green-700/70 mt-1">Pemasukan Terbayar</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/20 rounded-2xl">
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-3xl font-extrabold text-yellow-600">Rp {((financeSummary?.totalPending || 0) / 1000000).toFixed(1)}jt</p>
            <p className="text-xs font-bold text-yellow-700/70 mt-1">Menunggu Verifikasi</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 rounded-2xl">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="text-3xl font-extrabold text-red-600">Rp {((financeSummary?.totalUnpaid || 0) / 1000000).toFixed(1)}jt</p>
            <p className="text-xs font-bold text-red-700/70 mt-1">Piutang Belum Dibayar</p>
          </CardContent>
        </Card>
      </div>

      <Link href="/dashboard/admin/billing">
        <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl hover:border-[#5483B3]/50 transition-colors cursor-pointer">
          <CardContent className="p-5 flex items-center gap-4">
            <Wallet className="h-6 w-6 text-[#5483B3]" />
            <div>
              <p className="text-sm font-bold">Kelola Keuangan & SPP</p>
              <p className="text-xs text-[var(--muted-foreground)]">Lihat detail tagihan, verifikasi pembayaran</p>
            </div>
            <ChevronRight className="h-4 w-4 ml-auto text-[var(--muted-foreground)]" />
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}

// ============================================================
// TATA USAHA DASHBOARD
// ============================================================
export function TataUsahaDashboard({ stats, recentUsers }: any) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Dashboard Tata Usaha</h1>
        <p className="text-sm text-[var(--muted-foreground)]">Kelola data pengguna, siswa, guru, dan administrasi sekolah</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Pengguna', value: stats.userCount, icon: Users, color: '#5483B3' },
          { label: 'Siswa', value: stats.studentCount, icon: GraduationCap, color: '#22C55E' },
          { label: 'Guru', value: stats.teacherCount, icon: ShieldCheck, color: '#8B5CF6' },
          { label: 'Kelas', value: stats.classCount, icon: School, color: '#F59E0B' },
        ].map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl">
              <CardContent className="p-4 text-center">
                <div className="mx-auto h-10 w-10 rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
                  {(() => { const Icon = card.icon; return <Icon className="h-5 w-5" / />; })()}
                </div>
                <p className="text-2xl font-extrabold">{card.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] mt-1">{card.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Kelola Pengguna', desc: 'CRUD data siswa, guru, staf', href: '/dashboard/admin/users', icon: Users, color: '#5483B3' },
          { label: 'Kelola Siswa', desc: 'Data detail siswa aktif', href: '/dashboard/admin/students', icon: GraduationCap, color: '#22C55E' },
          { label: 'Kelola Kelas', desc: 'Buat & atur kelas', href: '/dashboard/admin/classes', icon: School, color: '#F59E0B' },
        ].map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl hover:border-[#5483B3]/50 transition-all cursor-pointer">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                  {(() => { const Icon = item.icon; return <Icon className="h-5 w-5" / />; })()}
                </div>
                <div>
                  <p className="text-sm font-bold">{item.label}</p>
                  <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{item.desc}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Users */}
      <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl">
        <CardHeader className="border-b border-[var(--border)]">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Users className="h-4 w-4 text-[#5483B3]" /> Pengguna Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-[var(--border)]">
            {(recentUsers || []).map((u: any) => (
              <div key={u.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-[#5483B3]/10 flex items-center justify-center text-[#5483B3] font-bold text-xs">
                    {u.name?.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{u.name}</p>
                    <p className="text-[10px] text-[var(--muted-foreground)]">{u.email}</p>
                  </div>
                </div>
                <Badge className="bg-[var(--muted)] text-[var(--muted-foreground)] border-none text-[10px] font-bold">{u.role}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ============================================================
// KAPROG DASHBOARD
// ============================================================
export function KaprogDashboard({ stats, subjects }: any) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Dashboard Kepala Program Keahlian</h1>
        <p className="text-sm text-[var(--muted-foreground)]">Kelola kurikulum jurusan dan kompetensi kejuruan</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: 'Mata Pelajaran', value: stats.subjectCount, icon: BookOpen, color: '#5483B3' },
          { label: 'Total Guru', value: stats.teacherCount, icon: ShieldCheck, color: '#8B5CF6' },
          { label: 'Total Kelas', value: stats.classCount, icon: School, color: '#F59E0B' },
        ].map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl">
              <CardContent className="p-5 text-center">
                <div className="mx-auto h-10 w-10 rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
                  {(() => { const Icon = card.icon; return <Icon className="h-5 w-5" / />; })()}
                </div>
                <p className="text-2xl font-extrabold">{card.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] mt-1">{card.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/dashboard/admin/subjects">
          <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl hover:border-[#5483B3]/50 transition-colors cursor-pointer">
            <CardContent className="p-5 flex items-center gap-4">
              <BookOpen className="h-6 w-6 text-[#5483B3]" />
              <div><p className="text-sm font-bold">Kelola Mapel</p><p className="text-xs text-[var(--muted-foreground)]">Kurikulum jurusan</p></div>
              <ChevronRight className="h-4 w-4 ml-auto text-[var(--muted-foreground)]" />
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/admin/reports">
          <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl hover:border-[#5483B3]/50 transition-colors cursor-pointer">
            <CardContent className="p-5 flex items-center gap-4">
              <FileBarChart className="h-6 w-6 text-[#8B5CF6]" />
              <div><p className="text-sm font-bold">Laporan Akademik</p><p className="text-xs text-[var(--muted-foreground)]">Rekap nilai siswa</p></div>
              <ChevronRight className="h-4 w-4 ml-auto text-[var(--muted-foreground)]" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}

// ============================================================
// GENERIC OPERATIONAL DASHBOARD (Kepala Lab, Staf Sarpras, Panitia PPDB)
// ============================================================
export function OperationalDashboard({ roleName, roleDesc, stats }: any) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Dashboard {roleName}</h1>
        <p className="text-sm text-[var(--muted-foreground)]">{roleDesc}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Pengguna', value: stats.userCount, icon: Users, color: '#5483B3' },
          { label: 'Total Siswa', value: stats.studentCount, icon: GraduationCap, color: '#22C55E' },
          { label: 'Total Guru', value: stats.teacherCount, icon: ShieldCheck, color: '#8B5CF6' },
          { label: 'Total Kelas', value: stats.classCount, icon: School, color: '#F59E0B' },
        ].map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl">
              <CardContent className="p-4 text-center">
                <div className="mx-auto h-10 w-10 rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
                  {(() => { const Icon = card.icon; return <Icon className="h-5 w-5" / />; })()}
                </div>
                <p className="text-2xl font-extrabold">{card.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] mt-1">{card.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5 flex items-start gap-3">
        <Activity className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700 dark:text-blue-400">
          <strong>Selamat datang, {roleName}!</strong> Fitur-fitur khusus untuk peran Anda sedang dalam tahap pengembangan. Sementara itu, Anda dapat mengakses menu-menu di sidebar untuk mengelola data sekolah.
        </div>
      </div>
    </div>
  )
}

// ============================================================
// WALI KELAS DASHBOARD
// ============================================================
export function WaliKelasDashboard({ stats, classStudents, className: kelasName }: any) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Dashboard Wali Kelas</h1>
        <p className="text-sm text-[var(--muted-foreground)]">Rekap kelas {kelasName || ''} — absensi, nilai, dan catatan perkembangan siswa</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Siswa di Kelas', value: classStudents?.length || 0, icon: GraduationCap, color: '#5483B3' },
          { label: 'Rata-rata Kehadiran', value: `${stats.avgAttendance || 0}%`, icon: CheckCircle2, color: '#22C55E' },
          { label: 'Tugas Dibuat', value: stats.assignmentCount || 0, icon: ClipboardList, color: '#F59E0B' },
          { label: 'Mapel Kelas', value: stats.subjectCount || 0, icon: BookOpen, color: '#8B5CF6' },
        ].map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl">
              <CardContent className="p-4 text-center">
                <div className="mx-auto h-10 w-10 rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
                  {(() => { const Icon = card.icon; return <Icon className="h-5 w-5" / />; })()}
                </div>
                <p className="text-2xl font-extrabold">{card.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] mt-1">{card.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Student List */}
      <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl">
        <CardHeader className="border-b border-[var(--border)]">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-[#5483B3]" /> Daftar Siswa Kelas {kelasName}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-[var(--border)]">
            {(classStudents || []).map((s: any, idx: number) => (
              <div key={s.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[var(--muted-foreground)] w-6">{idx + 1}</span>
                  <div className="h-8 w-8 rounded-full bg-[#5483B3]/10 flex items-center justify-center text-[#5483B3] font-bold text-xs">
                    {s.name?.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{s.name}</p>
                    <p className="text-[10px] text-[var(--muted-foreground)]">NIS: {s.nis || '-'}</p>
                  </div>
                </div>
                <Link href={`/dashboard/admin/users/${s.id}`}>
                  <Badge className="bg-[#5483B3]/10 text-[#5483B3] border-none text-[10px] font-bold cursor-pointer hover:bg-[#5483B3]/20">Detail →</Badge>
                </Link>
              </div>
            ))}
            {(!classStudents || classStudents.length === 0) && (
              <div className="p-8 text-center text-sm text-[var(--muted-foreground)]">Belum ada siswa di kelas ini.</div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/dashboard/admin/reports">
          <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl hover:border-[#5483B3]/50 transition-colors cursor-pointer">
            <CardContent className="p-5 flex items-center gap-4">
              <FileBarChart className="h-6 w-6 text-[#5483B3]" />
              <div><p className="text-sm font-bold">Cetak e-Rapor</p><p className="text-xs text-[var(--muted-foreground)]">Validasi dan cetak rapor siswa</p></div>
              <ChevronRight className="h-4 w-4 ml-auto text-[var(--muted-foreground)]" />
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/siswa-guru">
          <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl hover:border-[#5483B3]/50 transition-colors cursor-pointer">
            <CardContent className="p-5 flex items-center gap-4">
              <Users className="h-6 w-6 text-[#22C55E]" />
              <div><p className="text-sm font-bold">Data Siswa Lengkap</p><p className="text-xs text-[var(--muted-foreground)]">Lihat detail per siswa</p></div>
              <ChevronRight className="h-4 w-4 ml-auto text-[var(--muted-foreground)]" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}

// ============================================================
// GURU BK DASHBOARD
// ============================================================
export function GuruBkDashboard({ stats, recentNotes }: any) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Dashboard Guru BK</h1>
        <p className="text-sm text-[var(--muted-foreground)]">Bimbingan konseling, catatan perilaku, dan penjurusan karier</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Siswa', value: stats.studentCount, icon: GraduationCap, color: '#5483B3' },
          { label: 'Catatan Perilaku', value: stats.noteCount || 0, icon: ClipboardList, color: '#F59E0B' },
          { label: 'Total Kelas', value: stats.classCount, icon: School, color: '#8B5CF6' },
        ].map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl">
              <CardContent className="p-5 text-center">
                <div className="mx-auto h-10 w-10 rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
                  {(() => { const Icon = card.icon; return <Icon className="h-5 w-5" / />; })()}
                </div>
                <p className="text-2xl font-extrabold">{card.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] mt-1">{card.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/dashboard/siswa-guru">
          <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl hover:border-[#5483B3]/50 transition-colors cursor-pointer">
            <CardContent className="p-5 flex items-center gap-4">
              <Users className="h-6 w-6 text-[#5483B3]" />
              <div><p className="text-sm font-bold">Data Siswa</p><p className="text-xs text-[var(--muted-foreground)]">Lihat profil & catatan siswa</p></div>
              <ChevronRight className="h-4 w-4 ml-auto text-[var(--muted-foreground)]" />
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/admin/reports">
          <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl hover:border-[#5483B3]/50 transition-colors cursor-pointer">
            <CardContent className="p-5 flex items-center gap-4">
              <FileBarChart className="h-6 w-6 text-[#8B5CF6]" />
              <div><p className="text-sm font-bold">Laporan Akademik</p><p className="text-xs text-[var(--muted-foreground)]">Grafik kedisiplinan & rekap</p></div>
              <ChevronRight className="h-4 w-4 ml-auto text-[var(--muted-foreground)]" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Notes */}
      <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl">
        <CardHeader className="border-b border-[var(--border)]">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-[#F59E0B]" /> Catatan Perilaku Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-[var(--border)]">
            {(recentNotes || []).slice(0, 5).map((n: any) => (
              <div key={n.id} className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-bold">{n.user?.name || 'Siswa'}</p>
                  <Badge className="bg-[var(--muted)] text-[var(--muted-foreground)] border-none text-[10px]">{n.type}</Badge>
                </div>
                <p className="text-xs text-[var(--muted-foreground)] italic">"{n.content}"</p>
              </div>
            ))}
            {(!recentNotes || recentNotes.length === 0) && (
              <div className="p-8 text-center text-sm text-[var(--muted-foreground)]">Belum ada catatan perilaku.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
