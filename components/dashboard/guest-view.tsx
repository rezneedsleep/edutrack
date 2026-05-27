'use client'

import { useEffect } from 'react'

import { motion } from 'framer-motion'
import { 
  Shield, 
  Clock, 
  BookOpen, 
  GraduationCap, 
  MessageCircle, 
  ArrowRight,
  Sparkles,
  UserCheck,
  Mail
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export function GuestDashboard({ user }: any) {
  const features = [
    {
      icon: BookOpen,
      title: 'Kelola Mata Pelajaran',
      description: 'Akses materi dan kurikulum yang terstruktur dengan rapi.',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      icon: GraduationCap,
      title: 'Pantau Progres Belajar',
      description: 'Lacak pencapaian dan perkembangan akademik secara real-time.',
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      icon: MessageCircle,
      title: 'Forum Diskusi',
      description: 'Berdiskusi dan berkolaborasi dengan sesama peserta didik.',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
    {
      icon: Clock,
      title: 'Kalender Akademik',
      description: 'Jadwal tugas, ujian, dan acara penting dalam satu tempat.',
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
  ]

  useEffect(() => {
    // FORCE CLEAR SERVICE WORKER
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
          registration.unregister()
        }
      })
    }
  }, [])

  return (
    <div className="space-y-10 pb-20 max-w-5xl mx-auto">
      {/* Welcome Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#5483B3] via-[#3B6FA0] to-[#2C5A8A] p-8 md:p-12 text-white shadow-2xl shadow-[#5483B3]/20"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImRvdHMiIHg9IjAiIHk9IjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNkb3RzKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/10">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <Badge className="bg-white/15 text-white border-white/20 backdrop-blur-sm rounded-lg text-[10px] font-bold uppercase tracking-wider px-3 py-1">
              Akun Tamu
            </Badge>
          </div>
          
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              Selamat Datang, {user?.name || 'Pengguna'}! 👋
            </h1>
            <p className="text-base md:text-lg text-white/80 font-medium max-w-2xl leading-relaxed">
              Akun Anda berhasil terdaftar di EduTrack. Saat ini Anda masuk sebagai <span className="text-white font-bold">Tamu</span>. 
              Hubungi administrator sekolah untuk mendapatkan peran sebagai Siswa atau Guru agar dapat mengakses seluruh fitur platform.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/10">
              <Mail className="h-4 w-4 text-white/70" />
              <span className="text-sm font-semibold text-white/90">{user?.email}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/10">
              <Shield className="h-4 w-4 text-white/70" />
              <span className="text-sm font-semibold text-white/90">Role: Tamu</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="h-16 w-16 bg-amber-500/10 rounded-2xl flex items-center justify-center shrink-0">
                <UserCheck className="h-8 w-8 text-amber-500" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-extrabold text-[var(--foreground)] tracking-tight">Aktivasi Akun Penuh</h3>
                <p className="text-sm text-[var(--muted-foreground)] font-medium leading-relaxed">
                  Untuk mengakses dashboard siswa, guru, atau fitur lengkap lainnya, hubungi administrator sekolah Anda dan minta mereka mengubah peran akun Anda melalui panel <strong>Kelola Pengguna</strong>.
                </p>
              </div>
              <Link href="/dashboard/help">
                <Button className="bg-[#5483B3] hover:bg-[#3B6FA0] text-white font-bold rounded-xl h-12 px-8 shadow-md shadow-[#5483B3]/20 transition-all hover:-translate-y-0.5 gap-2 whitespace-nowrap">
                  Pusat Bantuan
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Feature Preview */}
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <p className="text-[#5483B3] font-bold uppercase tracking-wider text-xs mb-2">Platform Preview</p>
          <h2 className="text-2xl font-extrabold tracking-tight text-[var(--foreground)]">Fitur yang Menanti Anda</h2>
          <p className="text-sm text-[var(--muted-foreground)] font-medium mt-2">Setelah administrator mengaktifkan peran Anda, Anda akan mendapatkan akses ke fitur-fitur berikut.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
            >
              <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-sm hover:shadow-md hover:border-[#5483B3]/20 transition-all group h-full">
                <CardContent className="p-6 flex items-start gap-5">
                  <div className={`h-12 w-12 ${feature.bg} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-bold text-[var(--foreground)] group-hover:text-[#5483B3] transition-colors">{feature.title}</h4>
                    <p className="text-xs text-[var(--muted-foreground)] font-medium leading-relaxed">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
