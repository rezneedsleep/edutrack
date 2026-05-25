const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, isActive: true }
  });
  console.log("USERS:");
  console.log(users);

  const settings = await prisma.settings.findMany();
  console.log("SETTINGS:");
  console.log(settings);

  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
