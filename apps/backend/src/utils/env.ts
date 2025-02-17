import { getTokenSecret } from "./token";

export function validateEnvironment() {
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
}
