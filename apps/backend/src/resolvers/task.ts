import { Resolvers } from "@workshop-graphql-rappa/graphql-schema";
import { GraphQLError } from "graphql";
import { toGQLTask } from "./utils";
import { Task } from "@prisma/client";

const TASK_ADDED_EVENT = (id: string) => `taskAdded@${id}`;
const TASK_UPDATED_EVENT = (id: string) => `taskUpdated@${id}`;
const TASK_DELETED_EVENT = (id: string) => `taskDeleted@${id}`;

const resolvers: Partial<Resolvers<RappaContext>> = {
  Mutation: {
    createTask: async (_parent, args, context) => {
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

      const existingTask = await context.prisma.task.findUnique({
        where: {
          project: project,
          name: args.input.name,
        },
      });

      if (existingTask) {
        throw new GraphQLError("Une tâche avec un nom similaire existe déjà.", {
          extensions: {
            code: "CLIENT_TASK_ALREADY_EXISTS",
          },
        });
      }

      const task = await context.prisma.task.create({
        data: {
          name: args.input.name,
          state: "TODO",
          project: { connect: project },
        },
      });

      context.pubsub.publish(TASK_ADDED_EVENT(project.id), task);
      return toGQLTask(task);
    },

    updateTask: async (_parent, args, context) => {
      const task = await context.prisma.task.findUnique({
        where: { id: args.task },
      });

      if (!task) {
        throw new GraphQLError("Cette tâche n'existe pas.", {
          extensions: {
            code: "CLIENT_TASK_MISSING",
          },
        });
      }

      const updatedTask = await context.prisma.task.update({
        where: { id: task.id },
        data: {
          state: args.input.state ?? undefined,
        },
      });

      context.pubsub.publish(TASK_UPDATED_EVENT(task.projectId), updatedTask);
      return toGQLTask(updatedTask);
    },

    deleteTask: async (_parent, args, context) => {
      const task = await context.prisma.task.findUnique({
        where: { id: args.task },
      });

      if (!task) {
        throw new GraphQLError("Cette tâche n'existe pas.", {
          extensions: {
            code: "CLIENT_TASK_MISSING",
          },
        });
      }

      await context.prisma.task.delete({
        where: { id: task.id },
      });

      context.pubsub.publish(TASK_DELETED_EVENT(task.projectId), task.id);
      return true;
    },
  },

  Task: {
    project: async (parent, _args, context) => {
      const project = await context.prisma.task
        .findUnique({
          where: { id: parent.id },
        })
        .project();

      if (!project) {
        throw new GraphQLError("Une erreur serveur est survenue.", {
          extensions: {
            code: "SERVER_RELATION_ERROR",
            at: `Task(id = ${parent.id}).project`,
          },
        });
      }

      return project;
    },
  },

  Subscription: {
    taskAdded: {
      subscribe: (_parent, args, context) => {
        return context.pubsub.asyncIterableIterator(
          TASK_ADDED_EVENT(args.project)
        );
      },
      resolve: (payload: Task) => {
        return toGQLTask(payload);
      },
    },

    taskUpdated: {
      subscribe: (_parent, args, context) => {
        return context.pubsub.asyncIterableIterator(
          TASK_UPDATED_EVENT(args.project)
        );
      },
      resolve: (payload: Task) => {
        return toGQLTask(payload);
      },
    },

    taskDeleted: {
      subscribe: (_parent, args, context) => {
        return context.pubsub.asyncIterableIterator(
          TASK_DELETED_EVENT(args.project)
        );
      },
      resolve: (payload: string) => {
        return payload;
      },
    },
  },
};

export default resolvers;
