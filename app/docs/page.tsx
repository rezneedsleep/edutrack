'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  GraduationCap, 
  ArrowLeft, 
  Users, 
  ClipboardList, 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Key,
  ListTodo,
  FileText,
  BadgeAlert,
  Award,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', name: 'Ringkasan Sistem' },
    { id: 'admin', name: '1. Otoritas Administrator' },
    { id: 'teacher', name: '2. Fitur Lengkap Guru' },
    { id: 'student', name: '3. Fitur Lengkap Siswa' },
    { id: 'faq', name: 'Pertanyaan Alur Kerja' }
  ]

  const scrollToSection = (id: string) => {
    setActiveSection(id)
    const element = document.getElementById(id)
    if (element) {
      const yOffset = -100
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="min-h-screen bg-[#FDFCF7] text-[#1E293B] font-sans antialiased"
    >
      {/* Navbar */}
      <header className="sticky top-0 w-full z-50 bg-[#FDFCF7]/90 backdrop-blur-xl border-b border-[#E2E8F0] h-20">
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-[#1E293B] rounded-2xl flex items-center justify-center text-white shrink-0">
              <GraduationCap className="h-5.5 w-5.5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#1E293B]">EduTrack</span>
            <div className="h-4 w-px bg-[#E2E8F0] hidden sm:block" />
            <span className="text-xs font-bold text-[#64748B] hidden sm:block">Dokumentasi Alur Kerja</span>
          </div>

          <Link href="/">
            <Button variant="ghost" className="text-xs font-bold text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9] rounded-full gap-2">
              <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar Navigation */}
          <motion.aside 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="lg:col-span-1 space-y-3 lg:sticky lg:top-32 h-fit"
          >
            <p className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] px-3 mb-4">DAFTAR ISI DOKUMENTASI</p>
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between group",
                    activeSection === section.id 
                      ? "bg-[#1E293B] text-white shadow-sm" 
                      : "text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#1E293B]"
                  )}
                >
                  <span>{section.name}</span>
                </button>
              ))}
            </nav>
          </motion.aside>

          {/* Main Content Area */}
          <motion.main 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-3 space-y-16"
          >
            {/* Overview Section */}
            <section id="overview" className="space-y-6 scroll-mt-32">
              <div className="space-y-3">
                <span className="text-xs font-black uppercase tracking-widest text-[#5483B3] block">MEMULAI</span>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0F172A] font-serif">Cara Kerja Ekosistem EduTrack</h1>
              </div>
              <p className="text-sm text-[#64748B] leading-relaxed">
                EduTrack adalah platform monitoring kemajuan akademik sekolah terintegrasi. Sistem ini menjembatani interaksi administrasi antara Administrator, Guru Mata Pelajaran, serta Siswa dengan metode kolaboratif terstruktur.
              </p>
              
              <div className="bg-[#1E293B] text-white rounded-3xl p-8 relative overflow-hidden shadow-md">
                 <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
                    <GraduationCap className="h-64 w-64 -rotate-12" />
                 </div>
                 <h3 className="text-xl font-bold font-serif mb-3 flex items-center gap-2">
                   <Sparkles className="h-5 w-5 text-yellow-400" /> Ringkasan Fungsi Utama
                 </h3>
                 <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                   Sistem kami menggunakan otorisasi berbasis peran (Role-Based Access Control) yang ketat. Siswa hanya dapat mengelola data progres belajarnya sendiri, Guru dibatasi melihat rombongan belajar tempat mereka mengajar saja, dan Admin memegang kendali penuh atas manajemen pengguna dan jadwal.
                 </p>
              </div>
            </section>

            {/* Admin Section */}
            <section id="admin" className="space-y-6 scroll-mt-32">
              <div className="h-px bg-[#E2E8F0] w-full" />
              <div className="space-y-3">
                <span className="text-xs font-black uppercase tracking-widest text-[#5483B3] block">OTORISASI UTAMA</span>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0F172A] font-serif">1. Peran & Fungsi Administrator</h2>
              </div>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Administrator memegang hak akses tertinggi untuk mengonfigurasi data master sekolah. Sebelum guru dan siswa menggunakan platform, Admin harus menyelesaikan pengaturan berikut:
              </p>
              <div className="space-y-4">
                 <div className="p-6 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm space-y-2">
                    <h4 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                       <Key className="h-4.5 w-4.5 text-[#5483B3]" /> Manajemen Pengguna (Users)
                    </h4>
                    <p className="text-xs text-[#64748B] leading-relaxed pl-6.5">
                       Admin menambahkan akun Guru, Siswa, dan Pelatih Ekskul. Pada pembuatan profil siswa, Admin berkewajiban mengisi data identitas seperti nama lengkap, NIS, email, password awal, serta **Nomor Absen**.
                    </p>
                 </div>
                 <div className="p-6 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm space-y-2">
                    <h4 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                       <Users className="h-4.5 w-4.5 text-[#5483B3]" /> Manajemen Kelas & Rombel
                    </h4>
                    <p className="text-xs text-[#64748B] leading-relaxed pl-6.5">
                       Menyusun tingkatan kelas beserta nama rombongan belajarnya (contoh: XII RPL 1). Admin juga menugaskan siswa ke dalam kelas-kelas yang telah dibuat agar terpetakan dengan rapi.
                    </p>
                 </div>
                 <div className="p-6 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm space-y-2">
                    <h4 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                       <Calendar className="h-4.5 w-4.5 text-[#5483B3]" /> Manajemen Jadwal (Schedule Planner)
                    </h4>
                    <p className="text-xs text-[#64748B] leading-relaxed pl-6.5">
                       Admin menyusun jadwal belajar mengajar mingguan dengan menetapkan hari, jam mulai, jam selesai, ruang kelas, mata pelajaran, dan menunjuk guru pengampu mata pelajaran tersebut.
                    </p>
                 </div>
              </div>
            </section>

            {/* Teacher Section */}
            <section id="teacher" className="space-y-6 scroll-mt-32">
              <div className="h-px bg-[#E2E8F0] w-full" />
              <div className="space-y-3">
                <span className="text-xs font-black uppercase tracking-widest text-[#5483B3] block">FITUR GURU</span>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0F172A] font-serif">2. Panduan & Fitur Guru Pengampu</h2>
              </div>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Guru Mata Pelajaran memiliki kendali atas proses belajar mengajar harian. Hak akses Guru dirancang khusus agar mereka fokus hanya pada ruang lingkup kelas yang diampu:
              </p>
              
              <div className="space-y-6">
                 {/* Feature 1 */}
                 <div className="flex gap-5 items-start">
                    <div className="h-10 w-10 rounded-2xl bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center shrink-0">
                       <Users className="h-5 w-5" />
                    </div>
                    <div className="space-y-1.5">
                       <h4 className="text-sm font-bold text-[#0F172A]">Pembatasan Kelola Kelas (Class Scoping)</h4>
                       <p className="text-xs text-[#64748B] leading-relaxed">
                         Guru tidak dapat melihat seluruh kelas di sekolah. Halaman "Kelola Kelas" pada akun guru disaring secara otomatis hanya menampilkan daftar kelas di mana guru tersebut terdaftar mengajar berdasarkan jadwal (*Class Schedule*) yang diatur Admin.
                       </p>
                    </div>
                 </div>

                 {/* Feature 2 */}
                 <div className="flex gap-5 items-start">
                    <div className="h-10 w-10 rounded-2xl bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center shrink-0">
                       <ListTodo className="h-5 w-5" />
                    </div>
                    <div className="space-y-1.5">
                       <h4 className="text-sm font-bold text-[#0F172A]">Penyaringan Data Siswa (Student Directory Filter)</h4>
                       <p className="text-xs text-[#64748B] leading-relaxed">
                         Daftar direktori siswa disaring otomatis. Guru hanya akan melihat data profil siswa yang mengambil mata pelajaran yang mereka ajar. Siswa dalam kelas diurutkan rapi berdasarkan **Nomor Absen** serta dapat dikelompokkan berdasarkan kelasnya dengan menekan tombol toggle *"Kelompokkan Kelas"*.
                       </p>
                    </div>
                 </div>

                 {/* Feature 3 */}
                 <div className="flex gap-5 items-start">
                    <div className="h-10 w-10 rounded-2xl bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center shrink-0">
                       <FileText className="h-5 w-5" />
                    </div>
                    <div className="space-y-1.5">
                       <h4 className="text-sm font-bold text-[#0F172A]">Pembagian Materi & Tugas (Classroom Feed)</h4>
                       <p className="text-xs text-[#64748B] leading-relaxed">
                         Melalui Classroom Feed di setiap kelas, Guru dapat membuat postingan materi (dapat melampirkan berkas dokumen atau link video eksternal) serta menerbitkan Tugas. Guru dapat menetapkan skor maksimal, memberikan catatan koreksi (feedback), serta memasukkan nilai setelah siswa mengumpulkan tugas.
                       </p>
                    </div>
                 </div>

                 {/* Feature 4 */}
                 <div className="flex gap-5 items-start">
                    <div className="h-10 w-10 rounded-2xl bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center shrink-0">
                       <Clock className="h-5 w-5" />
                    </div>
                    <div className="space-y-1.5">
                       <h4 className="text-sm font-bold text-[#0F172A]">Absensi Kehadiran Kerja (Teacher Attendance Log)</h4>
                       <p className="text-xs text-[#64748B] leading-relaxed">
                         Guru dapat mencatat kehadiran harian secara mandiri dengan mengeklik tombol *Check-in* saat datang mengajar dan *Check-out* di akhir jam kerja. Guru dapat melampirkan catatan status (seperti Hadir, Sakit, atau Izin) beserta lampiran keterangan tertulis.
                       </p>
                    </div>
                 </div>

                 {/* Feature 5 */}
                 <div className="flex gap-5 items-start">
                    <div className="h-10 w-10 rounded-2xl bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center shrink-0">
                       <MessageSquare className="h-5 w-5" />
                    </div>
                    <div className="space-y-1.5">
                       <h4 className="text-sm font-bold text-[#0F172A]">Forum Diskusi Subjek</h4>
                       <p className="text-xs text-[#64748B] leading-relaxed">
                         Guru dapat memantau ruang diskusi kelas, menjawab pertanyaan siswa terkait materi pelajaran yang diampu, serta mengelola interaksi tanya jawab.
                       </p>
                    </div>
                 </div>
              </div>
            </section>

            {/* Student Section */}
            <section id="student" className="space-y-6 scroll-mt-32">
              <div className="h-px bg-[#E2E8F0] w-full" />
              <div className="space-y-3">
                <span className="text-xs font-black uppercase tracking-widest text-[#5483B3] block">FITUR SISWA</span>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0F172A] font-serif">3. Panduan & Fitur Siswa</h2>
              </div>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Siswa dibekali dengan modul personal untuk memicu pembelajaran mandiri, mencatat secara modular, dan memantau kemajuan belajarnya:
              </p>
              
              <div className="space-y-6">
                 {/* Student Feature 1 */}
                 <div className="flex gap-5 items-start">
                    <div className="h-10 w-10 rounded-2xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center shrink-0">
                       <TrendingUp className="h-5 w-5" />
                    </div>
                    <div className="space-y-1.5">
                       <h4 className="text-sm font-bold text-[#0F172A]">Log Progres Belajar Mandiri (Progress Tracker)</h4>
                       <p className="text-xs text-[#64748B] leading-relaxed">
                         Setiap selesai mempelajari suatu subjek/topik pelajaran, siswa dapat mengisi form progres secara jujur dengan menyertakan durasi belajar (dalam menit), tingkat kesulitan topik (skala 1-5), serta ringkasan reflektif catatan pribadi.
                       </p>
                    </div>
                 </div>

                 {/* Student Feature 2 */}
                 <div className="flex gap-5 items-start">
                    <div className="h-10 w-10 rounded-2xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center shrink-0">
                       <Calendar className="h-5 w-5" />
                    </div>
                    <div className="space-y-1.5">
                       <h4 className="text-sm font-bold text-[#0F172A]">Kalender Akademik & Notion-Style Notes</h4>
                       <p className="text-xs text-[#64748B] leading-relaxed">
                         Siswa dapat membuka menu kalender untuk melihat timeline akademik. Dengan mengeklik salah satu tanggal, siswa dapat membuka block-based editor (seperti Notion) untuk menulis rangkuman pelajaran, checklist tugas pribadi, atau catatan visual harian yang tersimpan otomatis secara real-time.
                       </p>
                    </div>
                 </div>

                 {/* Student Feature 3 */}
                 <div className="flex gap-5 items-start">
                    <div className="h-10 w-10 rounded-2xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center shrink-0">
                       <ClipboardList className="h-5 w-5" />
                    </div>
                    <div className="space-y-1.5">
                       <h4 className="text-sm font-bold text-[#0F172A]">Pengumpulan & Pemantauan Tugas</h4>
                       <p className="text-xs text-[#64748B] leading-relaxed">
                         Menerima instruksi tugas baru dari guru kelas. Siswa mengumpulkan tugas dengan mengetikkan lembar jawaban langsung atau mengunggah berkas lampiran pendukung. Siswa dapat memantau jika tugas telah dinilai beserta rekap nilai tugas rata-rata mereka.
                       </p>
                    </div>
                 </div>

                 {/* Student Feature 4 */}
                 <div className="flex gap-5 items-start">
                    <div className="h-10 w-10 rounded-2xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center shrink-0">
                       <Award className="h-5 w-5" />
                    </div>
                    <div className="space-y-1.5">
                       <h4 className="text-sm font-bold text-[#0F172A]">Papan Peringkat Belajar (Leaderboard)</h4>
                       <p className="text-xs text-[#64748B] leading-relaxed">
                         Guna meningkatkan antusiasme, EduTrack menyusun Papan Peringkat sekolah secara otomatis berdasarkan total durasi jam belajar mandiri yang diinput secara valid oleh para siswa di Progress Tracker.
                       </p>
                    </div>
                 </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="space-y-6 scroll-mt-32">
              <div className="h-px bg-[#E2E8F0] w-full" />
              <div className="space-y-3">
                <span className="text-xs font-black uppercase tracking-widest text-[#5483B3] block">TANYA JAWAB</span>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0F172A] font-serif">Pertanyaan Terkait Alur Kerja</h2>
              </div>
              <div className="space-y-4">
                <div className="p-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm">
                  <h4 className="text-xs font-bold text-[#0F172A] mb-2">Bagaimana cara penetapan nomor absen siswa dilakukan?</h4>
                  <p className="text-[11px] text-[#64748B] leading-relaxed">Nomor absen ditentukan secara terpusat oleh Admin saat mendaftarkan data pengguna atau melakukan pembaruan profil di menu Kelola Pengguna. Hal ini memastikan nomor absen siswa bersifat unik dan valid.</p>
                </div>
                <div className="p-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm">
                  <h4 className="text-xs font-bold text-[#0F172A] mb-2">Mengapa siswa tidak dapat melihat jadwal kelas atau mapel tertentu?</h4>
                  <p className="text-[11px] text-[#64748B] leading-relaxed">Jadwal dan pemetaan mata pelajaran siswa dipengaruhi oleh Rombongan Belajar (Kelas) yang ditentukan Admin. Jika siswa belum dimasukkan ke dalam kelas, maka mata pelajaran dan jadwal tidak akan tampil. Segera hubungi Admin untuk penugasan kelas.</p>
                </div>
              </div>
            </section>
          </motion.main>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 bg-[#1E293B] text-[#94A3B8] border-t border-[#334155] text-center text-xs">
        <p>© {new Date().getFullYear()} EduTrack — Dikembangkan oleh Davin Maritza. Hak Cipta Dilindungi.</p>
      </footer>
    </motion.div>
  )
}
