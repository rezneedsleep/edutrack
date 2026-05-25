import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { censorText } from "@/lib/censor"

export async function GET(req: Request) {
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

    let materials;
    if (role === 'ADMIN') {
      materials = await prisma.material.findMany({
        include: { subject: true, class: true, teacher: true },
        orderBy: { createdAt: 'desc' }
      })
    } else {
      materials = await prisma.material.findMany({
        where: { teacherId: userId },
        include: { subject: true, class: true, teacher: true },
        orderBy: { createdAt: 'desc' }
      })
    }

    return NextResponse.json(materials)
  } catch (error) {
    console.error("[MATERIALS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function POST(req: Request) {
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
    const { title, description, subjectId, classId, status, attachments } = body

    if (!title || !subjectId) {
      return new NextResponse("Missing fields", { status: 400 })
    }

    const material = await prisma.material.create({
      data: {
        title: censorText(title),
        description: censorText(description || ""),
        subjectId,
        classId: classId === "all" || !classId ? null : classId,
        teacherId: userId,
        status: status || "BELUM_DITUGASKAN",
        attachments: attachments || []
      },
      include: { subject: true, class: true, teacher: true }
    })

    return NextResponse.json(material)
  } catch (error) {
    console.error("[MATERIALS_POST]", error)
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
        select: { canEditMaterials: true }
      })
      if (!user?.canEditMaterials) {
        return new NextResponse("Forbidden - Material editing is disabled", { status: 403 })
      }

      const materials = await prisma.material.findMany({
        where: { id: { in: ids } },
        select: { teacherId: true }
      })
      const isOwnerAll = materials.every(m => m.teacherId === userId)
      if (!isOwnerAll) {
        return new NextResponse("Forbidden - Unauthorized materials in bulk request", { status: 403 })
      }
    }

    await prisma.material.updateMany({
      where: { id: { in: ids } },
      data: { status }
    })

    return new NextResponse("Updated successfully", { status: 200 })
  } catch (error) {
    console.error("[MATERIALS_BULK_PATCH]", error)
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
        select: { canEditMaterials: true }
      })
      if (!user?.canEditMaterials) {
        return new NextResponse("Forbidden - Material editing is disabled", { status: 403 })
      }

      const materials = await prisma.material.findMany({
        where: { id: { in: ids } },
        select: { teacherId: true }
      })
      const isOwnerAll = materials.every(m => m.teacherId === userId)
      if (!isOwnerAll) {
        return new NextResponse("Forbidden", { status: 403 })
      }
    }

    await prisma.material.deleteMany({
      where: { id: { in: ids } }
    })

    return new NextResponse("Deleted successfully", { status: 200 })
  } catch (error) {
    console.error("[MATERIALS_BULK_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
