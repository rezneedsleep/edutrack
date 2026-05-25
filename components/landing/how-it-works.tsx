'use client'

import * as React from 'react'
import { motion } from 'framer-motion'

const steps = [
  {
    number: '01',
    title: 'Daftar & Buat Kelas',
    description:
      'Guru mendaftar dan membuat kelas dalam hitungan menit. Undang siswa dengan kode kelas yang unik.',
  },
  {
    number: '02',
    title: 'Siswa Input Progress Harian',
    description:
      'Siswa mencatat materi yang dipelajari setiap hari. Durasi belajar, tingkat kesulitan, dan catatan tambahan.',
  },
  {
    number: '03',
    title: 'Guru Pantau & Beri Feedback',
    description:
      'Guru melihat progress real-time semua siswa. Identifikasi yang tertinggal dan berikan dukungan tepat waktu.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-secondary">
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
            Mulai dalam <span className="text-primary">3 langkah mudah</span>
          </h2>
          <p className="mt-4 text-body text-muted-foreground">
            Tidak perlu setup rumit. Langsung pakai dan rasakan manfaatnya.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-px bg-border" />
              )}

              <div className="relative text-center">
                {/* Step number */}
                <div className="inline-flex items-center justify-center h-24 w-24 rounded-3xl bg-card shadow-sm border border-border mb-6">
                  <span className="text-display-3 text-primary font-mono">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-heading-2 text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-body text-muted-foreground max-w-sm mx-auto">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
