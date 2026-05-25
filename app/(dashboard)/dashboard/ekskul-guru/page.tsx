import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { TeacherEkskulClient } from '@/components/dashboard/teacher-ekskul-client'

export const metadata = {
  title: 'Ekskul Saya | Guru EduTrack',
}

export default async function TeacherEkskulPage() {
  const session = await auth()
  
  if (!session || (session.user as any)?.role !== 'TEACHER') {
    redirect('/login')
  }

  const userId = (session.user as any).id

  const extracurriculars = await prisma.extracurricular.findMany({
    where: { coachId: userId },
    include: {
      leader: true,
      members: {
        include: { student: true }
      },
      sessions: {
        include: { attendances: true },
        orderBy: { date: 'desc' }
      }
    }
  })

  return <TeacherEkskulClient initialData={extracurriculars} />
}
