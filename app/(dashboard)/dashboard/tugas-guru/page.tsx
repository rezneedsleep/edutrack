import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { TeacherTugasClient } from "@/components/dashboard/teacher-tugas-client"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function TeacherTugasPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const role = (session.user as any).role
  if (role !== 'TEACHER' && role !== 'ADMIN') redirect("/dashboard")

  const userId = (session.user as any).id
  
  const subjects = await prisma.subject.findMany({
    where: { teacherId: userId },
    include: { topics: true }
  })

  const classes = await prisma.class.findMany()

  const assignments = await prisma.assignment.findMany({
    where: { teacherId: userId },
    include: { 
      subject: true, 
      class: true,
      submissions: {
        include: { student: true }
      },
      comments: {
        include: { author: true },
        orderBy: { createdAt: 'asc' }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <TeacherTugasClient 
      assignments={assignments}
      subjects={subjects}
      classes={classes}
    />
  )
}
