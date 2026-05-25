const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const teachers = await prisma.user.findMany({
    where: { role: 'TEACHER' },
    select: { email: true, name: true }
  });
  console.log(JSON.stringify(teachers, null, 2));
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
