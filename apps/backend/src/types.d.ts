interface RappaContext {
  prisma: import("@prisma/client").PrismaClient;
  user?: import("@prisma/client").User;
}
