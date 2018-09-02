import knex from "knex";
import { Model } from "objection";

export const pg = knex({
  client: "pg",
  version: "9.6",
  connection: {
    host: "127.0.0.1",
    database: "publications",
    user: "publications",
    password: "publications",
  },
});

Model.knex(pg);

export { UserModel } from "./user";
export { ShapeModel } from "./shape";
export { DocumentModel } from "./document";
