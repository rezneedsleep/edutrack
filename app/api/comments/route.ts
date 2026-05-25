import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { censorText } from "@/lib/censor"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const userId = (session.user as any).id
    const body = await req.json()
    const { content, assignmentId, submissionId } = body

    if (!content || (!assignmentId && !submissionId)) {
      return new NextResponse('Missing fields', { status: 400 })
    }

    const comment = await prisma.comment.create({
      data: {
        content: censorText(content),
        authorId: userId,
        assignmentId: assignmentId || null,
        submissionId: submissionId || null
      },
      include: {
        author: {
          select: { name: true, image: true, role: true }
        }
      }
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error('Error creating comment:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
