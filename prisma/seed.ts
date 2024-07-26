const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      {
        email: 'john.doe@example.com',
        name: 'John Doe',
        password: 'securepassword123',
      },
      {
        email: 'jane.doe@example.com',
        name: 'Jane Doe',
        password: 'anothersecurepassword',
      },
    ],
  });

  console.log('Users have been seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
