import knex from "knex";
import { Model } from "objection";

const appConfig = require("../../../../app-config.json");
export const pg = knex({
  client: "pg",
  version: "9.6",
  connection: {
    host: appConfig.databaseHost,
    database: appConfig.databaseName,
    user: appConfig.databaseUser,
    password: appConfig.databasePassword,
  },
});

Model.knex(pg);

export { UserModel } from "./user";
export { ShapeModel } from "./shape";
export { DocumentModel } from "./document";
