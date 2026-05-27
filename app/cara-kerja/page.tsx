'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  GraduationCap, 
  ArrowRight, 
  ChevronLeft,
  Settings,
  Edit,
  GraduationCap as StudentIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CaraKerjaPage() {
  const steps = [
    {
      step: '01',
      title: 'Registrasi & Setup Sekolah',
      desc: 'Administrator sekolah mendaftarkan sekolah dan menyusun seluruh data inisialisasi awal, meliputi pembuatan data kelas, penugasan mata pelajaran, jadwal pelajaran, serta pendaftaran akun guru dan siswa secara massal.',
      icon: Settings,
      color: 'bg-blue-500/10 text-blue-500'
    },
    {
      step: '02',
      title: 'Guru Mengatur Ruang Kelas',
      desc: 'Guru masuk ke dalam sistem untuk membagikan materi pembelajaran (topik & modul), menyusun daftar tugas terstruktur, menentukan deadline pengumpulan, serta mengelola agenda reminder pada kalender kelas.',
      icon: Edit,
      color: 'bg-indigo-500/10 text-indigo-500'
    },
    {
      step: '03',
      title: 'Siswa Belajar & Mengumpulkan Tugas',
      desc: 'Siswa mengakses materi belajar harian secara mandiri melalui browser, memantau kemajuan belajarnya di progress tracker, mencatat ringkasan di block editor, dan mengumpulkan tugas tepat waktu.',
      icon: StudentIcon,
      color: 'bg-emerald-500/10 text-emerald-500'
    }
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
      <div className="container mx-auto px-6 pt-16 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 mb-20"
        >
          <span className="text-xs font-black uppercase tracking-widest text-[#5483B3]">ALUR KERJA</span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#0F172A] font-serif leading-[1.1]">
            Bagaimana EduTrack Bekerja?
          </h1>
          <p className="text-sm md:text-base text-[#64748B] font-medium max-w-xl mx-auto leading-relaxed">
            Menyediakan sistem kolaborasi yang mudah dipahami demi kelancaran proses pembelajaran.
          </p>
        </motion.div>

        {/* Timeline Steps */}
        <div className="relative border-l border-slate-200 ml-4 md:ml-12 space-y-12">
          {steps.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative pl-8 md:pl-16"
            >
              {/* Step Circle */}
              <div className="absolute -left-[18px] top-0.5 bg-[#FDFCF7] p-1 rounded-full border border-slate-200">
                <div className={`h-8 w-8 rounded-full ${item.color} flex items-center justify-center text-xs font-black`}>
                  {item.step}
                </div>
              </div>

              {/* Step Card */}
              <div className="bg-white border border-[#E2E8F0] p-6 md:p-8 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <item.icon className="h-5 w-5 text-[#5483B3]" />
                  <h3 className="text-lg font-bold text-[#0F172A]">{item.title}</h3>
                </div>
                <p className="text-xs text-[#64748B] font-semibold leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-20 p-8 md:p-12 rounded-3xl bg-[#1E293B] text-white text-center space-y-6"
        >
          <div className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold font-serif">Mulai Integrasi Sekolah Anda</h2>
            <p className="text-xs text-slate-300 font-medium max-w-sm mx-auto leading-relaxed">
              Daftarkan akun administrator sekolah Anda sekarang secara gratis dan mulai susun kelas digital impian.
            </p>
          </div>
          <div>
            <Link href="/register">
              <Button className="h-11 px-8 bg-white hover:bg-slate-100 text-[#1E293B] font-bold text-xs rounded-full shadow-lg gap-2">
                Daftar Sekarang <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
