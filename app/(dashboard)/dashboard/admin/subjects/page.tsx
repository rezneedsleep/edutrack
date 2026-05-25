import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { AdminSubjectsClient } from "@/components/dashboard/admin-subjects-client"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kelola Mapel',
  description: 'Manajemen kurikulum dan mata pelajaran EduTrack.',
}

export default async function AdminSubjectsPage() {
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') redirect("/dashboard")

  const [subjects, teachers, classes] = await Promise.all([
    prisma.subject.findMany({
      include: {
        teacher: true,
        topics: true,
        materials: {
          include: {
            class: true,
            teacher: true
          },
          orderBy: { createdAt: 'desc' }
        },
        schedules: {
          include: {
            teacher: true
          }
        }
      },
      orderBy: { name: 'asc' }
    }),
    prisma.user.findMany({
      where: { role: 'TEACHER' },
      select: { id: true, name: true }
    }),
    prisma.class.findMany({
      orderBy: { name: 'asc' }
    })
  ])

  return (
    <AdminSubjectsClient 
      initialSubjects={JSON.parse(JSON.stringify(subjects))}
      teachers={teachers}
      classes={JSON.parse(JSON.stringify(classes))}
    />
  )
}
