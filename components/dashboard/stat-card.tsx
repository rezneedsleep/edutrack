'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon: React.ComponentType<{ className?: string }>
  className?: string
}

export function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  className,
}: StatCardProps) {
  const isPositive = change && change > 0
  const isNegative = change && change < 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'rounded-2xl bg-[var(--card)] border border-[var(--border)] p-5 hover:shadow-lg hover:shadow-[#5483B3]/5 transition-all duration-300',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="h-10 w-10 rounded-xl bg-[#5483B3]/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-[#5483B3]" />
        </div>
        {change !== undefined && (
          <div
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium',
              isPositive && 'bg-[#22C55E]/10 text-[#22C55E]',
              isNegative && 'bg-[#E54D4D]/10 text-[#E54D4D]',
              !isPositive && !isNegative && 'bg-[var(--muted)] text-[var(--muted-foreground)]'
            )}
          >
            {isPositive && <TrendingUp className="h-3 w-3" />}
            {isNegative && <TrendingDown className="h-3 w-3" />}
            <span>
              {isPositive && '+'}
              {change}%
            </span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">{title}</p>
        <p className="text-2xl font-bold text-[var(--foreground)] mt-1 tracking-tight">{value}</p>
        {changeLabel && (
          <p className="text-xs text-[var(--muted-foreground)] mt-1">{changeLabel}</p>
        )}
      </div>
    </motion.div>
  )
}
