import { ApolloServer } from "@apollo/server";
import express from "express";
import http from "http";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import cors from "cors";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/use/ws";
import { validateEnvironment } from "./utils/env";
import schema from "./schema";
import { contextFromConnectionParams, contextFromRequest } from "./context";

validateEnvironment();

const app = express();
const server = http.createServer(app);

const wsServer = new WebSocketServer({
  server,
  path: "/",
});

const wsServerCleanup = useServer(
  {
    schema,
    context: ({ connectionParams }) =>
      contextFromConnectionParams(connectionParams ?? {}),
  },
  wsServer
);

const gqlServer = new ApolloServer<RappaContext>({
  schema: schema,
  csrfPrevention: true,
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer: server }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await wsServerCleanup.dispose();
          },
        };
      },
    },
  ],
});

await gqlServer.start();

app.use(
  "/",
  cors<cors.CorsRequest>(),
  express.json(),
  expressMiddleware(gqlServer, {
    context: ({ req }) => contextFromRequest(req),
  })
);

const host = import.meta.env.SERVER_HOST ?? "0.0.0.0";
const port = import.meta.env.SERVER_PORT
  ? parseInt(import.meta.env.SERVER_PORT)
  : 4000;

server.listen(
  {
    host,
    port,
  },
  () => {
    console.log(`🚀 Server ready at http://${host}:${port}`);
    console.log(`📅 Subscriptions ready at http://${host}:${port}`);
  }
);
