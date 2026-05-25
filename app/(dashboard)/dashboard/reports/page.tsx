import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ReportsClient } from "@/components/dashboard/reports-client"

export default async function StudentReportsPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const userId = (session.user as any).id
  
  const subjects = await prisma.userSubject.findMany({
    where: { userId },
    include: { subject: true }
  })

  const logs = await prisma.progressLog.findMany({
    where: { userId },
    include: { topic: { include: { subject: true } } }
  })

  return (
    <ReportsClient 
      subjects={subjects}
      logs={logs}
    />
  )
}
