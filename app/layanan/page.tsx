'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  GraduationCap, 
  ArrowRight, 
  BookOpen, 
  Calendar, 
  FileText, 
  Sparkles,
  ChevronLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LayananPage() {
  const services = [
    {
      title: 'Kelas Digital',
      desc: 'Ruang kelas online terintegrasi untuk mendistribusikan modul belajar, topik diskusi, agenda kegiatan kelas, dan materi pembelajaran berbasis Notion-style block editor.',
      icon: BookOpen,
      color: 'bg-blue-500/10 text-blue-500',
      badge: 'Utama'
    },
    {
      title: 'Absensi Real-Time',
      desc: 'Sistem pencatatan kehadiran harian siswa secara otomatis dan terstruktur. Membantu guru membuat rekap absensi kelas serta pemantauan ketidakhadiran berkala.',
      icon: Calendar,
      color: 'bg-green-500/10 text-green-500',
      badge: 'Otomatis'
    },
    {
      title: 'Tugas & Evaluasi',
      desc: 'Layanan pengarsipan dan pengumpulan tugas sekolah secara digital. Guru dapat memberikan nilai angka, menulis catatan umpan balik (feedback), serta memantau status pengumpulan.',
      icon: FileText,
      color: 'bg-purple-500/10 text-purple-500',
      badge: 'Penilaian'
    },
    {
      title: 'Asisten AI',
      desc: 'Asisten AI pintar untuk membantu meringkas materi pelajaran yang kompleks secara instan, memberikan rekomendasi bahan ajar, serta memudahkan siswa belajar mandiri.',
      icon: Sparkles,
      color: 'bg-orange-500/10 text-orange-500',
      badge: 'Smart AI'
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
      <div className="container mx-auto px-6 pt-16 max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 mb-20"
        >
          <span className="text-xs font-black uppercase tracking-widest text-[#5483B3]">LAYANAN DIGITAL</span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#0F172A] font-serif leading-[1.1]">
            Layanan Kami
          </h1>
          <p className="text-sm md:text-base text-[#64748B] font-medium max-w-xl mx-auto leading-relaxed">
            Menyediakan infrastruktur ruang belajar virtual kelas dunia yang efisien dan mudah diakses oleh seluruh sivitas akademika.
          </p>
        </motion.div>

        {/* Services Stack */}
        <div className="space-y-8">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white border border-[#E2E8F0] p-8 rounded-3xl flex flex-col md:flex-row gap-6 items-start md:items-center justify-between hover:shadow-md transition-all duration-300"
            >
              <div className="flex gap-4 items-start">
                <div className={`h-12 w-12 rounded-2xl ${service.color} flex items-center justify-center shrink-0`}>
                  <service.icon className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-[#0F172A]">{service.title}</h3>
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 text-[9px] font-bold uppercase rounded-md tracking-wider">
                      {service.badge}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] font-semibold leading-relaxed max-w-2xl">{service.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-20 p-8 rounded-3xl border border-[#5483B3]/20 bg-[#5483B3]/5 flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <div className="space-y-2 text-center md:text-left">
            <p className="font-bold text-[#1E293B] text-base">Butuh Bimbingan Penggunaan?</p>
            <p className="text-xs text-[#64748B] font-medium max-w-md leading-relaxed">
              Jelajahi panduan penggunaan platform lengkap yang sudah kami sesuaikan berdasarkan peranan Anda sebagai Guru atau Siswa.
            </p>
          </div>
          <Link href="/bantuan">
            <Button className="bg-[#5483B3] hover:bg-[#3B6FA0] text-white rounded-full font-bold text-xs px-6 h-11 transition-all">
              Bantuan & FAQ
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
