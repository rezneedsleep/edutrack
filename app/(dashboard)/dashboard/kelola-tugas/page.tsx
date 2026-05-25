import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { KelolaTugasClient } from "@/components/dashboard/kelola-tugas-client"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kelola Tugas',
  description: 'Manajemen tugas pembelajaran untuk Guru dan Admin EduTrack.',
}

export const dynamic = 'force-dynamic'

export default async function KelolaTugasPage() {
  const session = await auth()
  if (!session || ((session.user as any).role !== 'ADMIN' && (session.user as any).role !== 'TEACHER')) {
    redirect("/dashboard")
  }

  const role = (session.user as any).role
  const userId = (session.user as any).id

  const [assignments, subjects, classes, teachers, currentUser] = await Promise.all([
    role === 'ADMIN'
      ? prisma.assignment.findMany({
          include: { subject: true, class: true, teacher: true },
          orderBy: { createdAt: 'desc' }
        })
      : prisma.assignment.findMany({
          where: { teacherId: userId },
          include: { subject: true, class: true, teacher: true },
          orderBy: { createdAt: 'desc' }
        }),
    prisma.subject.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    }),
    prisma.class.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    }),
    role === 'ADMIN'
      ? prisma.user.findMany({
          where: { role: 'TEACHER' },
          select: { id: true, name: true, email: true, image: true, canEditAssignments: true },
          orderBy: { name: 'asc' }
        })
      : [],
    prisma.user.findUnique({
      where: { id: userId },
      select: { canEditAssignments: true }
    })
  ])

  return (
    <KelolaTugasClient
      initialAssignments={JSON.parse(JSON.stringify(assignments))}
      subjects={JSON.parse(JSON.stringify(subjects))}
      classes={JSON.parse(JSON.stringify(classes))}
      teachers={JSON.parse(JSON.stringify(teachers))}
      canEditAssignments={role === 'ADMIN' || !!currentUser?.canEditAssignments}
      role={role}
    />
  )
}
