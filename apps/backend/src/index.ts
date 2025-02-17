import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { schame as typeDefs } from "@workshop-graphql-rappa/graphql-schema";
import { PrismaClient } from "@prisma/client";
import { getTokenSecret, getUserFromRequest } from "./authentication";

if (!import.meta.env.DATABASE_URL) {
  console.error("Missing DATABASE_URL environment variable!");
  process.exit(1);
}

if (!import.meta.env.TOKEN_SECRET) {
  console.error("Missing TOKEN_SECRET environment variable!");
  process.exit(1);
}

if (getTokenSecret().length < 64) {
  console.warn(
    "TOKEN_SECRET is insecure, use a token of at least 64 characters!"
  );
}

const server = new ApolloServer<RappaContext>({
  typeDefs,
  resolvers: [],
});

const prisma = new PrismaClient();

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => ({
    prisma: prisma,
    user: await getUserFromRequest(req, prisma),
  }),
});

console.log(`🚀 Server ready at: ${url}`);
