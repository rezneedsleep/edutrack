import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const body = await req.json()
    const { classId, subjectId, teacherId, dayOfWeek, startTime, endTime, room } = body

    const newSchedule = await prisma.classSchedule.create({
      data: {
        classId,
        subjectId,
        teacherId,
        dayOfWeek: parseInt(dayOfWeek),
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

    return NextResponse.json(newSchedule)
  } catch (error) {
    console.error("[ADMIN_SCHEDULE_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
