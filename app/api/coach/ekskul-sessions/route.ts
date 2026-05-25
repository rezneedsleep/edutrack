import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()
  const role = (session?.user as any)?.role
  if (!session || (role !== 'TEACHER' && role !== 'COACH')) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const { extracurricularId, date, material, time, room } = await req.json()
    const item = await prisma.ekskulSession.create({
      data: {
        extracurricularId,
        date: new Date(date),
        material,
        time,
        room
      }
    })
    return NextResponse.json(item)
  } catch (error) {
    return new NextResponse("Error creating session", { status: 500 })
  }
}
