import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { SubjectsClient } from "@/components/dashboard/subjects-client"

export default async function StudentSubjectsPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const userId = (session.user as any).id
  const classId = (session.user as any).classId
  
  const subjects = await prisma.userSubject.findMany({
    where: { userId },
    include: { 
      subject: { 
        include: { 
          teacher: true,
          assignments: {
            where: { status: 'PUBLISHED' },
            include: {
              submissions: {
                where: { studentId: userId }
              }
            }
          },
          topics: {
            include: {
              logs: {
                where: { userId }
              }
            }
          } 
        } 
      } 
    }
  })

  const classmates = classId ? await prisma.user.findMany({
    where: { classId, role: 'STUDENT' },
    select: { id: true, name: true, image: true }
  }) : []

  return (
    <SubjectsClient 
      subjects={subjects}
      classmates={classmates}
    />
  )
}
