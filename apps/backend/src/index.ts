import { ApolloServer } from "@apollo/server";
import express from "express";
import http from "http";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import { schame as typeDefs } from "@workshop-graphql-rappa/graphql-schema";
import { PrismaClient } from "@prisma/client";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { getUserFromRequest } from "./utils/token";
import { authDirectiveTransformer } from "./directives/auth-directive";
import { GraphQLDateTime } from "graphql-scalars";
import { checkEnv } from "./utils/env";

import authenticationResolvers from "./resolvers/authentication";
import projectResolvers from "./resolvers/projects";

checkEnv();

const scalarResolvers = {
  DateTime: GraphQLDateTime,
};

const schema = authDirectiveTransformer(
  makeExecutableSchema({
    typeDefs,
    resolvers: [scalarResolvers, authenticationResolvers, projectResolvers],
  })
);

const app = express();

const prisma = new PrismaClient();

const gqlServer = new ApolloServer<RappaContext>({
  schema: authDirectiveTransformer(schema),
  csrfPrevention: true,
});

await server.start();

app.use(
  "/graphql",
  cors<cors.CorsRequest>(),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => ({
      prisma: prisma,
      user: await getUserFromRequest(req, prisma),
    }),
  })
);

Bun.serve({
  websocket: makeHa,
});

console.log(`🚀 Server ready at: ${url}`);
