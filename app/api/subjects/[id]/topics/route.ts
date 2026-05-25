import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const { name, description, estimatedHours } = await req.json()
    const subjectId = params.id

    // Get current max order
    const lastTopic = await prisma.topic.findFirst({
      where: { subjectId },
      orderBy: { order: 'desc' }
    })

    const newOrder = lastTopic ? lastTopic.order + 1 : 0

    const topic = await prisma.topic.create({
      data: {
        name,
        description,
        estimatedHours: parseInt(estimatedHours),
        subjectId,
        order: newOrder
      }
    })

    return NextResponse.json(topic)
  } catch (error) {
    console.error("[TOPIC_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
