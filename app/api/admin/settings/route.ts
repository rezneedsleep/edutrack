import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { 
      appName, 
      school, 
      timezone, 
      maintenanceMode, 
      disableRegistration,
      loginMaintenance,
      supportEmail, 
      backupEnabled, 
      securityLog,
      confirmPassword
    } = await req.json()

    if (!confirmPassword) {
      return new NextResponse("Password konfirmasi wajib diisi.", { status: 400 })
    }

    // Fetch the admin user to verify password
    const adminUser = await prisma.user.findUnique({
      where: { id: (session.user as any).id }
    })

    if (!adminUser || !adminUser.password) {
      return new NextResponse("Akun admin tidak ditemukan.", { status: 400 })
    }

    const isPasswordValid = await bcrypt.compare(confirmPassword, adminUser.password)
    if (!isPasswordValid) {
      return new NextResponse("Password konfirmasi salah!", { status: 400 })
    }

    const settings = await prisma.settings.upsert({
      where: { id: 'global' },
      update: { 
        appName, 
        school, 
        timezone, 
        maintenanceMode, 
        disableRegistration,
        loginMaintenance,
        supportEmail, 
        backupEnabled, 
        securityLog 
      },
      create: { 
        id: 'global', 
        appName, 
        school, 
        timezone, 
        maintenanceMode, 
        disableRegistration,
        loginMaintenance,
        supportEmail, 
        backupEnabled, 
        securityLog 
      }
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error("[ADMIN_SETTINGS_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
