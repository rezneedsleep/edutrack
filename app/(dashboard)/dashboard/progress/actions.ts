'use server'

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createProgressLog(data: {
  subjectId: string; topicId: string; duration: number;
  difficulty: number; notes?: string;
}) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  await prisma.progressLog.create({
    data: {
      userId: session.user.id,
      subjectId: data.subjectId,
      topicId: data.topicId,
      duration: data.duration,
      difficulty: data.difficulty,
      notes: data.notes,
      date: new Date(),
    },
  })

  revalidatePath('/dashboard/progress')
  revalidatePath('/dashboard')
}
