import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { AdminExtracurricularDetailClient } from '@/components/dashboard/admin-extracurricular-detail-client'

export const metadata = {
  title: 'Detail Ekstrakurikuler | Admin EduTrack',
}

export default async function ExtracurricularDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    redirect('/login')
  }

  const extracurricular = await prisma.extracurricular.findUnique({
    where: { id },
    include: {
      leader: true,
      coach: true,
      members: {
        include: { student: true }
      },
      sessions: {
        include: { attendances: true },
        orderBy: { date: 'desc' }
      }
    }
  })

  if (!extracurricular) redirect('/dashboard/admin/extracurriculars')

  const unassignedStudents = await prisma.user.findMany({
    where: {
      role: 'STUDENT',
      isActive: true,
      ekskulMembers: { none: { extracurricularId: id } }
    },
    select: { id: true, name: true, nis: true, email: true }
  })

  return <AdminExtracurricularDetailClient 
    initialData={extracurricular} 
    unassignedStudents={unassignedStudents} 
  />
}
