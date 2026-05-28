import { RBAC } from "@/lib/rbac"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session || !RBAC.isAdminLevel((session.user as any).role)) {
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
      bankName,
      bankAccount,
      bankAccountName,
      ppdbOpen,
      enableLibrary,
      enableSarpras,
      enableTataUsaha,
      enableBendahara,
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
        appName: 'EduTrack', 
        school, 
        timezone, 
        maintenanceMode, 
        disableRegistration,
        loginMaintenance,
        supportEmail, 
        backupEnabled, 
        securityLog,
        bankName,
        bankAccount,
        bankAccountName,
        ppdbOpen,
        enableLibrary,
        enableSarpras,
        enableTataUsaha,
        enableBendahara
      },
      create: { 
        id: 'global', 
        appName: 'EduTrack', 
        school, 
        timezone, 
        maintenanceMode, 
        disableRegistration,
        loginMaintenance,
        supportEmail, 
        backupEnabled, 
        securityLog,
        bankName,
        bankAccount,
        bankAccountName,
        ppdbOpen,
        enableLibrary,
        enableSarpras,
        enableTataUsaha,
        enableBendahara
      }
    })

    // Update all users and classes school name if changed
    if (school) {
      await prisma.$transaction([
        prisma.user.updateMany({
          data: { school: school }
        }),
        prisma.class.updateMany({
          data: { school: school }
        })
      ])
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("[ADMIN_SETTINGS_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
