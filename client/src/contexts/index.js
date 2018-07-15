// @flow
import type { PubDocument, PubShape, PubUser } from "../util/types";
import { StateContext } from "./app-state";

export type IActions = {
  addObject: (object: PubShape) => void,
  deleteObject: (object: ?PubShape) => void,
  handleClipboardAction: (action: string) => void,
  logOut: () => Promise<any>,
  getDocument: (id: string) => Promise<any>,
  saveDocument: () => Promise<any>,
  setZoom: (zoom: number) => void,
  showNewDocumentModal: () => void,
  showOpenDocumentModal: () => void,
  toggleLayersPanel: () => void,
  updateSelectedObject: (sender: ?Object) => void,
  adjustObjectLayer: (sender: PubShape) => void,
  toggleLoginDialog: () => void,
  hideStartModal: () => void,
  showNewAccountModal: () => void,
  showLoginModal: () => void,
  hideLoginModal: () => void,
};

export type IAppState = {
  actions: IActions,
  currentDocument: ?PubDocument,
  clipboardContents: ?PubShape,
  zoom: number,
  user: ?PubUser,
  selectedObject: ?PubShape,
  layersPanelVisible: boolean,
};

export { StateContext };
