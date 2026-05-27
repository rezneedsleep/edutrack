'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Clock, Calendar, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function StudentExamsClient() {
  const [exams, setExams] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchExams()
  }, [])

  const fetchExams = async () => {
    try {
      const res = await fetch('/api/student/exams')
      if (res.ok) {
        const data = await res.json()
        setExams(data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Ujian Tersedia</h1>
        <p className="text-sm text-[var(--muted-foreground)]">Daftar ujian yang harus Anda kerjakan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <p className="text-sm text-[var(--muted-foreground)]">Memuat ujian...</p>
        ) : exams.length > 0 ? (
          exams.map((exam: any) => {
            const now = new Date()
            const start = new Date(exam.startTime)
            const end = new Date(exam.endTime)
            const isOngoing = now >= start && now <= end
            const isPast = now > end
            const attempt = exam.attempts?.[0]
            
            return (
              <Card key={exam.id} className="bg-[var(--card)] border-[var(--border)] rounded-2xl hover:shadow-md transition-all relative overflow-hidden">
                {attempt?.status === 'COMPLETED' && (
                  <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10 flex items-center">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> SELESAI
                  </div>
                )}
                
                <CardContent className="p-5 pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-[#5483B3]/10 rounded-lg">
                      <BookOpen className="h-5 w-5 text-[#5483B3]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[var(--foreground)] text-sm">{exam.title}</h3>
                      <p className="text-xs text-[var(--muted-foreground)]">{exam.subject?.name}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4 bg-[var(--muted)]/50 p-3 rounded-xl border border-[var(--border)]">
                    <div className="flex items-center text-xs text-[var(--foreground)]">
                      <Calendar className="h-3.5 w-3.5 mr-2 text-[#5483B3]" />
                      {start.toLocaleDateString('id-ID')} ({start.toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})} - {end.toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})})
                    </div>
                    <div className="flex items-center text-xs text-[var(--foreground)]">
                      <Clock className="h-3.5 w-3.5 mr-2 text-[#5483B3]" />
                      {exam.durationMin} Menit
                    </div>
                  </div>

                  {attempt?.status === 'COMPLETED' ? (
                    <div className="text-center pt-2">
                      <p className="text-xs text-[var(--muted-foreground)]">Nilai Anda</p>
                      <p className="text-2xl font-black text-[#5483B3]">{attempt.score}</p>
                    </div>
                  ) : (
                    <Button 
                      className="w-full bg-[#5483B3] hover:bg-[#3b6086] text-white rounded-xl"
                      disabled={!isOngoing || attempt?.status === 'COMPLETED'}
                      onClick={() => router.push(`/dashboard/student/exams/${exam.id}`)}
                    >
                      {isOngoing ? 'Mulai Kerjakan' : isPast ? 'Waktu Habis' : 'Belum Dimulai'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })
        ) : (
          <p className="text-sm text-[var(--muted-foreground)]">Belum ada ujian untuk Anda.</p>
        )}
      </div>
    </div>
  )
}
