'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  GraduationCap, 
  ArrowRight, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  BarChart3, 
  MessageSquare, 
  ShieldCheck,
  ChevronLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function FiturPage() {
  const features = [
    { 
      title: 'Block Editor (Notion Style)', 
      desc: 'Tulis catatan, agenda belajar, dan rangkuman materi dengan editor blok interaktif yang fleksibel dan responsif.', 
      icon: BookOpen,
      color: 'bg-blue-500/10 text-blue-500'
    },
    { 
      title: 'Kalender & Reminder', 
      desc: 'Kelola jadwal kelas, jadwal ekstrakurikuler, dan atur pengingat otomatis untuk tenggat waktu tugas terdekat.', 
      icon: Calendar,
      color: 'bg-emerald-500/10 text-emerald-500'
    },
    { 
      title: 'Progress Tracker Real-time', 
      desc: 'Pantau persentase penguasaan kompetensi dasar, jam belajar mandiri, dan capaian target kurikulum secara akurat.', 
      icon: TrendingUp,
      color: 'bg-indigo-500/10 text-indigo-500'
    },
    { 
      title: 'Laporan Nilai Otomatis & Rapor', 
      desc: 'Sistem evaluasi otomatis, feedback instan dari guru, dan ekspor berkas rapor digital format PDF dengan satu klik.', 
      icon: BarChart3,
      color: 'bg-purple-500/10 text-purple-500'
    },
    { 
      title: 'Forum Diskusi Kelas', 
      desc: 'Tanya jawab interaktif, kolaborasi asinkronus, dan sarana interaksi edukatif antara guru dan rekan sekelas.', 
      icon: MessageSquare,
      color: 'bg-amber-500/10 text-amber-500'
    },
    { 
      title: 'Sistem Akses Terkontrol', 
      desc: 'Keamanan data terjamin dengan otorisasi khusus untuk Siswa, Guru, Wali Murid, Admin, hingga Pembina Ekskul.', 
      icon: ShieldCheck,
      color: 'bg-rose-500/10 text-rose-500'
    },
  ]

  return (
    <div className="min-h-screen bg-[#FDFCF7] text-[#1E293B] font-sans antialiased pb-24">
      {/* Header */}
      <nav className="h-20 border-b border-[#E2E8F0] bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 50" className="h-7 w-auto" fill="none">
              <text x="0" y="40" fontFamily="Inter, system-ui, sans-serif" fontSize="42" fontWeight="800" letterSpacing="-2" fill="#1E293B">
                Edu<tspan fontWeight="800" fill="#5483B3">track</tspan>
              </text>
            </svg>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="text-xs font-bold text-[#64748B] hover:text-[#1E293B] gap-2 rounded-full">
              <ChevronLeft className="h-4 w-4" /> Kembali
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 pt-16 max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 mb-20"
        >
          <span className="text-xs font-black uppercase tracking-widest text-[#5483B3]">EKSPLORASI FITUR</span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#0F172A] font-serif leading-[1.1]">
            Fitur Utama EduTrack
          </h1>
          <p className="text-sm md:text-base text-[#64748B] font-medium max-w-xl mx-auto leading-relaxed">
            Didesain khusus untuk menyederhanakan administrasi akademik dan meningkatkan produktivitas belajar mengajar di sekolah.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-white border border-[#E2E8F0] p-8 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className={`h-12 w-12 rounded-2xl ${feature.color} flex items-center justify-center mb-6`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-3">{feature.title}</h3>
                <p className="text-xs text-[#64748B] font-semibold leading-relaxed mb-6">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-24 p-8 md:p-12 rounded-3xl bg-[#1E293B] text-white text-center space-y-6 relative overflow-hidden"
        >
          <div className="relative z-10 space-y-3">
            <h2 className="text-2xl md:text-4xl font-bold font-serif">Siap Mencoba EduTrack?</h2>
            <p className="text-xs md:text-sm text-slate-300 font-medium max-w-md mx-auto">
              Dapatkan akses langsung ke seluruh fitur tanpa biaya. Mulai tingkatkan efisiensi pembelajaran sekarang.
            </p>
          </div>
          <div className="relative z-10 pt-4">
            <Link href="/register">
              <Button className="h-12 px-8 bg-white hover:bg-slate-100 text-[#1E293B] font-bold text-xs rounded-full shadow-lg gap-2">
                Daftar Sekarang <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
