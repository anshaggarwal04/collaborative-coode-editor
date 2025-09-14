import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // 1. Create a test user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const user = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      username: "admin",
      email: "admin@example.com",
      password: hashedPassword,
    },
  });

  // 2. Create a sample room owned by this user
  const room = await prisma.room.upsert({
    where: { name: "demo-room" },
    update: {},
    create: {
      name: "demo-room",
      createdBy: user.id,
    },
  });

  // 3. Add the user as participant
  await prisma.roomUser.upsert({
    where: {
      roomId_userId: {
        roomId: room.id,
        userId: user.id,
      },
    },
    update: {},
    create: {
      roomId: room.id,
      userId: user.id,
    },
  });

  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });