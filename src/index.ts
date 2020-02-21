import "dotenv/config";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { createSchema } from "./utils/createSchema";
import { ApolloServer } from "apollo-server-express";
import Express from "express";

const server = async () => {
  await createConnection();

  const schema = await createSchema();

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res })
  });

  const app = Express();

  apolloServer.applyMiddleware({ app });

  app.listen(4200, () => {
    console.log("Dev.to server started on http://localhost:4200/graphql");
  });
};

server();
