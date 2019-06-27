import express, { ErrorRequestHandler } from "express";
import graphqlHttp from "express-graphql";
import schema from "./platform/schemas";
import jwt from "express-jwt";
import graphqlPlayground from "graphql-playground-middleware-express";
import path from "path";
import documentPdfHandler from "./platform/handlers/pdf";
import appConfig from "../app-config";

const PORT = 4004;
const jwtConfig = {
  secret: appConfig.jwtSecret,
  credentialsRequired: false,
};

const onAuthError: ErrorRequestHandler = (err, req, res) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).send(err);
  }
};

export function startPublications() {
  const mode = process.env.NODE_ENV || "DEVELOPMENT";
  const app = express();

  if (mode.toUpperCase() === "DEVELOPMENT") {
    app.use("/playground", graphqlPlayground({ endpoint: "/graphql" }));
  } else {
    const publicPath = path.resolve(__dirname, "../public");
    app.use(express.static(publicPath));
    app.get("*", (req, res) =>
      res.sendFile(path.resolve(publicPath, "index.html"))
    );
  }

  app.use(jwt(jwtConfig));
  app.use(
    "/graphql",
    graphqlHttp(request => ({
      schema,
      context: { user: request.user },
    }))
  );
  app.use(onAuthError);
  app.get("/documents/:id/pdf", documentPdfHandler);
  app.listen(PORT, () => {
    console.log(`Publications API started on port ${PORT}.`);
  });
}
