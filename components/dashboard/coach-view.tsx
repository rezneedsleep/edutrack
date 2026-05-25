'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Calendar, Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function CoachDashboard({ user, extracurriculars }: any) {
  return (
    <div className="space-y-8 pb-20">
      {/* Header section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-[#5483B3] to-[#3B6FA0] rounded-3xl p-8 text-white relative overflow-hidden shadow-lg shadow-[#5483B3]/20">
        <div className="absolute inset-0 bg-dot-pattern opacity-10 mix-blend-overlay" />
        <div className="relative z-10">
          <p className="text-white/80 font-medium uppercase tracking-wider text-sm flex items-center gap-2 mb-2">
            <Trophy className="h-4 w-4" /> DASHBOARD PELATIH
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
            Halo, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-white/90 text-lg max-w-xl leading-relaxed">
            Kelola jadwal, absensi, dan materi ekstrakurikuler yang Anda bina di sini.
          </p>
        </div>
      </motion.div>

      {/* Ekstrakurikuler Saya */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)]">Ekstrakurikuler Binaan</h2>
        </div>
        
        {extracurriculars?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {extracurriculars.map((ekskul: any) => (
              <Card key={ekskul.id} className="bg-[var(--card)] border-[var(--border)] rounded-3xl shadow-sm hover:shadow-md transition-shadow group overflow-hidden">
                <CardHeader className="bg-[var(--muted)]/50 border-b border-[var(--border)] p-5">
                  <CardTitle className="text-lg font-bold group-hover:text-[#5483B3] transition-colors">{ekskul.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-3 text-sm font-medium text-[var(--muted-foreground)]">
                    <Calendar className="h-4 w-4" />
                    <span>{ekskul.schedule || 'Belum ada jadwal rutin'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-[var(--muted-foreground)]">
                    <Users className="h-4 w-4" />
                    <span>{ekskul.members?.length || 0} Anggota</span>
                  </div>
                  
                  <Link href={`/dashboard/coach/extracurriculars/${ekskul.id}`}>
                    <Button className="w-full bg-[var(--background)] border border-[var(--border)] text-[#5483B3] hover:bg-[#5483B3]/10 mt-2">
                      Kelola Ekskul
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-[var(--card)] border-[var(--border)] border-dashed rounded-3xl">
             <CardContent className="p-12 flex flex-col items-center text-center space-y-4">
                <div className="h-16 w-16 bg-[var(--muted)] rounded-full flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-[var(--muted-foreground)] opacity-50" />
                </div>
                <div>
                   <p className="text-lg font-bold text-[var(--foreground)]">Belum ada Ekstrakurikuler</p>
                   <p className="text-sm font-medium text-[var(--muted-foreground)]">Anda belum ditugaskan sebagai pembina ekskul manapun.</p>
                </div>
             </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  )
}
