
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const id = "cmo5ug1o90001l00kffa42ni0" // TEST-TUGAS ID
  try {
    console.log(`Attempting to delete assignment ${id}...`)
    const deleted = await prisma.assignment.delete({
      where: { id }
    })
    console.log("Deleted successfully:", deleted)
  } catch (error) {
    console.error("Delete failed with error:", error)
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
