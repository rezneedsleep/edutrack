import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const session = await auth()
  if (!session) return new NextResponse("Unauthorized", { status: 401 })

  const { searchParams } = new URL(req.url)
  const userId = (session.user as any).id

  const logs = await prisma.progressLog.findMany({
    where: { userId },
    orderBy: { loggedAt: 'desc' },
    include: { topic: { include: { subject: true } } }
  })

  return NextResponse.json(logs)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const body = await req.json()
    const { subjectId, topicId, duration, difficulty, notes } = body

    const log = await prisma.progressLog.create({
      data: {
        userId: (session.user as any).id,
        topicId,
        duration: parseInt(duration),
        difficulty: parseInt(difficulty),
        notes,
        loggedAt: new Date()
      }
    })

    return NextResponse.json(log)
  } catch (error) {
    console.error("[PROGRESS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
