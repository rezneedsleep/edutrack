import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DashboardRedirect() {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }

  const role = (session.user as any)?.role

  if (role === 'ADMIN') {
    redirect("/dashboard/admin")
  }

  redirect("/dashboard")
}
