const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('davin123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'admin@davinn.net' },
    update: {
      password: passwordHash,
      role: 'ADMIN',
      isActive: true
    },
    create: {
      email: 'admin@davinn.net',
      name: 'Admin Davin',
      password: passwordHash,
      role: 'ADMIN',
      isActive: true
    }
  });

  console.log("Admin user updated/created:", user);
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
