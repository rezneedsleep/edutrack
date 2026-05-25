import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { HelpClient } from "@/components/dashboard/help-client"

export default async function HelpPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const role = (session.user as any).role

  return (
    <div className="p-6 md:p-10">
      <HelpClient role={role} />
    </div>
  )
}
