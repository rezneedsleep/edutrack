import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const body = await req.json()
    const { name, description, schedule, coachId, leaderId } = body

    if (!name) {
      return new NextResponse("Name is required", { status: 400 })
    }

    const item = await prisma.extracurricular.create({
      data: {
        name,
        description: description || null,
        schedule: schedule || null,
        coachId: coachId && coachId !== 'none' ? coachId : null,
        leaderId: leaderId && leaderId !== 'none' ? leaderId : null
      },
      include: {
        coach: true,
        leader: true,
        members: true
      }
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error("[EXTRACURRICULARS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
