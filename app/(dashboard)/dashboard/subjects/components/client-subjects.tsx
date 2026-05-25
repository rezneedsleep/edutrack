'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, User, List, ChevronRight, PlayCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

export function SubjectsClient({ userSubjects }: any) {
  return (
    <div className="space-y-8 pb-10">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <h1 className="text-4xl font-bold tracking-tight text-white">Mata Pelajaran</h1>
        <p className="text-white/50 text-lg mt-1">Daftar kurikulum dan materi yang kamu pelajari.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {userSubjects.map((us: any) => {
          const progress = Math.floor(Math.random() * 100)
          return (
            <Card key={us.id} className="p-10 rounded-[40px] bg-[#1C1C1E] border-[#3A3A3C] hover:border-white/20 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 blur-[128px] opacity-10" style={{ backgroundColor: us.subject.color }} />
              
              <div className="flex items-start justify-between mb-10">
                <div className="h-20 w-20 rounded-[32px] flex items-center justify-center bg-primary/10" style={{ backgroundColor: `${us.subject.color}20` }}>
                  <BookOpen className="h-10 w-10" style={{ color: us.subject.color }} />
                </div>
                <Badge variant="outline" className="border-white/10 text-white/40 h-8 px-4 rounded-full uppercase tracking-widest text-[10px] font-bold">
                  {us.subject.topics.length} Topik
                </Badge>
              </div>

              <h2 className="text-3xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{us.subject.name}</h2>
              <div className="flex items-center gap-2 mb-10">
                <div className="h-6 w-6 rounded-full bg-white/5 flex items-center justify-center">
                  <User className="h-3 w-3 text-white/40" />
                </div>
                <span className="text-sm text-white/40 font-medium">{us.subject.teacher?.name || 'Guru'}</span>
              </div>

              <div className="space-y-6 mb-10">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white/40">
                  <span>Progress Kurikulum</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2 bg-black/40" style={{ '--progress-foreground': us.subject.color } as any} />
              </div>

              <div className="space-y-4">
                 <h4 className="text-xs font-bold uppercase tracking-widest text-white/30">Daftar Topik</h4>
                 <div className="space-y-2">
                   {us.subject.topics.slice(0, 3).map((t: any) => (
                     <div key={t.id} className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5 group/topic hover:border-white/20 transition-all">
                       <span className="text-sm font-medium text-white/70 group-hover/topic:text-white">{t.name}</span>
                       <ChevronRight className="h-4 w-4 text-white/20" />
                     </div>
                   ))}
                 </div>
              </div>

              <Button className="w-full h-14 rounded-2xl bg-white text-black font-black text-lg mt-10 shadow-2xl hover:bg-white/90">
                Lanjutkan Belajar <PlayCircle className="ml-2 h-6 w-6" />
              </Button>
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
