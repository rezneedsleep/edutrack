import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Menjalankan seeding akun demo...')
  const hashedPassword = await bcrypt.hash('password123', 10)

  // Buat Admin Demo
  const admin = await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: { password: hashedPassword },
    create: {
      email: 'admin@demo.com',
      name: 'Admin Demo',
      password: hashedPassword,
      role: Role.ADMIN,
      school: 'SMK Demo',
      nis: 'ADMIN001'
    },
  })
  console.log('✅ Admin Demo berhasil dibuat:', admin.email)

  // Buat Guru Demo
  const teacher = await prisma.user.upsert({
    where: { email: 'guru@demo.com' },
    update: { password: hashedPassword },
    create: {
      email: 'guru@demo.com',
      name: 'Guru Demo',
      password: hashedPassword,
      role: Role.TEACHER,
      school: 'SMK Demo',
      nis: 'GURU001',
      position: 'Wali Kelas X',
      affiliations: ['Matematika', 'Fisika']
    },
  })
  console.log('✅ Guru Demo berhasil dibuat:', teacher.email)

  // Buat Pelatih Demo
  const coach = await prisma.user.upsert({
    where: { email: 'pelatih@demo.com' },
    update: { password: hashedPassword },
    create: {
      email: 'pelatih@demo.com',
      name: 'Pelatih Demo',
      password: hashedPassword,
      role: Role.COACH,
      school: 'SMK Demo',
      nis: 'COACH001',
      position: 'Pembina Pramuka'
    },
  })
  console.log('✅ Pelatih Demo berhasil dibuat:', coach.email)

  // Buat Siswa Demo
  const student = await prisma.user.upsert({
    where: { email: 'siswa@demo.com' },
    update: { password: hashedPassword },
    create: {
      email: 'siswa@demo.com',
      name: 'Siswa Demo',
      password: hashedPassword,
      role: Role.STUDENT,
      school: 'SMK Demo',

      nis: '12345678',
      phone: '08123456789',
      gender: 'Laki-laki'
    },
  })
  console.log('✅ Siswa Demo berhasil dibuat:', student.email)

  console.log('🎉 Seeding selesai! Anda dapat login dengan akun-akun tersebut menggunakan password: password123')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
