import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { AdminUsersClient } from "@/components/dashboard/admin-users-client"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kelola Pengguna',
  description: 'Manajemen basis data pengguna EduTrack: Siswa, Guru, dan Administrator.',
}

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') redirect("/dashboard")

  const [users, classes, subjects] = await Promise.all([
    prisma.user.findMany({
      include: { class: true, teacherSubjects: true },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.class.findMany(),
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
      classes={JSON.parse(JSON.stringify(classes))}
      subjects={JSON.parse(JSON.stringify(subjects))}
    />
  )
}
