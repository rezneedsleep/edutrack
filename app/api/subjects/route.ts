import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const createSubjectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format').optional(),
  description: z.string().max(500).optional(),
})

const updateSubjectSchema = createSubjectSchema.partial()

// GET /api/subjects - Fetch all subjects
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const includeTopics = searchParams.get('includeTopics') === 'true'
    const includeProgress = searchParams.get('includeProgress') === 'true'

    const subjects = await prisma.subject.findMany({
      include: {
        topics: includeTopics ? {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            name: true,
            description: true,
            order: true,
          },
        } : false,
        _count: {
          select: {
            topics: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    })

    const progressLogs = includeProgress ? await prisma.progressLog.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        duration: true,
        loggedAt: true,
        topicId: true,
      }
    }) : []

    const completedTopicIds = new Set(progressLogs.map(l => l.topicId))

    // Calculate progress for each subject if requested
    const subjectsWithProgress = subjects.map((subject) => {
      const topicIds = subject.topics?.map((t: any) => t.id) || []
      const completedTopics = topicIds.filter(id => completedTopicIds.has(id)).length
      
      const totalTopics = subject._count.topics
      const progress = totalTopics > 0 
        ? Math.round((completedTopics / totalTopics) * 100)
        : 0

      return {
        ...subject,
        progress,
        completedTopics,
        totalTopics,
        progressLogs: includeProgress ? progressLogs.filter(l => topicIds.includes(l.topicId)) : [],
      }
    })

    return NextResponse.json(subjectsWithProgress)
  } catch (error) {
    console.error('Error fetching subjects:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/subjects - Create a new subject (Admin/Teacher only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is teacher or admin
    if ((session.user as any).role !== 'TEACHER' && (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Only teachers and admins can create subjects' },
        { status: 403 }
      )
    }

    const body = await request.json()
    
    const validationResult = createSubjectSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.flatten() 
        },
        { status: 400 }
      )
    }

    const { name, color, description } = validationResult.data

    // Check if subject with same name exists
    const existing = await prisma.subject.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Subject with this name already exists' },
        { status: 409 }
      )
    }

    const subject = await prisma.subject.create({
      data: {
        name,
        color: color || '#0071E3',
        description: description || null,
      },
    })

    return NextResponse.json(subject, { status: 201 })
  } catch (error) {
    console.error('Error creating subject:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
