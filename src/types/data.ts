import { PubUser, PubDocument } from "./pub-objects";

export interface CurrentUserQuery {
  currentUser: PubUser;
}

export interface DocumentsQuery {
  documents: Array<PubDocument>;
}

export type LoginMutation = (
  options: { name: string; password: string }
) => { login: PubUser };

export type CreateUserMutation = (
  options: { name: string; password: string }
) => { createUser: PubUser };

export type SaveDocumentMutation = (
  options: { document: PubDocument }
) => { saveDocument: PubDocument };

export type DeleteDocumentMutation = (
  options: { id: string | number }
) => number;

export type RefetchCurrentUser = (options: any) => void;
