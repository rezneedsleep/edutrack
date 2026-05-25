import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const userId = (session.user as any).id

    const notifications = await prisma.notification.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20
    })

    return NextResponse.json(notifications)
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const userId = (session.user as any).id

    let body;
    try {
      body = await req.json()
    } catch {
      // It's a "mark all as read" request if no body
    }

    if (body?.id) {
      // Mark specific as read
      const notification = await prisma.notification.updateMany({
        where: {
          id: body.id,
          userId: userId // Ensure user owns it
        },
        data: {
          read: true
        }
      })
      return NextResponse.json({ success: true })
    } else {
      // Mark all as read
      await prisma.notification.updateMany({
        where: {
          userId: userId,
          read: false
        },
        data: {
          read: true
        }
      })
      return NextResponse.json({ success: true })
    }

  } catch (error) {
    console.error('Error updating notifications:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
