import { PubShape, PubShapeType } from "../../types/pub-objects";

export const getPropertyOrNull = (
  object: PubShape | null,
  property: string
): number | null => {
  if (!object || typeof object[property] === "undefined") {
    return null;
  }
  return object[property];
};
export const getStringPropertyOrNull = (
  object: PubShape | null,
  property: string
): string | null => {
  if (!object || typeof object[property] === "undefined") {
    return null;
  }
  return object[property];
};
export const supportsBorder = (shape: PubShape | null) =>
  shape &&
  (shape.type === PubShapeType.Rectangle ||
    shape.type === PubShapeType.Ellipse);
export const supportsRadius = (shape: PubShape | null) =>
  shape && shape.type === PubShapeType.Rectangle;
export const isText = (shape: PubShape | null) =>
  shape && shape.type === PubShapeType.Text;
