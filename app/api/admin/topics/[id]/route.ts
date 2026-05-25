import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: topicId } = await params
  const session = await auth()
  if (!session) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const body = await req.json()
    const { name, description, estimatedHours, materials, isLocked } = body

    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      include: { subject: true }
    })

    if (!topic) return new NextResponse("Not Found", { status: 404 })

    // Permission check: Admin or the teacher who owns the subject
    const isTeacherOwner = (session.user as any).role === 'TEACHER' && topic.subject.teacherId === (session.user as any).id
    const isAdmin = (session.user as any).role === 'ADMIN'

    if (!isAdmin && !isTeacherOwner) {
      return new NextResponse("Forbidden", { status: 403 })
    }

    const updatedTopic = await prisma.topic.update({
      where: { id: topicId },
      data: {
        name: name !== undefined ? name : undefined,
        description: description !== undefined ? description : undefined,
        estimatedHours: estimatedHours !== undefined ? Number(estimatedHours) : undefined,
        materials: materials !== undefined ? materials : undefined,
        isLocked: isLocked !== undefined ? isLocked : undefined,
      }
    })

    return NextResponse.json(updatedTopic)
  } catch (error) {
    console.error("[ADMIN_TOPICS_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: topicId } = await params
  const session = await auth()
  if (!session) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      include: { subject: true }
    })

    if (!topic) return new NextResponse("Not Found", { status: 404 })

    // Permission check
    const isTeacherOwner = (session.user as any).role === 'TEACHER' && topic.subject.teacherId === (session.user as any).id
    const isAdmin = (session.user as any).role === 'ADMIN'

    if (!isAdmin && !isTeacherOwner) {
      return new NextResponse("Forbidden", { status: 403 })
    }

    await prisma.topic.delete({
      where: { id: topicId }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[ADMIN_TOPICS_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
