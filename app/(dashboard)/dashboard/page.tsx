import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { StudentDashboard } from "@/components/dashboard/student-view"
import { TeacherDashboard } from "@/components/dashboard/teacher-view"
import { CoachDashboard } from "@/components/dashboard/coach-view"
import { GuestDashboard } from "@/components/dashboard/guest-view"

export default async function Page() {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }

  const role = (session.user as any)?.role
  const userId = (session.user as any)?.id

  if (role === 'ADMIN') {
    redirect("/dashboard/admin")
  }

  if (role === 'PARENT') {
    redirect("/dashboard/parent")
  }

  if (role === 'USER') {
    return <GuestDashboard user={session.user} />
  }

  if (role === 'STUDENT') {
    // Fetch Student specific data
    const userSubjects = await prisma.userSubject.findMany({
      where: { userId },
      include: { subject: { include: { topics: true } } }
    })

    const recentLogs = await prisma.progressLog.findMany({
      where: { userId },
      orderBy: { loggedAt: 'desc' },
      include: { topic: { include: { subject: true } } }
    })

    const allSubmissions = await prisma.assignmentSubmission.findMany({
      where: { studentId: userId },
      include: { assignment: true }
    })

    const studentClassId = (session.user as any).classId
    const assignments = studentClassId ? await prisma.assignment.findMany({
      where: { classId: studentClassId, status: 'PUBLISHED' },
      orderBy: { deadline: 'asc' },
      take: 5,
      include: { subject: true, submissions: { where: { studentId: userId } } }
    }) : []

    return (
      <StudentDashboard 
        user={session.user} 
        subjects={userSubjects} 
        recentLogs={recentLogs}
        assignments={assignments}
        allSubmissions={allSubmissions}
      />
    )
  }

  if (role === 'TEACHER') {
    // Fetch Teacher specific data
    const teacherSubjects = await prisma.subject.findMany({
      where: { teacherId: userId },
      include: { assignments: true, topics: true }
    })

    const pendingGrades = await prisma.assignmentSubmission.count({
      where: { assignment: { teacherId: userId }, score: null }
    })

    // Fetch students from classes taught by this teacher
    const schedules = await prisma.classSchedule.findMany({
      where: { teacherId: userId },
      select: { classId: true }
    })
    
    // Also include classes where teacher has assignments
    const assignmentsList = await prisma.assignment.findMany({
      where: { teacherId: userId },
      select: { classId: true }
    })

    const classIds = Array.from(new Set([
      ...schedules.map(s => s.classId),
      ...assignmentsList.filter(a => a.classId).map(a => a.classId as string)
    ]))

    const students = await prisma.user.findMany({
      where: { classId: { in: classIds }, role: 'STUDENT' },
      include: { 
        class: true,
        progressLogs: { include: { topic: { include: { subject: true } } } },
        studentSubmissions: { include: { assignment: true } }
      }
    })

    // Fetch Recent Activities (Submissions & Progress Logs)
    const recentSubmissions = await prisma.assignmentSubmission.findMany({
      where: { assignment: { teacherId: userId } },
      orderBy: { submittedAt: 'desc' },
      take: 5,
      include: { student: true, assignment: true }
    })

    const recentLogs = await prisma.progressLog.findMany({
      where: { topic: { subject: { teacherId: userId } } },
      orderBy: { loggedAt: 'desc' },
      take: 5,
      include: { user: true, topic: { include: { subject: true } } }
    })

    // Fetch Materials
    const materials = await prisma.material.findMany({
      where: { teacherId: userId },
      include: { subject: true, class: true },
      orderBy: { createdAt: 'desc' }
    })

    // Combine and sort activities
    const activities = [
      ...recentSubmissions.map(s => ({
        id: s.id,
        type: 'SUBMISSION',
        user: s.student.name,
        item: s.assignment.title,
        time: s.submittedAt
      })),
      ...recentLogs.map(l => ({
        id: l.id,
        type: 'LOG',
        user: l.user.name,
        item: l.topic.name,
        time: l.loggedAt
      }))
    ].sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 5)

    // Fetch classes for dropdown selection when creating material/assignment
    const classes = await prisma.class.findMany({
      orderBy: { name: 'asc' }
    })

    return (
      <TeacherDashboard 
        user={session.user} 
        subjects={teacherSubjects}
        pendingGrades={pendingGrades}
        students={students}
        activities={activities}
        materials={materials}
        classes={classes}
      />
    )
  }

  if (role === 'COACH') {
    // Fetch Coach specific data
    const extracurriculars = await prisma.extracurricular.findMany({
      where: { coachId: userId },
      include: {
        members: true,
        sessions: { include: { attendances: true } }
      }
    })

    return (
      <CoachDashboard 
        user={session.user} 
        extracurriculars={extracurriculars}
      />
    )
  }

  // Fallback for any unknown role - show guest view
  return <GuestDashboard user={session.user} />
}
