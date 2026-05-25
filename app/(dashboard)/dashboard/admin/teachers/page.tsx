import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { AdminUsersClient } from "@/components/dashboard/admin-users-client"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kelola Guru | EduTrack',
  description: 'Manajemen basis data guru: NIP, mata pelajaran, dan informasi profil.',
}

export const dynamic = 'force-dynamic'

export default async function AdminTeachersPage() {
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') redirect("/dashboard")

  const [users, subjects] = await Promise.all([
    prisma.user.findMany({
      where: { role: 'TEACHER' },
      include: { teacherSubjects: true },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.subject.findMany({
      select: {
         id: true,
         name: true
      },
      orderBy: { name: 'asc' }
    })
  ])
  
  return (
    <AdminUsersClient 
      initialUsers={JSON.parse(JSON.stringify(users))}
      subjects={JSON.parse(JSON.stringify(subjects))}
      fixedRole="TEACHER"
      title="Kelola Guru."
    />
  )
}
