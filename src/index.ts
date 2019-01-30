import express from "express";
import webpack from "webpack";
import webpackConfig from "../webpack.config";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import graphqlHttp from "express-graphql";
import schema from "./platform/schemas";
import jwt from "express-jwt";
import graphqlPlayground from "graphql-playground-middleware-express";
import path from "path";
import documentPdfHandler from "./platform/handlers/pdf";
import appConfig from "../app-config";
import { GraphQLSchema } from "graphql";

const PORT = 4000;
const jwtConfig = {
  secret: appConfig.jwtSecret,
  credentialsRequired: false,
};

const startPublications = function() {
  const mode = process.env.NODE_ENV || "DEVELOPMENT";
  const app = express();

  if (mode.toUpperCase() === "DEVELOPMENT") {
    const compiler = webpack(webpackConfig as webpack.Configuration);
    app.use(
      webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
      })
    );
    app.use(webpackHotMiddleware(compiler));
    app.use("/playground", graphqlPlayground({ endpoint: "/graphql" }));
  } else {
    const publicPath = path.resolve(__dirname, "../public");
    app.use(express.static(publicPath));
    app.get("/", (req, res) =>
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

  app.use(function(err, req, res, next) {
    if (err.name === "UnauthorizedError") {
      res.status(401).send(err);
    }
  });

  app.get("/documents/:id/pdf", documentPdfHandler);

  app.listen(PORT, () => {
    console.log(`Publications started on port ${PORT}.`);
  });
};

export { startPublications };
