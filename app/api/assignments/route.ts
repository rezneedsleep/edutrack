import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const body = await req.json()
    console.log("[ASSIGNMENT_DEBUG] Payload:", JSON.stringify(body, null, 2))
    
    const { title, description, subjectId, topicId, classId, deadline, maxScore, status, attachments } = body
    const teacherId = (session.user as any).id

    if (!teacherId) {
      console.error("[ASSIGNMENT_ERROR] Teacher ID not found in session")
      return new NextResponse("Unauthorized: Teacher ID Missing", { status: 401 })
    }

    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        subjectId,
        topicId: topicId || null,
        classId: classId === "all" || !classId ? null : classId,
        teacherId,
        deadline: new Date(deadline),
        maxScore: Number(maxScore) || 100,
        attachments: attachments || [],
        status: status || 'DRAFT'
      },
      include: { subject: true, class: true, teacher: true }
    })

    // Email Notification
    try {
      const targetClass = classId === "all" || !classId ? null : classId;
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
          subject: `Tugas Baru: ${assignment.title}`,
          html: `<p>Halo, ada tugas baru dari guru Anda yang harus dikerjakan.</p>
                 <p><strong>Judul:</strong> ${assignment.title}</p>
                 <p><strong>Tenggat Waktu:</strong> ${new Date(deadline).toLocaleString('id-ID')}</p>
                 <p>Silakan login ke EduTrack untuk mengumpulkan tugas Anda.</p>`
        });
      }
    } catch (emailError) {
      console.error("[EMAIL_ERROR]", emailError);
    }

    console.log("[ASSIGNMENT_SUCCESS] Created:", assignment.id)
    return NextResponse.json(assignment)
  } catch (error: any) {
    console.error("[ASSIGNMENT_POST_ERROR]", error)
    return new NextResponse(`Internal Error: ${error.message || 'Unknown error'}`, { status: 500 })
  }
}

export async function GET(req: Request) {
  const session = await auth()
  if (!session) return new NextResponse("Unauthorized", { status: 401 })

  const { searchParams } = new URL(req.url)
  const classId = searchParams.get('classId')

  try {
    if (classId) {
      const assignments = await prisma.assignment.findMany({
        where: { classId },
        include: {
          subject: true,
          teacher: {
            select: { name: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
      return NextResponse.json(assignments)
    }

    const role = (session.user as any).role
    const userId = (session.user as any).id

    if (role !== 'ADMIN' && role !== 'TEACHER') {
      return new NextResponse("Forbidden", { status: 403 })
    }

    let assignments;
    if (role === 'ADMIN') {
      assignments = await prisma.assignment.findMany({
        include: { subject: true, class: true, teacher: true },
        orderBy: { createdAt: 'desc' }
      })
    } else {
      assignments = await prisma.assignment.findMany({
        where: { teacherId: userId },
        include: { subject: true, class: true, teacher: true },
        orderBy: { createdAt: 'desc' }
      })
    }

    return NextResponse.json(assignments)
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const role = (session.user as any).role
    const userId = (session.user as any).id

    if (role !== 'ADMIN' && role !== 'TEACHER') {
      return new NextResponse("Forbidden", { status: 403 })
    }

    const body = await req.json()
    const { ids, status } = body

    if (!ids || !Array.isArray(ids) || !status) {
      return new NextResponse("Invalid request payload", { status: 400 })
    }

    if (role !== 'ADMIN') {
      // Check permissions and ownership
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { canEditAssignments: true }
      })
      if (!user?.canEditAssignments) {
        return new NextResponse("Forbidden - Assignment editing is disabled", { status: 403 })
      }

      const assignments = await prisma.assignment.findMany({
        where: { id: { in: ids } },
        select: { teacherId: true }
      })
      const isOwnerAll = assignments.every(a => a.teacherId === userId)
      if (!isOwnerAll) {
        return new NextResponse("Forbidden - Unauthorized assignments in bulk request", { status: 403 })
      }
    }

    await prisma.assignment.updateMany({
      where: { id: { in: ids } },
      data: { status }
    })

    return new NextResponse("Updated successfully", { status: 200 })
  } catch (error) {
    console.error("[ASSIGNMENTS_BULK_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth()
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const role = (session.user as any).role
    const userId = (session.user as any).id

    if (role !== 'ADMIN' && role !== 'TEACHER') {
      return new NextResponse("Forbidden", { status: 403 })
    }

    const body = await req.json()
    const { ids } = body

    if (!ids || !Array.isArray(ids)) {
      return new NextResponse("Invalid request payload", { status: 400 })
    }

    if (role !== 'ADMIN') {
      // Check permissions and ownership
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { canEditAssignments: true }
      })
      if (!user?.canEditAssignments) {
        return new NextResponse("Forbidden - Assignment editing is disabled", { status: 403 })
      }

      const assignments = await prisma.assignment.findMany({
        where: { id: { in: ids } },
        select: { teacherId: true }
      })
      const isOwnerAll = assignments.every(a => a.teacherId === userId)
      if (!isOwnerAll) {
        return new NextResponse("Forbidden", { status: 403 })
      }
    }

    await prisma.assignment.deleteMany({
      where: { id: { in: ids } }
    })

    return new NextResponse("Deleted successfully", { status: 200 })
  } catch (error) {
    console.error("[ASSIGNMENTS_BULK_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
