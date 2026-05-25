'use server'

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function submitAssignment(assignmentId: string, content: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  await prisma.assignmentSubmission.create({
    data: {
      assignmentId,
      studentId: session.user.id,
      content,
      submittedAt: new Date(),
    }
  })

  revalidatePath(`/dashboard/assignments/${assignmentId}`)
  revalidatePath('/dashboard/assignments')
  revalidatePath('/dashboard')
}
