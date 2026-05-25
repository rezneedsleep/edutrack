import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { TeacherTugasClient } from "@/components/dashboard/teacher-tugas-client"

export default async function TeacherTugasPage() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'TEACHER') {
    redirect('/dashboard')
  }

  const userId = (session.user as any).id
  const assignments = await prisma.assignment.findMany({
    where: { teacherId: userId },
    include: { 
      subject: true,
      class: true,
      submissions: { 
        include: { 
          student: true,
          comments: { include: { author: true } }
        } 
      },
      comments: { include: { author: true } }
    },
    orderBy: { createdAt: 'desc' }
  })

  const mySubjects = await prisma.subject.findMany({
    where: { teacherId: userId },
    include: { topics: true }
  })

  const classes = await prisma.class.findMany()

  return (
    <TeacherTugasClient 
      assignments={assignments} 
      subjects={mySubjects} 
      classes={classes} 
    />
  )
}
