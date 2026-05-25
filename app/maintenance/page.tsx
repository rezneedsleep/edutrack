'use client'

import Link from "next/link"
import { motion } from "framer-motion"
import { Clock, ShieldAlert, Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[#FDFCF7] text-[#1E293B] flex items-center justify-center p-6 relative overflow-hidden font-sans antialiased">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-60">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#5483B3]/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#C1E8FF]/40 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="max-w-2xl w-full text-center space-y-10 relative z-10">
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 50" className="h-10 w-auto" fill="none">
              <text x="0" y="40" fontFamily="Inter, system-ui, sans-serif" fontSize="42" fontWeight="800" letterSpacing="-2" fill="#1E293B">
                Edu<tspan fontWeight="800" fill="#5483B3">track</tspan>
              </text>
            </svg>
          </div>
        </motion.div>

        {/* Maintenance Visual */}
        <div className="relative pt-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center space-y-6"
          >
            <div className="h-24 w-24 bg-white border border-[#E2E8F0] rounded-full shadow-lg flex items-center justify-center mb-2 animate-bounce">
              <ShieldAlert className="h-12 w-12 text-[#5483B3]" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0F172A] font-serif leading-tight">
              Pemeliharaan Sistem<br />Sedang Berlangsung
            </h2>
            
            <p className="text-[#64748B] font-semibold max-w-md mx-auto leading-relaxed text-sm">
              Mohon maaf atas ketidaknyamanannya. Kami sedang melakukan peningkatan infrastruktur dan pemeliharaan rutin untuk memberikan pelayanan terbaik bagi sekolah Anda.
            </p>
          </motion.div>
        </div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-white border border-[#E2E8F0] p-8 rounded-3xl shadow-sm space-y-4 max-w-lg mx-auto"
        >
          <div className="flex items-center justify-between text-xs font-bold text-[#64748B] pb-3 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#5483B3]" />
              <span>Status: Pemeliharaan Rutin</span>
            </div>
            <div className="h-2 w-2 bg-[#5483B3] rounded-full animate-ping" />
          </div>
          <p className="text-xs text-[#64748B] leading-relaxed text-left">
            Akses masuk saat ini dibatasi hanya untuk Administrator. Sistem akan kembali online untuk Guru, Siswa, dan Pelatih setelah proses sinkronisasi database selesai.
          </p>
          <div className="pt-2 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[#94A3B8]">
            <span>EduTrack Core v2.4.0</span>
            <span>Est. Selesai: Hari ini</span>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
        >
          <Button 
            asChild
            className="bg-[#1E293B] hover:bg-[#334155] text-white font-bold h-12 px-8 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#1E293B]/20 active:scale-[0.98] w-full sm:w-auto text-xs gap-2"
          >
            <Link href="/login">
              <ArrowLeft className="h-4 w-4" />
              Masuk sebagai Admin
            </Link>
          </Button>
          <Button 
            variant="outline"
            asChild
            className="border-[#CBD5E1] hover:border-[#1E293B] hover:bg-white text-slate-700 hover:text-[#1E293B] font-bold h-12 px-8 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-200 active:scale-[0.98] w-full sm:w-auto text-xs gap-2"
          >
            <Link href="/">
              <Home className="h-4 w-4" />
              Kembali ke Beranda
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
