import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { AdminClassesClient } from "@/components/dashboard/admin-classes-client"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kelola Kelas',
  description: 'Manajemen data kelas dan rombongan belajar.',
}

export default async function AdminClassesPage() {
  const session = await auth()
  if (!session) redirect("/login")
  
  const role = (session.user as any).role
  if (role !== 'ADMIN' && role !== 'TEACHER') redirect("/dashboard")

  const userId = (session.user as any).id

  const [classes, subjects, unassignedStudents] = await Promise.all([
    prisma.class.findMany({
      include: {
        students: true,
        schedules: true,
      },
      orderBy: { name: 'asc' }
    }),
    prisma.subject.findMany({
      where: role === 'TEACHER' ? { teacherId: userId } : {}
    }),
    prisma.user.findMany({
      where: { role: 'STUDENT', classId: null },
      orderBy: { name: 'asc' }
    })
  ])

  return (
    <AdminClassesClient 
      initialClasses={classes}
      role={role}
      subjects={subjects}
      unassignedStudents={unassignedStudents}
    />
  )
}
