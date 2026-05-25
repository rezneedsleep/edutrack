'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { ArrowLeft, X, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { gradeSubmission } from '../actions'

export function TugasDetailClient({ assignment }: { assignment: any }) {
  const router = useRouter()
  const [selectedSub, setSelectedSub] = React.useState<any | null>(null)
  const [score, setScore] = React.useState('')
  const [feedback, setFeedback] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const openGrade = (sub: any) => {
    setSelectedSub(sub)
    setScore(sub.score !== null ? String(sub.score) : '')
    setFeedback(sub.feedback ?? '')
  }

  const handleGrade = async (e: React.FormEvent) => {
    e.preventDefault()
    const numScore = parseInt(score)
    if (isNaN(numScore) || numScore < 0 || numScore > assignment.maxScore) {
      alert(`Nilai harus antara 0 – ${assignment.maxScore}`)
      return
    }
    setIsSubmitting(true)
    try {
      await gradeSubmission(selectedSub.id, numScore, feedback)
      setSelectedSub(null)
      router.refresh()
    } finally { setIsSubmitting(false) }
  }

  const gradedCount = assignment.submissions.filter((s: any) => s.score !== null).length
  const pct = assignment.submissions.length > 0 ? Math.round((gradedCount / assignment.submissions.length) * 100) : 0

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />Kembali
        </Button>
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <Badge variant="secondary" style={{ backgroundColor: `${assignment.subjectColor}15`, color: assignment.subjectColor }}>
            {assignment.subjectName}
          </Badge>
          <Badge variant={assignment.status === 'PUBLISHED' ? 'default' : 'secondary'}>
            {assignment.status === 'PUBLISHED' ? 'Aktif' : assignment.status}
          </Badge>
        </div>
        <h1 className="text-heading-1 text-foreground">{assignment.title}</h1>
        <p className="text-body text-muted-foreground mt-2 whitespace-pre-wrap max-w-2xl">{assignment.description}</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Pengumpulan', value: `${assignment.submissions.length}` },
          { label: 'Sudah Dinilai', value: `${gradedCount}` },
          { label: 'Tenggat', value: format(new Date(assignment.deadline), 'dd MMM yy', { locale: localeId }) },
        ].map(s => (
          <div key={s.label} className="rounded-2xl bg-card border border-border p-4 text-center">
            <p className="text-heading-2 font-mono text-foreground">{s.value}</p>
            <p className="text-caption text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="rounded-2xl bg-card border border-border p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-body-sm font-medium text-foreground">Progress Penilaian</p>
          <span className="text-caption font-mono text-foreground">{gradedCount}/{assignment.submissions.length}</span>
        </div>
        <Progress value={pct} className="h-2" />
      </div>

      {/* Submissions Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-3xl bg-card border border-border overflow-hidden"
      >
        <div className="p-6 border-b border-border">
          <h3 className="text-heading-3 text-foreground">Semua Pengumpulan</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                {['Siswa', 'Waktu Kumpul', 'Cuplikan Jawaban', 'Status', 'Nilai', 'Aksi'].map(h => (
                  <th key={h} className="text-left py-3 px-5 text-caption font-semibold text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assignment.submissions.map((sub: any) => (
                <tr key={sub.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-caption font-semibold">
                          {sub.studentName?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-body-sm font-medium text-foreground">{sub.studentName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-5 text-caption text-muted-foreground whitespace-nowrap">
                    {format(new Date(sub.submittedAt), 'dd MMM HH:mm')}
                  </td>
                  <td className="py-3 px-5 max-w-[200px]">
                    <p className="text-caption text-muted-foreground truncate">{sub.content}</p>
                  </td>
                  <td className="py-3 px-5">
                    {sub.score !== null ? (
                      <Badge variant="secondary" className="bg-success/10 text-success text-[11px]">
                        <CheckCircle2 className="w-3 h-3 mr-1" />Dinilai
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-warning/10 text-warning text-[11px]">Menunggu</Badge>
                    )}
                  </td>
                  <td className="py-3 px-5">
                    <span className={cn('text-body-sm font-mono font-bold', sub.score !== null ? 'text-success' : 'text-muted-foreground')}>
                      {sub.score !== null ? `${sub.score}` : '—'}
                    </span>
                    {sub.score !== null && <span className="text-caption text-muted-foreground">/{assignment.maxScore}</span>}
                  </td>
                  <td className="py-3 px-5">
                    <Button size="sm" variant={sub.score !== null ? 'outline' : 'default'} className="rounded-lg" onClick={() => openGrade(sub)}>
                      {sub.score !== null ? 'Edit Nilai' : 'Beri Nilai'}
                    </Button>
                  </td>
                </tr>
              ))}
              {assignment.submissions.length === 0 && (
                <tr><td colSpan={6} className="py-10 text-center text-muted-foreground">Belum ada siswa yang mengumpulkan.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Grading Modal */}
      <AnimatePresence>
        {selectedSub && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => !isSubmitting && setSelectedSub(null)}
            />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl bg-card border border-border rounded-3xl shadow-xl flex flex-col overflow-hidden max-h-[90vh]"
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-heading-3 text-foreground">Penilaian Tugas</h3>
                  <p className="text-caption text-muted-foreground mt-0.5">Siswa: {selectedSub.studentName}</p>
                </div>
                <button onClick={() => setSelectedSub(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-5">
                <div>
                  <p className="text-caption font-semibold text-muted-foreground uppercase tracking-wider mb-2">Jawaban Siswa</p>
                  <div className="bg-secondary/50 rounded-xl p-4 text-body-sm whitespace-pre-wrap max-h-[200px] overflow-y-auto">
                    {selectedSub.content}
                  </div>
                </div>
                <form id="grade-form" onSubmit={handleGrade} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="score">Nilai (0–{assignment.maxScore})</Label>
                    <Input id="score" type="number" min="0" max={assignment.maxScore} required value={score}
                      onChange={e => setScore(e.target.value)} className="w-36 rounded-xl text-lg font-mono" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="feedback">Feedback (Opsional)</Label>
                    <Textarea id="feedback" placeholder="Berikan masukan untuk siswa..." value={feedback}
                      onChange={e => setFeedback(e.target.value)} className="rounded-xl min-h-[90px]" />
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-border flex justify-end gap-3">
                <Button type="button" variant="ghost" className="rounded-xl" onClick={() => setSelectedSub(null)} disabled={isSubmitting}>Batal</Button>
                <Button type="submit" form="grade-form" className="rounded-xl" disabled={isSubmitting}>
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Nilai'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
