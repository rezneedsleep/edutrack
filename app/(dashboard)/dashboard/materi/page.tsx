import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { TeacherMateriClient } from "@/components/dashboard/teacher-materi-client"

export const dynamic = 'force-dynamic'

export default async function TeacherMateriPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const role = (session.user as any).role
  if (role !== 'TEACHER' && role !== 'ADMIN') redirect("/dashboard")

  const userId = (session.user as any).id
  
  const [subjects, classes, currentUser] = await Promise.all([
    prisma.subject.findMany({
      where: role === 'ADMIN' ? undefined : { teacherId: userId },
      include: { 
        materials: {
          include: {
            class: true,
            teacher: true
          },
          orderBy: { createdAt: 'desc' }
        },
        assignments: {
          include: {
            submissions: true
          }
        },
        userSubjects: {
          include: {
            user: true
          }
        },
        topics: { 
          orderBy: { order: 'asc' } 
        } 
      },
      orderBy: { name: 'asc' }
    }),
    prisma.class.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { canEditMaterials: true }
    })
  ])

  return (
    <TeacherMateriClient 
      subjects={JSON.parse(JSON.stringify(subjects))}
      classes={JSON.parse(JSON.stringify(classes))}
      canEditMaterials={role === 'ADMIN' || !!currentUser?.canEditMaterials}
      role={role}
    />
  )
}
