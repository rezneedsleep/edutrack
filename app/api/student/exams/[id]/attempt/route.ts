import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

// Start an attempt
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== 'STUDENT') {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { id: examId } = await params;
    const studentId = (session.user as any).id

    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: { questions: true }
    })

    if (!exam || exam.status !== 'PUBLISHED') {
      return new NextResponse("Exam not available", { status: 404 })
    }

    const existingAttempt = await prisma.examAttempt.findUnique({
      where: { examId_studentId: { examId, studentId } }
    })

    if (existingAttempt) {
      return NextResponse.json(existingAttempt) // Already started
    }

    const attempt = await prisma.examAttempt.create({
      data: {
        examId,
        studentId,
        status: 'ONGOING'
      }
    })

    return NextResponse.json(attempt)
  } catch (error) {
    console.error("[EXAM_ATTEMPT_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// Submit answers and finish
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== 'STUDENT') {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { id: examId } = await params;
    const studentId = (session.user as any).id
    const body = await req.json()
    const { answers, cheatWarnings } = body // answers = [{ questionId, answerText }]

    const attempt = await prisma.examAttempt.findUnique({
      where: { examId_studentId: { examId, studentId } },
      include: { exam: { include: { questions: true } } }
    })

    if (!attempt || attempt.status === 'COMPLETED') {
      return new NextResponse("Invalid attempt", { status: 400 })
    }

    const questions = attempt.exam.questions
    let totalScore = 0
    let totalPossible = 0

    const answerRecords = []

    for (const q of questions) {
      totalPossible += q.points
      const submitted = answers?.find((a: any) => a.questionId === q.id)
      
      let isCorrect = false
      let pointsAwarded = 0

      if (submitted && submitted.answerText === q.correctAnswer) {
        isCorrect = true
        pointsAwarded = q.points
        totalScore += q.points
      }

      answerRecords.push({
        attemptId: attempt.id,
        questionId: q.id,
        answerText: submitted?.answerText || "",
        isCorrect,
        pointsAwarded
      })
    }

    // Save answers
    await prisma.examAnswer.createMany({
      data: answerRecords,
      skipDuplicates: true
    })

    // Calculate percentage score (0-100)
    const finalScore = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0

    const completed = await prisma.examAttempt.update({
      where: { id: attempt.id },
      data: {
        status: 'COMPLETED',
        endTime: new Date(),
        score: finalScore,
        cheatWarnings: cheatWarnings || 0
      }
    })

    return NextResponse.json(completed)
  } catch (error) {
    console.error("[EXAM_ATTEMPT_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
