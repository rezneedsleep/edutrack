import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const teacher = await prisma.user.findFirst({ where: { email: 'guru@edutrack.com' } })
  const subject = await prisma.subject.findFirst({ where: { name: 'Matematika' } })
  
  if (teacher && subject) {
    await prisma.assignment.create({
      data: {
        title: 'Tugas Aljabar Linear',
        description: 'Kerjakan soal 1-5 di halaman 42. Pastikan menyertakan langkah-langkah penyelesaian.',
        subjectId: subject.id,
        teacherId: teacher.id,
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // 2 days from now
        status: 'PUBLISHED'
      }
    })
    await prisma.assignment.create({
      data: {
        title: 'Tugas Integral Tertentu',
        description: 'Baca materi Bab 4 dan kerjakan soal latihan di e-learning.',
        subjectId: subject.id,
        teacherId: teacher.id,
        deadline: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago (Late)
        status: 'PUBLISHED'
      }
    })
    console.log('✅ Assignments seeded!')
  }
}

main().finally(() => prisma.$disconnect())
