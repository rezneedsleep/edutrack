'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background gradient mesh */}
      <div className="absolute inset-0 gradient-mesh" />
      
      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-caption font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              Platform pendidikan #1 di Indonesia
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8 text-display-1 text-foreground text-balance"
          >
            Pantau Belajar.
            <br />
            <span className="text-primary">Capai Lebih.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-body md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty"
          >
            Platform monitoring kemajuan belajar siswa SMA/SMK yang simpel,
            real-time, dan gratis. Dirancang khusus untuk guru dan siswa
            Indonesia.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              asChild
              className="rounded-2xl px-8 h-14 text-lg"
            >
              <Link href="/register">
                Mulai Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="rounded-2xl px-8 h-14 text-lg"
            >
              <Link href="#how-it-works">
                <Play className="mr-2 h-5 w-5" />
                Lihat Demo
              </Link>
            </Button>
          </motion.div>

          {/* Dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 md:mt-24 perspective-1000"
          >
            <div className="relative mx-auto max-w-5xl">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-3xl" />
              
              {/* Dashboard preview */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border bg-card">
                <div className="aspect-[16/10] bg-secondary flex items-center justify-center">
                  {/* Mock dashboard UI */}
                  <div className="w-full h-full p-4 md:p-8">
                    {/* Top bar */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/20" />
                        <div className="h-4 w-24 rounded bg-muted-foreground/20" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-muted-foreground/20" />
                        <div className="h-8 w-8 rounded-full bg-muted-foreground/20" />
                      </div>
                    </div>
                    
                    {/* Stats row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="rounded-2xl bg-card p-4 shadow-sm"
                        >
                          <div className="h-3 w-16 rounded bg-muted-foreground/20 mb-2" />
                          <div className="h-6 w-12 rounded bg-foreground/20" />
                        </div>
                      ))}
                    </div>

                    {/* Chart area */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="md:col-span-2 rounded-2xl bg-card p-4 shadow-sm">
                        <div className="h-3 w-32 rounded bg-muted-foreground/20 mb-4" />
                        <div className="h-32 flex items-end justify-between gap-2">
                          {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                            <div
                              key={i}
                              className="flex-1 bg-primary/30 rounded-t"
                              style={{ height: `${h}%` }}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="rounded-2xl bg-card p-4 shadow-sm">
                        <div className="h-3 w-24 rounded bg-muted-foreground/20 mb-4" />
                        <div className="space-y-3">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-lg bg-secondary" />
                              <div className="flex-1">
                                <div className="h-2 w-full rounded bg-secondary mb-1" />
                                <div className="h-2 w-3/4 rounded bg-muted-foreground/20" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
