import { getDirective, MapperKind, mapSchema } from "@graphql-tools/utils";
import { AuthDirectiveArgs } from "@workshop-graphql-rappa/graphql-schema";
import { defaultFieldResolver, GraphQLSchema } from "graphql";
import { isAuthorized } from "../utils/composable";

const DIRECTIVE_NAME = "auth";

export function authDirectiveTransformer(schema: GraphQLSchema): GraphQLSchema {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const directives = getDirective(schema, fieldConfig, DIRECTIVE_NAME);
      if (!directives) {
        return undefined;
      }

      if (directives.length > 1) {
        throw new Error(
          "Cannot handle more than one auth directive on a single field!"
        );
      }

      const authDirective: AuthDirectiveArgs = directives[0];
      if (!authDirective || !authDirective.requires) {
        return undefined;
      }

      const { resolve = defaultFieldResolver } = fieldConfig;
      const composable = isAuthorized(authDirective.requires)(resolve);
      fieldConfig.resolve = composable;
      return fieldConfig;
    },
  });
}
