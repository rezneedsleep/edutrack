import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { censorText } from '@/lib/censor'

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    
    const { searchParams } = new URL(req.url)
    const classId = searchParams.get('classId')

    const threads = await prisma.discussionThread.findMany({
      where: {
        classId: classId || null
      },
      orderBy: {
        updatedAt: 'desc'
      },
      include: {
        author: {
          select: { name: true, image: true, role: true }
        },
        replies: {
          include: {
            author: { select: { name: true, image: true, role: true } }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    return NextResponse.json(threads)
  } catch (error) {
    console.error('Error fetching discussions:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const userId = (session.user as any).id
    const body = await req.json()
    const { title, content, classId } = body

    if (!title || !content) {
      return new NextResponse('Missing fields', { status: 400 })
    }

    const thread = await prisma.discussionThread.create({
      data: {
        title: censorText(title),
        content: censorText(content),
        classId: classId || null,
        authorId: userId
      },
      include: {
        author: { select: { name: true, image: true, role: true } },
        replies: true
      }
    })

    return NextResponse.json(thread)
  } catch (error) {
    console.error('Error creating discussion:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
