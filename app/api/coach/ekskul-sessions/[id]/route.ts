import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  const role = (session?.user as any)?.role
  if (!session || (role !== 'TEACHER' && role !== 'COACH')) return new NextResponse("Unauthorized", { status: 401 })

  try {
    await prisma.ekskulSession.delete({ where: { id } })
    return new NextResponse("Deleted", { status: 200 })
  } catch (error) {
    return new NextResponse("Error deleting session", { status: 500 })
  }
}
