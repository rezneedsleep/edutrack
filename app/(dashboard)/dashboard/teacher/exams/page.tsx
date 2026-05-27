import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { TeacherExamsClient } from "@/components/dashboard/teacher-exams-client"

export default async function TeacherExamsPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }

  const role = (session.user as any)?.role
  if (role !== 'TEACHER') {
    redirect("/dashboard")
  }

  const teacherId = (session.user as any).id

  // Fetch subjects and classes for the teacher to use in the form
  const [subjects, classes] = await Promise.all([
    prisma.subject.findMany({ where: { teacherId } }),
    prisma.class.findMany() // Can be optimized to classes the teacher actually teaches
  ])

  return (
    <div className="p-6">
      <TeacherExamsClient subjects={subjects} classes={classes} />
    </div>
  )
}
