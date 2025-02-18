import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

await prisma.user.create({
  data: {
    email: "default@rappa.fr",
    password: await argon2.hash("rappa"),
    role: "USER",
  },
});

await prisma.user.create({
  data: {
    email: "admin@rappa.fr",
    password: await argon2.hash("rappa-admin"),
    role: "ADMIN",
  },
});

await prisma.$disconnect();
