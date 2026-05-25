import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function main() {
  const subjects = await prisma.subject.findMany()
  console.log("TOTAL SUBJECTS:", subjects.length)
  console.log("SUBJECT NAMES:", subjects.map(s => s.name))
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
