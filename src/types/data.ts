import { PubUser, PubDocument } from "./pub-objects";

export interface CurrentUserQuery {
  currentUser: PubUser;
}

export interface DocumentsQuery {
  documents: Array<PubDocument>;
}

export interface LoginMutation {
  name: string;
  password: string;
}

export interface LoginMutationResponse {
  login: PubUser;
}

export interface CreateUserMutation {
  name: string;
  password: string;
}

export interface CreateUserMutationResponse {
  createUser: PubUser;
}

export interface SaveDocumentMutation {
  document: PubDocument;
}

export interface SaveDocumentMutationResponse {
  saveDocument: PubDocument;
}

export interface DeleteDocumentMutation {
  id: string | number;
}

export type DeleteDocumentMutationResponse = number;

export type RefetchCurrentUser = (options: any) => void;

export enum ClipboardAction {
  Copy = "copy",
  Paste = "paste",
  Cut = "cut",
}

export interface LayerMutationDelta {
  source?: { index: number };
  destination?: { index: number };
}
