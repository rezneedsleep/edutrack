import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { isActive } = await req.json()
    const userId = params.id

    const user = await prisma.user.update({
      where: { id: userId },
      data: { isActive }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("[ADMIN_USER_STATUS_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
