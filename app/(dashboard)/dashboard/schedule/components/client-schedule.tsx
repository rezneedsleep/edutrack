'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, User } from 'lucide-react'
import { Card } from '@/components/ui/card'

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

export function StudentScheduleClient({ initialSchedules }: any) {
  const [selectedDay, setSelectedDay] = React.useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1)

  return (
    <div className="space-y-8 pb-10">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <h1 className="text-4xl font-bold tracking-tight text-white">Jadwal Belajar</h1>
        <p className="text-white/50 text-lg mt-1">Jangan sampai terlewat sesi kelas pentingmu.</p>
      </motion.div>

      <div className="flex flex-wrap gap-2 p-2 bg-[#1C1C1E] border border-[#3A3A3C] rounded-[24px]">
        {DAYS.map((day, i) => (
          <button
            key={day}
            onClick={() => setSelectedDay(i)}
            className={cn(
              "flex-1 min-w-[100px] py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all",
              selectedDay === i ? "bg-primary text-white shadow-xl shadow-primary/30" : "text-white/30 hover:text-white"
            )}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {initialSchedules.filter((s: any) => s.dayOfWeek === selectedDay + 1).map((s: any) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-[40px] bg-[#1C1C1E] border border-[#3A3A3C] hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center gap-8 group"
          >
            <div className="flex flex-col items-center md:items-end md:w-32 shrink-0">
               <p className="text-3xl font-black text-white">{s.startTime}</p>
               <p className="text-xs font-bold text-white/30 uppercase tracking-widest">{s.endTime}</p>
            </div>
            
            <div className="h-px md:h-20 w-full md:w-px bg-white/5" />
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                 <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.subject.color}20` }}>
                    <Calendar className="h-5 w-5" style={{ color: s.subject.color }} />
                 </div>
                 <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">{s.subject.name}</h3>
              </div>
              
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <User className="h-4 w-4 text-primary" />
                  <span>{s.teacher.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{s.room || 'TBA'}</span>
                </div>
              </div>
            </div>
            
            <div className="flex md:flex-col gap-2">
               <button className="flex-1 md:flex-none h-12 px-6 rounded-xl bg-white/5 text-white/60 font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-colors">
                  Materi
               </button>
               <button className="flex-1 md:flex-none h-12 px-6 rounded-xl bg-white/5 text-white/60 font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-colors">
                  Tugas
               </button>
            </div>
          </motion.div>
        ))}

        {initialSchedules.filter((s: any) => s.dayOfWeek === selectedDay + 1).length === 0 && (
          <div className="py-32 text-center border-2 border-dashed border-[#3A3A3C] rounded-[40px] opacity-20">
             <Calendar className="h-16 w-16 mx-auto mb-4" />
             <p className="text-xl font-bold italic">Waktu istirahat! Tidak ada jadwal untuk hari {DAYS[selectedDay]}.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
