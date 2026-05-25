import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const role = (session.user as any).role
    const userId = (session.user as any).id

    if (role !== 'ADMIN' && role !== 'TEACHER') {
      return new NextResponse("Forbidden", { status: 403 })
    }

    const assignment = await prisma.assignment.findUnique({ where: { id } })
    if (!assignment) {
      return new NextResponse("Not Found", { status: 404 })
    }

    if (role !== 'ADMIN') {
      // Check ownership
      if (assignment.teacherId !== userId) {
        return new NextResponse("Forbidden", { status: 403 })
      }

      // Check teacher permission
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { canEditAssignments: true }
      })
      if (!user?.canEditAssignments) {
        return new NextResponse("Forbidden - Assignment editing is disabled", { status: 403 })
      }
    }

    const body = await req.json()
    const { title, description, subjectId, classId, deadline, maxScore, status, attachments } = body

    const updated = await prisma.assignment.update({
      where: { id },
      data: {
        title: title || undefined,
        description: description !== undefined ? description : undefined,
        subjectId: subjectId || undefined,
        classId: classId === "all" ? null : (classId !== undefined ? classId : undefined),
        deadline: deadline ? new Date(deadline) : undefined,
        maxScore: maxScore !== undefined ? Number(maxScore) : undefined,
        status: status || undefined,
        attachments: attachments !== undefined ? attachments : undefined
      },
      include: { subject: true, class: true, teacher: true }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("[ASSIGNMENT_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const { id } = await params
    const userId = (session.user as any).id
    const role = (session.user as any).role

    const assignment = await prisma.assignment.findUnique({
      where: { id }
    })

    if (!assignment) {
      return new NextResponse("Not Found", { status: 404 })
    }

    if (role !== 'ADMIN') {
      if (assignment.teacherId !== userId) {
        return new NextResponse("Forbidden", { status: 403 })
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { canEditAssignments: true }
      })
      if (!user?.canEditAssignments) {
        return new NextResponse("Forbidden - Assignment editing is disabled", { status: 403 })
      }
    }

    await prisma.assignment.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Assignment deleted successfully" })
  } catch (error) {
    console.error("[ASSIGNMENT_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
