'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Calendar as CalendarIcon, Clock, BookOpen, AlertCircle, PartyPopper, Flag } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { format, isSameDay, parseISO } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

// Hari Libur Nasional Indonesia 2026
// Sumber: Keputusan Bersama Menteri (disesuaikan setiap tahun)
const INDONESIAN_HOLIDAYS_2026 = [
  { date: '2026-01-01', title: 'Tahun Baru Masehi', type: 'holiday' },
  { date: '2026-01-29', title: 'Tahun Baru Imlek 2577', type: 'holiday' },
  { date: '2026-02-17', title: "Isra' Mi'raj Nabi Muhammad SAW", type: 'holiday' },
  { date: '2026-03-20', title: 'Hari Raya Nyepi (Tahun Baru Saka 1948)', type: 'holiday' },
  { date: '2026-03-20', title: 'Hari Suci Nyepi', type: 'holiday' },
  { date: '2026-04-03', title: 'Wafat Isa Al Masih (Jumat Agung)', type: 'holiday' },
  { date: '2026-05-01', title: 'Hari Buruh Internasional', type: 'holiday' },
  { date: '2026-05-14', title: 'Kenaikan Isa Al Masih', type: 'holiday' },
  { date: '2026-05-16', title: 'Hari Raya Waisak 2570', type: 'holiday' },
  { date: '2026-06-01', title: 'Hari Lahir Pancasila', type: 'holiday' },
  { date: '2026-06-17', title: 'Hari Raya Idul Adha 1447 H', type: 'holiday' },
  { date: '2026-07-07', title: 'Tahun Baru Islam 1448 H', type: 'holiday' },
  { date: '2026-08-17', title: 'Hari Kemerdekaan Republik Indonesia', type: 'holiday' },
  { date: '2026-09-15', title: 'Maulid Nabi Muhammad SAW', type: 'holiday' },
  { date: '2026-12-25', title: 'Hari Raya Natal', type: 'holiday' },
  // Cuti Bersama (Contoh, disesuaikan tiap tahun)
  { date: '2026-01-02', title: 'Cuti Bersama Tahun Baru', type: 'cuti' },
  { date: '2026-03-21', title: 'Cuti Bersama Nyepi', type: 'cuti' },
  { date: '2026-12-24', title: 'Cuti Bersama Natal', type: 'cuti' },
  { date: '2026-12-26', title: 'Cuti Bersama Natal', type: 'cuti' },
  { date: '2026-12-31', title: 'Cuti Bersama Tahun Baru', type: 'cuti' },
]

// Hari Libur Nasional Indonesia 2025
const INDONESIAN_HOLIDAYS_2025 = [
  { date: '2025-01-01', title: 'Tahun Baru Masehi', type: 'holiday' },
  { date: '2025-01-27', title: "Isra' Mi'raj Nabi Muhammad SAW", type: 'holiday' },
  { date: '2025-01-29', title: 'Tahun Baru Imlek 2576', type: 'holiday' },
  { date: '2025-03-29', title: 'Hari Raya Nyepi', type: 'holiday' },
  { date: '2025-03-30', title: 'Hari Raya Idul Fitri 1446 H (Hari 1)', type: 'holiday' },
  { date: '2025-03-31', title: 'Hari Raya Idul Fitri 1446 H (Hari 2)', type: 'holiday' },
  { date: '2025-04-18', title: 'Wafat Isa Al Masih', type: 'holiday' },
  { date: '2025-05-01', title: 'Hari Buruh Internasional', type: 'holiday' },
  { date: '2025-05-12', title: 'Hari Raya Waisak 2569', type: 'holiday' },
  { date: '2025-05-29', title: 'Kenaikan Isa Al Masih', type: 'holiday' },
  { date: '2025-06-01', title: 'Hari Lahir Pancasila', type: 'holiday' },
  { date: '2025-06-06', title: 'Hari Raya Idul Adha 1446 H', type: 'holiday' },
  { date: '2025-06-27', title: 'Tahun Baru Islam 1447 H', type: 'holiday' },
  { date: '2025-08-17', title: 'Hari Kemerdekaan RI', type: 'holiday' },
  { date: '2025-09-05', title: 'Maulid Nabi Muhammad SAW', type: 'holiday' },
  { date: '2025-12-25', title: 'Hari Raya Natal', type: 'holiday' },
]

function getHolidaysForYear(year: number) {
  if (year === 2026) return INDONESIAN_HOLIDAYS_2026
  if (year === 2025) return INDONESIAN_HOLIDAYS_2025
  return []
}

export function CalendarClient() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/calendar')
      if (res.ok) {
        const data = await res.json()
        setEvents(data)
      }
    } catch (error) {
      console.error("Failed to fetch events")
    } finally {
      setLoading(false)
    }
  }

  // Get holidays for the current visible year
  const holidays = useMemo(() => {
    const year = currentMonth.getFullYear()
    return getHolidaysForYear(year)
  }, [currentMonth])

  // Combine events + holidays for the selected date
  const selectedDateEvents = useMemo(() => {
    if (!date) return []
    const apiEvents = events.filter(e => isSameDay(parseISO(e.date), date)).map(e => ({ ...e, eventType: 'assignment' }))
    const holidayEvents = holidays.filter(h => isSameDay(parseISO(h.date), date)).map((h, i) => ({ 
      id: `holiday-${i}`, 
      title: h.title, 
      date: h.date, 
      eventType: h.type 
    }))
    return [...holidayEvents, ...apiEvents]
  }, [date, events, holidays])

  // Check if a date has any event/holiday
  const hasEvent = (d: Date) => events.some(e => isSameDay(parseISO(e.date), d))
  const isHoliday = (d: Date) => holidays.some(h => h.type === 'holiday' && isSameDay(parseISO(h.date), d))
  const isCuti = (d: Date) => holidays.some(h => h.type === 'cuti' && isSameDay(parseISO(h.date), d))

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-[#5483B3] font-bold uppercase tracking-wider text-xs mb-2">
          Academic Planner
        </p>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">Kalender Akademik</h1>
        <p className="text-sm font-medium text-[var(--muted-foreground)] mt-2">Pantau jadwal tugas, acara penting, dan hari libur nasional dalam satu lirikan.</p>
      </motion.div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-xs font-medium text-[var(--muted-foreground)]">
          <div className="h-3 w-3 rounded-full border-2 border-[#5483B3]" />
          <span>Tugas / Jadwal</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-[var(--muted-foreground)]">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <span>Hari Libur Nasional</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-[var(--muted-foreground)]">
          <div className="h-3 w-3 rounded-full bg-amber-500" />
          <span>Cuti Bersama</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-sm overflow-hidden h-full">
            <CardContent className="p-6 md:p-10 flex justify-center h-full items-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                className="w-full h-full [&_.rdp-cell]:h-16 md:[&_.rdp-cell]:h-24 [&_.rdp-button]:w-full [&_.rdp-button]:h-full [&_.rdp-button]:rounded-xl [&_.rdp-button:hover]:bg-[#5483B3]/10 [&_.rdp-button[aria-selected='true']]:bg-[#5483B3] [&_.rdp-button[aria-selected='true']]:text-white transition-all [&_.rdp-head_th]:font-bold [&_.rdp-head_th]:text-[#5483B3] [&_.rdp-month]:w-full"
                modifiers={{
                  hasEvent: (d) => hasEvent(d),
                  holiday: (d) => isHoliday(d),
                  cuti: (d) => isCuti(d),
                }}
                modifiersStyles={{
                  hasEvent: { fontWeight: 'bold', border: '2px solid #5483B3' },
                  holiday: { backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#EF4444', fontWeight: '800' },
                  cuti: { backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#F59E0B', fontWeight: '700' },
                }}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-sm h-full flex flex-col">
            <CardHeader className="border-b border-[var(--border)] bg-[var(--muted)]/30 p-6">
              <CardTitle className="text-lg font-extrabold flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-[#5483B3]" />
                Jadwal Tanggal Ini
              </CardTitle>
              <CardDescription className="text-xs font-semibold text-[#5483B3] uppercase tracking-wider mt-1">
                {date ? format(date, 'EEEE, dd MMMM yyyy', { locale: idLocale }) : 'Pilih Tanggal'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-y-auto min-h-[300px]">
              {loading ? (
                 <div className="p-8 text-center text-[var(--muted-foreground)] text-sm">Memuat jadwal...</div>
              ) : selectedDateEvents.length === 0 ? (
                 <div className="p-12 text-center flex flex-col items-center justify-center h-full">
                   <div className="h-16 w-16 bg-[var(--muted)] rounded-full flex items-center justify-center mb-4">
                     <Clock className="h-8 w-8 text-[var(--muted-foreground)] opacity-50" />
                   </div>
                   <p className="text-sm font-bold text-[var(--foreground)] mb-1">Tidak ada jadwal</p>
                   <p className="text-xs font-medium text-[var(--muted-foreground)]">Hari ini bebas dari tenggat waktu tugas maupun acara.</p>
                 </div>
              ) : (
                 <div className="divide-y divide-[var(--border)]">
                   {selectedDateEvents.map(event => {
                     const isHol = event.eventType === 'holiday'
                     const isCut = event.eventType === 'cuti'
                     const isAssignment = event.eventType === 'assignment'
                     
                     return (
                       <div key={event.id} className="p-5 hover:bg-[var(--muted)]/50 transition-colors group">
                         <div className="flex items-start gap-4">
                           <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                             isHol ? 'bg-red-100 dark:bg-red-500/20' : 
                             isCut ? 'bg-amber-100 dark:bg-amber-500/20' : 
                             'bg-blue-100 dark:bg-[#5483B3]/20'
                           }`}>
                             {isHol ? (
                               <Flag className="h-5 w-5 text-red-600 dark:text-red-400" />
                             ) : isCut ? (
                               <PartyPopper className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                             ) : (
                               <AlertCircle className="h-5 w-5 text-[#5483B3]" />
                             )}
                           </div>
                           <div className="flex-1 min-w-0">
                             <p className={`font-bold text-sm leading-tight mb-1 ${
                               isHol ? 'text-red-700 dark:text-red-400' : 
                               isCut ? 'text-amber-700 dark:text-amber-400' : 
                               'text-[var(--foreground)] group-hover:text-[#5483B3] transition-colors'
                             }`}>
                               {event.title}
                             </p>
                             <div className="flex items-center gap-2">
                               {isHol && (
                                 <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400">
                                   Libur Nasional
                                 </span>
                               )}
                               {isCut && (
                                 <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
                                   Cuti Bersama
                                 </span>
                               )}
                               {isAssignment && (
                                 <p className="text-xs font-medium text-[var(--muted-foreground)]">
                                   Tenggat: {format(parseISO(event.date), 'HH:mm')} WIB
                                 </p>
                               )}
                             </div>
                           </div>
                         </div>
                       </div>
                     )
                   })}
                 </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
