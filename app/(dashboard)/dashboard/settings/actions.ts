'use server'

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"

export async function updateProfile(data: { name: string; email: string; school: string; classRoom?: string; avatar?: string }) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  let classId = undefined
  if (data.classRoom) {
    let targetClass = await prisma.class.findFirst({
      where: { 
        name: { equals: data.classRoom, mode: 'insensitive' },
        school: data.school
      }
    })

    if (!targetClass) {
      targetClass = await prisma.class.create({
        data: {
          name: data.classRoom,
          school: data.school,
          gradeYear: 10
        }
      })
    }
    classId = targetClass.id
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: data.name,
      email: data.email,
      school: data.school,
      classId: classId,
      avatar: data.avatar,
    }
  })

  revalidatePath('/dashboard/settings')
  revalidatePath('/dashboard')
}

export async function updatePassword(currentPassword: string, newPassword: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user || !user.password) throw new Error("User not found or no password set")

  const isValid = await bcrypt.compare(currentPassword, user.password)
  if (!isValid) throw new Error("Password saat ini salah")

  const hashedPassword = await bcrypt.hash(newPassword, 10)
  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashedPassword }
  })
}
