
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const assignments = await prisma.assignment.findMany({
    select: {
      id: true,
      title: true,
      teacherId: true,
      teacher: {
        select: {
          name: true,
          email: true
        }
      }
    }
  })
  console.log(JSON.stringify(assignments, null, 2))
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
