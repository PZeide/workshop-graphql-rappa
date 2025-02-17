import { User as PrismaUser, UserRole as PrismaUserRole } from "@prisma/client";
import {
  User as GQLUser,
  UserRole as GQLUserRole,
} from "@workshop-graphql-rappa/graphql-schema";

export function toGQLUser(user: PrismaUser): Partial<GQLUser> {
  const roleMappings: Record<PrismaUserRole, GQLUserRole> = {
    ADMIN: GQLUserRole.Admin,
    USER: GQLUserRole.User,
  };

  return {
    id: user.id,
    email: user.email,
    role: roleMappings[user.role],
  };
}
