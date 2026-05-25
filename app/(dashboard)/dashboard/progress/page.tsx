import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ProgressClient } from "@/components/dashboard/progress-client"

export default async function StudentProgressPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const userId = (session.user as any).id
  
  const subjects = await prisma.userSubject.findMany({
    where: { userId },
    include: { subject: { include: { topics: true } } }
  })

  const logs = await prisma.progressLog.findMany({
    where: { userId },
    orderBy: { loggedAt: 'desc' },
    include: { topic: { include: { subject: true } } }
  })

  return (
    <ProgressClient 
      subjects={subjects}
      logs={logs}
    />
  )
}
