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
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { class: true }
    })

    const role = (session.user as any).role

    // Fetch assignments as events
    let assignments = []
    if (role === 'STUDENT' && user?.classId) {
      assignments = await prisma.assignment.findMany({
        where: {
          classId: user.classId,
          status: 'PUBLISHED'
        },
        include: { subject: true }
      })
    } else if (role === 'TEACHER') {
      assignments = await prisma.assignment.findMany({
        where: { teacherId: userId },
        include: { subject: true }
      })
    }

    const events = assignments.map(a => ({
      id: `assignment-${a.id}`,
      title: `${a.subject.name}: ${a.title}`,
      date: a.deadline.toISOString(),
      type: 'assignment'
    }))

    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching calendar events:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
