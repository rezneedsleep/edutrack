import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { censorText } from '@/lib/censor'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const userId = (session.user as any).id
    const body = await req.json()
    const { content } = body

    if (!content) {
      return new NextResponse('Missing content', { status: 400 })
    }

    const reply = await prisma.discussionReply.create({
      data: {
        content: censorText(content),
        threadId: params.id,
        authorId: userId
      },
      include: {
        author: { select: { name: true, image: true, role: true } }
      }
    })

    // Update thread updatedAt
    await prisma.discussionThread.update({
      where: { id: params.id },
      data: { updatedAt: new Date() }
    })

    return NextResponse.json(reply)
  } catch (error) {
    console.error('Error creating reply:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
