import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { StudentExamsClient } from "@/components/dashboard/student-exams-client"

export default async function StudentExamsPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }

  const role = (session.user as any)?.role
  if (role !== 'STUDENT') {
    redirect("/dashboard")
  }

  return (
    <div className="p-6">
      <StudentExamsClient />
    </div>
  )
}
