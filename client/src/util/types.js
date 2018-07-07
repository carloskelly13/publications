// @flow
export type PubDocument = {
  id: string,
  name: string,
  width: number,
  height: number,
  shapes: PubShape[],
};

export type PubShape = {
  id: string,
  width: number,
  height: number,
  x: number,
  y: number,
  r: number,
  fill: string,
  fillOpacity: number,
  stroke: string,
  strokeWidth: number,
  strokeOpacity: number,
  isEditing: ?boolean,
  editorState: ?any,
  type: "rect" | "ellipse" | "text",
};

export type PubUser = {
  emailAddress: string,
  id: string,
};
