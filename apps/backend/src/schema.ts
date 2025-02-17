import { GraphQLDateTime } from "graphql-scalars";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { schame as typeDefs } from "@workshop-graphql-rappa/graphql-schema";

import authenticationResolvers from "./resolvers/authentication";
import projectResolvers from "./resolvers/projects";
import { authDirectiveTransformer } from "./directives/auth-directive";

const scalarResolvers = {
  DateTime: GraphQLDateTime,
};

let schema = makeExecutableSchema({
  typeDefs,
  resolvers: [scalarResolvers, authenticationResolvers, projectResolvers],
});

schema = authDirectiveTransformer(schema);
export default schema;
