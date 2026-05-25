import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(announcements)
  } catch (error) {
    console.error("[ADMIN_ANNOUNCEMENT_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { title, message, type } = await req.json()

    // 1. Create central Announcement
    const announcement = await prisma.announcement.create({
      data: {
        title,
        message,
        type: type || 'SYSTEM'
      }
    })

    // 2. Send notification to ALL active users
    const users = await prisma.user.findMany({
      where: { isActive: true },
      select: { id: true }
    })

    await prisma.notification.createMany({
      data: users.map(user => ({
        userId: user.id,
        title,
        message,
        type: (type as any) || 'SYSTEM',
        announcementId: announcement.id
      }))
    })

    return NextResponse.json({ success: true, count: users.length, announcement })
  } catch (error) {
    console.error("[ADMIN_ANNOUNCEMENT_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
