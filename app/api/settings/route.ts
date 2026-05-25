import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const settings = await prisma.settings.findUnique({
      where: { id: 'global' },
      select: {
        maintenanceMode: true,
        disableRegistration: true,
        loginMaintenance: true,
      }
    })
    return NextResponse.json(settings || {
      maintenanceMode: false,
      disableRegistration: false,
      loginMaintenance: false,
    })
  } catch (error) {
    return NextResponse.json({
      maintenanceMode: false,
      disableRegistration: false,
      loginMaintenance: false,
    })
  }
}
