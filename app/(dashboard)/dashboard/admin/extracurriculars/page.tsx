import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { AdminExtracurricularsClient } from '@/components/dashboard/admin-extracurriculars-client'

export const metadata = {
  title: 'Kelola Ekstrakurikuler | Admin EduTrack',
  description: 'Kelola data ekstrakurikuler sekolah',
}

export default async function AdminExtracurricularsPage() {
  const session = await auth()
  
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    redirect('/login')
  }

  const [extracurriculars, teachers, students] = await Promise.all([
    prisma.extracurricular.findMany({
      include: {
        leader: true,
        coach: true,
        members: { include: { student: true } },
        sessions: true
      },
      orderBy: { name: 'asc' }
    }),
    prisma.user.findMany({
      where: { role: { in: ['TEACHER', 'COACH'] }, isActive: true },
      select: { id: true, name: true, email: true, affiliations: true }
    }),
    prisma.user.findMany({
      where: { role: 'STUDENT', isActive: true },
      select: { id: true, name: true, email: true, nis: true, class: { select: { name: true } } }
    })
  ])

  return <AdminExtracurricularsClient 
    initialData={extracurriculars} 
    teachers={teachers} 
    students={students} 
  />
}
