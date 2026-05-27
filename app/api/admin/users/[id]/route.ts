import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: userId } = await params
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const body = await req.json()
    const { name, email, role, school, classId, subjectId, image, nis, phone, gender, address, password, parentPin } = body

    if (!userId) {
        return new NextResponse("User ID missing", { status: 400 })
    }

    // Check email uniqueness if changed
    if (email) {
      const existing = await prisma.user.findFirst({
        where: { 
          email,
          id: { not: userId }
        }
      })
      if (existing) {
        return new NextResponse("Email already taken", { status: 400 })
      }
    }

    // Prepare update data
    const updateData: any = {
      name,
      email,
      role,
      school,
      classId: classId || null,
      image: image !== undefined ? image : undefined,
      nis: nis === "" ? null : (nis !== undefined ? nis : undefined),
      noAbsen: body.noAbsen !== undefined ? (body.noAbsen ? parseInt(body.noAbsen) : null) : undefined,
      phone: phone === "" ? null : (phone !== undefined ? phone : undefined),
      gender: gender !== undefined ? gender : undefined,
      address: address !== undefined ? address : undefined,
      position: body.position !== undefined ? body.position : undefined,
      affiliations: body.affiliations !== undefined ? body.affiliations : undefined,
      canEditMaterials: body.canEditMaterials !== undefined ? body.canEditMaterials : undefined,
      canEditAssignments: body.canEditAssignments !== undefined ? body.canEditAssignments : undefined,
      parentPin: parentPin !== undefined ? parentPin : undefined
    }

    // If password is provided, hash it and update it
    if (password && typeof password === 'string' && password.trim() !== '') {
      updateData.password = await bcrypt.hash(password, 10)
    }

    // Update user
    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        class: true,
        teacherSubjects: true
      }
    })

    // If it's a teacher and subjectId is provided, handle subject assignment
    if (role === 'TEACHER' && subjectId) {
        // Clear previous assignments for this teacher for a clean "one primary subject" logic
        // (Or just update the new one if we want many-to-many, but user asked for "mapel nya apa" singular context)
        await prisma.subject.updateMany({
            where: { teacherId: userId },
            data: { teacherId: null }
        })

        // Assign new subject
        await prisma.subject.update({
            where: { id: subjectId },
            data: { teacherId: userId }
        })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("[ADMIN_USER_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: userId } = await params
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return new NextResponse("User not found", { status: 404 })

    // Delete related data first (Manual Cascade)
    const ids = [userId]
    await prisma.progressLog.deleteMany({ where: { userId: { in: ids } } })
    await prisma.userSubject.deleteMany({ where: { userId: { in: ids } } })
    await prisma.notification.deleteMany({ where: { userId: { in: ids } } })
    await prisma.assignmentSubmission.deleteMany({ where: { studentId: { in: ids } } })
    await prisma.account.deleteMany({ where: { userId: { in: ids } } })
    await prisma.session.deleteMany({ where: { userId: { in: ids } } })
    await prisma.calendarReminder.deleteMany({ where: { userId: { in: ids } } })
    await prisma.attendance.deleteMany({ where: { userId: { in: ids } } })
    await prisma.extracurricularMember.deleteMany({ where: { studentId: { in: ids } } })
    await prisma.extracurricularAttendance.deleteMany({ where: { studentId: { in: ids } } })
    await prisma.operator.deleteMany({ where: { userId: { in: ids } } })

    // Cascade for teachers/notes/etc.
    await prisma.comment.deleteMany({ where: { authorId: { in: ids } } })
    await prisma.assignmentSubmission.deleteMany({ where: { assignment: { teacherId: { in: ids } } } })
    await prisma.assignment.deleteMany({ where: { teacherId: { in: ids } } })
    await prisma.material.deleteMany({ where: { teacherId: { in: ids } } })
    await prisma.classSchedule.deleteMany({ where: { teacherId: { in: ids } } })
    await prisma.userNote.deleteMany({ where: { authorId: { in: ids } } })
    await prisma.userNote.deleteMany({ where: { userId: { in: ids } } })
    await prisma.subject.updateMany({ where: { teacherId: { in: ids } }, data: { teacherId: null } })
    await prisma.extracurricular.updateMany({ where: { leaderId: { in: ids } }, data: { leaderId: null } })
    await prisma.extracurricular.updateMany({ where: { coachId: { in: ids } }, data: { coachId: null } })
    
    // Delete user
    await prisma.user.delete({ where: { id: userId } })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[ADMIN_USER_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
