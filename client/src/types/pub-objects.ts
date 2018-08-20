import { EditorState } from "draft-js";

export enum PubShapeType {
  Rectangle = "rect",
  Ellipse = "ellipse",
  Text = "text",
}

export type PubShapeChanges = {
  [key: string]: string | number | EditorState;
} | null;

export interface PubNewDocument {
  name: string;
  orientation: "portrait" | "landscape";
}

export interface PubShape {
  id: string;
  type: PubShapeType;
  width: number;
  height: number;
  x: number;
  y: number;
  z: number;
  r: number;
  fill: string;
  fillOpacity: number;
  stroke: string;
  strokeWidth: number;
  strokeOpacity: number;
  isEditing?: boolean;
  editorState?: EditorState;
}

export interface PubDocument {
  id: string;
  name: string;
  width: number;
  height: number;
  shapes: Array<PubShape>;
  lastModified: string;
}

export interface PubUser {
  id: string;
  emailAddress: string;
}
