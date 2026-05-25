'use client'

import { motion } from 'framer-motion'

export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-3">
          <div className="h-3 w-24 bg-[var(--muted)] rounded-lg" />
          <div className="h-8 w-56 bg-[var(--muted)] rounded-xl" />
        </div>
        <div className="h-10 w-36 bg-[var(--muted)] rounded-xl" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-[var(--card)] border border-[var(--border)] rounded-2xl relative overflow-hidden">
            <div className="p-5 space-y-4">
              <div className="flex justify-between">
                <div className="h-3 w-20 bg-[var(--muted)] rounded-md" />
                <div className="h-10 w-10 bg-[var(--muted)] rounded-xl" />
              </div>
              <div className="space-y-2">
                <div className="h-6 w-16 bg-[var(--muted)] rounded-lg" />
                <div className="h-2.5 w-24 bg-[var(--muted)] rounded-md" />
              </div>
            </div>
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--border)]/40 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            />
          </div>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-[340px] bg-[var(--card)] border border-[var(--border)] rounded-2xl relative overflow-hidden">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--border)]/30 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear", delay: 0.3 }}
            />
          </div>
          <div className="h-[280px] bg-[var(--card)] border border-[var(--border)] rounded-2xl relative overflow-hidden">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--border)]/30 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear", delay: 0.5 }}
            />
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-[240px] bg-[var(--card)] border border-[var(--border)] rounded-2xl relative overflow-hidden">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--border)]/30 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear", delay: 0.2 }}
            />
          </div>
          <div className="h-[360px] bg-[var(--card)] border border-[var(--border)] rounded-2xl relative overflow-hidden">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--border)]/30 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear", delay: 0.4 }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
