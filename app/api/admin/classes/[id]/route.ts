import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: classId } = await params
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const body = await req.json()
    const { name, school, gradeYear } = body

    const updatedClass = await prisma.class.update({
      where: { id: classId },
      data: {
        name,
        school,
        gradeYear: parseInt(gradeYear)
      },
      include: {
        students: true,
        schedules: true,
      }
    })

    return NextResponse.json(updatedClass)
  } catch (error) {
    console.error("[ADMIN_CLASS_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: classId } = await params
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    await prisma.class.delete({ where: { id: classId } })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[ADMIN_CLASS_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
