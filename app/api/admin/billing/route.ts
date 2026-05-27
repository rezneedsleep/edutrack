import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

// Create new billing
export async function POST(req: Request) {
  try {
    const session = await auth()
    const role = (session?.user as any)?.role
    if (role !== "ADMIN" && role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { studentId, title, description, amount, dueDate } = await req.json()

    if (!studentId || !title || !amount || !dueDate) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 })
    }

    await prisma.billing.create({
      data: {
        studentId,
        title,
        description,
        amount: Number(amount),
        dueDate: new Date(dueDate),
        status: "UNPAID"
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Create billing error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan internal" }, { status: 500 })
  }
}

// Update billing status (Verify payment)
export async function PATCH(req: Request) {
  try {
    const session = await auth()
    const role = (session?.user as any)?.role
    if (role !== "ADMIN" && role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, status } = await req.json()

    if (!id || !status) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 })
    }

    await prisma.billing.update({
      where: { id },
      data: { 
        status,
        paymentDate: status === "PAID" ? new Date() : null
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update billing error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan internal" }, { status: 500 })
  }
}

// Edit billing details
export async function PUT(req: Request) {
  try {
    const session = await auth()
    const role = (session?.user as any)?.role
    if (role !== "ADMIN" && role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, title, description, amount, dueDate, status } = await req.json()

    if (!id || !title || !amount || !dueDate) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 })
    }

    await prisma.billing.update({
      where: { id },
      data: {
        title,
        description,
        amount: Number(amount),
        dueDate: new Date(dueDate),
        status: status || undefined,
        paymentDate: status === "PAID" ? new Date() : undefined
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Edit billing error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan internal" }, { status: 500 })
  }
}

// Delete billing
export async function DELETE(req: Request) {
  try {
    const session = await auth()
    const role = (session?.user as any)?.role
    if (role !== "ADMIN" && role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, ids } = await req.json()

    if (ids && Array.isArray(ids)) {
      await prisma.billing.deleteMany({
        where: { id: { in: ids } }
      })
    } else if (id) {
      await prisma.billing.delete({
        where: { id }
      })
    } else {
      return NextResponse.json({ error: "ID tidak ditemukan" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete billing error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan internal" }, { status: 500 })
  }
}
