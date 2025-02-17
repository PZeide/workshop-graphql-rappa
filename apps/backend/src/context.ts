import { PrismaClient } from "@prisma/client";
import http from "http";
import { getUserFromJwt } from "./utils/token";
import { PubSub } from "graphql-subscriptions";

// Use the same Prisma Client for every requests
const prisma = new PrismaClient();

// Used for subscriptions
const pubsub = new PubSub();

export async function contextFromRequest(
  request: http.IncomingMessage
): Promise<RappaContext> {
  return {
    prisma: prisma,
    pubsub: pubsub,
    user: await getUserFromJwt(request.headers["authorization"], prisma),
  };
}

export async function contextFromConnectionParams(
  connectionParams: Record<string, unknown>
): Promise<RappaContext> {
  return {
    prisma: prisma,
    pubsub: pubsub,
    user: await getUserFromJwt(
      connectionParams["Authorization"]?.toString(),
      prisma
    ),
  };
}
