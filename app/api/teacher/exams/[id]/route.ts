import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== 'TEACHER') {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { id } = await params;
    const exam = await prisma.exam.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        },
        class: true,
        subject: true
      }
    })

    if (!exam || exam.teacherId !== (session.user as any).id) {
      return new NextResponse("Not Found or Unauthorized", { status: 404 })
    }

    return NextResponse.json(exam)
  } catch (error) {
    console.error("[EXAM_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== 'TEACHER') {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { id } = await params;
    const body = await req.json()
    
    // Verify ownership
    const existing = await prisma.exam.findUnique({ where: { id } })
    if (!existing || existing.teacherId !== (session.user as any).id) {
      return new NextResponse("Not Found or Unauthorized", { status: 404 })
    }

    const exam = await prisma.exam.update({
      where: { id },
      data: {
        ...body,
        ...(body.startTime && { startTime: new Date(body.startTime) }),
        ...(body.endTime && { endTime: new Date(body.endTime) }),
      }
    })

    return NextResponse.json(exam)
  } catch (error) {
    console.error("[EXAM_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== 'TEACHER') {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { id } = await params;
    
    // Verify ownership
    const existing = await prisma.exam.findUnique({ where: { id } })
    if (!existing || existing.teacherId !== (session.user as any).id) {
      return new NextResponse("Not Found or Unauthorized", { status: 404 })
    }

    await prisma.exam.delete({ where: { id } })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[EXAM_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
