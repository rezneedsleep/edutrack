import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== 'STUDENT') {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const studentId = (session.user as any).id
    const student = await prisma.user.findUnique({
      where: { id: studentId },
      select: { classId: true }
    })

    if (!student?.classId) {
      return NextResponse.json([])
    }

    const exams = await prisma.exam.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { classId: student.classId },
          { classId: null }
        ]
      },
      include: {
        subject: true,
        teacher: true,
        attempts: {
          where: { studentId }
        }
      },
      orderBy: { startTime: 'desc' }
    })

    return NextResponse.json(exams)
  } catch (error) {
    console.error("[STUDENT_EXAMS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
