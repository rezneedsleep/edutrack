'use server'

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function toggleTopicLock(topicId: string, isLocked: boolean) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'TEACHER') throw new Error("Unauthorized")

  await prisma.topic.update({ where: { id: topicId }, data: { isLocked } })
  revalidatePath('/dashboard/materi')
}

export async function addTopic(subjectId: string, name: string, description: string, estimatedHours: number) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'TEACHER') throw new Error("Unauthorized")

  const lastTopic = await prisma.topic.findFirst({ where: { subjectId }, orderBy: { order: 'desc' } })
  await prisma.topic.create({
    data: { name, description, estimatedHours, subjectId, order: (lastTopic?.order ?? 0) + 1 },
  })
  revalidatePath('/dashboard/materi')
}

export async function editTopic(topicId: string, name: string, description: string, estimatedHours: number) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'TEACHER') throw new Error("Unauthorized")

  await prisma.topic.update({ where: { id: topicId }, data: { name, description, estimatedHours } })
  revalidatePath('/dashboard/materi')
}

export async function deleteTopic(topicId: string) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'TEACHER') throw new Error("Unauthorized")

  await prisma.topic.delete({ where: { id: topicId } })
  revalidatePath('/dashboard/materi')
}
