import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const body = await req.json()
    const { name, school, nis, phone, gender, address } = body
    const userId = (session.user as any).id

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        school,
        nis,
        phone,
        gender,
        address
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("[USER_SETTINGS_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
