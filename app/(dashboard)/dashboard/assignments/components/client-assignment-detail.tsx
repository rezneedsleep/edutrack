'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { BookOpen, Clock, ArrowLeft, CheckCircle2, UserCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { submitAssignment } from '../actions' // We will create this Server Action

export function AssignmentDetailClient({ assignment }: { assignment: any }) {
  const router = useRouter()
  const [content, setContent] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)

  const isLate = assignment.status === 'Terlambat'
  const isDone = assignment.status === 'Sudah Dikumpulkan' || isSuccess

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)
    try {
      await submitAssignment(assignment.id, content)
      setIsSuccess(true)
      router.refresh()
    } catch (error) {
      console.error('Failed to submit assignment', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>
        
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Badge 
            variant="secondary"
            style={{ backgroundColor: `${assignment.subjectColor}15`, color: assignment.subjectColor }}
          >
            {assignment.subjectName}
          </Badge>
          {isDone ? (
            <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
              Sudah Dikumpulkan ✓
            </Badge>
          ) : isLate ? (
            <Badge variant="destructive">Terlambat</Badge>
          ) : (
            <Badge variant="secondary" className="bg-warning/10 text-warning">
              Belum Dikerjakan
            </Badge>
          )}
        </div>

        <h1 className="text-heading-1 text-foreground mb-4">{assignment.title}</h1>
        
        <div className="flex flex-wrap gap-6 text-body-sm text-muted-foreground border-b border-border pb-6">
          <div className="flex items-center gap-2">
            <UserCircle2 className="w-4 h-4" />
            <span>Guru: {assignment.teacherName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Tenggat: {format(new Date(assignment.deadline), 'EEEE, dd MMM yyyy, HH:mm', { locale: localeId })}</span>
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        <motion.div 
          className="md:col-span-2 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-heading-3 text-foreground mb-4">Deskripsi Tugas</h2>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap">{assignment.description}</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-heading-3 text-foreground mb-4">Pengumpulan Jawaban</h2>
            {isDone ? (
              <div className="space-y-4">
                <div className="bg-success/10 border border-success/20 rounded-xl p-4 flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                  <div>
                    <p className="text-body-sm font-medium text-success">Berhasil dikumpulkan</p>
                    <p className="text-caption text-success/80">
                      Pada {format(new Date(assignment.submittedAt || new Date()), 'dd MMM yyyy, HH:mm', { locale: localeId })}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-caption font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Jawaban Kamu</h3>
                  <div className="bg-secondary/50 rounded-xl p-4 text-body-sm whitespace-pre-wrap">
                    {assignment.submittedContent || content}
                  </div>
                </div>

                {assignment.score !== null && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <h3 className="text-heading-3 text-foreground mb-4">Penilaian Guru</h3>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-5xl font-mono text-primary font-bold">{assignment.score}</div>
                        <div className="text-caption text-muted-foreground mt-1">/ 100</div>
                      </div>
                      <div className="flex-1 bg-secondary rounded-xl p-4 text-body-sm">
                        <span className="font-medium text-foreground block mb-1">Feedback:</span>
                        {assignment.feedback || "Tidak ada feedback."}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea 
                  placeholder="Ketik jawabanmu di sini atau lampirkan deskripsi file yang dikirimkan..." 
                  className="min-h-[200px] resize-y rounded-xl p-4 text-body"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={isSubmitting}
                />
                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting || !content.trim()} className="rounded-xl px-8">
                    {isSubmitting ? 'Mengirim...' : 'Kumpulkan Tugas'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </motion.div>

        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {/* Side Info */}
          <div className="bg-secondary/30 rounded-2xl p-6 border border-border">
            <h3 className="text-heading-3 text-foreground mb-4">Status Progress</h3>
            <div className="space-y-4">
              <div>
                <p className="text-caption text-muted-foreground mb-1">Status</p>
                <p className="text-body-sm font-medium text-foreground">{status}</p>
              </div>
              <div>
                <p className="text-caption text-muted-foreground mb-1">Nilai</p>
                <p className="text-body-sm font-medium text-foreground">
                  {assignment.score !== null ? `${assignment.score} / 100` : 'Belum dinilai'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
