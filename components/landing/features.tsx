'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  CalendarCheck,
  AlertTriangle,
  Lightbulb,
  FileText,
  Bell,
  Trophy,
  Users,
} from 'lucide-react'

const features = [
  {
    icon: LayoutDashboard,
    title: 'Dashboard Real-Time',
    description: 'Pantau semua siswa dalam satu tampilan yang intuitif dan mudah dipahami.',
  },
  {
    icon: CalendarCheck,
    title: 'Input Harian',
    description: 'Siswa log materi yang sudah dipelajari setiap hari dengan cepat dan mudah.',
  },
  {
    icon: AlertTriangle,
    title: 'Deteksi Siswa Lagging',
    description: 'Otomatis highlight siswa yang tertinggal agar bisa segera ditindaklanjuti.',
  },
  {
    icon: Lightbulb,
    title: 'Rekomendasi Materi',
    description: 'Saran materi berikutnya berdasarkan progress dan kemampuan siswa.',
  },
  {
    icon: FileText,
    title: 'Laporan Otomatis',
    description: 'Ekspor PDF laporan kemajuan per periode dengan satu klik.',
  },
  {
    icon: Bell,
    title: 'Notifikasi Pintar',
    description: 'Pengingat belajar dan alert guru untuk menjaga konsistensi.',
  },
  {
    icon: Trophy,
    title: 'Leaderboard',
    description: 'Motivasi siswa dengan ranking belajar dan sistem pencapaian.',
  },
  {
    icon: Users,
    title: 'Multi-Role',
    description: 'Tampilan berbeda untuk siswa, guru, dan admin sesuai kebutuhan.',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export function Features() {
  return (
    <section id="features" className="py-24 md:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-display-3 text-foreground text-balance">
            Semua yang kamu butuhkan untuk{' '}
            <span className="text-primary">memantau belajar</span>
          </h2>
          <p className="mt-4 text-body text-muted-foreground">
            Fitur lengkap yang dirancang khusus untuk kebutuhan pendidikan di
            Indonesia.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="apple-card p-6 group cursor-default"
            >
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-heading-3 text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-body-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
