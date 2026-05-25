import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

// POST — New submission
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const { id: assignmentId } = await params
    const { content, fileUrl, fileName } = await req.json()
    const studentId = (session.user as any).id

    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId }
    })

    if (!assignment) {
      return new NextResponse("Assignment not found", { status: 404 })
    }

    if (new Date(assignment.deadline) < new Date()) {
      return new NextResponse("Batas waktu pengumpulan telah berakhir", { status: 403 })
    }

    const existing = await prisma.assignmentSubmission.findUnique({
      where: { assignmentId_studentId: { assignmentId, studentId } }
    })

    if (existing) {
      return new NextResponse("Already submitted", { status: 400 })
    }

    const attachments = fileUrl && fileName ? [{ name: fileName, url: fileUrl, type: 'file' }] : []

    const submission = await prisma.assignmentSubmission.create({
      data: { assignmentId, studentId, content, attachments, submittedAt: new Date() }
    })

    return NextResponse.json(submission)
  } catch (error) {
    console.error("[SUBMISSION_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// PATCH — Update existing submission
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const { id: assignmentId } = await params
    const { content, fileUrl, fileName } = await req.json()
    const studentId = (session.user as any).id

    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId }
    })

    if (!assignment) {
      return new NextResponse("Assignment not found", { status: 404 })
    }

    if (new Date(assignment.deadline) < new Date()) {
      return new NextResponse("Batas waktu pengumpulan telah berakhir", { status: 403 })
    }

    const existing = await prisma.assignmentSubmission.findUnique({
      where: { assignmentId_studentId: { assignmentId, studentId } }
    })

    if (!existing) return new NextResponse("Submission not found", { status: 404 })

    const attachments = fileUrl && fileName
      ? [{ name: fileName, url: fileUrl, type: 'file' }]
      : existing.attachments

    const updated = await prisma.assignmentSubmission.update({
      where: { assignmentId_studentId: { assignmentId, studentId } },
      data: { content, attachments, submittedAt: new Date() }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("[SUBMISSION_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

