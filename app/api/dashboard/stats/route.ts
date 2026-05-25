import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET /api/dashboard/stats - Get dashboard statistics for current user
export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const now = new Date()
    const weekStart = getWeekStart(now)
    const lastWeekStart = new Date(weekStart)
    lastWeekStart.setDate(lastWeekStart.getDate() - 7)

    // Get all subjects count
    const totalSubjects = await prisma.subject.count()

    // Get this week's progress
    const thisWeekLogs = await prisma.progressLog.findMany({
      where: {
        userId,
        date: { gte: weekStart },
      },
      select: { duration: true },
    })
    
    const thisWeekMinutes = thisWeekLogs.reduce((sum, log) => sum + log.duration, 0)

    // Get last week's progress for comparison
    const lastWeekLogs = await prisma.progressLog.findMany({
      where: {
        userId,
        date: { gte: lastWeekStart, lt: weekStart },
      },
      select: { duration: true },
    })
    
    const lastWeekMinutes = lastWeekLogs.reduce((sum, log) => sum + log.duration, 0)

    // Calculate percentage change
    const progressChange = lastWeekMinutes > 0 
      ? Math.round(((thisWeekMinutes - lastWeekMinutes) / lastWeekMinutes) * 100)
      : 0

    // Calculate streak
    const streak = await calculateStreak(userId)

    // Calculate rank (simplified - based on total study time this week)
    const rank = await calculateRank(userId, weekStart)

    // Get weekly progress data per day
    const weeklyProgressData = await getWeeklyProgressData(userId, weekStart)

    // Get subject progress
    const subjectProgress = await getSubjectProgress(userId)

    // Get recent activity
    const recentActivity = await prisma.progressLog.findMany({
      where: { userId },
      include: {
        subject: { select: { name: true, color: true } },
        topic: { select: { name: true } },
      },
      orderBy: { date: 'desc' },
      take: 5,
    })

    // Weekly target progress (estimate based on 10 hours/week goal)
    const weeklyTargetHours = 10
    const weeklyProgress = Math.min(Math.round((thisWeekMinutes / 60 / weeklyTargetHours) * 100), 100)

    return NextResponse.json({
      stats: {
        totalSubjects,
        weeklyProgress: `${weeklyProgress}%`,
        weeklyProgressChange: progressChange,
        streak: `${streak} hari`,
        streakBest: Math.max(streak, 7), // Simplified best streak
        rank: `#${rank}`,
        rankChange: 2, // Simplified
      },
      weeklyChartData: weeklyProgressData,
      subjectProgress,
      recentActivity: recentActivity.map(log => ({
        id: log.id,
        subject: log.subject.name,
        topic: log.topic?.name || 'General',
        duration: log.duration,
        date: log.date,
        color: log.subject.color,
      })),
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
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
    orderBy: { date: 'desc' },
    select: { date: true },
    distinct: ['date'],
  })

  if (logs.length === 0) return 0

  let streak = 0
  let currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)

  const logDates = new Set(
    logs.map(log => {
      const d = new Date(log.date)
      d.setHours(0, 0, 0, 0)
      return d.getTime()
    })
  )

  while (logDates.has(currentDate.getTime())) {
    streak++
    currentDate.setDate(currentDate.getDate() - 1)
  }

  return streak
}

async function calculateRank(userId: string, weekStart: Date): Promise<number> {
  const allUsers = await prisma.progressLog.groupBy({
    by: ['userId'],
    where: { date: { gte: weekStart } },
    _sum: { duration: true },
  })

  const sorted = allUsers.sort((a, b) => 
    (b._sum.duration || 0) - (a._sum.duration || 0)
  )

  const userIndex = sorted.findIndex(u => u.userId === userId)
  return userIndex >= 0 ? userIndex + 1 : sorted.length + 1
}

async function getWeeklyProgressData(userId: string, weekStart: Date) {
  const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']
  const subjects = await prisma.subject.findMany({ take: 3 })
  
  const data = []
  
  for (let i = 0; i < 7; i++) {
    const dayStart = new Date(weekStart)
    dayStart.setDate(dayStart.getDate() + i)
    const dayEnd = new Date(dayStart)
    dayEnd.setDate(dayEnd.getDate() + 1)

    const dayData: Record<string, string | number> = { name: days[i] }

    for (const subject of subjects) {
      const logs = await prisma.progressLog.findMany({
        where: {
          userId,
          subjectId: subject.id,
          date: { gte: dayStart, lt: dayEnd },
        },
        select: { duration: true },
      })
      
      const totalMinutes = logs.reduce((sum, log) => sum + log.duration, 0)
      // Convert to a score (0-100 based on target of 60 min/subject/day)
      dayData[subject.name.toLowerCase()] = Math.min(Math.round((totalMinutes / 60) * 100), 100)
    }

    data.push(dayData)
  }

  return data
}

async function getSubjectProgress(userId: string) {
  const subjects = await prisma.subject.findMany({
    include: {
      topics: { select: { id: true } },
      progressLogs: {
        where: { userId, completed: true },
        select: { topicId: true },
        distinct: ['topicId'],
      },
    },
  })

  return subjects.map(subject => {
    const totalTopics = subject.topics.length
    const completedTopics = subject.progressLogs.filter(l => l.topicId).length
    const progress = totalTopics > 0 
      ? Math.round((completedTopics / totalTopics) * 100) 
      : 0
    
    let status: 'on-track' | 'lagging' | 'ahead' = 'on-track'
    if (progress >= 80) status = 'ahead'
    else if (progress < 50) status = 'lagging'

    return {
      id: subject.id,
      name: subject.name,
      progress,
      status,
      color: subject.color,
      topicCount: totalTopics,
      completedTopics,
      lastUpdated: 'Baru saja', // Simplified
    }
  }).slice(0, 4) // Limit to 4 subjects for dashboard
}
