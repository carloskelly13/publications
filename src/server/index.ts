import express from "express";
import graphqlHttp from "express-graphql";
import schema from "./schemas";
import jwt from "express-jwt";
import graphqlPlayground from "graphql-playground-middleware-express";
import path from "path";

const PORT = 4000;
const jwtConfig = {
  secret: "carlos-secret-pls-change",
  credentialsRequired: false,
};

const startPublications = function() {
  const mode = process.env.NODE_ENV || "DEVELOPMENT";
  const app = express();
  let publicPath;

  if (mode.toUpperCase() === "DEVELOPMENT") {
    path.resolve(__dirname, "public");
    app.use("/playground", graphqlPlayground({ endpoint: "/graphql" }));
    publicPath = path.resolve(__dirname, "../../dist/public");
  } else {
    publicPath = path.resolve(__dirname, "public");
  }
  console.log(publicPath);
  app.use(express.static(publicPath));
  app.get("/", (req, res) =>
    res.sendFile(path.resolve(publicPath, "index.html"))
  );

  app.use(jwt(jwtConfig));

  app.use(
    "/graphql",
    graphqlHttp(request => ({
      schema,
      context: { user: request.user },
    }))
  );

  app.use(function(err, req, res, next) {
    if (err.name === "UnauthorizedError") {
      res.status(401).send(err);
    }
  });

  app.listen(PORT, () => {
    console.log(`Publications started on port ${PORT}.`);
  });
};

startPublications();
