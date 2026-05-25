import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { name, email, password, school, subjectSpecialty } = data

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ message: 'Email sudah terdaftar' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'TEACHER',
        school,
        classRoom: subjectSpecialty, // Repurposing classRoom for specialty in teacher role
      }
    })

    return NextResponse.json({ message: 'Pendaftaran berhasil', userId: user.id }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Terjadi kesalahan sistem' }, { status: 500 })
  }
}
