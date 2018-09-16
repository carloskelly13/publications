import React from "react";
import { documentsWithEditorState } from "../../util/documents";
import {
  updatedDocumentStateForObjectChanges,
  updatedDocumentStateForLayerChanges,
  updatedDocumentStateForClipboardAction,
  updatedDocumentStateForDeleteAction,
  ClipboardAction,
  LayerMutationDelta,
} from "./editor-actions";
import {
  currentUserQuery,
  documentsQuery,
  loginMutation,
  saveDocumentMutation,
  createUserMutation,
  deleteDocumentMutation,
} from "../../queries";
import { PubUser, PubDocument } from "../../types/pub-objects";
import { Connect, query, mutation } from "urql";
import {
  LoginMutation,
  CurrentUserQuery,
  DocumentsQuery,
  SaveDocumentMutation,
  DeleteDocumentMutation,
  CreateUserMutation,
} from "../../types/data";
import DocumentsView from "./documents-view";

type Queries = [CurrentUserQuery, DocumentsQuery];
interface Mutations {
  login: LoginMutation;
  saveDocument: SaveDocumentMutation;
  deleteDocument: DeleteDocumentMutation;
  createUser: CreateUserMutation;
}

function ConnectedDocumentsView() {
  return (
    <Connect<Queries, Mutations>
      query={[query(currentUserQuery), query(documentsQuery)]}
      mutation={{
        login: mutation(loginMutation),
        saveDocument: mutation(saveDocumentMutation),
        deleteDocument: mutation(deleteDocumentMutation),
        createUser: mutation(createUserMutation),
      }}
    >
      {({
        data,
        login,
        refetch,
        saveDocument,
        deleteDocument,
        createUser,
        fetching,
        loaded,
      }) => {
        let user: PubUser | null = null;
        let documents: Array<PubDocument> = [];
        if (Array.isArray(data) && data.length === 2) {
          const [currentUserResponse, documentsResponse] = data;
          user = currentUserResponse.currentUser;
          documents = documentsWithEditorState(
            documentsResponse.documents || []
          );
        }
        return (
          <DocumentsView
            user={user}
            documents={documents}
            refetchCurrentUser={refetch}
            login={login}
            createUser={createUser}
            saveDocument={saveDocument}
            deleteDocument={deleteDocument}
            dataFetching={fetching}
            dataLoaded={loaded}
          />
        );
      }}
    </Connect>
  );
}

export default ConnectedDocumentsView;
