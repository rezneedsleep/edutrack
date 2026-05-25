import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const { score, feedback } = await req.json()
    const { id: submissionId } = await params

    const submission = await prisma.assignmentSubmission.update({
      where: { id: submissionId },
      data: {
        score: parseInt(score),
        feedback,
        gradedAt: new Date()
      }
    })

    // Optionally create notification for student
    await prisma.notification.create({
      data: {
        userId: submission.studentId,
        type: 'ASSIGNMENT_GRADED',
        title: `Tugas Dinilai: ${score}`,
        message: `Feedback: ${feedback || 'Tidak ada feedback.'}`
      }
    })

    return NextResponse.json(submission)
  } catch (error) {
    console.error("[SUBMISSION_GRADE_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
