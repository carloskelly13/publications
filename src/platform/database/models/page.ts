import { Model, snakeCaseMappers } from "objection";
import path from "path";
import { PubShape } from "../../../types/pub-objects";

export class PageModel extends Model {
  static get tableName() {
    return "pages";
  }

  static columnNameMappers = snakeCaseMappers();

  static relationMappings = {
    shapes: {
      relation: Model.HasManyRelation,
      modelClass: path.join(__dirname, "shape"),
      join: {
        from: "pages.id",
        to: "shapes.page_id",
      },
    },

    document: {
      relation: Model.BelongsToOneRelation,
      modelClass: path.join(__dirname, "document"),
      join: {
        from: "pages.document_id",
        to: "documents.id",
      },
    },
  };

  readonly id!: string | number;
  document_id!: string | number;
  width!: number;
  height!: number;
  pageNumber!: number;
  shapes?: Array<PubShape>;
}
