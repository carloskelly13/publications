import React from "react";
import { PubDocument, PubShape, PubUser } from "../types/pub-objects";
import {
  LoginMutation,
  RefetchCurrentUser,
  CreateUserMutation,
  LayerMutationDelta,
  ClipboardAction,
} from "../types/data";

export interface PubActions {
  login: LoginMutation;
  createUser: CreateUserMutation;
  refetchCurrentUser: RefetchCurrentUser;
  addObject(object: PubShape): void;
  deleteObject(): void;
  deleteDocument(id: string | number): Promise<number>;
  handleClipboardAction(action: ClipboardAction): void;
  handleCreateNewDocument(sender: {
    name: string;
    width: number;
    height: number;
  }): Promise<void>;
  logout(): Promise<void>;
  getDocument(id: string): void;
  saveDocument(): Promise<any>;
  setZoom(zoom: number): void;
  setNewDocumentModalVisible(visible: boolean): void;
  setOpenDocumentModalVisible(visible: boolean): void;
  setLayersPanelVisible(visible: boolean): void;
  updateSelectedObject(sender?: Record<string, any> | null): void;
  adjustObjectLayer(sender: LayerMutationDelta): void;
  setStartModalVisible(visible: boolean): void;
  setNewAccountModalVisible(visible: boolean): void;
  setLoginModalVisible(visible: boolean): void;
  setAboutModalVisible(visible: boolean): void;
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
