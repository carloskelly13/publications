// @flow
export type ToolbarProps = {
  user: ?Object,
  selectedObject: ?Object,
  currentDocument: ?Object,
  layersPanelVisible: boolean,
  clipboardContents: ?Object,
  zoom: number,
  actions: {
    toggleLayersPanel: () => void,
    addObject: Object => void,
    deleteObject: (?Object) => void,
    showNewDocumentModal: () => void,
    showOpenDocumentModal: () => void,
    handleClipboardAction: string => void,
    saveDocument: () => Promise<void>,
    setZoom: number => void,
    logOut: () => Promise<void>,
  },
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
