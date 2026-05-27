'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  GraduationCap, 
  ChevronLeft,
  ChevronDown,
  HelpCircle,
  Mail,
  MessageSquare
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function BantuanPage() {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null)

  const faqs = [
    { 
      q: "Apakah platform ini gratis digunakan?", 
      a: "Ya! EduTrack dirancang untuk membantu sekolah, guru, dan siswa di Indonesia dalam menunjang pembelajaran terstruktur tanpa biaya registrasi dasar." 
    },
    { 
      q: "Bagaimana cara guru menyaring siswa di kelasnya saja?", 
      a: "Sistem secara otomatis akan membatasi data siswa yang muncul pada dashboard guru hanya berdasarkan jadwal mata pelajaran yang diajarkan oleh guru tersebut untuk menjamin kerahasiaan dan efisiensi." 
    },
    { 
      q: "Bagaimana cara menambahkan catatan di kalender?", 
      a: "Siswa dan guru dapat membuka menu Kalender di dashboard mereka dan mengeklik tanggal tertentu untuk menambahkan catatan agenda visual berbasis Notion-style block editor." 
    },
    { 
      q: "Bagaimana cara Orang Tua masuk ke sistem?", 
      a: "Orang Tua/Wali Murid dapat masuk melalui menu login khusus Wali Murid menggunakan Nomor Induk Siswa (NIS) anak mereka serta PIN Orang Tua 6 digit yang dapat diperoleh dari Admin sekolah." 
    },
    { 
      q: "Apakah data nilai dan kehadiran dijamin aman?", 
      a: "Kami menggunakan enkripsi keamanan tinggi dan sistem akses terkontrol (role-based access control) untuk memastikan data akademik hanya dapat diakses oleh pihak yang berwenang (Admin, Guru, Siswa, dan Wali Murid)." 
    }
  ]

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index)
  }

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
      <div className="container mx-auto px-6 pt-16 max-w-3xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 mb-20"
        >
          <span className="text-xs font-black uppercase tracking-widest text-[#5483B3]">PUSAT DUKUNGAN</span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0F172A] font-serif leading-[1.1]">
            Bantuan & FAQ
          </h1>
          <p className="text-sm md:text-base text-[#64748B] font-medium max-w-xl mx-auto leading-relaxed">
            Punya pertanyaan mengenai cara penggunaan EduTrack? Temukan jawabannya di bawah ini.
          </p>
        </motion.div>

        {/* Accordion FAQ Section */}
        <div className="bg-white border border-[#E2E8F0] p-6 md:p-8 rounded-3xl shadow-sm space-y-4">
          {faqs.map((item, idx) => (
            <div key={idx} className="border-b border-[#F1F5F9] last:border-0 pb-4">
              <button 
                onClick={() => toggleAccordion(idx)}
                className="w-full flex items-center justify-between py-4 text-left font-bold text-sm text-[#0F172A] hover:text-[#5483B3] transition-colors focus:outline-none"
              >
                <span>{item.q}</span>
                <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-300 ${activeAccordion === idx ? 'rotate-180 text-[#5483B3]' : 'text-slate-400'}`} />
              </button>
              {activeAccordion === idx && (
                <div className="text-xs text-[#64748B] font-semibold leading-relaxed pb-4">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Support Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-3 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-[#5483B3]">
              <MessageSquare className="h-5 w-5" />
              <p className="text-sm font-bold">Butuh Bantuan Lebih Lanjut?</p>
            </div>
            <p className="text-xs text-[#64748B] font-medium max-w-md leading-relaxed">
              Jika Anda mengalami kendala teknis yang tidak dapat diselesaikan melalui FAQ di atas, silakan hubungi tim dukungan IT kami.
            </p>
          </div>
          <Button asChild className="bg-[#5483B3] hover:bg-[#3B6FA0] text-white rounded-full font-bold text-xs px-6 h-11 transition-all gap-2 w-full md:w-auto">
            <a href="https://instagram.com/davinmaritza" target="_blank" rel="noopener noreferrer">
              <Mail className="h-4 w-4" /> Hubungi Admin IT
            </a>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
