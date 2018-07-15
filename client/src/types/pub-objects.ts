export enum IPubShapeType {
  Rectangle = "rect",
  Ellipse = "ellipse",
  Text = "text",
}

export interface IPubShape {
  id: string;
  type: IPubShapeType;
  width: number;
  height: number;
  x: number;
  y: number;
  r: number;
  fill: string;
  fillOpacity: number;
  stroke: string;
  strokeWidth: number;
  strokeOpacity: number;
  isEditing?: boolean;
  editorState?: any;
}

export interface IPubDocument {
  id: string;
  name: string;
  width: number;
  height: number;
  shapes: Array<IPubShape>;
}

export interface IPubUser {
  id: string;
  emailAddress: string;
}
