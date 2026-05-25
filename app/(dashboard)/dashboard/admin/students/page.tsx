import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { AdminUsersClient } from "@/components/dashboard/admin-users-client"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kelola Siswa | EduTrack',
  description: 'Manajemen basis data siswa: NIS, kelas, dan informasi profil.',
}

export const dynamic = 'force-dynamic'

export default async function AdminStudentsPage() {
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') redirect("/dashboard")

  const [users, classes] = await Promise.all([
    prisma.user.findMany({
      where: { role: 'STUDENT' },
      include: { class: true },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.class.findMany({
      orderBy: { name: 'asc' }
    })
  ])
  
  return (
    <AdminUsersClient 
      initialUsers={JSON.parse(JSON.stringify(users))}
      classes={JSON.parse(JSON.stringify(classes))}
      fixedRole="STUDENT"
      title="Kelola Siswa."
    />
  )
}
