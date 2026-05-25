'use server'

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function sendNotification(studentId: string, message: string) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'TEACHER') throw new Error("Unauthorized")

  await prisma.notification.create({
    data: {
      userId: studentId,
      type: 'ALERT',
      title: 'Pesan dari Guru',
      message,
    }
  })

  revalidatePath('/dashboard')
  return { success: true }
}
