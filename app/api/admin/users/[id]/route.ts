import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

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
    const { name, email, role, school, classId, subjectId, image, nis, phone, gender, address } = body

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

    // Update user
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        role,
        school,
        classId: classId || null,
        image: image !== undefined ? image : undefined,
        nis: nis === "" ? null : (nis !== undefined ? nis : undefined),
        phone: phone === "" ? null : (phone !== undefined ? phone : undefined),
        gender: gender !== undefined ? gender : undefined,
        address: address !== undefined ? address : undefined,
        position: body.position !== undefined ? body.position : undefined,
        affiliations: body.affiliations !== undefined ? body.affiliations : undefined,
        canEditMaterials: body.canEditMaterials !== undefined ? body.canEditMaterials : undefined,
        canEditAssignments: body.canEditAssignments !== undefined ? body.canEditAssignments : undefined
      },
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
    await prisma.progressLog.deleteMany({ where: { userId } })
    await prisma.userSubject.deleteMany({ where: { userId } })
    await prisma.notification.deleteMany({ where: { userId } })
    await prisma.assignmentSubmission.deleteMany({ where: { studentId: userId } })
    
    // Delete user
    await prisma.user.delete({ where: { id: userId } })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[ADMIN_USER_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
