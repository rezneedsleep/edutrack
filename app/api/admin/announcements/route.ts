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

    // Email Notification
    try {
      const activeUsersWithEmail = await prisma.user.findMany({
        where: { isActive: true },
        select: { email: true }
      });
      const emails = activeUsersWithEmail.map(u => u.email).filter(Boolean);
      
      if (emails.length > 0) {
        const { sendEmail } = await import("@/lib/email");
        await sendEmail({
          to: emails,
          subject: `Pengumuman Admin: ${announcement.title}`,
          html: `<p>Halo, ada pengumuman baru dari Administrator.</p>
                 <p><strong>Topik:</strong> ${announcement.title}</p>
                 <p><strong>Pesan:</strong> ${announcement.message}</p>
                 <p>Silakan login ke EduTrack untuk info lebih lanjut.</p>`
        });
      }
    } catch (emailError) {
      console.error("[EMAIL_ERROR]", emailError);
    }

    return NextResponse.json({ success: true, count: users.length, announcement })
  } catch (error) {
    console.error("[ADMIN_ANNOUNCEMENT_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
