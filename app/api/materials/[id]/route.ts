import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { censorText } from "@/lib/censor"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const role = (session.user as any).role
    const userId = (session.user as any).id

    if (role !== 'ADMIN' && role !== 'TEACHER') {
      return new NextResponse("Forbidden", { status: 403 })
    }

    const material = await prisma.material.findUnique({ where: { id } })
    if (!material) {
      return new NextResponse("Not Found", { status: 404 })
    }

    if (role !== 'ADMIN') {
      // Check ownership
      if (material.teacherId !== userId) {
        return new NextResponse("Forbidden", { status: 403 })
      }

      // Check teacher permission
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { canEditMaterials: true }
      })
      if (!user?.canEditMaterials) {
        return new NextResponse("Forbidden - Material editing is disabled", { status: 403 })
      }
    }

    const body = await req.json()
    const { title, description, subjectId, classId, status, attachments } = body

    const updated = await prisma.material.update({
      where: { id },
      data: {
        title: title ? censorText(title) : undefined,
        description: description !== undefined ? censorText(description) : undefined,
        subjectId: subjectId || undefined,
        classId: classId === "all" ? null : (classId !== undefined ? classId : undefined),
        status: status || undefined,
        attachments: attachments !== undefined ? attachments : undefined
      },
      include: { subject: true, class: true, teacher: true }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("[MATERIAL_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const role = (session.user as any).role
    const userId = (session.user as any).id

    if (role !== 'ADMIN' && role !== 'TEACHER') {
      return new NextResponse("Forbidden", { status: 403 })
    }

    const material = await prisma.material.findUnique({ where: { id } })
    if (!material) {
      return new NextResponse("Not Found", { status: 404 })
    }

    if (role !== 'ADMIN') {
      // Check ownership and permission
      if (material.teacherId !== userId) {
        return new NextResponse("Forbidden", { status: 403 })
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { canEditMaterials: true }
      })
      if (!user?.canEditMaterials) {
        return new NextResponse("Forbidden - Material editing is disabled", { status: 403 })
      }
    }

    await prisma.material.delete({ where: { id } })

    return new NextResponse("Deleted", { status: 200 })
  } catch (error) {
    console.error("[MATERIAL_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
