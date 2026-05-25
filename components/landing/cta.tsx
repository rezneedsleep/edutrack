'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CTA() {
  return (
    <section className="py-24 md:py-32 bg-foreground dark:bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-display-2 text-background dark:text-foreground text-balance">
            Siap meningkatkan kualitas belajar di sekolahmu?
          </h2>
          <p className="mt-6 text-body md:text-xl text-background/70 dark:text-muted-foreground max-w-2xl mx-auto">
            Bergabung dengan ribuan sekolah lainnya yang sudah menggunakan
            EduTrack untuk memantau progress belajar siswa.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10"
          >
            <Button
              size="lg"
              asChild
              className="rounded-2xl px-8 h-14 text-lg bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Link href="/register">
                Daftar Sekarang — Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
