import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  const role = (session?.user as any)?.role
  if (!session || (role !== 'TEACHER' && role !== 'COACH')) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const body = await req.json()
    const { studentId, status } = body

    const attendance = await prisma.ekskulAttendance.upsert({
      where: {
        sessionId_studentId: {
          sessionId: id,
          studentId: studentId
        }
      },
      update: { status },
      create: {
        sessionId: id,
        studentId: studentId,
        status
      }
    })

    return NextResponse.json(attendance)
  } catch (error) {
    return new NextResponse("Error saving attendance", { status: 500 })
  }
}
