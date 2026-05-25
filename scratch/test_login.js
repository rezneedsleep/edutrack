const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const email = "admin@davinn.net"
  const password = "davin123"
  
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    console.log("User not found")
    return
  }
  
  const valid = await bcrypt.compare(password, user.password)
  console.log(`Password is valid: ${valid}`)
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
