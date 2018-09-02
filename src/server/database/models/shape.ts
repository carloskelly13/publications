import { Model, snakeCaseMappers } from "objection";
import path from "path";

export class ShapeModel extends Model {
  static get tableName() {
    return "shapes";
  }

  static columnNameMappers = snakeCaseMappers();

  static relationMappings = {
    document: {
      relation: Model.BelongsToOneRelation,
      modelClass: path.join(__dirname, "document"),
      join: {
        from: "shapes.document_id",
        to: "documents.id",
      },
    },
  };

  readonly id!: string | number;
  type!: string;
  width!: number;
  height!: number;
  x!: number;
  y!: number;
  z!: number;
  r!: number;
  fill!: string;
  fill_opacity!: number;
  stroke!: string;
  stroke_width!: number;
  stroke_opacity!: number;
  text!: string;
}
