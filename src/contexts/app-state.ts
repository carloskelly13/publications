import React from "react";
import { PubDocument, PubShape, PubUser } from "../types/pub-objects";
import {
  ClipboardAction,
  LayerMutationDelta,
} from "../components/documents/editor-actions";

export interface IPubActions {
  addObject(object: PubShape): void;
  deleteObject(object?: PubShape): void;
  handleClipboardAction(action: ClipboardAction): void;
  logout(): Promise<void>;
  getDocument(id: string): void;
  saveDocument(): Promise<any>;
  setZoom(zoom: number): void;
  showNewDocumentModal(): void;
  showOpenDocumentModal(): void;
  toggleLayersPanel(): void;
  updateSelectedObject(sender?: Object | null): void;
  adjustObjectLayer(sender: LayerMutationDelta): void;
  toggleLoginDialog(): void;
  hideStartModal(): void;
  showNewAccountModal(): void;
  showLoginModal(): void;
  hideLoginModal(): void;
}

export interface IPubAppState {
  actions: IPubActions;
  currentDocument: PubDocument | null;
  clipboardContents: PubShape | null;
  user: PubUser | null;
  zoom: number;
  selectedObject: PubShape | null;
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
