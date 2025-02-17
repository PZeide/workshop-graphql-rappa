import { ContextFunction } from "@apollo/server";
import { PrismaClient } from "@prisma/client";
import { getUserFromRequest } from "./utils/token";
import { ExpressContextFunctionArgument } from "@apollo/server/express4";

type RappaContextFunction = ContextFunction<
  [ExpressContextFunctionArgument],
  RappaContext
>;

// Use the same Prisma Client for every requests
const prisma = new PrismaClient();

export default (async ({ req }) => ({
  prisma: prisma,
  user: await getUserFromRequest(req, prisma),
})) satisfies RappaContextFunction;
