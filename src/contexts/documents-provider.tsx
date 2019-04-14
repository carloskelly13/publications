import * as React from "react";

import produce from "immer";
import get from "lodash/fp/get";
import pick from "lodash/fp/pick";
import cloneDeep from "clone-deep";

import {
  addEditorStateToObject,
  convertObjStylesToHTML,
  documentsWithEditorState,
  duplicateShape,
  omitTransientData,
} from "../util/documents";
import shortid from "shortid";
import { StateContext, PubAppState } from "./app-state";
import {
  PubDocument,
  PubPage,
  PubShape,
  PubShapeChanges,
  PubShapeType,
  PubUser,
} from "../types/pub-objects";
import {
  ClipboardAction,
  LayerMutationDelta,
  SaveDocumentMutationResponse,
  DocumentsQuery,
  CurrentUserQuery,
  DeleteDocumentMutationResponse,
  SaveDocumentMutation,
  DeleteDocumentMutation,
  LoginMutationResponse,
  LoginMutation,
  CreateUserMutationResponse,
  CreateUserMutation,
} from "../types/data";
import { useQuery, useMutation } from "urql";
import {
  currentUserQuery,
  documentsQuery,
  saveDocumentMutation,
  deleteDocumentMutation,
  loginMutation,
  createUserMutation,
} from "../queries";

export { StateContext } from "./app-state";

interface Props {
  children?: React.ReactNode;
}
export default function DocumentsProvider(props: Props) {
  const [{ data: currentUserData }, refetchCurrentUser] = useQuery<
    CurrentUserQuery
  >({ query: currentUserQuery });
  const [{ data: docData }] = useQuery<DocumentsQuery>({
    query: documentsQuery,
  });
  const [, saveDocumentAction] = useMutation<
    SaveDocumentMutationResponse,
    SaveDocumentMutation
  >(saveDocumentMutation);
  const [, deleteDocumentAction] = useMutation<
    DeleteDocumentMutationResponse,
    DeleteDocumentMutation
  >(deleteDocumentMutation);
  const [, login] = useMutation<LoginMutationResponse, LoginMutation>(
    loginMutation
  );
  const [, createUser] = useMutation<
    CreateUserMutationResponse,
    CreateUserMutation
  >(createUserMutation);

  const documents: PubDocument[] = documentsWithEditorState(
    get("documents")(docData) || []
  );
  const user: PubUser | null = get("currentUser")(currentUserData) || null;

  const dataLoaded = !documents;

  const [
    currentDocument,
    setCurrentDocument,
  ] = React.useState<PubDocument | null>(null);
  const [selectedObject, setSelectedObject] = React.useState<PubShape | null>(
    null
  );
  const [
    clipboardContents,
    setClipboardContents,
  ] = React.useState<PubShape | null>(null);
  const [zoom, setZoom] = React.useState(1);
  const [newDocumentModalVisible, setNewDocumentModalVisible] = React.useState(
    false
  );
  const [
    openDocumentModalVisible,
    setOpenDocumentModalVisible,
  ] = React.useState(false);
  const [startModalVisible, setStartModalVisible] = React.useState(false);
  const [newAccountModalVisible, setNewAccountModalVisible] = React.useState(
    false
  );
  const [aboutModalVisible, setAboutModalVisible] = React.useState(false);
  const [loginModalVisible, setLoginModalVisible] = React.useState(false);
  const [layersPanelVisible, setLayersPanelVisible] = React.useState(false);

  const getDocument = React.useCallback(
    async (id: string) => {
      const doc = documents.filter(d => d.id === id)[0];
      setCurrentDocument(doc);
      window.history.pushState({}, null, `?docId=${doc.id}`);
    },
    [setCurrentDocument, documents]
  );

  const saveDocument = React.useCallback(
    async (sender?: PubDocument) => {
      if (!currentDocument && !sender) {
        return;
      }
      let documentToSave = sender || currentDocument;
      documentToSave = produce(documentToSave, (draftDocument: any) => {
        if (sender && currentDocument) {
          draftDocument.name = sender.name;
        }
        draftDocument.pages[0] = {
          ...pick(
            ["id", "width", "height", "pageNumber"],
            draftDocument.pages[0]
          ),
          shapes: documentToSave.pages[0].shapes.map(shape =>
            omitTransientData(convertObjStylesToHTML(shape))
          ),
        };
        draftDocument.id = get("id")(documentToSave);
        delete draftDocument.__typename;
      });
      return saveDocumentAction({ document: documentToSave });
    },
    [currentDocument, saveDocumentAction]
  );

  const updateSelectedObject = React.useCallback(
    (sender: PubShapeChanges) => {
      if (sender === null) {
        setSelectedObject(null);
        return;
      }
      const updatedSelectedObj: PubShape = { ...selectedObject, ...sender };
      const updatedDocument = produce(currentDocument, draftDocument => {
        const idx = currentDocument.pages[0].shapes.findIndex(
          shape => updatedSelectedObj.id === shape.id
        );
        draftDocument.pages[0].shapes[idx] = updatedSelectedObj;
      });
      setSelectedObject(updatedSelectedObj);
      setCurrentDocument(updatedDocument);
    },
    [selectedObject, currentDocument]
  );

  const updateCurrentPage = React.useCallback(
    (sender: Partial<PubPage>) => {
      if (sender === null || !currentDocument) {
        return;
      }
      const updatedDocument = produce(currentDocument, draftDocument => {
        draftDocument.pages[0] = { ...draftDocument.pages[0], ...sender };
      });
      setCurrentDocument(updatedDocument);
    },
    [currentDocument]
  );

  const updateCurrentDocument = React.useCallback(
    (sender: Partial<PubDocument>) => {
      if (sender === null || !currentDocument) {
        return;
      }
      setCurrentDocument({ ...currentDocument, ...sender });
    },
    [currentDocument]
  );

  const logout = React.useCallback(async () => {
    await saveDocument();
    window.localStorage.removeItem("authorization_token");
    setCurrentDocument(null);
    setSelectedObject(null);
    setLayersPanelVisible(false);
    setZoom(1);
    return await refetchCurrentUser({ skipCache: true });
  }, [refetchCurrentUser, saveDocument]);

  const addObject = React.useCallback(
    (sender: PubShape) => {
      const newObject = produce(sender, draftNewObject => {
        draftNewObject.z = currentDocument.pages[0].shapes.length + 1;
        draftNewObject.id = shortid.generate();
      });
      const updatedDocument = produce(currentDocument, draftDocument => {
        draftDocument.pages[0].shapes.push(newObject);
      });
      setSelectedObject(newObject);
      setCurrentDocument(updatedDocument);
    },
    [setSelectedObject, setCurrentDocument, currentDocument]
  );

  const adjustObjectLayer = React.useCallback(
    (delta: LayerMutationDelta) => {
      const { source, destination } = delta;
      if (!source || !destination || !currentDocument) {
        return;
      }
      const doc = produce(currentDocument, draftState => {
        const fromIndex = source.index;
        const toIndex = destination.index;
        const sortedObjects = Array.from(currentDocument.pages[0].shapes);
        const [adjustedShape] = sortedObjects.splice(fromIndex, 1);
        sortedObjects.splice(toIndex, 0, adjustedShape);
        const shapes = sortedObjects.map((shape, index) => ({
          ...shape,
          z: index + 1,
        }));
        const selectedObject = shapes.find(
          shape => shape.id === adjustedShape.id
        );
        draftState.pages[0].shapes = shapes;
        setSelectedObject(selectedObject);
      });
      setCurrentDocument(doc);
    },
    [currentDocument, setCurrentDocument, setSelectedObject]
  );

  const deleteObject = React.useCallback(() => {
    if (!selectedObject || !currentDocument) {
      return;
    }
    const doc = produce(currentDocument, draftState => {
      draftState.pages[0].shapes = currentDocument.pages[0].shapes
        .filter(shape => shape.id !== selectedObject.id)
        .map(shape => {
          if (shape.z > selectedObject.z) {
            shape.z -= 1;
          }
          return shape;
        });
    });
    setSelectedObject(null);
    setCurrentDocument(doc);
  }, [setSelectedObject, setCurrentDocument, currentDocument, selectedObject]);

  const handleCreateNewDocument = React.useCallback(
    async (sender: { name: string; width: number; height: number }) => {
      const payload = {
        name: sender.name,
        pages: [
          {
            pageNumber: 1,
            width: sender.width,
            height: sender.height,
            shapes: [],
          },
        ],
      };
      if (user) {
        try {
          const response = await saveDocumentAction({
            document: payload,
          } as any);
          if (currentDocument) {
            await saveDocument();
          }
          setCurrentDocument(response.data.saveDocument);
          return;
        } catch (e) {
          return;
        }
      }
      setCurrentDocument(payload as PubDocument);
    },
    [currentDocument, saveDocument, saveDocumentAction, user]
  );

  const deleteDocument = React.useCallback(
    async (id: string | number) => {
      if (currentDocument && currentDocument.id === id) {
        setCurrentDocument(null);
        setSelectedObject(null);
      }
      const response = await deleteDocumentAction({ id });
      return response.data;
    },
    [currentDocument, deleteDocumentAction]
  );

  const handleClipboardAction = React.useCallback(
    (action: ClipboardAction) => {
      if (!currentDocument) {
        return;
      }
      if (action === ClipboardAction.Copy && selectedObject) {
        const copiedObj = duplicateShape(selectedObject);
        setClipboardContents(copiedObj);
      } else if (action === ClipboardAction.Cut && selectedObject) {
        const cutObj = duplicateShape(selectedObject);
        setClipboardContents(cutObj);
        deleteObject();
      } else if (action === ClipboardAction.Paste && clipboardContents) {
        const newObject = {
          ...cloneDeep(clipboardContents),
          z: currentDocument.pages[0].shapes.length + 1,
          id: shortid.generate(),
        };
        if (newObject.type === PubShapeType.Text) {
          addEditorStateToObject(newObject);
        }
        const updatedDocument = produce(currentDocument, draftDocument => {
          draftDocument.pages[0].shapes.push(newObject);
        });
        setSelectedObject(newObject);
        setCurrentDocument(updatedDocument);
      }
    },
    [currentDocument, selectedObject, clipboardContents, deleteObject]
  );

  const appState: PubAppState = {
    actions: {
      setAboutModalVisible,
      setLoginModalVisible,
      setLayersPanelVisible,
      setStartModalVisible,
      setNewAccountModalVisible,
      setNewDocumentModalVisible,
      setOpenDocumentModalVisible,
      setZoom,
      getDocument,
      saveDocument,
      deleteDocument,
      addObject,
      deleteObject,
      updateSelectedObject,
      updateCurrentPage,
      updateCurrentDocument,
      adjustObjectLayer,
      handleCreateNewDocument,
      handleClipboardAction,
      login,
      createUser,
      refetchCurrentUser,
      logout,
    },
    aboutModalVisible,
    clipboardContents,
    currentDocument,
    documents,
    dataLoaded,
    selectedObject,
    zoom,
    user,
    newDocumentModalVisible,
    openDocumentModalVisible,
    loginModalVisible,
    startModalVisible,
    newAccountModalVisible,
    layersPanelVisible,
  };

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const documentId = urlParams.get("docId");
    if (documentId === null || currentDocument) {
      return;
    }
    getDocument(documentId)
      .then(() => setStartModalVisible(false))
      .catch(() => setStartModalVisible(false));
  }, [currentDocument, getDocument, documents.length]);

  return (
    <StateContext.Provider value={appState}>
      {props.children}
    </StateContext.Provider>
  );
}
