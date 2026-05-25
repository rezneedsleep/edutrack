import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { AdminReportsClient } from "@/components/dashboard/admin-reports-client"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Laporan Akademik',
  description: 'Statistik dan ringkasan kemajuan belajar siswa EduTrack.',
}

export default async function AdminReportsPage() {
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') redirect("/dashboard")

  const [
    userCount,
    studentCount,
    teacherCount,
    classCount,
    subjectCount,
    assignmentCount,
    submissionCount
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.user.count({ where: { role: 'TEACHER' } }),
    prisma.class.count(),
    prisma.subject.count(),
    prisma.assignment.count(),
    prisma.assignmentSubmission.count()
  ])

  const stats = {
    userCount,
    studentCount,
    teacherCount,
    classCount,
    subjectCount,
    assignmentCount,
    submissionCount
  }

  return <AdminReportsClient stats={stats} />
}
