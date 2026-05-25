const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function check() {
  const subjects = await prisma.subject.findMany({
    include: { teacher: true }
  })
  console.log("=== SUBJECTS AND TEACHERS ===")
  subjects.forEach(s => {
    console.log(`Subject: ${s.name} | Teacher: ${s.teacher?.name} (ID: ${s.teacherId})`)
  })
  
  const users = await prisma.user.findMany({
    where: { role: 'TEACHER' }
  })
  console.log("\n=== ALL TEACHERS ===")
  users.forEach(u => {
    console.log(`Teacher: ${u.name} | ID: ${u.id}`)
  })
}

check()
