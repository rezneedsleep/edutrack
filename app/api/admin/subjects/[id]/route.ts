import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: subjectId } = await params
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const body = await req.json()
    const { name, description, color, teacherId } = body

    const updatedSubject = await prisma.subject.update({
      where: { id: subjectId },
      data: {
        name,
        description,
        color,
        teacherId: teacherId || null
      },
      include: {
        teacher: { select: { name: true } },
        topics: true
      }
    })

    return NextResponse.json(updatedSubject)
  } catch (error) {
    console.error("[ADMIN_SUBJECT_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: subjectId } = await params
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    await prisma.subject.delete({ where: { id: subjectId } })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[ADMIN_SUBJECT_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
