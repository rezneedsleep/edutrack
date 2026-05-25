import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { AdminSchedulesClient } from "@/components/dashboard/admin-schedules-client"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kelola Jadwal',
  description: 'Pengaturan jadwal mata pelajaran dan jam belajar.',
}

export default async function AdminSchedulesPage() {
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') redirect("/dashboard")

  const [schedules, classes, subjects, teachers] = await Promise.all([
    prisma.classSchedule.findMany({
      include: {
        class: true,
        subject: true,
        teacher: true,
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' }
      ]
    }),
    prisma.class.findMany({ orderBy: { name: 'asc' } }),
    prisma.subject.findMany({ orderBy: { name: 'asc' } }),
    prisma.user.findMany({
      where: { role: 'TEACHER' },
      include: {
        teacherSubjects: true
      },
      orderBy: { name: 'asc' }
    })
  ])

  return (
    <AdminSchedulesClient 
      initialSchedules={schedules}
      classes={classes}
      subjects={subjects}
      teachers={teachers}
    />
  )
}
