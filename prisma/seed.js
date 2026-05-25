const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🧹 Cleaning existing data...')
  // Delete in dependency order
  await prisma.assignmentSubmission.deleteMany()
  await prisma.assignment.deleteMany()
  await prisma.classSchedule.deleteMany()
  await prisma.classTeacher.deleteMany()
  await prisma.classSubject.deleteMany()
  await prisma.progressLog.deleteMany()
  await prisma.studyGoal.deleteMany()
  await prisma.schedule.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.achievement.deleteMany()
  await prisma.operator.deleteMany()
  await prisma.topic.deleteMany()
  await prisma.subject.deleteMany()
  await prisma.user.deleteMany()
  await prisma.class.deleteMany()
  await prisma.settings.deleteMany()
  console.log('✅ Cleaned.')

  // ── Passwords ──
  const adminPass = await bcrypt.hash('davin123', 10)
  const defaultPass = await bcrypt.hash('password123', 10)

  // ── Class ──
  const xrpl1 = await prisma.class.create({
    data: { name: 'X RPL 1', school: 'SMKN 13 Bandung', gradeYear: 10 },
  })
  console.log('📚 Class created:', xrpl1.name)

  // ── Users ──
  const admin = await prisma.user.create({
    data: {
      name: 'Admin Davinn', email: 'admin@davinn.net',
      password: adminPass, role: 'ADMIN', school: 'SMKN 13 Bandung',
    },
  })

  const odang = await prisma.user.create({
    data: {
      name: 'Odang', email: 'odang@gmail.com',
      password: defaultPass, role: 'TEACHER', school: 'SMKN 13 Bandung',
    },
  })

  const samsu = await prisma.user.create({
    data: {
      name: 'Samsu', email: 'samsu@gmail.com',
      password: defaultPass, role: 'TEACHER', school: 'SMKN 13 Bandung',
    },
  })

  const haziq = await prisma.user.create({
    data: {
      name: 'Haziq', email: 'haziq@edutrack.com',
      password: defaultPass, role: 'STUDENT', school: 'SMKN 13 Bandung',
      classId: xrpl1.id,
    },
  })

  console.log('👤 Users created: Admin Davinn, Odang, Samsu, Haziq')

  // ── Subjects ──
  const ipas = await prisma.subject.create({
    data: {
      name: 'IPAS', color: '#10B981', icon: 'flask',
      description: 'Ilmu Pengetahuan Alam dan Sosial',
      teacherId: odang.id,
    },
  })

  const pai = await prisma.subject.create({
    data: {
      name: 'PAI', color: '#8B5CF6', icon: 'book-open',
      description: 'Pendidikan Agama Islam',
      teacherId: samsu.id,
    },
  })

  console.log('📖 Subjects created: IPAS, PAI')

  // ── Link class ↔ subject ──
  await prisma.classSubject.createMany({
    data: [
      { classId: xrpl1.id, subjectId: ipas.id },
      { classId: xrpl1.id, subjectId: pai.id },
    ],
  })

  // ── ClassTeacher ──
  await prisma.classTeacher.createMany({
    data: [
      { classId: xrpl1.id, teacherId: odang.id, subjectId: ipas.id },
      { classId: xrpl1.id, teacherId: samsu.id, subjectId: pai.id },
    ],
  })

  // ── Topics (8 per subject) ──
  const ipasTopics = [
    { name: 'Sistem Tata Surya', description: 'Mempelajari planet, bintang, dan benda langit', estimatedHours: 2 },
    { name: 'Ekosistem dan Lingkungan', description: 'Interaksi makhluk hidup dengan lingkungannya', estimatedHours: 3 },
    { name: 'Energi dan Perubahannya', description: 'Bentuk-bentuk energi dan konversi energi', estimatedHours: 2 },
    { name: 'Zat dan Perubahannya', description: 'Sifat fisika dan kimia zat', estimatedHours: 3 },
    { name: 'Genetika Dasar', description: 'Pewarisan sifat dan DNA', estimatedHours: 3 },
    { name: 'Listrik dan Magnet', description: 'Rangkaian listrik dan medan magnet', estimatedHours: 2 },
    { name: 'Gelombang dan Bunyi', description: 'Sifat gelombang dan fenomena bunyi', estimatedHours: 2 },
    { name: 'Perubahan Iklim', description: 'Dampak dan mitigasi perubahan iklim global', estimatedHours: 2 },
  ]

  const paiTopics = [
    { name: 'Al-Quran dan Hadits', description: 'Sumber hukum Islam pertama dan kedua', estimatedHours: 3 },
    { name: 'Aqidah Akhlak', description: 'Dasar-dasar keimanan dan akhlak mulia', estimatedHours: 2 },
    { name: 'Fiqih Ibadah', description: 'Tata cara ibadah shalat, puasa, zakat', estimatedHours: 3 },
    { name: 'Sejarah Kebudayaan Islam', description: 'Perkembangan peradaban Islam', estimatedHours: 2 },
    { name: 'Tafsir Surah Pendek', description: 'Memahami makna surah-surah pendek', estimatedHours: 2 },
    { name: 'Muamalah', description: 'Aturan interaksi sosial dalam Islam', estimatedHours: 2 },
    { name: 'Akhlak Terpuji', description: 'Sifat-sifat terpuji dan contoh dalam kehidupan', estimatedHours: 2 },
    { name: 'Toleransi Beragama', description: 'Menghargai perbedaan dan keragaman', estimatedHours: 2 },
  ]

  const createdIpasTopics = []
  for (let i = 0; i < ipasTopics.length; i++) {
    const t = await prisma.topic.create({
      data: { ...ipasTopics[i], subjectId: ipas.id, order: i + 1 },
    })
    createdIpasTopics.push(t)
  }

  const createdPaiTopics = []
  for (let i = 0; i < paiTopics.length; i++) {
    const t = await prisma.topic.create({
      data: { ...paiTopics[i], subjectId: pai.id, order: i + 1 },
    })
    createdPaiTopics.push(t)
  }

  console.log('📝 Topics created: 8 IPAS + 8 PAI')

  // ── Class Schedule ──
  await prisma.classSchedule.createMany({
    data: [
      // IPAS: Monday + Wednesday 08:00-09:30
      { classId: xrpl1.id, subjectId: ipas.id, teacherId: odang.id, dayOfWeek: 0, startTime: '08:00', endTime: '09:30', room: 'Lab IPA' },
      { classId: xrpl1.id, subjectId: ipas.id, teacherId: odang.id, dayOfWeek: 2, startTime: '08:00', endTime: '09:30', room: 'Lab IPA' },
      // PAI: Tuesday + Thursday 10:00-11:30
      { classId: xrpl1.id, subjectId: pai.id, teacherId: samsu.id, dayOfWeek: 1, startTime: '10:00', endTime: '11:30', room: 'R. Agama' },
      { classId: xrpl1.id, subjectId: pai.id, teacherId: samsu.id, dayOfWeek: 3, startTime: '10:00', endTime: '11:30', room: 'R. Agama' },
    ],
  })
  console.log('📅 Class schedules created')

  // ── Assignments (3 per subject: 2 published, 1 draft) ──
  const now = new Date()

  const ipasAssignments = [
    { title: 'Laporan Pengamatan Tata Surya', description: 'Buat laporan pengamatan posisi planet selama 1 minggu. Sertakan sketsa dan data pengamatan.', status: 'PUBLISHED', deadline: new Date(now.getTime() + 7 * 86400000) },
    { title: 'Praktikum Rangkaian Listrik', description: 'Rangkai seri dan paralel, ukur tegangan dan arus, buat laporan. Foto dokumentasi wajib dilampirkan.', status: 'PUBLISHED', deadline: new Date(now.getTime() + 14 * 86400000) },
    { title: 'Essay Perubahan Iklim', description: 'Tulis essay 500 kata tentang dampak perubahan iklim di Indonesia dan solusi yang bisa dilakukan siswa.', status: 'DRAFT', deadline: new Date(now.getTime() + 21 * 86400000) },
  ]

  const paiAssignments = [
    { title: 'Hafalan Surah Al-Mulk', description: 'Hafalkan Surah Al-Mulk ayat 1-15 dan rekam video hafalan kamu.', status: 'PUBLISHED', deadline: new Date(now.getTime() + 5 * 86400000) },
    { title: 'Makalah Sejarah Peradaban Islam', description: 'Tulis makalah tentang kontribusi peradaban Islam terhadap ilmu pengetahuan dunia. Minimal 3 halaman.', status: 'PUBLISHED', deadline: new Date(now.getTime() + 10 * 86400000) },
    { title: 'Presentasi Toleransi Beragama', description: 'Buat presentasi kelompok tentang contoh toleransi beragama di lingkungan sekolah.', status: 'DRAFT', deadline: new Date(now.getTime() + 25 * 86400000) },
  ]

  const createdAssignments = []
  for (const a of ipasAssignments) {
    const created = await prisma.assignment.create({
      data: { ...a, subjectId: ipas.id, teacherId: odang.id, classId: xrpl1.id, maxScore: 100 },
    })
    createdAssignments.push(created)
  }
  for (const a of paiAssignments) {
    const created = await prisma.assignment.create({
      data: { ...a, subjectId: pai.id, teacherId: samsu.id, classId: xrpl1.id, maxScore: 100 },
    })
    createdAssignments.push(created)
  }
  console.log('📋 Assignments created: 3 IPAS + 3 PAI')

  // ── Haziq submissions (1 graded, 1 ungraded) ──
  // Graded: first IPAS assignment
  await prisma.assignmentSubmission.create({
    data: {
      assignmentId: createdAssignments[0].id, // Laporan Tata Surya
      studentId: haziq.id,
      content: 'Berdasarkan pengamatan saya selama seminggu, posisi Venus terlihat di barat saat senja. Jupiter terlihat terang di timur setelah pukul 21:00. Mars tidak terlihat karena cuaca mendung di hari ke-3 dan ke-4.',
      score: 85,
      feedback: 'Bagus! Data pengamatan cukup detail. Sketsa bisa lebih rapi lagi. Terus tingkatkan!',
      gradedAt: new Date(now.getTime() - 2 * 86400000),
    },
  })

  // Ungraded: first PAI assignment
  await prisma.assignmentSubmission.create({
    data: {
      assignmentId: createdAssignments[3].id, // Hafalan Al-Mulk
      studentId: haziq.id,
      content: 'Video hafalan sudah direkam. Saya hafal sampai ayat 12 dengan lancar, ayat 13-15 masih perlu latihan lagi.',
    },
  })
  console.log('📤 Submissions created: 2 (1 graded, 1 ungraded)')

  // ── ProgressLog for Haziq — 14 days ──
  const progressData = []
  for (let dayOffset = 13; dayOffset >= 0; dayOffset--) {
    const logDate = new Date(now.getTime() - dayOffset * 86400000)
    logDate.setHours(8, 0, 0, 0) // morning study

    // Alternate between IPAS and PAI, skip some weekend days
    const dayOfWeek = logDate.getDay() // 0=Sun 6=Sat
    if (dayOfWeek === 0) continue // skip Sunday

    // IPAS log
    const ipasTopicIdx = Math.min(dayOffset % createdIpasTopics.length, createdIpasTopics.length - 1)
    progressData.push({
      userId: haziq.id,
      subjectId: ipas.id,
      topicId: createdIpasTopics[ipasTopicIdx].id,
      duration: 30 + Math.floor(Math.random() * 45), // 30-75 min
      difficulty: 2 + Math.floor(Math.random() * 3),  // 2-4
      notes: `Belajar ${createdIpasTopics[ipasTopicIdx].name}`,
      completed: dayOffset > 8, // older topics "completed"
      date: logDate,
    })

    // PAI log (every other day or so)
    if (dayOffset % 2 === 0) {
      const paiTopicIdx = Math.min(Math.floor(dayOffset / 2) % createdPaiTopics.length, createdPaiTopics.length - 1)
      const paiLogDate = new Date(logDate.getTime())
      paiLogDate.setHours(14, 0, 0, 0) // afternoon
      progressData.push({
        userId: haziq.id,
        subjectId: pai.id,
        topicId: createdPaiTopics[paiTopicIdx].id,
        duration: 25 + Math.floor(Math.random() * 35), // 25-60 min
        difficulty: 2 + Math.floor(Math.random() * 2),
        notes: `Belajar ${createdPaiTopics[paiTopicIdx].name}`,
        completed: dayOffset > 10,
        date: paiLogDate,
      })
    }
  }

  await prisma.progressLog.createMany({ data: progressData })
  console.log(`📊 ProgressLogs created: ${progressData.length} entries for Haziq`)

  // ── Notifications for Haziq ──
  await prisma.notification.createMany({
    data: [
      {
        userId: haziq.id, type: 'ASSIGNMENT_NEW',
        title: 'Tugas Baru: Laporan Tata Surya',
        message: 'Pak Odang memberikan tugas IPAS baru. Deadline: 7 hari lagi.',
        createdAt: new Date(now.getTime() - 6 * 86400000),
      },
      {
        userId: haziq.id, type: 'ASSIGNMENT_GRADED',
        title: 'Tugas Dinilai: Laporan Tata Surya',
        message: 'Tugasmu "Laporan Pengamatan Tata Surya" sudah dinilai. Nilai: 85/100. Bagus!',
        createdAt: new Date(now.getTime() - 2 * 86400000),
      },
      {
        userId: haziq.id, type: 'ACHIEVEMENT',
        title: '🔥 Streak 7 Hari!',
        message: 'Keren! Kamu sudah belajar 7 hari berturut-turut. Pertahankan!',
        createdAt: new Date(now.getTime() - 3 * 86400000),
      },
      {
        userId: haziq.id, type: 'SYSTEM',
        title: 'Selamat Datang di EduTrack',
        message: 'Hai Haziq! Selamat datang di EduTrack. Atur jadwal belajarmu dan mulai tracking progress!',
        read: true,
        createdAt: new Date(now.getTime() - 14 * 86400000),
      },
      {
        userId: haziq.id, type: 'ASSIGNMENT_DUE',
        title: 'Pengingat: Hafalan Al-Mulk',
        message: 'Tugas PAI "Hafalan Surah Al-Mulk" jatuh tempo dalam 5 hari lagi.',
        createdAt: new Date(now.getTime() - 1 * 86400000),
      },
    ],
  })
  console.log('🔔 Notifications created: 5 for Haziq')

  // ── StudyGoal for Haziq ──
  const monday = new Date(now)
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7))
  monday.setHours(0, 0, 0, 0)

  await prisma.studyGoal.createMany({
    data: [
      { userId: haziq.id, subjectId: ipas.id, targetHours: 5, currentHours: 3.2, weekStart: monday },
      { userId: haziq.id, subjectId: pai.id, targetHours: 4, currentHours: 2.1, weekStart: monday },
    ],
  })
  console.log('🎯 Study goals created')

  // ── Settings ──
  await prisma.settings.create({
    data: { id: 'global', appName: 'EduTrack', school: 'SMKN 13 Bandung', timezone: 'Asia/Jakarta' },
  })
  console.log('⚙️  Settings created')

  // ── Summary ──
  console.log('\n═══════════════════════════════════════')
  console.log('🎉 SEED COMPLETE!')
  console.log('═══════════════════════════════════════')
  console.log('')
  console.log('  ADMIN:')
  console.log('    Email:    admin@davinn.net')
  console.log('    Password: davin123')
  console.log('')
  console.log('  GURU IPAS:')
  console.log('    Email:    odang@gmail.com')
  console.log('    Password: password123')
  console.log('')
  console.log('  GURU PAI:')
  console.log('    Email:    samsu@gmail.com')
  console.log('    Password: password123')
  console.log('')
  console.log('  SISWA:')
  console.log('    Email:    haziq@edutrack.com')
  console.log('    Password: password123')
  console.log('')
  console.log('═══════════════════════════════════════')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
