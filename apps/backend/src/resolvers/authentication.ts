import { Resolvers } from "@workshop-graphql-rappa/graphql-schema";
import * as argon2 from "argon2";
import { GraphQLError } from "graphql";
import { generateToken } from "../utils/token";

const resolvers: Partial<Resolvers<RappaContext>> = {
  Mutation: {
    signup: async (_parent, args, context) => {
      const existingUser = await context.prisma.user.findUnique({
        where: { email: args.email },
      });

      if (existingUser) {
        throw new GraphQLError(
          "Un utilisateur existe déjà avec cette adresse mail.",
          {
            extensions: {
              code: "CLIENT_USER_ALREADY_EXISTS",
            },
          }
        );
      }

      const passwordHash = await argon2.hash(args.password);
      const user = await context.prisma.user.create({
        data: {
          email: args.email,
          password: passwordHash,
          role: "USER",
        },
      });

      return await generateToken(user);
    },

    login: async (_parent, args, context) => {
      const securityTimeout = new Promise((resolve) =>
        setTimeout(resolve, 2000)
      );

      const user = await context.prisma.user.findUnique({
        where: { email: args.email },
      });

      if (!user) {
        await securityTimeout;
        throw new GraphQLError("Invalid credentials", {
          extensions: {
            code: "CLIENT_INVALID_CREDENTIALS",
          },
        });
      }

      const match = await argon2.verify(user.password, args.password);
      if (!match) {
        await securityTimeout;
        throw new GraphQLError("Invalid credentials", {
          extensions: {
            code: "CLIENT_INVALID_CREDENTIALS",
          },
        });
      }

      return await generateToken(user);
    },
  },
};

export default resolvers;
