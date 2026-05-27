import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { RBAC } from "@/lib/rbac"
import { AdminOverview } from "@/components/dashboard/admin-overview"

export default async function Page() {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }

  const role = (session.user as any)?.role
  // if (!RBAC.canAccessAdminDashboard(role)) {
  //   redirect("/dashboard")
  // }
  if (!RBAC.canAccessAdminDashboard(role)) {
    redirect("/dashboard?reason=unauthorized")
  }

  // Fetch Admin Stats
  const [userCount, studentCount, teacherCount, subjectCount, classCount, recentUsers, roleDistribution] = await Promise.all([
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
    }),
    prisma.user.groupBy({
      by: ['role'],
      _count: { role: true }
    })
  ])

  // Format chart data
  const chartData = roleDistribution.map(item => ({
    name: item.role,
    value: item._count.role,
    fill: item.role === 'STUDENT' ? '#3b82f6' : 
          item.role === 'TEACHER' ? '#10b981' : 
          item.role === 'PARENT' ? '#f59e0b' : 
          item.role === 'COACH' ? '#8b5cf6' : 
          item.role === 'ADMIN' ? '#ef4444' : '#64748b'
  }))

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
      chartData={chartData}
    />
  )
}
