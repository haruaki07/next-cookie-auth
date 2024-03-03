import { PrismaClient } from "@prisma/client";
import { hash } from "@node-rs/bcrypt";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { username: "john" },
    update: {},
    create: {
      name: "John Doe",
      username: "john",
      password: await hash("john123"),
    },
  });

  await prisma.user.upsert({
    where: { username: "jane" },
    update: {},
    create: {
      name: "Jane Doe",
      username: "jane",
      password: await hash("jane123"),
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
