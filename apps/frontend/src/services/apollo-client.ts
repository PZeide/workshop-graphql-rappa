import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getAuthToken } from "./token";
import { getMainDefinition } from "@apollo/client/utilities";

const graphqlEndpoint = import.meta.env.VITE_API_GRAPHQL_ENDPOINT;
const wsEndpoint = import.meta.env.VITE_API_GRAPHQL_WS_ENDPOINT;

if (!graphqlEndpoint || !wsEndpoint) {
  throw new Error("Missing API_GRAPHQL_ENDPOINT or API_GRAPHQL_WS_ENDPOINT");
}

const httpLink = createHttpLink({
  uri: graphqlEndpoint,
});

const authLink = setContext((_, { headers }) => {
  const token = getAuthToken();
  if (token) {
    return {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    };
  }

  return {};
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: wsEndpoint,
    connectionParams: () => {
      const token = getAuthToken();
      if (token) {
        return {
          Authorization: `Bearer ${token}`,
        };
      }

      return {};
    },
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  // Add wsLink
  wsLink,
  // Add authLink to httpLink
  authLink.concat(httpLink)
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
