import type { UserRole } from "@workshop-graphql-rappa/graphql-schema";
import { jwtDecode } from "jwt-decode";

export type AuthPayload = {
  id: string;
  email: string;
  role: UserRole;
};

const TOKEN_KEY = "_rappa_tkn";

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getAuthInfo(): AuthPayload | null {
  const token = getAuthToken();
  if (!token) {
    return null;
  }

  return jwtDecode<AuthPayload>(token);
}
