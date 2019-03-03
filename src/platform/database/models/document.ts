import { Model, snakeCaseMappers } from "objection";
import path from "path";
import { PubPage } from "../../../types/pub-objects";

export class DocumentModel extends Model {
  static get tableName() {
    return "documents";
  }

  static columnNameMappers = snakeCaseMappers();

  static relationMappings = {
    pages: {
      relation: Model.HasManyRelation,
      modelClass: path.join(__dirname, "page"),
      join: {
        from: "documents.id",
        to: "pages.document_id",
      },
    },

    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: path.join(__dirname, "user"),
      join: {
        from: "documents.user_id",
        to: "users.id",
      },
    },
  };

  readonly id!: string | number;
  user_id!: string | number;
  name!: string;
  pages?: Array<PubPage>;
}
