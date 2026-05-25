import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session || (session.user as any).role !== 'TEACHER') {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const userId = (session.user as any).id
    
    // Verify ownership
    const material = await prisma.material.findUnique({ where: { id } })
    if (!material || material.teacherId !== userId) {
      return new NextResponse("Not Found or Unauthorized", { status: 404 })
    }

    await prisma.material.delete({
      where: { id }
    })

    return new NextResponse("Deleted", { status: 200 })
  } catch (error) {
    console.error("[MATERIALS_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
