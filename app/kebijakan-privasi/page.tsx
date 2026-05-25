'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { 
  ArrowLeft, 
  ShieldCheck, 
  Database, 
  Eye, 
  Lock, 
  Share2, 
  UserCheck, 
  Mail, 
  HelpCircle,
  FileText,
  Clock
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState('pengumpulan')

  const sections = [
    { id: 'pengumpulan', label: '1. Pengumpulan Data', icon: Database },
    { id: 'penggunaan', label: '2. Penggunaan Data', icon: Eye },
    { id: 'keamanan', label: '3. Perlindungan & Keamanan', icon: Lock },
    { id: 'pembagian', label: '4. Pembagian Data', icon: Share2 },
    { id: 'hak', label: '5. Hak Pengguna', icon: UserCheck },
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
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gradient">
                  Kebijakan Privasi & Keamanan
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
                        layoutId="active-indicator-policy"
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
                <HelpCircle className="h-4 w-4" /> Butuh Bantuan?
              </h4>
              <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed">
                Jika Anda memiliki pertanyaan seputar privasi data Anda di platform EduTrack, hubungi DPO (Data Protection Officer) kami di bawah.
              </p>
              <a 
                href="mailto:privacy@edutrack.id" 
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5483B3] hover:underline pt-1"
              >
                <Mail className="h-3.5 w-3.5" /> privacy@edutrack.id
              </a>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-3 space-y-8">
            <div className="glass border border-[var(--border)] p-8 rounded-3xl shadow-sm leading-relaxed text-sm md:text-base text-[var(--muted-foreground)] space-y-6">
              <p className="text-[var(--foreground)] font-medium">
                EduTrack berkomitmen penuh untuk melindungi privasi data pribadi seluruh pengguna platform kami—baik Siswa, Guru, Orang Tua, maupun Staf Administrasi. Kebijakan ini menjelaskan bagaimana data Anda dikumpulkan, digunakan, dilindungi, dan dikelola secara aman.
              </p>
            </div>

            {/* Sections cards */}
            <div className="space-y-6">
              {/* Section 1 */}
              <motion.div 
                id="pengumpulan"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass border border-[var(--border)] p-8 rounded-3xl shadow-sm space-y-4 hover:border-[#5483B3]/20 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#5483B3]/10 flex items-center justify-center text-[#5483B3]">
                    <Database className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-extrabold text-[var(--foreground)]">1. Pengumpulan Data Pribadi</h2>
                </div>
                <div className="text-sm text-[var(--muted-foreground)] leading-relaxed space-y-3 pl-1">
                  <p>Kami mengumpulkan data yang secara eksplisit diperlukan untuk menyelenggarakan sistem administrasi akademik digital sekolah, yang meliputi:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Informasi Identitas:</strong> Nama lengkap, Nomor Induk Siswa (NIS/NISN), Nomor Induk Pegawai (NIP), foto profil, dan jenis kelamin.</li>
                    <li><strong>Informasi Kontak:</strong> Alamat email aktif, nomor telepon, dan alamat tempat tinggal.</li>
                    <li><strong>Data Akademis & Penugasan:</strong> Daftar nilai, catatan kehadiran (absensi), kurikulum kelas, dokumen lampiran belajar, serta berkas penugasan digital yang dikirimkan.</li>
                    <li><strong>Data Keaktifan:</strong> Catatan waktu login, preferensi notifikasi, dan interaksi di dalam forum diskusi kelas.</li>
                  </ul>
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
                    <Eye className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-extrabold text-[var(--foreground)]">2. Penggunaan Data</h2>
                </div>
                <div className="text-sm text-[var(--muted-foreground)] leading-relaxed space-y-3 pl-1">
                  <p>Semua informasi yang kami himpun digunakan secara eksklusif untuk tujuan operasional belajar mengajar sekolah Anda, antara lain:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Memfasilitasi pembagian materi, kurikulum bab, dan penugasan secara digital.</li>
                    <li>Melakukan evaluasi hasil belajar siswa dan merekam rekapitulasi nilai akademik.</li>
                    <li>Mengelola administrasi kelas, jadwal pelajaran, dan tingkat kehadiran siswa secara real-time.</li>
                    <li>Menyampaikan pemberitahuan penting (announcement) serta notifikasi tenggat waktu tugas.</li>
                    <li>Meningkatkan pengalaman platform melalui analisis keaktifan belajar siswa.</li>
                  </ul>
                </div>
              </motion.div>

              {/* Section 3 */}
              <motion.div 
                id="keamanan"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass border border-[var(--border)] p-8 rounded-3xl shadow-sm space-y-4 hover:border-[#5483B3]/20 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#5483B3]/10 flex items-center justify-center text-[#5483B3]">
                    <Lock className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-extrabold text-[var(--foreground)]">3. Perlindungan & Keamanan Data</h2>
                </div>
                <div className="text-sm text-[var(--muted-foreground)] leading-relaxed space-y-3 pl-1">
                  <p>EduTrack menempatkan keamanan siber di tingkat prioritas tertinggi dengan mengadopsi standar industri terdepan:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Enkripsi Sandi:</strong> Semua kata sandi akun dienkripsi menggunakan algoritma hash satu arah yang kuat (bcrypt).</li>
                    <li><strong>Transmisi Data Aman:</strong> Seluruh komunikasi data dilindungi protokol Secure Socket Layer (HTTPS) untuk mencegah penyadapan.</li>
                    <li><strong>Kontrol Akses Berbasis Peran (RBAC):</strong> Izin akses dibatasi secara ketat berdasarkan hak istimewa peran (Siswa hanya bisa mengakses data mereka, Guru mengelola kelasnya, Admin mengelola sekolah).</li>
                    <li><strong>Pemantauan Sistem:</strong> Logging aktivitas yang komprehensif untuk mencegah akses tidak sah atau modifikasi data secara ilegal.</li>
                  </ul>
                </div>
              </motion.div>

              {/* Section 4 */}
              <motion.div 
                id="pembagian"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass border border-[var(--border)] p-8 rounded-3xl shadow-sm space-y-4 hover:border-[#5483B3]/20 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#5483B3]/10 flex items-center justify-center text-[#5483B3]">
                    <Share2 className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-extrabold text-[var(--foreground)]">4. Kebijakan Pembagian Data</h2>
                </div>
                <div className="text-sm text-[var(--muted-foreground)] leading-relaxed space-y-3 pl-1">
                  <p><strong>EduTrack TIDAK PERNAH menjual, menyewakan, membagikan, atau menukar data pribadi Anda dengan pengiklan atau pihak ketiga komersial mana pun.</strong></p>
                  <p>Data hanya dibagikan dalam kondisi berikut:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Kepada pendidik dan staf resmi sekolah Anda sebagai bagian dari operasional akademik harian.</li>
                    <li>Jika diwajibkan oleh hukum atau putusan pengadilan yang sah di wilayah hukum Republik Indonesia.</li>
                  </ul>
                </div>
              </motion.div>

              {/* Section 5 */}
              <motion.div 
                id="hak"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass border border-[var(--border)] p-8 rounded-3xl shadow-sm space-y-4 hover:border-[#5483B3]/20 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#5483B3]/10 flex items-center justify-center text-[#5483B3]">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-extrabold text-[var(--foreground)]">5. Hak & Pilihan Pengguna</h2>
                </div>
                <div className="text-sm text-[var(--muted-foreground)] leading-relaxed space-y-3 pl-1">
                  <p>Setiap pengguna memiliki kontrol penuh atas informasi mereka yang terdaftar di sistem:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Hak Akses:</strong> Melihat semua data akademis, tugas, absensi, dan informasi pribadi yang terdaftar.</li>
                    <li><strong>Hak Koreksi:</strong> Meminta perbaikan data melalui Administrator sekolah jika terdapat kekeliruan data identitas atau kontak.</li>
                    <li><strong>Preferensi Kontak:</strong> Mengaktifkan atau menonaktifkan pengingat email/notifikasi sistem melalui pengaturan akun.</li>
                    <li><strong>Penghapusan Akun:</strong> Akun dapat dinonaktifkan atau dihapus atas permintaan sekolah yang bersangkutan melalui pengajuan resmi administrator sekolah.</li>
                  </ul>
                </div>
              </motion.div>
            </div>
            
            {/* Mobile Footer Help Banner */}
            <div className="lg:hidden glass border border-[var(--border)] p-6 rounded-3xl shadow-sm space-y-3 mt-8">
              <h4 className="text-sm font-bold flex items-center gap-1.5 text-[#5483B3]">
                <HelpCircle className="h-4 w-4" /> Butuh Bantuan?
              </h4>
              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                Jika Anda memiliki pertanyaan seputar privasi data Anda di platform EduTrack, hubungi DPO (Data Protection Officer) kami.
              </p>
              <a 
                href="mailto:privacy@edutrack.id" 
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5483B3] hover:underline"
              >
                <Mail className="h-3.5 w-3.5" /> privacy@edutrack.id
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

