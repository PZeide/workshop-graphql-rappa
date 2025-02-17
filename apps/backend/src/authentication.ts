import { PrismaClient, User } from "@prisma/client";
import { jwtVerify, SignJWT } from "jose";
import { IncomingMessage } from "node:http";

export function getTokenSecret(): string {
  if (!import.meta.env.TOKEN_SECRET) {
    throw Error("Missing TOKEN_SECRET environment variable!");
  }

  return import.meta.env.TOKEN_SECRET;
}

export function getEncodedTokenSecret(): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(getTokenSecret());
}

export async function getUserFromRequest(
  request: IncomingMessage,
  prisma: PrismaClient
): Promise<User | undefined> {
  const jwt = request.headers["authorization"];

  if (!jwt || !jwt.startsWith("Bearer ")) {
    return undefined;
  }

  const token = jwt.split("Bearer ", 2)[1];
  const verified = await jwtVerify(token, getEncodedTokenSecret());
  const userId = verified.payload.id;

  if (!userId) {
    return undefined;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: userId.toString(),
    },
  });

  return user ?? undefined;
}

export async function generateToken(user: User): Promise<string> {
  return await new SignJWT({ id: user.id })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(getEncodedTokenSecret());
}
