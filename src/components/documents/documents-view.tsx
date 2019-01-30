import React, { useCallback, useState } from "react";
import Toolbar from "../toolbar";
import EditorView from "../editor";
import MetricsBar from "../metrics-bar";
import LayersSidebar from "../layers-sidebar";
import produce from "immer";
import Modals from "./modals";
import get from "lodash/fp/get";
import pick from "lodash/fp/pick";
import cloneDeep from "clone-deep";
import { DocumentView, ViewContainer } from "./components";
import {
  addEditorStateToObject,
  convertObjStylesToHTML,
  omitTransientData,
} from "../../util/documents";
import {
  ClipboardAction,
  duplicateObj,
  LayerMutationDelta,
} from "./editor-actions";
import shortid from "shortid";
import { StateContext } from "../../contexts";
import {
  PubDocument,
  PubShape,
  PubShapeChanges,
  PubShapeType,
  PubUser,
} from "../../types/pub-objects";
import {
  CreateUserMutation,
  DeleteDocumentMutation,
  LoginMutation,
  RefetchCurrentUser,
  SaveDocumentMutation,
} from "../../types/data";
import { PubAppState } from "../../contexts/app-state";
import { EditorState } from "draft-js";

interface Props {
  user: PubUser | null;
  documents: Array<PubDocument>;
  login: LoginMutation;
  createUser: CreateUserMutation;
  refetchCurrentUser: RefetchCurrentUser;
  saveDocument: SaveDocumentMutation;
  deleteDocument: DeleteDocumentMutation;
  dataFetching: boolean;
  dataLoaded: boolean;
}

const DocumentsView: React.FunctionComponent<Props> = props => {
  const [currentDocument, setCurrentDocument] = useState<PubDocument | null>(
    null
  );
  const [selectedObject, setSelectedObject] = useState<PubShape | null>(null);
  const [clipboardContents, setClipboardContents] = useState<PubShape | null>(
    null
  );
  const [zoom, setZoom] = useState(1);
  const [newDocumentModalVisible, setNewDocumentModalVisible] = useState(false);
  const [openDocumentModalVisible, setOpenDocumentModalVisible] = useState(
    false
  );
  const [startModalVisible, setStartModalVisible] = useState(true);
  const [newAccountModalVisible, setNewAccountModalVisible] = useState(false);
  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [layersPanelVisible, setLayersPanelVisible] = useState(false);

  const getDocument = useCallback(
    (id: string) => {
      const doc = props.documents.filter(d => d.id === id)[0];
      setCurrentDocument(doc);
    },
    [setCurrentDocument, props.documents]
  );

  const saveDocument = useCallback(
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
      return props.saveDocument({ document: documentToSave });
    },
    [props.saveDocument, currentDocument]
  );

  const updateSelectedObject = useCallback(
    (sender: PubShapeChanges) => {
      if (sender === null) {
        setSelectedObject(null);
        return;
      }
      const updatedSelectedObj: PubShape = { ...selectedObject, ...sender };
      if (updatedSelectedObj.type === PubShapeType.Text) {
        updatedSelectedObj.editorState = EditorState.moveSelectionToEnd(
          updatedSelectedObj.editorState
        );
      }
      const updatedDocument = produce(currentDocument, draftDocument => {
        const idx = currentDocument.pages[0].shapes.findIndex(
          shape => updatedSelectedObj.id === shape.id
        );
        draftDocument.pages[0].shapes[idx] = updatedSelectedObj;
      });
      setSelectedObject(updatedSelectedObj);
      setCurrentDocument(updatedDocument);
    },
    [currentDocument, setSelectedObject, setCurrentDocument]
  );

  const logout = useCallback(
    async () => {
      await saveDocument();
      window.localStorage.removeItem("authorization_token");
      setCurrentDocument(null);
      setSelectedObject(null);
      setLayersPanelVisible(false);
      setZoom(1);
      return await props.refetchCurrentUser({ skipCache: true });
    },
    [
      saveDocument,
      props.refetchCurrentUser,
      setCurrentDocument,
      setSelectedObject,
      setLayersPanelVisible,
      setZoom,
    ]
  );

  const addObject = useCallback(
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

  const adjustObjectLayer = useCallback(
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

  const deleteObject = useCallback(
    () => {
      if (!selectedObject || !currentDocument) {
        return;
      }
      const doc = produce(currentDocument, draftState => {
        const shapes = currentDocument.pages[0].shapes
          .filter(shape => shape.id !== selectedObject.id)
          .map(shape => {
            if (shape.z > selectedObject.z) {
              shape.z -= 1;
            }
            return shape;
          });
        draftState.pages[0].shapes = shapes;
      });
      setSelectedObject(null);
      setCurrentDocument(doc);
    },
    [setSelectedObject, setCurrentDocument, currentDocument, selectedObject]
  );

  const handleCreateNewDocument = useCallback(
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
      if (props.user) {
        try {
          const response = await props.saveDocument({
            document: payload,
          } as any);
          if (currentDocument) {
            await saveDocument();
          }
          setCurrentDocument(response.saveDocument);
          return;
        } catch (e) {
          return;
        }
      }
      setCurrentDocument(payload as PubDocument);
    },
    [
      currentDocument,
      saveDocument,
      setCurrentDocument,
      props.saveDocument,
      props.user,
    ]
  );

  const deleteDocument = useCallback(
    async (id: string | number) => {
      if (currentDocument && currentDocument.id === id) {
        setCurrentDocument(null);
        setSelectedObject(null);
      }
      return await props.deleteDocument({ id });
    },
    [
      props.deleteDocument,
      currentDocument,
      setCurrentDocument,
      setSelectedObject,
    ]
  );

  const handleClipboardAction = useCallback(
    (action: ClipboardAction) => {
      if (!currentDocument) {
        return;
      }
      if (action === ClipboardAction.Copy && selectedObject) {
        const copiedObj = duplicateObj(selectedObject);
        setClipboardContents(copiedObj);
      } else if (action === ClipboardAction.Cut && selectedObject) {
        const cutObj = duplicateObj(selectedObject);
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
    [
      selectedObject,
      currentDocument,
      setCurrentDocument,
      setSelectedObject,
      clipboardContents,
      setClipboardContents,
    ]
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
      adjustObjectLayer,
      handleCreateNewDocument,
      handleClipboardAction,
      login: props.login,
      createUser: props.createUser,
      refetchCurrentUser: props.refetchCurrentUser,
      logout,
    },
    aboutModalVisible,
    clipboardContents,
    currentDocument,
    documents: props.documents,
    dataLoaded: props.dataLoaded,
    selectedObject,
    zoom,
    user: props.user,
    newDocumentModalVisible,
    openDocumentModalVisible,
    loginModalVisible,
    startModalVisible,
    newAccountModalVisible,
    layersPanelVisible,
  };

  return (
    <StateContext.Provider value={appState}>
      <ViewContainer>
        <Toolbar />
        <MetricsBar />
        <DocumentView>
          <EditorView />
          <LayersSidebar />
        </DocumentView>
      </ViewContainer>
      <Modals />
    </StateContext.Provider>
  );
};

export default DocumentsView;
