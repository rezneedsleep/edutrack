import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { LeaderboardClient } from "@/components/dashboard/leaderboard-client"

export default async function StudentLeaderboardPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const classId = (session.user as any).classId
  
  // Fetch students, their study hours, submissions, and attendance
  const students = await prisma.user.findMany({
    where: { classId, role: 'STUDENT' },
    select: {
      id: true,
      name: true,
      image: true,
      class: { select: { name: true } },
      progressLogs: { select: { duration: true } },
      studentSubmissions: { select: { score: true } },
      attendances: { select: { status: true } }
    }
  })

  const leaderboard = students.map(s => {
    // 1. Calculate Total Hours
    const totalMinutes = s.progressLogs.reduce((acc, log) => acc + log.duration, 0)
    const hours = parseFloat((totalMinutes / 60).toFixed(1))

    // 2. Calculate Avg Score (Salah/Benar representation)
    const scoredSubmissions = s.studentSubmissions.filter(sub => sub.score !== null)
    const avgScore = scoredSubmissions.length > 0 
      ? scoredSubmissions.reduce((acc, sub) => acc + (sub.score || 0), 0) / scoredSubmissions.length
      : 0

    // 3. Calculate Attendance Rate
    const totalAttendance = s.attendances.length
    const presentCount = s.attendances.filter(a => a.status === 'PRESENT').length
    const attendanceRate = totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 0

    // 4. Calculate Final Points (for sorting)
    // Formula: (avgScore * 0.5) + (attendanceRate * 0.3) + (hours * 2)
    const points = (avgScore * 0.5) + (attendanceRate * 0.3) + (hours * 2)

    return {
      rank: 0, // Will be set after sorting
      name: s.name,
      avatar: s.name.charAt(0),
      hours: hours,
      streak: Math.floor(hours / 2), // Mocking streak based on hours for now
      class: s.class?.name || 'No Class',
      isCurrentUser: s.id === (session.user as any).id,
      points: points
    }
  })
  .sort((a, b) => b.points - a.points)
  .map((entry, index) => ({ ...entry, rank: index + 1 }))

  return (
    <LeaderboardClient 
      data={{
        weekly: leaderboard,
        monthly: leaderboard,
        allTime: leaderboard
      }}
    />
  )
}
