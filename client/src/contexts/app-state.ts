import React from "react";
import { IPubDocument, IPubShape, IPubUser } from "../types/pub-objects";

export interface IPubActions {
  addObject(object: IPubShape): void;
  deleteObject(object?: IPubShape): void;
  handleClipboardAction(action: string): void;
  logout(): Promise<void>;
  getDocument(id: string): Promise<void>;
  saveDocument(): Promise<any>;
  setZoom(zoom: number): void;
  showNewDocumentModal(): void;
  showOpenDocumentModal(): void;
  toggleLayersPanel(): void;
  updateSelectedObject(sender?: Object | null): void;
  adjustObjectLayer(sender: IPubShape): void;
  toggleLoginDialog(): void;
  hideStartModal(): void;
  showNewAccountModal(): void;
  showLoginModal(): void;
  hideLoginModal(): void;
}

export interface IPubAppState {
  actions: IPubActions;
  currentDocument: IPubDocument | null;
  clipboardContents: IPubShape | null;
  user: IPubUser | null;
  zoom: number;
  selectedObject: IPubShape | null;
  layersPanelVisible: boolean;
}

const defaultState: IPubAppState = {
  actions: {} as any,
  currentDocument: null,
  clipboardContents: null,
  user: null,
  zoom: 1,
  selectedObject: null,
  layersPanelVisible: false,
};

export const StateContext = React.createContext<IPubAppState>(defaultState);
