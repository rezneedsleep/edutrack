import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const userId = (session.user as any).id
  const role = (session.user as any).role

  try {
    const body = await req.json()
    const { name, subjectId } = body

    if (!name || !subjectId) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    // Permission check: Admin or the teacher who owns the subject
    if (role !== 'ADMIN') {
      const subject = await prisma.subject.findUnique({
        where: { id: subjectId }
      })

      if (!subject || subject.teacherId !== userId) {
        return new NextResponse("Forbidden", { status: 403 })
      }
    }

    // Get the highest order to put the new topic at the end
    const lastTopic = await prisma.topic.findFirst({
      where: { subjectId },
      orderBy: { order: 'desc' }
    })

    const newTopic = await prisma.topic.create({
      data: {
        name,
        subjectId,
        order: lastTopic ? lastTopic.order + 1 : 0
      }
    })

    return NextResponse.json(newTopic)
  } catch (error) {
    console.error("[ADMIN_TOPICS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
