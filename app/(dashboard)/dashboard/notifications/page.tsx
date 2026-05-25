import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { NotificationsClient } from "@/components/dashboard/notifications-client"

export default async function StudentNotificationsPage() {  
  const session = await auth()
  if (!session) redirect("/login")

  const userId = (session.user as any).id
  
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50
  })

  return (
    <NotificationsClient 
      notifications={notifications}
    />
  )
}
