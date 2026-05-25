'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { ListChecks, Clock, BookOpen, AlertCircle, ChevronRight, CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { format, differenceInDays } from 'date-fns'
import Link from 'next/link'

export function AssignmentsClient({ initialAssignments }: any) {
  const [filter, setFilter] = React.useState('ALL')

  const filtered = initialAssignments.filter((a: any) => {
    if (filter === 'PENDING') return a.submissions.length === 0 && new Date(a.deadline) > new Date()
    if (filter === 'SUBMITTED') return a.submissions.length > 0
    if (filter === 'OVERDUE') return a.submissions.length === 0 && new Date(a.deadline) < new Date()
    return true
  })

  return (
    <div className="space-y-8 pb-10">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <h1 className="text-4xl font-bold tracking-tight text-white">Tugas Saya</h1>
        <p className="text-white/50 text-lg mt-1">Selesaikan tugas tepat waktu untuk hasil maksimal.</p>
      </motion.div>

      <div className="flex gap-2 p-1 bg-[#1C1C1E] border border-[#3A3A3C] rounded-2xl w-fit">
        {['ALL', 'PENDING', 'SUBMITTED', 'OVERDUE'].map(t => (
          <button 
            key={t}
            onClick={() => setFilter(t)}
            className={cn(
              "px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-xl transition-all",
              filter === t ? "bg-primary text-white" : "text-white/40 hover:text-white"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((as: any) => {
          const daysLeft = differenceInDays(new Date(as.deadline), new Date())
          const isSubmitted = as.submissions.length > 0
          const submission = as.submissions[0]

          return (
            <Card key={as.id} className="p-8 rounded-[40px] bg-[#1C1C1E] border-[#3A3A3C] hover:border-white/20 transition-all flex flex-col group">
              <div className="flex items-start justify-between mb-8">
                 <div className="h-14 w-14 rounded-2xl flex items-center justify-center bg-primary/10" style={{ color: as.subject.color }}>
                   <ListChecks className="h-7 w-7" />
                 </div>
                 <Badge className={cn("rounded-full px-4 py-1 h-8", 
                   isSubmitted ? "bg-green-500/20 text-green-400" : daysLeft < 0 ? "bg-red-500/20 text-red-400" : "bg-white/5 text-white/40"
                 )}>
                   {isSubmitted ? 'Selesai' : daysLeft < 0 ? 'Terlambat' : 'Belum'}
                 </Badge>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{as.title}</h3>
              <p className="text-sm text-white/40 mb-8 line-clamp-2">{as.description}</p>

              <div className="mt-auto space-y-6">
                <div className="flex items-center gap-2">
                   <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: as.subject.color }} />
                   <span className="text-xs font-bold text-white/60 uppercase tracking-widest">{as.subject.name}</span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5">
                  <div className="flex items-center gap-2">
                    <Clock className={cn("h-4 w-4", daysLeft <= 2 ? "text-red-400" : "text-white/40")} />
                    <span className={cn("text-xs font-bold", daysLeft <= 2 ? "text-red-400" : "text-white/60")}>
                      {daysLeft < 0 ? 'Selesai' : daysLeft === 0 ? 'Hari Ini!' : `${daysLeft} Hari Lagi`}
                    </span>
                  </div>
                  <span className="text-[10px] text-white/30 uppercase font-bold tracking-widest">{format(new Date(as.deadline), 'dd MMM')}</span>
                </div>

                {isSubmitted && submission.score !== null && (
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-green-500/5 border border-green-500/10">
                    <span className="text-xs font-bold text-green-400">Nilai</span>
                    <span className="text-lg font-black text-green-400">{submission.score} / {as.maxScore}</span>
                  </div>
                )}

                <Button className="w-full h-12 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-white/70">
                  {isSubmitted ? 'Lihat Detail' : 'Kumpulkan Tugas'} <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
