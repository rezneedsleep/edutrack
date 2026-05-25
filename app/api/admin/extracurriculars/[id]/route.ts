import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const body = await req.json()
    const { name, description, schedule, coachId, leaderId } = body

    const item = await prisma.extracurricular.update({
      where: { id },
      data: {
        name,
        description: description || null,
        schedule: schedule || null,
        coachId: coachId && coachId !== 'none' ? coachId : null,
        leaderId: leaderId && leaderId !== 'none' ? leaderId : null
      },
      include: {
        coach: true,
        leader: true,
        members: true
      }
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error("[EXTRACURRICULAR_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    await prisma.extracurricular.delete({
      where: { id }
    })

    return new NextResponse("Deleted", { status: 200 })
  } catch (error) {
    console.error("[EXTRACURRICULAR_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
