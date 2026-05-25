'use client'

import * as React from 'react'
import { motion, useInView } from 'framer-motion'
import { Users, School, Heart, Wallet } from 'lucide-react'

const stats = [
  {
    value: 10000,
    suffix: '+',
    label: 'Siswa terdaftar',
    icon: Users,
  },
  {
    value: 500,
    suffix: '+',
    label: 'Sekolah',
    icon: School,
  },
  {
    value: 98,
    suffix: '%',
    label: 'Kepuasan guru',
    icon: Heart,
  },
  {
    value: 0,
    suffix: '',
    label: 'Biaya',
    prefix: 'Rp',
    icon: Wallet,
  },
]

function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
}: {
  value: number
  prefix?: string
  suffix?: string
}) {
  const [displayValue, setDisplayValue] = React.useState(0)
  const ref = React.useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  React.useEffect(() => {
    if (isInView) {
      const duration = 2000
      const steps = 60
      const increment = value / steps
      let current = 0
      const timer = setInterval(() => {
        current += increment
        if (current >= value) {
          setDisplayValue(value)
          clearInterval(timer)
        } else {
          setDisplayValue(Math.floor(current))
        }
      }, duration / steps)
      return () => clearInterval(timer)
    }
  }, [isInView, value])

  return (
    <span ref={ref} className="font-mono">
      {prefix}
      {displayValue.toLocaleString('id-ID')}
      {suffix}
    </span>
  )
}

export function Stats() {
  return (
    <section className="py-16 bg-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-primary/10 text-primary mb-4">
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="text-heading-1 text-foreground">
                <AnimatedNumber
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </div>
              <div className="text-body-sm text-muted-foreground mt-1">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
