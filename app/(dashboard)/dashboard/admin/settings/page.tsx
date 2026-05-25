import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { AdminSettingsClient } from "@/components/dashboard/admin-settings-client"

export default async function AdminSettingsPage() {
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') redirect("/dashboard")

  const settings = await prisma.settings.findUnique({
    where: { id: 'global' }
  })

  return <AdminSettingsClient initialSettings={settings} />
}
