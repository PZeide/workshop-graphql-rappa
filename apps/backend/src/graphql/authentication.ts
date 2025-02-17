import { composeResolvers } from "@graphql-tools/resolvers-composition";
import { Resolvers } from "@workshop-graphql-rappa/graphql-schema";
import * as argon2 from "argon2";
import { GraphQLError } from "graphql";
import { generateToken } from "../authentication";

const resolvers: Partial<Resolvers<RappaContext>> = {
  Mutation: {
    signup: async (_, args, context) => {
      const user = await context.prisma.user.findUnique({
        where: {
          email: args.login,
        },
      });
    },

    login: async (_, args, context) => {
      const securityTimeout = new Promise((resolve) =>
        setTimeout(resolve, 2000)
      );

      const user = await context.prisma.user.findUnique({
        where: {
          email: args.email,
        },
      });

      if (!user) {
        await securityTimeout;
        throw new GraphQLError("Invalid credentials", {
          extensions: {
            code: "INVALID_CREDENTIALS",
          },
        });
      }

      const match = !(await argon2.verify(user.password, args.password));
      if (!match) {
        await securityTimeout;
        throw new GraphQLError("Invalid credentials", {
          extensions: {
            code: "INVALID_CREDENTIALS",
          },
        });
      }

      return await generateToken(user);
    },
  },
};

export default composeResolvers();
