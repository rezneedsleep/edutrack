'use client'

import { motion } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User,
  Users,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

export function ScheduleClient({ schedules, role }: any) {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[var(--border)]">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)]">Jadwal Pelajaran</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-2 font-medium">Lihat jadwal kelas Anda selama seminggu.</p>
        </div>
      </div>

      {/* Mobile view warning (optional helper) */}
      <div className="block md:hidden bg-[#5483B3]/10 text-[#5483B3] p-3 rounded-xl text-xs font-semibold text-center border border-[#5483B3]/20">
        Geser ke kanan untuk melihat jadwal hari berikutnya →
      </div>

      <div className="flex md:grid md:grid-cols-7 gap-4 overflow-x-auto pb-4 md:pb-0 snap-x">
        {DAYS.map((day, dayIndex) => {
          const daySchedules = schedules.filter((s: any) => s.dayOfWeek === dayIndex)
          
          return (
            <div key={day} className="space-y-4 min-w-[260px] md:min-w-0 snap-start">
              <div className="text-center py-3 bg-[var(--muted)] border border-[var(--border)] rounded-xl sticky top-0 z-10">
                <p className="text-xs font-bold text-[#5483B3] uppercase tracking-wider">{day}</p>
              </div>
              
              <div className="space-y-3">
                {daySchedules.length > 0 ? daySchedules.map((s: any, i: number) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card 
                      className="bg-[var(--card)] border-[var(--border)] rounded-xl group hover:shadow-md transition-all overflow-hidden relative" 
                    >
                      {/* Left accent color bar */}
                      <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: s.subject.color || '#5483B3' }} />
                      
                      <CardContent className="p-4 pl-5 space-y-3">
                        <div>
                          <p className="text-[10px] font-extrabold text-[var(--muted-foreground)] mb-1 flex items-center gap-1.5 bg-[var(--muted)] w-fit px-2 py-0.5 rounded-md">
                            <Clock className="h-3 w-3" />
                            {s.startTime} - {s.endTime}
                          </p>
                          <h4 className="text-sm font-bold text-[var(--foreground)] leading-tight group-hover:text-[#5483B3] transition-colors">{s.subject.name}</h4>
                        </div>
                        
                        <div className="space-y-1.5 pt-2 border-t border-[var(--border)]">
                           <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                              <MapPin className="h-3.5 w-3.5 text-[#5483B3]" />
                              <span className="text-xs font-medium truncate">{s.room || 'TBA'}</span>
                           </div>
                           <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                              {role === 'TEACHER' ? (
                                <>
                                  <Users className="h-3.5 w-3.5 text-[#5483B3]" />
                                  <span className="text-xs font-medium truncate">{s.class?.name || 'No Class'}</span>
                                </>
                              ) : (
                                <>
                                  <User className="h-3.5 w-3.5 text-[#5483B3]" />
                                  <span className="text-xs font-medium truncate">{s.teacher.name.split(' ')[0]}</span>
                                </>
                              )}
                           </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )) : (
                  <div className="h-24 border border-dashed border-[var(--border)] bg-[var(--card)] flex flex-col items-center justify-center rounded-xl opacity-60">
                    <Calendar className="h-5 w-5 text-[var(--muted-foreground)] mb-1 opacity-50" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Kosong</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
