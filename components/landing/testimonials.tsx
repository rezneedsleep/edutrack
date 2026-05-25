'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const testimonials = [
  {
    quote:
      'EduTrack membantu saya memantau progress 200+ siswa dengan mudah. Sekarang saya bisa fokus pada siswa yang benar-benar butuh bantuan.',
    name: 'Bu Siti Rahayu',
    role: 'Guru Matematika, SMAN 1 Jakarta',
    avatar: 'SR',
    rating: 5,
  },
  {
    quote:
      'Sebagai siswa, saya jadi lebih termotivasi karena bisa lihat progress sendiri. Fitur streak-nya bikin semangat belajar setiap hari!',
    name: 'Andi Pratama',
    role: 'Siswa Kelas XI, SMKN 2 Bandung',
    avatar: 'AP',
    rating: 5,
  },
  {
    quote:
      'Platform yang sangat intuitif. Sekolah kami mengadopsi EduTrack untuk semua kelas dan hasilnya sangat positif.',
    name: 'Pak Budi Santoso',
    role: 'Kepala Sekolah, SMA Negeri 3 Surabaya',
    avatar: 'BS',
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 md:py-32 bg-secondary">
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
            Dipercaya oleh <span className="text-primary">guru & siswa</span>{' '}
            di seluruh Indonesia
          </h2>
          <p className="mt-4 text-body text-muted-foreground">
            Dengar langsung dari mereka yang sudah merasakan manfaatnya.
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="apple-card p-8"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-warning text-warning"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-body text-foreground mb-6">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-body-sm font-semibold text-primary">
                    {testimonial.avatar}
                  </span>
                </div>
                <div>
                  <div className="text-body-sm font-semibold text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-caption text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
