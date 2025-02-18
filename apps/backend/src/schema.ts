import { GraphQLDateTime } from "graphql-scalars";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { schame as typeDefs } from "@workshop-graphql-rappa/graphql-schema";
import { authDirectiveTransformer } from "./directives/auth-directive";

import authenticationResolvers from "./resolvers/authentication";
import projectResolvers from "./resolvers/projects";
import taskResolvers from "./resolvers/task";
import commentResolvers from "./resolvers/comment";

const scalarResolvers = {
  DateTime: GraphQLDateTime,
};

let schema = makeExecutableSchema({
  typeDefs,
  resolvers: [
    scalarResolvers,
    authenticationResolvers,
    projectResolvers,
    taskResolvers,
    commentResolvers,
  ],
});

schema = authDirectiveTransformer(schema);
export default schema;
