import { Project, Resolvers } from "@workshop-graphql-rappa/graphql-schema";
import { GraphQLError } from "graphql";
import { isAdminOrOwner, toGQLTask, toGQLUser } from "./utils";

const PROJECT_ADDED_EVENT = "projectAdded";
const PROJECT_UPDATED_EVENT = "projectUpdated";
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
        where: { name: args.input.name },
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
          name: args.input.name,
          description: args.input.description,
          owner: { connect: context.user },
          updatedAt: now,
          createdAt: now,
        },
      });

      context.pubsub.publish(PROJECT_ADDED_EVENT, project);
      return project;
    },

    updateProject: async (_parent, args, context) => {
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

      // Deny update if user is not admin and it's not his project
      if (!context.user || !isAdminOrOwner(context.user, project.ownerId)) {
        throw new GraphQLError("Vous ne pouvez pas faire ça.", {
          extensions: {
            code: "CLIENT_FORBIDDEN",
          },
        });
      }

      // If user want to change name, check if a project with a similar name already exists
      if (args.input.name) {
        const existingProject = await context.prisma.project.findUnique({
          where: { name: args.input.name },
        });

        if (existingProject) {
          throw new GraphQLError(
            "Un projet avec un nom similaire existe déjà.",
            {
              extensions: {
                code: "CLIENT_PROJECT_ALREADY_EXISTS",
              },
            }
          );
        }
      }

      const now = new Date();
      const updatedProject = await context.prisma.project.update({
        where: { id: project.id },
        data: {
          name: args.input.name ?? undefined,
          description: args.input.description ?? undefined,
          updatedAt: now,
        },
      });

      context.pubsub.publish(PROJECT_UPDATED_EVENT, updatedProject);
      return updatedProject;
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
      if (!context.user || !isAdminOrOwner(context.user, project.ownerId)) {
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
          where: { id: parent.id },
        })
        .owner();

      if (!user) {
        throw new GraphQLError("Une erreur serveur est survenue.", {
          extensions: {
            code: "SERVER_RELATION_ERROR",
            at: `Projet(id = ${parent.id}).owner`,
          },
        });
      }

      return toGQLUser(user);
    },

    comments: async (parent, _args, context) => {
      const comments = await context.prisma.project
        .findUnique({
          where: { id: parent.id },
        })
        .comments();

      if (!comments) {
        throw new GraphQLError("Une erreur serveur est survenue.", {
          extensions: {
            code: "SERVER_RELATION_ERROR",
            at: `Projet(id = ${parent.id}).comments`,
          },
        });
      }

      return comments;
    },

    tasks: async (parent, _args, context) => {
      const tasks = await context.prisma.project
        .findUnique({
          where: { id: parent.id },
        })
        .tasks();

      if (!tasks) {
        throw new GraphQLError("Une erreur serveur est survenue.", {
          extensions: {
            code: "SERVER_RELATION_ERROR",
            at: `Projet(id = ${parent.id}).tasks`,
          },
        });
      }

      return tasks.map(toGQLTask);
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

    projectUpdated: {
      subscribe: (_parent, _args, context) => {
        return context.pubsub.asyncIterableIterator(PROJECT_UPDATED_EVENT);
      },
      resolve: (payload: Project) => {
        return payload;
      },
    },

    projectDeleted: {
      subscribe: (_parent, _args, context) => {
        return context.pubsub.asyncIterableIterator(PROJECT_DELETED_EVENT);
      },
      resolve: (payload: string) => {
        return payload;
      },
    },
  },
};

export default resolvers;
