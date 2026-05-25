import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { AssignmentDetailClient } from "../components/client-assignment-detail"
import { notFound } from "next/navigation"


export default async function AssignmentDetailPage({ params }: { params: { id: string } }) {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  const role = session.user.role
  const userId = session.user.id

  if (role !== 'STUDENT') {
    redirect("/dashboard")
  }

  const assignmentRaw = await prisma.assignment.findUnique({
    where: { id: params.id },
    include: {
      subject: true,
      submissions: {
        where: { studentId: userId }
      },
      teacher: {
        select: { name: true, image: true }
      }
    }
  })

  if (!assignmentRaw) {
    notFound()
  }

  const submission = assignmentRaw.submissions[0]
  let status = 'Belum Dikerjakan'
  if (submission) {
    status = 'Sudah Dikumpulkan'
  } else if (new Date(assignmentRaw.deadline) < new Date()) {
    status = 'Terlambat'
  }

  const assignment = {
    id: assignmentRaw.id,
    title: assignmentRaw.title,
    description: assignmentRaw.description,
    deadline: assignmentRaw.deadline,
    subjectName: assignmentRaw.subject.name,
    subjectColor: assignmentRaw.subject.color,
    teacherName: assignmentRaw.teacher.name || 'Guru',
    status: status,
    score: submission?.score || null,
    feedback: submission?.feedback || null,
    submittedContent: submission?.content || null,
    submittedAt: submission?.submittedAt || null,
  }

  return <AssignmentDetailClient assignment={assignment} />
}
