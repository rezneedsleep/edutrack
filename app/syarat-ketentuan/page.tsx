'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { 
  ArrowLeft, 
  FileText, 
  ShieldAlert, 
  UserCheck, 
  CheckCircle, 
  Globe, 
  RefreshCw,
  Mail, 
  HelpCircle,
  Clock
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function TermsAndConditionsPage() {
  const [activeSection, setActiveSection] = useState('persetujuan')

  const sections = [
    { id: 'persetujuan', label: '1. Persetujuan Layanan', icon: CheckCircle },
    { id: 'penggunaan', label: '2. Penggunaan yang Diizinkan', icon: ShieldAlert },
    { id: 'akun', label: '3. Akun Pengguna', icon: UserCheck },
    { id: 'ketersediaan', label: '4. Ketersediaan Layanan', icon: Globe },
    { id: 'perubahan', label: '5. Perubahan Ketentuan', icon: RefreshCw },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200
      for (const section of sections) {
        const el = document.getElementById(section.id)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] relative overflow-hidden bg-dot-pattern">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#5483B3]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#5483B3]/5 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 py-20 relative z-10 space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-[#5483B3] hover:text-[#3B6FA0] transition-colors font-bold text-sm group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
            Kembali ke Beranda
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-[#5483B3]/10 flex items-center justify-center text-[#5483B3] shadow-inner">
                <FileText className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gradient">
                  Syarat & Ketentuan Layanan
                </h1>
                <p className="text-xs text-[var(--muted-foreground)] font-semibold uppercase tracking-wider mt-1.5 flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" /> Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
          
          {/* Left Sticky Sidebar Index */}
          <div className="hidden lg:block sticky top-28 space-y-6">
            <div className="glass border border-[var(--border)] p-6 rounded-2xl shadow-sm">
              <h3 className="text-xs font-extrabold text-[var(--muted-foreground)] uppercase tracking-widest mb-4">
                Daftar Isi
              </h3>
              <nav className="space-y-2">
                {sections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => {
                      document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                      setActiveSection(sec.id)
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all relative ${
                      activeSection === sec.id
                        ? 'text-[#5483B3] bg-[#5483B3]/5'
                        : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50'
                    }`}
                  >
                    {activeSection === sec.id && (
                      <motion.div
                        layoutId="active-indicator-terms"
                        className="absolute left-0 w-1 h-5 bg-[#5483B3] rounded-r-full"
                      />
                    )}
                    <sec.icon className="h-4 w-4 shrink-0" />
                    <span>{sec.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="glass border border-[var(--border)] p-6 rounded-2xl shadow-sm space-y-3">
              <h4 className="text-xs font-bold flex items-center gap-1.5 text-[#5483B3]">
                <HelpCircle className="h-4 w-4" /> Ada Pertanyaan?
              </h4>
              <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed">
                Jika Anda memiliki pertanyaan mengenai penggunaan platform EduTrack sekolah Anda, silakan hubungi tim dukungan operasional kami.
              </p>
              <a 
                href="mailto:support@edutrack.id" 
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5483B3] hover:underline pt-1"
              >
                <Mail className="h-3.5 w-3.5" /> support@edutrack.id
              </a>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-3 space-y-8">
            <div className="glass border border-[var(--border)] p-8 rounded-3xl shadow-sm leading-relaxed text-sm md:text-base text-[var(--muted-foreground)] space-y-6">
              <p className="text-[var(--foreground)] font-medium">
                Selamat datang di platform EduTrack. Syarat & Ketentuan Layanan ini mengatur penggunaan Anda atas platform administrasi dan kelas digital kami. Harap membaca ketentuan ini dengan saksama sebelum mulai mengakses layanan.
              </p>
            </div>

            {/* Sections cards */}
            <div className="space-y-6">
              {/* Section 1 */}
              <motion.div 
                id="persetujuan"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass border border-[var(--border)] p-8 rounded-3xl shadow-sm space-y-4 hover:border-[#5483B3]/20 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#5483B3]/10 flex items-center justify-center text-[#5483B3]">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-extrabold text-[var(--foreground)]">1. Persetujuan Layanan</h2>
                </div>
                <div className="text-sm text-[var(--muted-foreground)] leading-relaxed space-y-3 pl-1">
                  <p>Dengan mengakses, mendaftarkan diri, atau menggunakan platform EduTrack, Anda mengakui bahwa Anda telah membaca, memahami, dan menyetujui untuk terikat oleh ketentuan di dalam Syarat & Ketentuan ini.</p>
                  <p>Ketentuan ini berlaku bagi seluruh klasifikasi pengguna, termasuk siswa, pendidik (guru), pelatih ekskul, admin sekolah, maupun orang tua yang mengakses portal ini.</p>
                </div>
              </motion.div>

              {/* Section 2 */}
              <motion.div 
                id="penggunaan"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass border border-[var(--border)] p-8 rounded-3xl shadow-sm space-y-4 hover:border-[#5483B3]/20 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#5483B3]/10 flex items-center justify-center text-[#5483B3]">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-extrabold text-[var(--foreground)]">2. Penggunaan yang Diizinkan</h2>
                </div>
                <div className="text-sm text-[var(--muted-foreground)] leading-relaxed space-y-3 pl-1">
                  <p>Anda setuju untuk menggunakan platform EduTrack hanya untuk tujuan akademis, pendidikan, penugasan, dan operasional administrasi sekolah yang sah. Anda dilarang keras untuk:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Menggunakan platform untuk mengunggah materi yang melanggar hak cipta, bermuatan asusila, mengandung kebencian, atau melanggar hukum.</li>
                    <li>Melakukan tindakan sabotase teknis seperti penyebaran malware, virus, atau upaya pemindaian kerentanan sistem (penetration testing) tanpa izin resmi tertulis.</li>
                    <li>Mencoba mengakses informasi atau akun milik pengguna lain secara paksa atau tidak sah.</li>
                    <li>Melakukan manipulasi terhadap sistem nilai, data absensi, atau laporan progres belajar di sistem.</li>
                  </ul>
                </div>
              </motion.div>

              {/* Section 3 */}
              <motion.div 
                id="akun"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass border border-[var(--border)] p-8 rounded-3xl shadow-sm space-y-4 hover:border-[#5483B3]/20 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#5483B3]/10 flex items-center justify-center text-[#5483B3]">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-extrabold text-[var(--foreground)]">3. Keamanan Akun Pengguna</h2>
                </div>
                <div className="text-sm text-[var(--muted-foreground)] leading-relaxed space-y-3 pl-1">
                  <p>Keamanan akun Anda sangat bergantung pada kerahasiaan informasi login Anda sendiri:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Anda bertanggung jawab penuh untuk menjaga kerahasiaan kata sandi dan kredensial login akun EduTrack Anda.</li>
                    <li>Anda setuju untuk segera memberitahukan Administrator sekolah jika mencurigai adanya penyalahgunaan atau akses tidak sah terhadap akun Anda.</li>
                    <li>Sekolah melalui Administrator memiliki hak penuh untuk menangguhkan atau menghapus akun yang terbukti melanggar kode etik sekolah atau membagikan kredensial ke pihak luar.</li>
                  </ul>
                </div>
              </motion.div>

              {/* Section 4 */}
              <motion.div 
                id="ketersediaan"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass border border-[var(--border)] p-8 rounded-3xl shadow-sm space-y-4 hover:border-[#5483B3]/20 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#5483B3]/10 flex items-center justify-center text-[#5483B3]">
                    <Globe className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-extrabold text-[var(--foreground)]">4. Ketersediaan Layanan & Batasan Tanggung Jawab</h2>
                </div>
                <div className="text-sm text-[var(--muted-foreground)] leading-relaxed space-y-3 pl-1">
                  <p>Kami berkomitmen untuk menjaga keandalan platform EduTrack agar dapat diakses kapan saja demi kelancaran kegiatan belajar mengajar:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Ketersediaan layanan dapat terganggu oleh jadwal pemeliharaan server berkala (maintenance), pembaruan sistem, atau kendala jaringan internet di luar kendali teknis kami.</li>
                    <li>EduTrack tidak bertanggung jawab atas kegagalan pengumpulan tugas atau absensi siswa yang disebabkan oleh gangguan penyedia jasa internet (ISP) pengguna atau perangkat keras personal yang tidak kompatibel.</li>
                  </ul>
                </div>
              </motion.div>

              {/* Section 5 */}
              <motion.div 
                id="perubahan"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass border border-[var(--border)] p-8 rounded-3xl shadow-sm space-y-4 hover:border-[#5483B3]/20 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#5483B3]/10 flex items-center justify-center text-[#5483B3]">
                    <RefreshCw className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-extrabold text-[var(--foreground)]">5. Perubahan Ketentuan</h2>
                </div>
                <div className="text-sm text-[var(--muted-foreground)] leading-relaxed space-y-3 pl-1">
                  <p>Kami berhak melakukan penyesuaian atau pembaruan pada Syarat & Ketentuan Layanan ini sewaktu-waktu guna menyelaraskan dengan pembaruan fitur platform atau peraturan perundang-undangan yang berlaku.</p>
                  <p>Perubahan yang bersifat signifikan akan kami informasikan melalui pengumuman di dasbor sekolah atau melalui pemberitahuan email resmi.</p>
                </div>
              </motion.div>
            </div>
            
            {/* Mobile Footer Help Banner */}
            <div className="lg:hidden glass border border-[var(--border)] p-6 rounded-3xl shadow-sm space-y-3 mt-8">
              <h4 className="text-sm font-bold flex items-center gap-1.5 text-[#5483B3]">
                <HelpCircle className="h-4 w-4" /> Ada Pertanyaan?
              </h4>
              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                Jika Anda memiliki pertanyaan mengenai penggunaan platform EduTrack sekolah Anda, silakan hubungi tim dukungan operasional kami.
              </p>
              <a 
                href="mailto:support@edutrack.id" 
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5483B3] hover:underline"
              >
                <Mail className="h-3.5 w-3.5" /> support@edutrack.id
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

