'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  Zap,
  Github,
  Twitter,
  Instagram,
  BarChart3,
  LayoutDashboard,
  ChevronDown,
  BookOpen,
  Calendar,
  MessageSquare,
  Trophy,
  HelpCircle,
  Settings,
  ArrowRightLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

export default function LandingPage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<'individual' | 'company'>('individual')
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null)

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index)
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#FDFCF7] text-[#1E293B] selection:bg-[#5483B3] selection:text-white font-sans antialiased overflow-x-hidden"
    >
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#FDFCF7]/80 backdrop-blur-xl border-b border-[#E2E8F0] h-20 transition-all duration-300">
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-9 w-9 bg-[#1E293B] rounded-xl flex items-center justify-center text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#1E293B]">EduTrack</span>
            </Link>

            {/* Individual / Company Pill Toggle */}
            <div className="hidden lg:flex items-center bg-[#F1F5F9] border border-[#E2E8F0] rounded-full p-1 ml-4 shadow-inner">
              <button 
                onClick={() => setActiveTab('individual')}
                className={`text-xs font-bold px-4 py-1.5 rounded-full transition-all duration-300 ${activeTab === 'individual' ? 'bg-[#1E293B] text-white shadow-sm' : 'text-[#64748B] hover:text-[#1E293B]'}`}
              >
                Siswa & Guru
              </button>
              <button 
                onClick={() => setActiveTab('company')}
                className={`text-xs font-bold px-4 py-1.5 rounded-full transition-all duration-300 ${activeTab === 'company' ? 'bg-[#1E293B] text-white shadow-sm' : 'text-[#64748B] hover:text-[#1E293B]'}`}
              >
                Institusi & Sekolah
              </button>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-[13px] font-bold text-[#64748B]">
            <Link href="/docs" className="hover:text-[#1E293B] transition-colors">Fitur</Link>
            <div className="relative group cursor-pointer flex items-center gap-1 hover:text-[#1E293B] transition-colors">
              <span>Layanan</span>
              <ChevronDown className="h-3 w-3" />
            </div>
            <Link href="/docs" className="hover:text-[#1E293B] transition-colors">Cara Kerja</Link>
            <Link href="/docs" className="hover:text-[#1E293B] transition-colors">Bantuan & FAQ</Link>
          </div>

          {/* Right Action */}
          <div className="flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <Button className="bg-[#1E293B] hover:bg-[#334155] text-white font-bold text-xs h-10 px-5 rounded-full shadow-sm transition-all hover:-translate-y-0.5">
                    Dashboard
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-xs font-bold text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9] rounded-full h-10 px-5">Masuk</Button>
                </Link>
                <Link href="/register">
                  <Button className="border border-[#1E293B] bg-transparent text-[#1E293B] hover:bg-[#1E293B] hover:text-white font-bold text-xs h-10 px-5 rounded-full transition-all duration-300">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-36 pb-0 overflow-hidden flex flex-col justify-between min-h-[92vh]">
        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl pt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Badge Announcement */}
              <div className="inline-flex bg-[#E0F2FE] border border-[#BAE6FD] text-[#0369A1] px-4 py-1.5 text-[11px] font-extrabold tracking-wider rounded-full shadow-sm">
                {activeTab === 'individual' 
                  ? "Fitur Baru: Integrasi Kalender Akademik & Notion Notes"
                  : "Mendukung Akreditasi Sekolah & Standardisasi Kurikulum"
                }
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl md:text-6xl lg:text-[70px] font-extrabold tracking-tight text-[#0F172A] leading-[1.1] font-serif max-w-3xl mx-auto">
                {activeTab === 'individual'
                  ? "Pantau kemajuan belajar siswa secara menyeluruh"
                  : "Solusi EduTrack untuk Pendidikan Modern"
                }
              </h1>

              {/* Description */}
              <p className="text-sm md:text-base text-[#64748B] font-medium max-w-xl mx-auto leading-relaxed">
                {activeTab === 'individual'
                  ? "Platform edukasi kami menyediakan sistem terpusat untuk mengelola tugas, penilaian, jadwal belajar, dan catatan pembelajaran secara detail."
                  : "EduTrack mengintegrasikan kolaborasi guru, siswa, dan sekolah secara terstruktur untuk menjamin akuntabilitas serta efisiensi manajemen akademik."
                }
              </p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href={session ? "/dashboard" : "/register"} className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto h-12 px-8 bg-[#1E293B] hover:bg-[#334155] text-white font-bold text-xs rounded-full shadow-md group transition-all">
                    Explore Product <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
                  </Button>
                </Link>
                <Link href="/docs" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto h-12 px-8 border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#334155] font-bold text-xs rounded-full shadow-sm transition-all">
                    Cara Kerja
                  </Button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Spacing adjustments */}
          <div className="pt-6 pb-8" />
        </div>

        {/* Canyon Background Artwork Container */}
        <div className="relative w-full h-[320px] md:h-[450px] overflow-hidden select-none pointer-events-none mt-auto">
          {/* Subtle overlay gradient to blend bottom illustration */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#FDFCF7]/0 via-[#FDFCF7]/60 to-[#FDFCF7] z-10" />
          <img 
            src="/canyon_bg.png" 
            alt="Canyon Background Illustration" 
            className="w-full h-full object-cover object-center animate-fade-in"
          />
        </div>
      </section>

      {/* Feature section */}
      <section id="features" className="py-24 bg-white border-y border-[#E2E8F0] relative z-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
             <span className="text-xs font-black uppercase tracking-widest text-[#5483B3] mb-3 block">EDUPLAYGROUND</span>
             <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#0F172A] font-serif">Fitur Utama EduTrack</h2>
             <p className="text-sm text-[#64748B] font-medium mt-3 leading-relaxed">
               Menggabungkan fleksibilitas pencatatan modern, analitik data kemajuan belajar, dan kemudahan kolaborasi akademik.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[
               { title: 'Block Editor (Notion Style)', desc: 'Tulis catatan, agenda belajar, dan rangkuman materi dengan editor blok interaktif.', icon: BookOpen },
               { title: 'Kalender & Reminder', icon: Calendar, desc: 'Kelola jadwal kelas, jadwal ekskul, dan atur reminder penting secara otomatis.' },
               { title: 'Progress Tracker Real-time', icon: TrendingUp, desc: 'Pantau persentase penguasaan kompetensi dasar dan jam belajar belajar mandiri.' },
               { title: 'Laporan Nilai Otomatis', icon: BarChart3, desc: 'Sistem pengarsipan tugas terstruktur dengan feedback langsung dari guru.' },
               { title: 'Forum Diskusi Kelas', icon: MessageSquare, desc: 'Tanya jawab interaktif dan kolaborasi asinkronus antara guru dan siswa.' },
               { title: 'Sistem Akses Terkontrol', icon: ShieldCheck, desc: 'Keamanan data tingkat tinggi dengan pembatasan hak akses siswa, guru, dan admin.' },
             ].map((feature, i) => (
               <div key={i} className="bg-[#F8FAFC] border border-[#E2E8F0] p-8 rounded-3xl hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group hover:-translate-y-1">
                  <div className="h-12 w-12 rounded-2xl bg-[#E2E8F0]/50 flex items-center justify-center mb-6 group-hover:bg-[#1E293B] group-hover:text-white transition-colors duration-300 text-[#1E293B]">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h4 className="text-lg font-bold text-[#0F172A] mb-3">{feature.title}</h4>
                  <p className="text-xs text-[#64748B] font-semibold leading-relaxed">{feature.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Interactive Feature Demo Mockup */}
      <section className="py-24 bg-[#FDFCF7] relative z-20">
         <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               <div className="space-y-6">
                  <span className="text-xs font-black uppercase tracking-widest text-[#5483B3] block">INTERACTIVE PLATFORM</span>
                  <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-[#0F172A] font-serif leading-tight">
                    Lihat Progres Akademik Secara Menyeluruh
                  </h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">
                     Guru dapat memantau siswa mana yang tertinggal dalam materi, memeriksa kemajuan belajar harian, serta memberikan respon langsung pada tugas siswa secara instan.
                  </p>
                  <div className="space-y-4">
                     <div className="flex items-start gap-4">
                        <div className="h-6 w-6 rounded-full bg-[#E0F2FE] flex items-center justify-center text-[#0369A1] shrink-0 mt-0.5">
                           <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>
                           <h5 className="text-sm font-bold text-[#0F172A]">Pembatasan Akses Guru</h5>
                           <p className="text-xs text-[#64748B] mt-0.5">Guru hanya dapat melihat data siswa di kelas yang diajarkan saja untuk efisiensi.</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-4">
                        <div className="h-6 w-6 rounded-full bg-[#E0F2FE] flex items-center justify-center text-[#0369A1] shrink-0 mt-0.5">
                           <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>
                           <h5 className="text-sm font-bold text-[#0F172A]">Nomor Absensi Terintegrasi</h5>
                           <p className="text-xs text-[#64748B] mt-0.5">Siswa terurut rapi berdasarkan nomor absen kelas untuk memudahkan guru saat entri nilai.</p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Mockup Dashboard Card */}
               <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 md:p-8 shadow-2xl relative">
                  <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-4 mb-6">
                     <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-[#5483B3]/10 flex items-center justify-center text-[#5483B3]">
                           <LayoutDashboard className="h-4.5 w-4.5" />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-[#1E293B]">Dashboard Guru</p>
                           <p className="text-[10px] text-[#94A3B8]">SMKN 13 Bandung</p>
                        </div>
                     </div>
                     <Badge className="bg-[#DEF7EC] text-[#03543F] border-none text-[10px] font-bold rounded-full px-2.5 py-0.5">Guru Aktif</Badge>
                  </div>

                  <div className="space-y-4">
                     {/* Student List Item Mockup */}
                     {[
                       { name: 'Siswa Demo 01', class: 'XI RPL 1', progress: 85, no: 1 },
                       { name: 'Siswa Demo 02', class: 'XI RPL 1', progress: 42, no: 2 },
                       { name: 'Siswa Demo 03', class: 'XI RPL 1', progress: 70, no: 3 }
                     ].map((s, idx) => (
                       <div key={idx} className="flex items-center justify-between p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl">
                          <div className="flex items-center gap-3">
                             <span className="text-xs font-extrabold text-[#64748B] bg-[#E2E8F0] h-6 w-6 rounded-full flex items-center justify-center">{s.no}</span>
                             <div>
                                <p className="text-xs font-bold text-[#1E293B]">{s.name}</p>
                                <p className="text-[10px] text-[#64748B] font-semibold">{s.class}</p>
                             </div>
                          </div>
                          <div className="text-right w-24">
                             <div className="flex justify-between items-center text-[10px] font-bold text-[#64748B] mb-1">
                                <span>Progress</span>
                                <span>{s.progress}%</span>
                             </div>
                             <Progress value={s.progress} className="h-1.5 rounded-full bg-[#E2E8F0]" indicatorClassName="bg-[#5483B3]" />
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-white border-y border-[#E2E8F0] relative z-20">
         <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
               <span className="text-xs font-black uppercase tracking-widest text-[#5483B3] block mb-3">WORKFLOW</span>
               <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-[#0F172A] font-serif">Bagaimana EduTrack Bekerja?</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {[
                 { step: '01', title: 'Registrasi Sekolah', desc: 'Admin sekolah mendaftarkan akun dan menyusun data kelas, mapel, jadwal, dan guru.' },
                 { step: '02', title: 'Guru Mengatur Kelas', desc: 'Guru memetakan tugas, topik, dan membuat agenda reminder pada kalender kelas.' },
                 { step: '03', title: 'Siswa Belajar & Submit', desc: 'Siswa memantau progres belajar mereka, mencatat notes, dan mengumpulkan tugas.' }
               ].map((item, idx) => (
                 <div key={idx} className="relative space-y-4">
                    <span className="text-5xl font-black text-[#5483B3]/20 font-serif block">{item.step}</span>
                    <h4 className="text-lg font-bold text-[#0F172A]">{item.title}</h4>
                    <p className="text-xs text-[#64748B] font-semibold leading-relaxed">{item.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Accordion FAQ Section */}
      <section id="faq" className="py-24 bg-[#FDFCF7] relative z-20">
        <div className="container mx-auto px-6 max-w-3xl">
           <div className="text-center mb-16">
              <span className="text-xs font-black uppercase tracking-widest text-[#5483B3] block mb-3">SUPPORT</span>
              <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-[#0F172A] font-serif">Pertanyaan Umum (FAQ)</h3>
           </div>

           <div className="space-y-4">
              {[
                { q: "Apakah platform ini gratis digunakan?", a: "Ya! EduTrack dirancang untuk membantu sekolah, guru, dan siswa di Indonesia dalam menunjang pembelajaran terstruktur tanpa biaya registrasi dasar." },
                { q: "Bagaimana cara guru menyaring siswa di kelasnya saja?", a: "Sistem secara otomatis akan membatasi data siswa yang muncul pada dashboard guru hanya berdasarkan jadwal mata pelajaran yang diajarkan oleh guru tersebut." },
                { q: "Bagaimana cara menambahkan catatan di kalender?", a: "Siswa dan guru dapat membuka menu Kalender dan mengeklik tanggal tertentu untuk menambahkan catatan visual berbasis editor Notion-style block." }
              ].map((item, idx) => (
                <div key={idx} className="border-b border-[#E2E8F0] pb-4">
                   <button 
                     onClick={() => toggleAccordion(idx)}
                     className="w-full flex items-center justify-between py-4 text-left font-bold text-sm text-[#0F172A] hover:text-[#5483B3] transition-colors"
                   >
                      <span>{item.q}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${activeAccordion === idx ? 'rotate-180' : ''}`} />
                   </button>
                   {activeAccordion === idx && (
                     <div className="text-xs text-[#64748B] font-semibold leading-relaxed pb-4 animate-fade-in">
                        {item.a}
                     </div>
                   )}
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-[#1E293B] text-[#94A3B8] border-t border-[#334155] relative z-20">
         <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
               <div className="space-y-6 max-w-sm">
                  <div className="flex items-center gap-2">
                     <div className="h-9 w-9 bg-white rounded-xl flex items-center justify-center text-[#1E293B]">
                        <GraduationCap className="h-5 w-5" />
                     </div>
                     <span className="text-xl font-bold tracking-tight text-white">EduTrack</span>
                  </div>
                  <p className="text-xs text-[#94A3B8] leading-relaxed font-semibold">
                     Platform monitoring dan akselerasi akademik digital untuk menciptakan ekosistem belajar yang terstruktur, transparan, dan terukur.
                  </p>
               </div>
               
               <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
                   <div className="space-y-4">
                      <h5 className="text-[10px] font-black uppercase tracking-wider text-white">Platform</h5>
                      <div className="flex flex-col gap-2.5 text-xs font-semibold text-[#94A3B8]">
                         <Link href="/docs" className="hover:text-white transition-colors">Fitur Utama</Link>
                         <Link href="/docs" className="hover:text-white transition-colors">Cara Kerja</Link>
                         <Link href="/docs" className="hover:text-white transition-colors">Bantuan</Link>
                      </div>
                  </div>
                  <div className="space-y-4">
                     <h5 className="text-[10px] font-black uppercase tracking-wider text-white">Legal</h5>
                     <div className="flex flex-col gap-2.5 text-xs font-semibold text-[#94A3B8]">
                        <Link href="/kebijakan-privasi" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
                        <Link href="/syarat-ketentuan" className="hover:text-white transition-colors">Syarat & Ketentuan</Link>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <h5 className="text-[10px] font-black uppercase tracking-wider text-white">Ikuti Kami</h5>
                     <div className="flex items-center gap-4 text-[#94A3B8]">
                        <Github className="h-4.5 w-4.5 hover:text-white cursor-pointer transition-colors" />
                        <Twitter className="h-4.5 w-4.5 hover:text-white cursor-pointer transition-colors" />
                        <Instagram className="h-4.5 w-4.5 hover:text-white cursor-pointer transition-colors" />
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="pt-8 border-t border-[#334155] flex flex-col sm:flex-row justify-between items-center gap-4">
               <p className="text-xs font-semibold text-[#64748B]">© {new Date().getFullYear()} EduTrack Inc. Hak Cipta Dilindungi.</p>
               <div className="text-xs font-semibold text-[#64748B]">
                  Developed by <a href="https://davinn.net" target="_blank" rel="noopener noreferrer" className="text-white hover:underline font-bold">Davin Maritza</a>
               </div>
            </div>
         </div>
      </footer>
    </motion.div>
  )
}
