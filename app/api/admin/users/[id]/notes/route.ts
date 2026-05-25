import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { content, type } = await req.json()
    const { id } = await params

    const note = await prisma.userNote.create({
      data: {
        userId: id,
        authorId: session.user.id!,
        content,
        type: type || "GENERAL"
      },
      include: {
        author: true
      }
    })

    return NextResponse.json(note)
  } catch (error) {
    console.error("[USER_NOTES_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { id } = await params
    const notes = await prisma.userNote.findMany({
      where: { userId: id },
      include: {
        author: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(notes)
  } catch (error) {
    console.error("[USER_NOTES_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
