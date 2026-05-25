'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface SubjectCardProps {
  id: string
  name: string
  progress: number
  lastUpdated: string
  status: 'on-track' | 'lagging' | 'ahead'
  color: string
  topicCount: number
  completedTopics: number
}

const statusConfig = {
  'on-track': {
    label: 'On Track',
    className: 'bg-success/10 text-success border-success/20',
  },
  lagging: {
    label: 'Lagging',
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  ahead: {
    label: 'Ahead',
    className: 'bg-primary/10 text-primary border-primary/20',
  },
}

export function SubjectCard({
  id,
  name,
  progress,
  lastUpdated,
  status,
  color,
  topicCount,
  completedTopics,
}: SubjectCardProps) {
  const statusInfo = statusConfig[status]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        href={`/dashboard/subjects/${id}`}
        className="block rounded-3xl bg-card border border-border p-6 hover:shadow-lg transition-all duration-300 group"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${color}20` }}
            >
              <div
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: color }}
              />
            </div>
            <div>
              <h3 className="text-body font-semibold text-foreground group-hover:text-primary transition-colors">
                {name}
              </h3>
              <p className="text-caption text-muted-foreground">
                {completedTopics}/{topicCount} topik selesai
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-caption text-muted-foreground">Progress</span>
            <span className="text-body-sm font-semibold text-foreground font-mono">
              {progress}%
            </span>
          </div>
          <Progress
            value={progress}
            className="h-2"
            style={
              {
                '--progress-background': color,
              } as React.CSSProperties
            }
          />
        </div>

        <div className="flex items-center justify-between mt-4">
          <Badge variant="outline" className={cn('text-caption', statusInfo.className)}>
            {statusInfo.label}
          </Badge>
          <span className="text-caption text-muted-foreground">
            {lastUpdated}
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
