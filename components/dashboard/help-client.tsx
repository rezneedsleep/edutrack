'use client'

import { motion } from 'framer-motion'
import { 
  HelpCircle, 
  Book, 
  Shield, 
  User, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  Terminal,
  Database,
  Mail,
  MessageSquare
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'

interface HelpClientProps {
  role: 'ADMIN' | 'TEACHER' | 'STUDENT'
}

export function HelpClient({ role }: HelpClientProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 pt-4"
      >
        <div className="inline-flex items-center justify-center h-16 w-16 bg-[#5483B3]/10 rounded-2xl mb-2 shadow-sm">
          <HelpCircle className="h-8 w-8 text-[#5483B3]" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--foreground)]">Pusat Bantuan</h1>
        <p className="text-sm text-[var(--muted-foreground)] font-medium max-w-xl mx-auto leading-relaxed">
          Temukan panduan lengkap dan tutorial penggunaan platform EduTrack yang disesuaikan dengan peran Anda sebagai <span className="text-[#5483B3] font-bold">{role}</span>.
        </p>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-8"
      >
        {/* Role Specific Content */}
        {role === 'ADMIN' && (
          <motion.div variants={item} className="space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 bg-[#5483B3]/10 rounded-xl flex items-center justify-center">
                <Shield className="h-5 w-5 text-[#5483B3]" />
              </div>
              <h2 className="text-xl font-bold text-[var(--foreground)]">Panduan Administrator</h2>
            </div>
            
            <Accordion type="single" collapsible className="w-full space-y-3">
              <AccordionItem value="user-mgmt" className="border border-[var(--border)] bg-[var(--card)] px-5 rounded-xl shadow-sm overflow-hidden data-[state=open]:border-[#5483B3]/30 transition-colors">
                <AccordionTrigger className="hover:no-underline text-sm font-bold text-[var(--foreground)] py-4">
                  Kelola Pengguna & Bulk Import
                </AccordionTrigger>
                <AccordionContent className="text-[var(--muted-foreground)] leading-relaxed text-sm space-y-4 pb-5 pt-1">
                  <p>Sebagai Admin, Anda dapat menambahkan user secara manual melalui tombol <span className="bg-[var(--muted)] text-[var(--foreground)] px-2 py-0.5 rounded font-semibold text-xs">+ TAMBAH USER</span> di dashboard.</p>
                  <div className="bg-[#5483B3]/5 p-4 rounded-xl border border-[#5483B3]/20 flex gap-3">
                    <div className="shrink-0 mt-0.5"><AlertCircle className="h-4 w-4 text-[#5483B3]" /></div>
                    <div>
                      <p className="font-bold text-[#5483B3] mb-1 text-xs uppercase tracking-wider">Pro Tip: Bulk Delete</p>
                      <p className="text-xs">Centang kotak di header tabel untuk memilih semua user, lalu klik ikon tempat sampah merah yang muncul untuk menghapus massal dengan protokol keamanan EduTrack.</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="class-subjects" className="border border-[var(--border)] bg-[var(--card)] px-5 rounded-xl shadow-sm overflow-hidden data-[state=open]:border-[#5483B3]/30 transition-colors">
                <AccordionTrigger className="hover:no-underline text-sm font-bold text-[var(--foreground)] py-4">
                  Inisialisasi Kelas & Mapel
                </AccordionTrigger>
                <AccordionContent className="text-[var(--muted-foreground)] leading-relaxed text-sm space-y-4 pb-5 pt-1">
                  <p>Pastikan setiap kelas memiliki jadwal yang valid. Mapel harus dihubungkan dengan minimal satu Guru Utama agar materi dapat diunggah dan diakses siswa.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="technical" className="border border-[var(--border)] bg-[var(--card)] px-5 rounded-xl shadow-sm overflow-hidden data-[state=open]:border-[#5483B3]/30 transition-colors">
                <AccordionTrigger className="hover:no-underline text-sm font-bold text-[var(--foreground)] py-4">
                  Sinkronisasi & Pemeliharaan
                </AccordionTrigger>
                <AccordionContent className="text-[var(--muted-foreground)] leading-relaxed text-sm space-y-4 pb-5 pt-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex gap-3 bg-[var(--muted)]/40 p-4 rounded-xl border border-[var(--border)]">
                        <Terminal className="h-5 w-5 text-[#5483B3] shrink-0" />
                        <div>
                            <p className="text-[var(--foreground)] font-bold text-xs mb-1">Prisma CLI</p>
                            <p className="text-[10px] font-mono bg-[var(--card)] border border-[var(--border)] px-2 py-1 rounded text-[var(--muted-foreground)]">npx prisma db pull && npx prisma generate</p>
                        </div>
                    </div>
                    <div className="flex gap-3 bg-[var(--muted)]/40 p-4 rounded-xl border border-[var(--border)]">
                        <Database className="h-5 w-5 text-[#5483B3] shrink-0" />
                        <div>
                            <p className="text-[var(--foreground)] font-bold text-xs mb-1">Database Monitoring</p>
                            <p className="text-[10px] font-mono bg-[var(--card)] border border-[var(--border)] px-2 py-1 rounded text-[var(--muted-foreground)]">npx prisma studio</p>
                        </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        )}

        {role === 'TEACHER' && (
          <motion.div variants={item} className="space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 bg-[#5483B3]/10 rounded-xl flex items-center justify-center">
                <Book className="h-5 w-5 text-[#5483B3]" />
              </div>
              <h2 className="text-xl font-bold text-[var(--foreground)]">Panduan Guru</h2>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-3">
              <AccordionItem value="materi" className="border border-[var(--border)] bg-[var(--card)] px-5 rounded-xl shadow-sm overflow-hidden data-[state=open]:border-[#5483B3]/30 transition-colors">
                <AccordionTrigger className="hover:no-underline text-sm font-bold text-[var(--foreground)] py-4">
                  Pembuatan Materi & Bab
                </AccordionTrigger>
                <AccordionContent className="text-[var(--muted-foreground)] leading-relaxed text-sm space-y-4 pb-5 pt-1">
                  <p>Gunakan menu <span className="bg-[var(--muted)] text-[var(--foreground)] px-2 py-0.5 rounded font-semibold text-xs">Materi Saya</span>. Anda bisa membagi materi ke dalam beberapa Topik. Klik ikon ekspansi untuk menggunakan editor layar penuh.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="assignments" className="border border-[var(--border)] bg-[var(--card)] px-5 rounded-xl shadow-sm overflow-hidden data-[state=open]:border-[#5483B3]/30 transition-colors">
                <AccordionTrigger className="hover:no-underline text-sm font-bold text-[var(--foreground)] py-4">
                  Pengelolaan Tugas & Deadline
                </AccordionTrigger>
                <AccordionContent className="text-[var(--muted-foreground)] leading-relaxed text-sm space-y-4 pb-5 pt-1">
                  <p>Setiap tugas yang Anda buat akan muncul otomatis di dashboard siswa. Pastikan memasukkan deskripsi yang jelas dan file pendukung jika diperlukan.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        )}

        {role === 'STUDENT' && (
          <motion.div variants={item} className="space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 bg-[#5483B3]/10 rounded-xl flex items-center justify-center">
                <User className="h-5 w-5 text-[#5483B3]" />
              </div>
              <h2 className="text-xl font-bold text-[var(--foreground)]">Panduan Siswa</h2>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-3">
              <AccordionItem value="dashboard" className="border border-[var(--border)] bg-[var(--card)] px-5 rounded-xl shadow-sm overflow-hidden data-[state=open]:border-[#5483B3]/30 transition-colors">
                <AccordionTrigger className="hover:no-underline text-sm font-bold text-[var(--foreground)] py-4">
                  Memantau Jadwal & Progres
                </AccordionTrigger>
                <AccordionContent className="text-[var(--muted-foreground)] leading-relaxed text-sm space-y-4 pb-5 pt-1">
                  <p>Halaman utama Anda menampilkan jadwal pelajaran hari ini. Menu <span className="bg-[var(--muted)] text-[var(--foreground)] px-2 py-0.5 rounded font-semibold text-xs">Progress Saya</span> merangkum seluruh nilai dan aktivitas belajar Anda.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="submit" className="border border-[var(--border)] bg-[var(--card)] px-5 rounded-xl shadow-sm overflow-hidden data-[state=open]:border-[#5483B3]/30 transition-colors">
                <AccordionTrigger className="hover:no-underline text-sm font-bold text-[var(--foreground)] py-4">
                  Cara Mengumpulkan Tugas
                </AccordionTrigger>
                <AccordionContent className="text-[var(--muted-foreground)] leading-relaxed text-sm space-y-4 pb-5 pt-1">
                  <p>Klik menu <span className="bg-[var(--muted)] text-[var(--foreground)] px-2 py-0.5 rounded font-semibold text-xs">Tugas</span>, pilih tugas yang aktif, dan klik tombol <span className="bg-[var(--muted)] text-[var(--foreground)] px-2 py-0.5 rounded font-semibold text-xs">Serahkan Tugas</span>. Anda bisa mengunggah file dokumen atau mengirimkan jawaban berbentuk teks.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        )}

        {/* Common Help Section */}
        <motion.div variants={item} className="pt-8">
          <Card className="bg-[#5483B3]/5 border border-[#5483B3]/20 rounded-2xl shadow-sm overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-3 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-[#5483B3]">
                    <MessageSquare className="h-5 w-5" />
                    <p className="text-sm font-bold">Butuh Bantuan Lebih Lanjut?</p>
                  </div>
                  <p className="text-xs md:text-sm text-[var(--muted-foreground)] font-medium max-w-md leading-relaxed">
                    Jika Anda mengalami kendala teknis yang tidak dapat diselesaikan melalui panduan di atas, silakan hubungi tim dukungan IT kami.
                  </p>
                </div>
                <Button className="bg-[#5483B3] hover:bg-[#3B6FA0] text-white rounded-xl font-bold text-xs px-6 h-12 shadow-lg shadow-[#5483B3]/20 transition-all gap-2 w-full md:w-auto">
                  <Mail className="h-4 w-4" /> Hubungi Admin IT
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
