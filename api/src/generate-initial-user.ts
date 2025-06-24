import { Prisma, PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";
import { bootstrap } from "./bootstrap";
import { ConfigService } from "@nestjs/config";

async function generateInitialUser() {
  const app = await bootstrap();

  const prisma = new PrismaClient();
  prisma.$connect();

  // Check if any users exist
  const userCount = await prisma.user.count();
  if (userCount > 0) {
    console.log("Users already exist, skipping initial user creation");
    await prisma.$disconnect();
    return;
  }

  const configService = app.get(ConfigService);
  const initialUserId = configService.get<string>("INITIAL_USER_ID");
  const initialUserEmail = configService.get<string>("INITIAL_USER_EMAIL");
  const initialUserPassword = configService.get<string>(
    "INITIAL_USER_PASSWORD"
  );

  if (!initialUserId || !initialUserEmail || !initialUserPassword) {
    throw new Error(
      [
        "Missing required environment variables for initial user creation.",
        "To auto-generate an admin user (when the database is empty), you must set the following variables:",
        "",
        "  INITIAL_USER_ID=<your-initial-user-id>",
        "  INITIAL_USER_EMAIL=<your-initial-user-email>",
        "  INITIAL_USER_PASSWORD=<your-initial-user-password>",
        "",
        "Example:",
        "  INITIAL_USER_ID=admin-uuid-1234",
        "  INITIAL_USER_EMAIL=admin@example.com",
        "  INITIAL_USER_PASSWORD=supersecretpassword",
        "",
      ].join("\n")
    );
  }

  const hashedPasswod = await argon2.hash(initialUserPassword);

  const user: Prisma.UserCreateInput = {
    id: initialUserId,
    email: initialUserEmail,
    passwordHash: hashedPasswod,
    firstName: "Super",
    lastName: "User",
    role: "ADMIN",
    isEmailVerified: true,
    twoFactorEnabled: false,
  };

  await prisma.user.upsert({
    where: { id: user.id },
    create: { ...user },
    update: {},
  });

  await prisma.$disconnect();
}

generateInitialUser();
