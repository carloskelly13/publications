import knex from "knex";
import { Model } from "objection";
import appConfig from "../../../../app-config";

export const pg = knex({
  client: "pg",
  version: "11.3",
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
