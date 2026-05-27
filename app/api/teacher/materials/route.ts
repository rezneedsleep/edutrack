import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { censorText } from "@/lib/censor"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== 'TEACHER') {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const userId = (session.user as any).id
    const body = await req.json()
    const { title, description, subjectId, classId, attachments } = body

    if (!title || !subjectId) {
      return new NextResponse("Missing fields", { status: 400 })
    }

    const material = await prisma.material.create({
      data: {
        title: censorText(title),
        description: censorText(description || ""),
        subjectId,
        classId: classId === "all" ? null : classId,
        teacherId: userId,
        attachments: attachments || []
      }
    })

    // Email Notification
    try {
      const targetClass = classId === "all" ? null : classId;
      const students = await prisma.user.findMany({
        where: {
          role: 'STUDENT',
          ...(targetClass ? { classId: targetClass } : {})
        },
        select: { email: true }
      });
      
      const emails = students.map(s => s.email).filter(Boolean);
      if (emails.length > 0) {
        const { sendEmail } = await import("@/lib/email");
        await sendEmail({
          to: emails,
          subject: `Materi Baru: ${material.title}`,
          html: `<p>Halo, ada materi baru yang diunggah oleh guru Anda.</p>
                 <p><strong>Judul:</strong> ${material.title}</p>
                 <p><strong>Deskripsi:</strong> ${material.description}</p>
                 <p>Silakan login ke EduTrack untuk melihat materi selengkapnya.</p>`
        });
      }
    } catch (emailError) {
      console.error("[EMAIL_ERROR]", emailError);
    }

    return NextResponse.json(material)
  } catch (error) {
    console.error("[MATERIALS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
