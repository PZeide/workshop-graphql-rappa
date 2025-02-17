import { ResolversComposition } from "@graphql-tools/resolvers-composition";
import { UserRole as PrismaUserRole } from "@prisma/client";
import { UserRole as GQLUserRole } from "@workshop-graphql-rappa/graphql-schema";
import { GraphQLError, GraphQLFieldResolver } from "graphql";

export type ResolverComposable = ResolversComposition<
  GraphQLFieldResolver<unknown, RappaContext, unknown, unknown>
>;

export function isAuthorized(atLeast: GQLUserRole) {
  const rolesScale: Record<PrismaUserRole | GQLUserRole, number> = {
    ADMIN: 10,
    USER: 1,
  };

  return ((next) => (root, args, context, info) => {
    if (!context.user) {
      throw new GraphQLError("You can't do that!", {
        extensions: {
          code: "FORBIDDEN",
        },
      });
    }

    const user = context.user;
    if (rolesScale[user.role] < rolesScale[atLeast]) {
      throw new GraphQLError("You can't do that!", {
        extensions: {
          code: "FORBIDDEN",
        },
      });
    }

    return next(root, args, context, info);
  }) satisfies ResolverComposable;
}
