// Forced reload to trigger recompilation
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { KelolaMateriClient } from "@/components/dashboard/kelola-materi-client"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kelola Materi',
  description: 'Manajemen materi pembelajaran untuk Guru dan Admin EduTrack.',
}

export const dynamic = 'force-dynamic'

export default async function KelolaMateriPage() {
  const session = await auth()
  if (!session || ((session.user as any).role !== 'ADMIN' && (session.user as any).role !== 'TEACHER')) {
    redirect("/dashboard")
  }

  const role = (session.user as any).role
  const userId = (session.user as any).id

  const [materials, subjects, classes, teachers, currentUser] = await Promise.all([
    role === 'ADMIN'
      ? prisma.material.findMany({
          include: { subject: true, class: true, teacher: true },
          orderBy: { createdAt: 'desc' }
        })
      : prisma.material.findMany({
          where: { teacherId: userId },
          include: { subject: true, class: true, teacher: true },
          orderBy: { createdAt: 'desc' }
        }),
    prisma.subject.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    }),
    prisma.class.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    }),
    role === 'ADMIN'
      ? prisma.user.findMany({
          where: { role: 'TEACHER' },
          select: { id: true, name: true, email: true, image: true, canEditMaterials: true },
          orderBy: { name: 'asc' }
        })
      : [],
    prisma.user.findUnique({
      where: { id: userId },
      select: { canEditMaterials: true }
    })
  ])

  return (
    <KelolaMateriClient
      initialMaterials={JSON.parse(JSON.stringify(materials))}
      subjects={JSON.parse(JSON.stringify(subjects))}
      classes={JSON.parse(JSON.stringify(classes))}
      teachers={JSON.parse(JSON.stringify(teachers))}
      canEditMaterials={role === 'ADMIN' || !!currentUser?.canEditMaterials}
      role={role}
    />
  )
}
