import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { censorText } from "@/lib/censor"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== 'TEACHER') {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const userId = (session.user as any).id
    const body = await req.json()
    const { title, description, subjectId, classId, attachments } = body

    if (!title || !subjectId) {
      return new NextResponse("Missing fields", { status: 400 })
    }

    const material = await prisma.material.create({
      data: {
        title: censorText(title),
        description: censorText(description || ""),
        subjectId,
        classId: classId === "all" ? null : classId,
        teacherId: userId,
        attachments: attachments || []
      }
    })

    return NextResponse.json(material)
  } catch (error) {
    console.error("[MATERIALS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
