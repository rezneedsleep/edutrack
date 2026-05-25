import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminAnnouncementsClient } from "@/components/dashboard/admin-announcements-client"

export default async function AdminAnnouncementsPage() {
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') redirect("/dashboard")

  return <AdminAnnouncementsClient />
}
