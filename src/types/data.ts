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

export type RefetchCurrentUser = (options: any) => void;

export interface DocumentMutations {
  login: LoginMutation;
}
