import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { ids } = await req.json()

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return new NextResponse("Invalid IDs", { status: 400 })
    }

    // Delete related data for all selected users (Manual Cascade)
    await prisma.progressLog.deleteMany({ where: { userId: { in: ids } } })
    await prisma.userSubject.deleteMany({ where: { userId: { in: ids } } })
    await prisma.notification.deleteMany({ where: { userId: { in: ids } } })
    await prisma.assignmentSubmission.deleteMany({ where: { studentId: { in: ids } } })
    await prisma.account.deleteMany({ where: { userId: { in: ids } } })
    await prisma.session.deleteMany({ where: { userId: { in: ids } } })
    
    // Delete users
    await prisma.user.deleteMany({
      where: {
        id: { in: ids }
      }
    })

    return new NextResponse("Users deleted", { status: 200 })
  } catch (error) {
    console.error("[ADMIN_USERS_BULK_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
