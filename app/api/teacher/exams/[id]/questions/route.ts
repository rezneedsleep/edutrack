import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== 'TEACHER') {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { id: examId } = await params;
    const body = await req.json()
    const { questionText, type, options, correctAnswer, points, order } = body

    // Verify exam ownership
    const exam = await prisma.exam.findUnique({ where: { id: examId } })
    if (!exam || exam.teacherId !== (session.user as any).id) {
      return new NextResponse("Not Found or Unauthorized", { status: 404 })
    }

    const question = await prisma.examQuestion.create({
      data: {
        examId,
        questionText,
        type: type || 'MULTIPLE_CHOICE',
        options: options || [],
        correctAnswer,
        points: Number(points) || 10,
        order: Number(order) || 0
      }
    })

    return NextResponse.json(question)
  } catch (error) {
    console.error("[EXAM_QUESTION_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
