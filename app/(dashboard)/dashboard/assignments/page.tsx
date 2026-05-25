import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { AssignmentsClient } from "@/components/dashboard/assignments-client"

export default async function StudentAssignmentsPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const userId = (session.user as any).id
  const classId = (session.user as any).classId

  const assignments = await prisma.assignment.findMany({
    where: { 
      OR: [
        { classId },
        { studentId: userId }
      ],
      status: 'PUBLISHED'
    },
    include: { 
      subject: true, 
      comments: {
        include: { author: true },
        orderBy: { createdAt: 'asc' }
      },
      submissions: { 
        where: { studentId: userId } 
      } 
    },
    orderBy: { deadline: 'asc' }
  })

  return (
    <AssignmentsClient 
      assignments={assignments}
      currentUserId={userId}
    />
  )
}
