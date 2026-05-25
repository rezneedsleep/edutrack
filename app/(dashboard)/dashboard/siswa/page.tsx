import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { SiswaClient } from './components/client-siswa'

export default async function TeacherSiswaPage() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'TEACHER') {
    redirect('/dashboard')
  }

  const userId = (session.user as any).id
  
  const students = await prisma.user.findMany({
    where: { 
      role: 'STUDENT',
      userSubjects: { 
        some: { 
          subject: { teacherId: userId } 
        } 
      }
    },
    include: { 
      class: true,
      userSubjects: {
        where: { subject: { teacherId: userId } },
        include: { subject: { include: { topics: true } } }
      },
      progressLogs: {
        where: { topic: { subject: { teacherId: userId } } },
        include: { topic: true }
      },
      studentSubmissions: {
        where: { assignment: { teacherId: userId } }
      }
    }
  })

  const classes = await prisma.class.findMany({
    where: { students: { some: { userSubjects: { some: { subject: { teacherId: userId } } } } } }
  })

  return <SiswaClient initialStudents={students} classes={classes} />
}
