'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Calendar, BarChart3 } from 'lucide-react'

const showcaseItems = [
  {
    title: 'Dashboard Siswa yang Intuitif',
    description:
      'Lihat progress belajarmu dalam tampilan yang jelas. Track streak harian, pencapaian, dan rekomendasi materi selanjutnya.',
    icon: TrendingUp,
    features: ['Progress real-time', 'Streak tracking', 'Goal setting'],
    align: 'left' as const,
  },
  {
    title: 'Jadwal Belajar Terstruktur',
    description:
      'Atur jadwal belajar mingguan dengan mudah. Set reminder otomatis agar tidak pernah lupa waktu belajar.',
    icon: Calendar,
    features: ['Weekly planner', 'Smart reminders', 'Subject color coding'],
    align: 'right' as const,
  },
  {
    title: 'Laporan Komprehensif',
    description:
      'Laporan otomatis untuk guru dan orang tua. Ekspor PDF kapan saja dengan detail progress per mata pelajaran.',
    icon: BarChart3,
    features: ['PDF export', 'Progress charts', 'Performance insights'],
    align: 'left' as const,
  },
]

export function Showcase() {
  return (
    <section className="py-24 md:py-32 bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-display-3 text-foreground text-balance">
            Dirancang untuk{' '}
            <span className="text-primary">kemudahan penggunaan</span>
          </h2>
          <p className="mt-4 text-body text-muted-foreground">
            Interface yang bersih dan mudah dipahami oleh semua pengguna.
          </p>
        </motion.div>

        {/* Showcase items */}
        <div className="space-y-24 md:space-y-32">
          {showcaseItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
              className={`flex flex-col gap-12 items-center ${
                item.align === 'right'
                  ? 'lg:flex-row-reverse'
                  : 'lg:flex-row'
              }`}
            >
              {/* Content */}
              <div className="flex-1 max-w-lg">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <item.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-heading-1 text-foreground mb-4">
                  {item.title}
                </h3>
                <p className="text-body text-muted-foreground mb-6">
                  {item.description}
                </p>
                <ul className="space-y-3">
                  {item.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-body-sm text-foreground"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mockup */}
              <div className="flex-1 w-full max-w-xl">
                <div className="relative">
                  {/* Glow effect */}
                  <div className="absolute -inset-4 bg-primary/10 blur-2xl rounded-3xl" />
                  
                  {/* Screen mockup */}
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border bg-card">
                    <div className="aspect-[4/3] bg-secondary p-6">
                      {/* Mock UI based on feature */}
                      {index === 0 && (
                        <div className="h-full flex flex-col">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="h-12 w-12 rounded-2xl bg-primary/20" />
                            <div>
                              <div className="h-4 w-32 rounded bg-foreground/20 mb-2" />
                              <div className="h-3 w-24 rounded bg-muted-foreground/20" />
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 mb-6">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="rounded-2xl bg-card p-4">
                                <div className="h-8 w-8 rounded-xl bg-primary/20 mb-3" />
                                <div className="h-5 w-16 rounded bg-foreground/30 mb-1" />
                                <div className="h-3 w-12 rounded bg-muted-foreground/20" />
                              </div>
                            ))}
                          </div>
                          <div className="flex-1 rounded-2xl bg-card p-4">
                            <div className="h-3 w-24 rounded bg-muted-foreground/20 mb-4" />
                            <div className="h-full flex items-end gap-2">
                              {[60, 40, 80, 55, 90, 45, 75].map((h, i) => (
                                <div
                                  key={i}
                                  className="flex-1 rounded-t bg-primary/40"
                                  style={{ height: `${h}%` }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      {index === 1 && (
                        <div className="h-full">
                          <div className="flex items-center justify-between mb-6">
                            <div className="h-4 w-32 rounded bg-foreground/20" />
                            <div className="flex gap-2">
                              <div className="h-8 w-8 rounded-lg bg-muted-foreground/20" />
                              <div className="h-8 w-8 rounded-lg bg-muted-foreground/20" />
                            </div>
                          </div>
                          <div className="grid grid-cols-7 gap-2 mb-4">
                            {['S', 'S', 'R', 'K', 'J', 'S', 'M'].map((day, i) => (
                              <div key={i} className="text-center text-caption text-muted-foreground">
                                {day}
                              </div>
                            ))}
                          </div>
                          <div className="grid grid-cols-7 gap-2">
                            {Array.from({ length: 35 }).map((_, i) => (
                              <div
                                key={i}
                                className={`aspect-square rounded-lg ${
                                  [3, 10, 11, 17, 24, 25, 31].includes(i)
                                    ? 'bg-primary/30'
                                    : 'bg-card'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      {index === 2 && (
                        <div className="h-full flex flex-col">
                          <div className="flex items-center justify-between mb-6">
                            <div className="h-4 w-40 rounded bg-foreground/20" />
                            <div className="h-8 w-24 rounded-lg bg-primary/20" />
                          </div>
                          <div className="space-y-4 flex-1">
                            {[1, 2, 3, 4].map((i) => (
                              <div key={i} className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-card flex items-center justify-center">
                                  <div className="h-5 w-5 rounded bg-primary/30" />
                                </div>
                                <div className="flex-1">
                                  <div className="h-3 w-32 rounded bg-foreground/20 mb-2" />
                                  <div className="h-2 w-full rounded-full bg-card">
                                    <div
                                      className="h-full rounded-full bg-primary/40"
                                      style={{ width: `${40 + i * 15}%` }}
                                    />
                                  </div>
                                </div>
                                <div className="h-4 w-12 rounded bg-muted-foreground/20" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
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
