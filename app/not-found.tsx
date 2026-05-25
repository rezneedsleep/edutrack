'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, GraduationCap, Ghost } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-60">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#5483B3]/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#C1E8FF]/40 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="text-center space-y-10 max-w-2xl relative z-10">
        {/* Logo Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="h-12 w-12 bg-[#5483B3] rounded-2xl flex items-center justify-center shadow-lg shadow-[#5483B3]/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <span className="text-3xl font-bold tracking-tight text-[#0F172A]">EduTrack</span>
          </Link>
        </motion.div>

        {/* 404 Visual */}
        <div className="relative pt-6">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-[12rem] md:text-[16rem] font-extrabold leading-none tracking-tight select-none text-[#5483B3]/5"
          >
            404
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center space-y-4 pt-16"
          >
            <div className="h-20 w-20 bg-white border border-[var(--border)] rounded-full shadow-lg flex items-center justify-center mb-4">
              <Ghost className="h-10 w-10 text-[#5483B3] animate-bounce" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#0F172A] leading-tight">
              Halaman Tidak<br/>Ditemukan
            </h2>
            <p className="text-[var(--muted-foreground)] font-medium max-w-md mx-auto leading-relaxed">
              Sepertinya Anda tersesat. Halaman yang Anda cari mungkin telah dipindah atau dihapus.
            </p>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col md:flex-row gap-4 justify-center items-center pt-8"
        >
          <Button 
            asChild
            size="lg"
            className="bg-[#5483B3] hover:bg-[#3B6FA0] text-white font-bold h-14 px-8 rounded-xl group w-full md:w-auto shadow-lg shadow-[#5483B3]/20 transition-all hover:-translate-y-0.5"
          >
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Kembali Ke Beranda
            </Link>
          </Button>
          
          <Button 
            variant="outline"
            size="lg"
            className="border-[var(--border)] hover:bg-[var(--muted)] text-[#0F172A] font-bold h-14 px-8 rounded-xl group w-full md:w-auto transition-all"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            Kembali
          </Button>
        </motion.div>
      </div>

      {/* Footer Decoration */}
      <div className="absolute bottom-8 text-[11px] font-semibold tracking-widest text-[var(--muted-foreground)]/60">
        ERROR_CODE: EDUTRACK_404
      </div>
    </div>
  )
}
