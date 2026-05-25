'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
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
  LayoutDashboard
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function LandingPage() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[#5483B3] selection:text-white font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-[var(--border)] h-20 transition-all duration-300">
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="EduTrack Logo"
              className="h-8 w-auto dark:invert"
            />
          </Link>
          
          <div className="hidden md:flex items-center gap-10 text-[13px] font-semibold text-[var(--muted-foreground)]">
            <a href="#features" className="hover:text-[#5483B3] transition-colors">Fitur</a>
            <a href="#about" className="hover:text-[#5483B3] transition-colors">Solusi</a>
            <a href="#stats" className="hover:text-[#5483B3] transition-colors">Statistik</a>
          </div>

          <div className="flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-[var(--muted)] rounded-full">
                  <Avatar className="h-8 w-8 rounded-full border border-white">
                    {session.user?.image && <AvatarImage src={session.user.image} />}
                    <AvatarFallback className="bg-[#5483B3] text-white text-[10px] font-bold">
                      {session.user?.name?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="pr-2">
                     <p className="text-[12px] font-bold text-[#0F172A] leading-tight">{session.user?.name}</p>
                     <p className="text-[10px] font-medium text-[var(--muted-foreground)] capitalize">{(session.user as any)?.role?.toLowerCase() || 'user'}</p>
                  </div>
                </div>
                <Link href="/dashboard">
                  <Button className="bg-[#5483B3] hover:bg-[#3B6FA0] text-white font-semibold text-sm h-11 px-6 rounded-xl shadow-lg shadow-[#5483B3]/20 transition-all hover:-translate-y-0.5">
                    Dashboard
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-sm font-semibold text-[var(--muted-foreground)] hover:text-[#0F172A] hover:bg-[var(--muted)] rounded-xl h-11 px-6">Masuk</Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-[#5483B3] hover:bg-[#3B6FA0] text-white font-semibold text-sm h-11 px-6 rounded-xl shadow-lg shadow-[#5483B3]/20 transition-all hover:-translate-y-0.5">
                    Daftar Sekarang
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-40" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#5483B3]/10 rounded-full blur-[120px] -mr-96 -mt-96 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#C1E8FF]/20 rounded-full blur-[100px] -ml-64 -mb-64 pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6 }}
             >
                <Badge className="mb-6 bg-[#5483B3]/10 text-[#5483B3] hover:bg-[#5483B3]/20 border-none px-4 py-1.5 text-[11px] font-bold tracking-widest rounded-full">
                  PLATFORM EDUKASI MODERN
                </Badge>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-[#0F172A] leading-[1.1] mb-8">
                  Ekosistem Belajar <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5483B3] to-[#3B6FA0]">Terintegrasi.</span>
                </h1>
                <p className="text-lg md:text-xl text-[var(--muted-foreground)] font-medium max-w-2xl mx-auto leading-relaxed mb-10">
                  Pantau progres akademik secara real-time. EduTrack memberikan pengalaman belajar dan mengajar yang lebih terstruktur, transparan, dan terukur.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                   <Link href="/register" className="w-full sm:w-auto">
                      <Button className="w-full h-14 px-8 bg-[#5483B3] hover:bg-[#3B6FA0] text-white font-bold text-base rounded-xl shadow-xl shadow-[#5483B3]/20 group transition-all">
                        Mulai Sekarang
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1.5 transition-transform" />
                      </Button>
                   </Link>
                   <a href="#features" className="w-full sm:w-auto">
                      <Button variant="outline" className="w-full h-14 px-8 border-[var(--border)] hover:bg-[var(--muted)] text-[#0F172A] font-bold text-base rounded-xl transition-all">
                        Pelajari Fitur
                      </Button>
                   </a>
                </div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white border-y border-[var(--border)] relative z-10">
         <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
               <h2 className="text-sm font-bold tracking-widest text-[#5483B3] mb-3 uppercase">Kenapa Memilih EduTrack?</h2>
               <h3 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] tracking-tight">Solusi Lengkap Manajemen Pendidikan</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {[
                 { title: 'Monitoring Real-time', desc: 'Pantau progres setiap topik pelajaran secara instan.', icon: TrendingUp },
                 { title: 'Manajemen Tugas', icon: CheckCircle2, desc: 'Sistem pengumpulan dan penilaian tugas yang transparan.' },
                 { title: 'Peringkat & Gamifikasi', icon: Zap, desc: 'Kompetisi sehat dengan sistem ranking berbasis jam belajar.' },
                 { title: 'Laporan Analitik', icon: BarChart3, desc: 'Generate laporan performa akademik secara otomatis.' },
                 { title: 'Keamanan Data', icon: ShieldCheck, desc: 'Sistem cloud aman untuk menyimpan seluruh data sekolah.' },
                 { title: 'Dashboard Lengkap', icon: LayoutDashboard, desc: 'Tampilan khusus untuk siswa, guru, dan administrator.' },
               ].map((feature, i) => (
                 <div key={i} className="bg-[var(--background)] border border-[var(--border)] p-8 rounded-2xl hover:shadow-xl hover:shadow-[#5483B3]/5 transition-all duration-300 group hover:-translate-y-1">
                    <div className="h-14 w-14 rounded-2xl bg-[#5483B3]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="h-7 w-7 text-[#5483B3]" />
                    </div>
                    <h4 className="text-xl font-bold text-[#0F172A] mb-3">{feature.title}</h4>
                    <p className="text-[var(--muted-foreground)] font-medium leading-relaxed">{feature.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-24 overflow-hidden relative">
         <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               <div>
                  <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0F172A] leading-[1.1] mb-10">
                     Dipercaya oleh<br />
                     <span className="text-[#5483B3]">Ratusan Sekolah.</span>
                  </h2>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-10">
                     <div>
                        <p className="text-4xl font-extrabold text-[#5483B3] mb-2">10K+</p>
                        <p className="text-sm font-semibold text-[var(--muted-foreground)]">Siswa Aktif</p>
                     </div>
                     <div>
                        <p className="text-4xl font-extrabold text-[#5483B3] mb-2">500+</p>
                        <p className="text-sm font-semibold text-[var(--muted-foreground)]">Guru & Pengajar</p>
                     </div>
                     <div>
                        <p className="text-4xl font-extrabold text-[#5483B3] mb-2">1M+</p>
                        <p className="text-sm font-semibold text-[var(--muted-foreground)]">Jam Belajar</p>
                     </div>
                     <div>
                        <p className="text-4xl font-extrabold text-[#5483B3] mb-2">99.9%</p>
                        <p className="text-sm font-semibold text-[var(--muted-foreground)]">Uptime Server</p>
                     </div>
                  </div>
               </div>
               
               <div className="relative lg:ml-auto w-full max-w-lg">
                  <div className="absolute inset-0 bg-[#5483B3]/20 blur-[80px] rounded-full" />
                  <div className="relative bg-white border border-[var(--border)] rounded-2xl p-6 shadow-2xl overflow-hidden">
                     <div className="flex items-center gap-2 mb-6 border-b border-[var(--border)] pb-4">
                        <div className="h-3 w-3 rounded-full bg-[#EF4444]" />
                        <div className="h-3 w-3 rounded-full bg-[#F59E0B]" />
                        <div className="h-3 w-3 rounded-full bg-[#22C55E]" />
                     </div>
                     <div className="space-y-4">
                        <div className="flex items-center gap-4">
                           <div className="h-10 w-10 rounded-full bg-[var(--muted)]" />
                           <div className="space-y-2 flex-1">
                              <div className="h-2.5 w-1/3 bg-[var(--muted)] rounded-full" />
                              <div className="h-2 w-1/4 bg-[var(--muted)] rounded-full" />
                           </div>
                        </div>
                        <div className="h-24 w-full bg-[var(--muted)] rounded-xl" />
                        <div className="flex gap-4">
                           <div className="h-32 w-1/2 bg-[var(--muted)] rounded-xl" />
                           <div className="h-32 w-1/2 bg-[#5483B3]/10 border border-[#5483B3]/20 rounded-xl" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section id="about" className="py-24 relative overflow-hidden">
         <div className="absolute inset-0 bg-[#5483B3]" />
         <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
         <div className="container mx-auto px-6 relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
               Siap Memulai Perjalanan Belajar?
            </h2>
            <p className="text-white/80 text-lg font-medium max-w-2xl mx-auto mb-10">
               Bergabung dengan ribuan siswa dan guru lainnya yang telah menggunakan EduTrack untuk pengalaman belajar yang lebih baik.
            </p>
            <Link href="/register">
               <Button className="h-14 px-10 bg-white hover:bg-white/90 text-[#5483B3] font-bold text-lg rounded-xl shadow-2xl transition-transform hover:scale-105">
                  Daftar Gratis
               </Button>
            </Link>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-white border-t border-[var(--border)]">
         <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
               <div className="space-y-6 max-w-sm">
                  <Link href="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-[#5483B3] rounded-lg flex items-center justify-center">
                      <GraduationCap className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-[#0F172A]">EduTrack</span>
                  </Link>
                  <p className="text-[var(--muted-foreground)] text-sm font-medium leading-relaxed">
                    Platform edukasi masa depan untuk monitoring dan akselerasi pembelajaran digital di Indonesia.
                  </p>
               </div>
               
               <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
                   <div className="space-y-4">
                     <h5 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Platform</h5>
                     <div className="flex flex-col gap-3 text-sm font-medium text-[var(--muted-foreground)]">
                        <a href="#features" className="hover:text-[#5483B3] transition-colors">Fitur Utama</a>
                        <a href="#stats" className="hover:text-[#5483B3] transition-colors">Statistik</a>
                        <Link href="#" className="hover:text-[#5483B3] transition-colors">Harga</Link>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <h5 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Legal</h5>
                     <div className="flex flex-col gap-3 text-sm font-medium text-[var(--muted-foreground)]">
                        <Link href="/kebijakan-privasi" className="hover:text-[#5483B3] transition-colors">Kebijakan Privasi</Link>
                        <Link href="/syarat-ketentuan" className="hover:text-[#5483B3] transition-colors">Syarat & Ketentuan</Link>
                        <Link href="/kebijakan-privasi" className="hover:text-[#5483B3] transition-colors">Keamanan</Link>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <h5 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Sosial Media</h5>
                     <div className="flex items-center gap-4 text-[var(--muted-foreground)]">
                        <Github className="h-5 w-5 hover:text-[#5483B3] cursor-pointer transition-colors" />
                        <Twitter className="h-5 w-5 hover:text-[#5483B3] cursor-pointer transition-colors" />
                        <Instagram className="h-5 w-5 hover:text-[#5483B3] cursor-pointer transition-colors" />
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row justify-between items-center gap-4">
               <p className="text-xs font-medium text-[var(--muted-foreground)]">© {new Date().getFullYear()} EduTrack Inc. Hak Cipta Dilindungi.</p>
               <div className="text-xs font-medium text-[var(--muted-foreground)]">
                  Developer By <a href="https://davinn.net" target="_blank" rel="noopener noreferrer" className="text-[#5483B3] hover:underline font-bold">Davin</a>
               </div>
            </div>
         </div>
      </footer>
    </div>
  )
}

function Badge({ children, className }: any) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      {children}
    </span>
  )
}
