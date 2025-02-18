import { Resolvers } from "@workshop-graphql-rappa/graphql-schema";
import { GraphQLError } from "graphql";
import { toGQLUser } from "./utils";
import { Comment } from "@prisma/client";

const COMMENT_ADDED_EVENT = (id: string) => `commentAdded@${id}`;
const COMMENT_DELETED_EVENT = (id: string) => `commentDeleted@${id}`;

const resolvers: Partial<Resolvers<RappaContext>> = {
  Mutation: {
    createComment: async (_parent, args, context) => {
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

      const comment = await context.prisma.comment.create({
        data: {
          author: { connect: context.user },
          message: args.input.message,
          project: { connect: project },
        },
      });

      context.pubsub.publish(COMMENT_ADDED_EVENT(project.id), comment);
      return comment;
    },

    deleteComment: async (_parent, args, context) => {
      const comment = await context.prisma.comment.findUnique({
        where: { id: args.comment },
      });

      if (!comment) {
        throw new GraphQLError("Ce commentaire n'existe pas.", {
          extensions: {
            code: "CLIENT_COMMENT_MISSING",
          },
        });
      }

      await context.prisma.comment.delete({
        where: { id: comment.id },
      });

      context.pubsub.publish(
        COMMENT_DELETED_EVENT(comment.projectId),
        comment.id
      );
      return true;
    },
  },

  Comment: {
    author: async (parent, _args, context) => {
      const user = await context.prisma.comment
        .findUnique({
          where: { id: parent.id },
        })
        .author();

      if (!user) {
        throw new GraphQLError("Une erreur serveur est survenue.", {
          extensions: {
            code: "SERVER_RELATION_ERROR",
            at: `Comment(id = ${parent.id}).author`,
          },
        });
      }

      return toGQLUser(user);
    },

    project: async (parent, _args, context) => {
      const project = await context.prisma.comment
        .findUnique({
          where: { id: parent.id },
        })
        .project();

      if (!project) {
        throw new GraphQLError("Une erreur serveur est survenue.", {
          extensions: {
            code: "SERVER_RELATION_ERROR",
            at: `Comment(id = ${parent.id}).project`,
          },
        });
      }

      return project;
    },
  },

  Subscription: {
    commentAdded: {
      subscribe: (_parent, args, context) => {
        return context.pubsub.asyncIterableIterator(
          COMMENT_ADDED_EVENT(args.project)
        );
      },
      resolve: (payload: Comment) => {
        return payload;
      },
    },

    commentDeleted: {
      subscribe: (_parent, args, context) => {
        return context.pubsub.asyncIterableIterator(
          COMMENT_DELETED_EVENT(args.project)
        );
      },
      resolve: (payload: string) => {
        return payload;
      },
    },
  },
};

export default resolvers;
