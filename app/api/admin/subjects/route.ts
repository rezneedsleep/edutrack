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
    const { name, description, color, teacherId } = body

    const newSubject = await prisma.subject.create({
      data: {
        name,
        description,
        color,
        teacherId: teacherId || null
      },
      include: {
        teacher: true,
        topics: true
      }
    })

    return NextResponse.json(newSubject)
  } catch (error) {
    console.error("[ADMIN_SUBJECT_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
