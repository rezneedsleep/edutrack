'use server'

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function markNotificationAsRead(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  await prisma.notification.update({
    where: { id, userId: session.user.id },
    data: { isRead: true }
  })
  revalidatePath('/dashboard/notifications')
}

export async function markAllNotificationsAsRead() {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  await prisma.notification.updateMany({
    where: { userId: session.user.id, isRead: false },
    data: { isRead: true }
  })
  revalidatePath('/dashboard/notifications')
}
