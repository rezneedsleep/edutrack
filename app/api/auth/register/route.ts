import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    const settings = await prisma.settings.findUnique({
      where: { id: 'global' },
      select: { disableRegistration: true }
    })
    return NextResponse.json({
      disableRegistration: settings?.disableRegistration || false
    })
  } catch (error) {
    return NextResponse.json({ disableRegistration: false })
  }
}

export async function POST(req: Request) {
  try {
    const settings = await prisma.settings.findUnique({
      where: { id: 'global' }
    })

    if (settings?.disableRegistration) {
      return NextResponse.json(
        { error: "Pendaftaran dinonaktifkan oleh administrator." },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { name, email, password, role, school, className, subject } = body

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

    // Handle class for students
    let classId = null
    if (role === 'STUDENT' && className) {
      const existingClass = await prisma.class.findFirst({
        where: { name: className, school }
      })
      
      if (existingClass) {
        classId = existingClass.id
      } else {
        const newClass = await prisma.class.create({
          data: { name: className, school, gradeYear: 10 }
        })
        classId = newClass.id
      }
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER',
        school,
        classId,
        isActive: true
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("[REGISTER_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
