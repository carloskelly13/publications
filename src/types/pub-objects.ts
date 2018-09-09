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
  text?: string;
  isEditing?: boolean;
  editorState?: EditorState;
}

export interface PubPage {
  id: string;
  width: number;
  height: number;
  pageNumber: number;
  shapes: Array<PubShape>;
}

export interface PubDocument {
  id?: string;
  name: string;
  pages: Array<PubPage>;
}

export interface PubUser {
  id?: string | number;
  name: string;
  token?: string;
}
