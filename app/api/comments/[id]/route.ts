import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

// DELETE /api/comments/[id]
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const { id } = await params
    const userId = (session.user as any).id

    const comment = await prisma.comment.findUnique({ where: { id } })
    if (!comment) return new NextResponse("Not Found", { status: 404 })
    if (comment.authorId !== userId) return new NextResponse("Forbidden", { status: 403 })

    await prisma.comment.delete({ where: { id } })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[COMMENT_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// PATCH /api/comments/[id]
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const { id } = await params
    const { content } = await req.json()
    const userId = (session.user as any).id

    const comment = await prisma.comment.findUnique({ where: { id } })
    if (!comment) return new NextResponse("Not Found", { status: 404 })
    if (comment.authorId !== userId) return new NextResponse("Forbidden", { status: 403 })

    const updated = await prisma.comment.update({
      where: { id },
      data: { content },
      include: { author: true }
    })
    return NextResponse.json(updated)
  } catch (error) {
    console.error("[COMMENT_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
