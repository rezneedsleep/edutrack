import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== 'TEACHER') {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const teacherId = (session.user as any).id
    const exams = await prisma.exam.findMany({
      where: { teacherId },
      include: {
        subject: true,
        class: true,
        _count: {
          select: { questions: true, attempts: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(exams)
  } catch (error) {
    console.error("[EXAMS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== 'TEACHER') {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const teacherId = (session.user as any).id
    const body = await req.json()
    const { title, description, classId, subjectId, startTime, endTime, durationMin, isStrict, status } = body

    if (!title || !subjectId || !startTime || !endTime) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const exam = await prisma.exam.create({
      data: {
        title,
        description,
        classId: classId === "all" ? null : classId,
        subjectId,
        teacherId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        durationMin: Number(durationMin) || 60,
        isStrict: Boolean(isStrict),
        status: status || 'DRAFT'
      }
    })

    return NextResponse.json(exam)
  } catch (error) {
    console.error("[EXAMS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
