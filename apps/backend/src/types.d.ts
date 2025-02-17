interface RappaContext {
  prisma: import("@prisma/client").PrismaClient;
  pubsub: import("graphql-subscriptions").PubSub;
  user?: import("@prisma/client").User;
}
