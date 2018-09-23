import React from "react";
import { PubDocument, PubShape, PubUser } from "../types/pub-objects";
import {
  ClipboardAction,
  LayerMutationDelta,
} from "../components/documents/editor-actions";
import {
  LoginMutation,
  RefetchCurrentUser,
  CreateUserMutation,
  DeleteDocumentMutation,
} from "../types/data";

export interface PubActions {
  login: LoginMutation;
  createUser: CreateUserMutation;
  refetchCurrentUser: RefetchCurrentUser;
  addObject(object: PubShape): void;
  deleteObject(object?: PubShape): void;
  deleteDocument(id: string | number): Promise<number>;
  handleClipboardAction(action: ClipboardAction): void;
  handleCreateNewDocument(sender: {
    name: string;
    orientation: string;
  }): Promise<void>;
  logout(): Promise<void>;
  getDocument(id: string): void;
  saveDocument(): Promise<any>;
  setZoom(zoom: number): void;
  showNewDocumentModal(): void;
  hideNewDocumentModal(): void;
  showOpenDocumentModal(): void;
  hideOpenDocumentModal(): void;
  toggleLayersPanel(): void;
  updateSelectedObject(sender?: Object | null): void;
  adjustObjectLayer(sender: LayerMutationDelta): void;
  toggleLoginDialog(): void;
  hideStartModal(): void;
  showNewAccountModal(): void;
  hideNewAccountModal(): void;
  showLoginModal(): void;
  hideLoginModal(): void;
  showAboutModal(): void;
  hideAboutModal(): void;
}

export interface PubAppState {
  actions: PubActions;
  currentDocument: PubDocument | null;
  clipboardContents: PubShape | null;
  dataLoaded: boolean;
  documents: Array<PubDocument>;
  layersPanelVisible: boolean;
  selectedObject: PubShape | null;
  user: PubUser | null;
  zoom: number;
  startModalVisible: boolean;
  loginModalVisible: boolean;
  newAccountModalVisible: boolean;
  openDocumentModalVisible: boolean;
  aboutModalVisible: boolean;
  newDocumentModalVisible: boolean;
}

const defaultState: PubAppState = {
  actions: {} as any,
  currentDocument: null,
  clipboardContents: null,
  dataLoaded: false,
  documents: [],
  layersPanelVisible: false,
  selectedObject: null,
  user: null,
  zoom: 1,
  startModalVisible: false,
  loginModalVisible: false,
  newAccountModalVisible: false,
  openDocumentModalVisible: false,
  aboutModalVisible: false,
  newDocumentModalVisible: false,
};

export const StateContext = React.createContext<PubAppState>(defaultState);
