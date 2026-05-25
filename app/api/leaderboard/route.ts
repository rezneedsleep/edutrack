import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const querySchema = z.object({
  period: z.enum(['weekly', 'monthly', 'all-time']).optional().default('weekly'),
  classId: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
})

// GET /api/leaderboard - Get ranked students
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
    const queryResult = querySchema.safeParse({
      period: searchParams.get('period') || undefined,
      classId: searchParams.get('classId') || undefined,
      limit: searchParams.get('limit') || undefined,
    })

    if (!queryResult.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: queryResult.error.flatten() },
        { status: 400 }
      )
    }

    const { period, classId, limit } = queryResult.data

    // Calculate date range based on period
    const now = new Date()
    let startDate: Date | undefined

    if (period === 'weekly') {
      startDate = getWeekStart(now)
    } else if (period === 'monthly') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    }
    // 'all-time' has no startDate filter

    // Build where clause for progress logs
    const logsWhere: Record<string, unknown> = {}
    if (startDate) {
      logsWhere.date = { gte: startDate }
    }

    // Get all students
    const studentWhere: Record<string, unknown> = {
      role: 'STUDENT',
    }
    if (classId) {
      studentWhere.classId = classId
    }

    const students = await prisma.user.findMany({
      where: studentWhere,
      select: {
        id: true,
        name: true,
        image: true,
        class: { select: { name: true } },
      },
    })

    // Calculate scores for each student
    const studentsWithScores = await Promise.all(
      students.map(async (student) => {
        const logs = await prisma.progressLog.findMany({
          where: {
            userId: student.id,
            ...logsWhere,
          },
          select: {
            duration: true,
            difficulty: true,
            completed: true,
          },
        })

        // Calculate score based on:
        // - Total study time (1 point per minute)
        // - Completed topics (10 points each)
        // - Difficulty bonus (difficulty * 2 points)
        const totalMinutes = logs.reduce((sum, log) => sum + log.duration, 0)
        const completedBonus = logs.filter(l => l.completed).length * 10
        const difficultyBonus = logs.reduce((sum, log) => sum + (log.difficulty || 3) * 2, 0)
        
        const score = totalMinutes + completedBonus + difficultyBonus
        const hours = Math.round((totalMinutes / 60) * 10) / 10

        return {
          id: student.id,
          name: student.name || 'Unnamed',
          image: student.image,
          className: student.class?.name || '-',
          score,
          hours,
          sessionsCount: logs.length,
        }
      })
    )

    // Sort by score and assign ranks
    const ranked = studentsWithScores
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((student, index) => ({
        ...student,
        rank: index + 1,
      }))

    // Find current user's rank
    const allRanked = studentsWithScores.sort((a, b) => b.score - a.score)
    const currentUserIndex = allRanked.findIndex(s => s.id === session.user.id)
    const currentUserRank = currentUserIndex >= 0 ? currentUserIndex + 1 : null
    const currentUserStats = currentUserIndex >= 0 ? allRanked[currentUserIndex] : null

    return NextResponse.json({
      leaderboard: ranked,
      currentUser: currentUserStats ? {
        ...currentUserStats,
        rank: currentUserRank,
      } : null,
      totalParticipants: allRanked.length,
      period,
    })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
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
