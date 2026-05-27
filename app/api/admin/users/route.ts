import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const body = await req.json()
    const { name, email, password, role, school, classId, subjectId, image, nis, phone, gender, address, parentPin } = body

    if (!email || !password || !name) {
      return new NextResponse("Missing information", { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return new NextResponse("User already exists", { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        school,
        classId: classId || null,
        image: image || null,
        nis: nis || null,
        parentPin: parentPin || "123456",
        noAbsen: body.noAbsen ? parseInt(body.noAbsen) : null,
        phone: phone || null,
        gender: gender || null,
        address: address || null,
        position: body.position || null,
        affiliations: body.affiliations || [],
        canEditMaterials: body.canEditMaterials || false,
        canEditAssignments: body.canEditAssignments || false,
        isActive: true
      },
      include: {
        class: true,
        teacherSubjects: true
      }
    })

    // If it's a teacher and subjectId is provided, assign the subject
    if (role === 'TEACHER' && subjectId) {
        await prisma.subject.update({
            where: { id: subjectId },
            data: { teacherId: user.id }
        })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("[ADMIN_USER_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
