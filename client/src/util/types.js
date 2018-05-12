// @flow
export type ToolbarProps = {
  user: ?PubUser,
  selectedObject: ?Object,
  currentDocument: ?Object,
  layersPanelVisible: boolean,
  clipboardContents: ?Object,
  zoom: number,
};

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
};

export type PubUser = {
  emailAddress: string,
  id: string,
};
