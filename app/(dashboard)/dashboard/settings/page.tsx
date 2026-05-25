import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { SettingsClient } from "@/components/dashboard/settings-client"

export default async function StudentSettingsPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id }
  })

  return (
    <SettingsClient 
      user={user}
    />
  )
}
