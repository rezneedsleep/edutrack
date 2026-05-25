'use server'

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function gradeSubmission(submissionId: string, score: number, feedback: string) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'TEACHER') throw new Error("Unauthorized")

  const sub = await prisma.assignmentSubmission.findUnique({
    where: { id: submissionId },
    include: { assignment: true }
  })
  if (!sub || sub.assignment.teacherId !== session.user.id) throw new Error("Unauthorized")

  await prisma.assignmentSubmission.update({
    where: { id: submissionId },
    data: { score, feedback, gradedAt: new Date() }
  })

  // Notify student
  await prisma.notification.create({
    data: {
      userId: sub.studentId,
      type: 'ASSIGNMENT_GRADED',
      title: 'Tugas Kamu Sudah Dinilai',
      message: `Tugasmu "${sub.assignment.title}" telah dinilai. Nilai: ${score}/${sub.assignment.maxScore}.`,
    }
  })

  revalidatePath(`/dashboard/tugas/${sub.assignmentId}`)
}
