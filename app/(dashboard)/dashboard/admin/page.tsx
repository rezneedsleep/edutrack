import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { AdminOverview } from "@/components/dashboard/admin-overview"

export default async function Page() {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }

  const role = (session.user as any)?.role
  if (role !== 'ADMIN') {
    redirect("/dashboard")
  }

  // Fetch Admin Stats
  const [userCount, studentCount, teacherCount, subjectCount, classCount, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.user.count({ where: { role: 'TEACHER' } }),
    prisma.subject.count(),
    prisma.class.count(),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    })
  ])

  return (
    <AdminOverview 
      stats={{
        userCount,
        studentCount,
        teacherCount,
        subjectCount,
        classCount
      }}
      recentUsers={recentUsers}
    />
  )
}
