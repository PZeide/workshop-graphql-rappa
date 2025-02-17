import { Project, Resolvers } from "@workshop-graphql-rappa/graphql-schema";
import { GraphQLError } from "graphql";
import { toGQLUser } from "../utils/mapping";

const PROJECT_ADDED_EVENT = "projectAdded";
const PROJECT_DELETED_EVENT = "projectDeleted";

const resolvers: Partial<Resolvers<RappaContext>> = {
  Query: {
    projects: async (_parent, _args, context) => {
      return await context.prisma.project.findMany();
    },

    project: async (_parent, args, context) => {
      const project = await context.prisma.project.findUnique({
        where: { id: args.id },
      });

      if (!project) {
        throw new GraphQLError("Ce projet n'existe pas.", {
          extensions: {
            code: "CLIENT_PROJECT_MISSING",
          },
        });
      }

      return project;
    },
  },

  Mutation: {
    createProject: async (_parent, args, context) => {
      const existingProject = await context.prisma.project.findUnique({
        where: { name: args.project.name },
      });

      if (existingProject) {
        throw new GraphQLError("Un projet avec un nom similaire existe déjà.", {
          extensions: {
            code: "CLIENT_PROJECT_ALREADY_EXISTS",
          },
        });
      }

      const now = new Date();
      const project = await context.prisma.project.create({
        data: {
          name: args.project.name,
          description: args.project.description,
          owner: { connect: context.user },
          updatedAt: now,
          createdAt: now,
        },
      });

      context.pubsub.publish(PROJECT_ADDED_EVENT, project);
      return project;
    },

    deleteProject: async (_parent, args, context) => {
      const project = await context.prisma.project.findUnique({
        where: { id: args.project },
      });

      if (!project) {
        throw new GraphQLError("Ce projet n'existe pas.", {
          extensions: {
            code: "CLIENT_PROJECT_MISSING",
          },
        });
      }

      // Deny deletion if user is not admin and it's not his project
      if (
        context.user?.role != "ADMIN" &&
        context.user?.id != project.ownerId
      ) {
        throw new GraphQLError("Vous ne pouvez pas faire ça.", {
          extensions: {
            code: "CLIENT_FORBIDDEN",
          },
        });
      }

      await context.prisma.project.delete({
        where: { id: project.id },
      });

      context.pubsub.publish(PROJECT_DELETED_EVENT, project.id);
      return true;
    },
  },

  Project: {
    owner: async (parent, _args, context) => {
      const user = await context.prisma.project
        .findUnique({
          where: {
            id: parent.id,
          },
        })
        .owner();

      if (!user) {
        throw new GraphQLError("Une erreur serveur est survenue.", {
          extensions: {
            code: "SERVER_RELATION_ERROR",
            at: `Projet(id = ${parent.id})`,
          },
        });
      }

      return toGQLUser(user);
    },
  },

  Subscription: {
    projectAdded: {
      subscribe: (_parent, _args, context) => {
        return context.pubsub.asyncIterableIterator(PROJECT_ADDED_EVENT);
      },
      resolve: (payload: Project) => {
        return payload;
      },
    },

    projectDeleted: {
      subscribe: (_parent, _args, context) => {
        return context.pubsub.asyncIterableIterator(PROJECT_DELETED_EVENT);
      },
      resolve: (payload: Project) => {
        return payload;
      },
    },
  },
};

export default resolvers;
