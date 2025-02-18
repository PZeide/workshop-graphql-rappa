import { ApolloError } from "@apollo/client";

export function extractErrorMessage(e: unknown): string {
  if (e instanceof ApolloError) {
    return e.message;
  }

  return "Erreur inconnue.";
}
