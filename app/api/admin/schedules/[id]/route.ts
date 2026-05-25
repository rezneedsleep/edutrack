import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { id: scheduleId } = await params
    const body = await req.json()
    const { classId, subjectId, teacherId, dayOfWeek, startTime, endTime, room } = body

    if (!classId || !subjectId || !teacherId) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const updatedSchedule = await prisma.classSchedule.update({
      where: { id: scheduleId },
      data: {
        classId,
        subjectId,
        teacherId,
        dayOfWeek: typeof dayOfWeek === 'string' ? parseInt(dayOfWeek) : dayOfWeek,
        startTime,
        endTime,
        room
      },
      include: {
        class: true,
        subject: true,
        teacher: true
      }
    })

    return NextResponse.json(updatedSchedule)
  } catch (error: any) {
    console.error("[ADMIN_SCHEDULE_PATCH]", error)
    return new NextResponse(error.message || "Internal Error", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { id: scheduleId } = await params
    await prisma.classSchedule.delete({ where: { id: scheduleId } })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[ADMIN_SCHEDULE_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
