import React from "react";
import { PubDocument, PubShape, PubUser, PubPage } from "../types/pub-objects";
import {
  LoginMutation,
  RefetchCurrentUser,
  CreateUserMutation,
  LayerMutationDelta,
  ClipboardAction,
  LoginMutationResponse,
  CreateUserMutationResponse,
  RefetchDocuments,
} from "../types/data";
import { OperationContext, OperationResult } from "urql";

export interface PubActions {
  refetchCurrentUser: RefetchCurrentUser;
  refreshDocsData: RefetchDocuments;
  login(
    variables?: LoginMutation,
    context?: Partial<OperationContext>
  ): Promise<OperationResult<LoginMutationResponse>>;
  createUser(
    opts: CreateUserMutation
  ): Promise<OperationResult<CreateUserMutationResponse>>;
  addObject(object: PubShape): void;
  deleteObject(): void;
  deleteDocument(id: string | number): Promise<number>;
  handleClipboardAction(action: ClipboardAction): void;
  handleCreateNewDocument(sender: {
    name: string;
    width: number;
    height: number;
  }): Promise<PubDocument>;
  logout(): Promise<void>;
  getDocument(id: string): void;
  saveDocument(sender?: PubDocument): Promise<any>;
  setZoom(zoom: number): void;
  setNewDocumentModalVisible(visible: boolean): void;
  setOpenDocumentModalVisible(visible: boolean): void;
  setLayersPanelVisible(visible: boolean): void;
  setSelectedDocumentItem(sender: PubDocument | null): void;
  updateSelectedObject(sender?: Record<string, any> | null): void;
  setSelectedObject(sender: PubShape | null): void;
  updateCurrentPage(sender?: Partial<PubPage>): void;
  updateCurrentDocument(sender?: Partial<PubDocument>): void;
  adjustObjectLayer(sender: LayerMutationDelta): void;
  setStartModalVisible(visible: boolean): void;
  setNewAccountModalVisible(visible: boolean): void;
  setLoginModalVisible(visible: boolean): void;
  setAboutModalVisible(visible: boolean): void;
  setSaveDialogVisible(visible: boolean): void;
  setDeleteDocumentDialogVisible(visible: boolean): void;
  setCurrentDocument: React.Dispatch<PubDocument | null>;
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
  selectedDocumentItem: PubDocument | null;
  deleteDocumentDialogVisible: boolean;
  saveDialogVisible: boolean;
  userFetching: boolean;
}

export const StateContext = React.createContext<PubAppState>(
  null as PubAppState
);
