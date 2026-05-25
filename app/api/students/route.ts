import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const querySchema = z.object({
  classId: z.string().optional(),
  search: z.string().optional(),
  status: z.enum(['all', 'on-track', 'lagging', 'ahead']).optional(),
  limit: z.coerce.number().min(1).max(100).optional().default(50),
  offset: z.coerce.number().min(0).optional().default(0),
})

// GET /api/students - Teacher only - Get all students with progress summary
export async function GET(request: NextRequest) {
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
        { error: 'Forbidden: Only teachers can access student data' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const queryResult = querySchema.safeParse({
      classId: searchParams.get('classId') || undefined,
      search: searchParams.get('search') || undefined,
      status: searchParams.get('status') || undefined,
      limit: searchParams.get('limit') || undefined,
      offset: searchParams.get('offset') || undefined,
    })

    if (!queryResult.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: queryResult.error.flatten() },
        { status: 400 }
      )
    }

    const { classId, search, limit, offset } = queryResult.data

    const where: Record<string, unknown> = {
      role: 'STUDENT',
    }

    if (classId) {
      where.classId = classId
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [students, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          class: { select: { id: true, name: true, gradeYear: true } },
          progressLogs: {
            orderBy: { loggedAt: 'desc' },
            take: 10,
            select: {
              duration: true,
              loggedAt: true,
            },
          },
          _count: {
            select: {
              progressLogs: true,
            },
          },
        },
        orderBy: { name: 'asc' },
        take: limit,
        skip: offset,
      }),
      prisma.user.count({ where }),
    ])

    // Calculate progress metrics for each student
    const weekStart = getWeekStart(new Date())
    
    const studentsWithMetrics = await Promise.all(
      students.map(async (student) => {
        // Calculate weekly study time
        const weeklyLogs = await prisma.progressLog.findMany({
          where: {
            userId: student.id,
            loggedAt: { gte: weekStart },
          },
          select: { duration: true },
        })
        
        const weeklyMinutes = weeklyLogs.reduce((sum, log) => sum + log.duration, 0)
        const weeklyHours = Math.round((weeklyMinutes / 60) * 10) / 10

        // Calculate streak
        const streak = await calculateStreak(student.id)

        const progressLogs = await prisma.progressLog.findMany({
          where: { userId: student.id },
          select: { topicId: true }
        })
        const completedTopicIds = new Set(progressLogs.map(l => l.topicId))

        // Calculate overall progress
        const subjects = await prisma.subject.findMany({
          include: {
            topics: { select: { id: true } },
          },
        })

        const totalTopics = subjects.reduce((sum, s) => sum + s.topics.length, 0)
        const completedTopics = subjects.reduce(
          (sum, s) => sum + s.topics.filter(t => completedTopicIds.has(t.id)).length, 
          0
        )
        const overallProgress = totalTopics > 0 
          ? Math.round((completedTopics / totalTopics) * 100) 
          : 0

        // Determine status
        let status: 'on-track' | 'lagging' | 'ahead' = 'on-track'
        if (overallProgress >= 80) status = 'ahead'
        else if (overallProgress < 50) status = 'lagging'

        // Last activity
        const lastLog = student.progressLogs[0]
        const lastActivity = lastLog 
          ? formatRelativeTime(new Date(lastLog.loggedAt))
          : 'Belum ada aktivitas'

        return {
          id: student.id,
          name: student.name || 'Unnamed',
          email: student.email,
          image: student.image,
          class: student.class,
          weeklyHours,
          streak,
          overallProgress,
          status,
          lastActivity,
          totalLogs: student._count.progressLogs,
        }
      })
    )

    return NextResponse.json({
      students: studentsWithMetrics,
      total,
      hasMore: offset + students.length < total,
    })
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

async function calculateStreak(userId: string): Promise<number> {
  const logs = await prisma.progressLog.findMany({
    where: { userId },
    orderBy: { loggedAt: 'desc' },
    select: { loggedAt: true },
  })

  if (logs.length === 0) return 0

  const logDates = new Set(
    logs.map(log => {
      const d = new Date(log.loggedAt)
      d.setHours(0, 0, 0, 0)
      return d.getTime()
    })
  )

  let streak = 0
  let currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)

  while (logDates.has(currentDate.getTime())) {
    streak++
    currentDate.setDate(currentDate.getDate() - 1)
  }

  return streak
}

function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffHours < 1) return 'Baru saja'
  if (diffHours < 24) return `${diffHours} jam lalu`
  if (diffDays === 1) return 'Kemarin'
  if (diffDays < 7) return `${diffDays} hari lalu`
  return date.toLocaleDateString('id-ID')
}
