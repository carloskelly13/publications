import { Model, snakeCaseMappers } from "objection";
import path from "path";

export class DocumentModel extends Model {
  static get tableName() {
    return "documents";
  }

  static columnNameMappers = snakeCaseMappers();

  static relationMappings = {
    shapes: {
      relation: Model.HasManyRelation,
      modelClass: path.join(__dirname, "shape"),
      join: {
        from: "documents.id",
        to: "shapes.document_id",
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
  width!: number;
  height!: number;
  shapes?: Array<Object>;
}
