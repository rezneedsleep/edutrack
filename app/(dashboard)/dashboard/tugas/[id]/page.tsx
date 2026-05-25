import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { TugasDetailClient } from "./components/client-tugas-detail"
import { notFound } from "next/navigation"

export default async function TugasDetailPage({ params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'TEACHER') redirect("/dashboard")
  const userId = session.user.id

  const a = await prisma.assignment.findUnique({
    where: { id: params.id, teacherId: userId },
    include: {
      subject: true,
      submissions: {
        include: {
          student: { select: { name: true, email: true, image: true } }
        },
        orderBy: { submittedAt: 'asc' }
      }
    }
  })
  if (!a) notFound()

  const assignment = {
    id: a.id, title: a.title, description: a.description,
    deadline: a.deadline, subjectName: a.subject.name, subjectColor: a.subject.color,
    status: a.status, maxScore: a.maxScore,
    submissions: a.submissions.map(s => ({
      id: s.id, studentId: s.studentId,
      studentName: s.student.name, studentEmail: s.student.email,
      content: s.content, submittedAt: s.submittedAt,
      score: s.score, feedback: s.feedback ?? '',
    })),
  }

  return <TugasDetailClient assignment={assignment} />
}
