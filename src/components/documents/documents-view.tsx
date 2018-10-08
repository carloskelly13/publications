import React from "react";
import Toolbar from "../toolbar";
import EditorView from "../editor";
import MetricsBar from "../metrics-bar";
import LayersSidebar from "../layers-sidebar";
import get from "lodash/fp/get";
import Modals from "./modals";
import { ViewContainer, DocumentView } from "./components";
import { packageDocumentToJson } from "../../util/documents";
import {
  updatedDocumentStateForObjectChanges,
  updatedDocumentStateForLayerChanges,
  updatedDocumentStateForClipboardAction,
  updatedDocumentStateForDeleteAction,
  ClipboardAction,
  LayerMutationDelta,
} from "./editor-actions";
import shortid from "shortid";
import {
  currentUserQuery,
  documentsQuery,
  loginMutation,
  saveDocumentMutation,
  createUserMutation,
  deleteDocumentMutation,
} from "../../queries";
import { StateContext } from "../../contexts";
import {
  PubUser,
  PubDocument,
  PubShape,
  PubShapeChanges,
} from "../../types/pub-objects";
import {
  LoginMutation,
  RefetchCurrentUser,
  SaveDocumentMutation,
  DeleteDocumentMutation,
  CreateUserMutation,
} from "../../types/data";
import { metrics } from "../../util/constants";
import { PubAppState, PubActions } from "../../contexts/app-state";

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

interface State {
  documents: Array<PubDocument>;
  currentDocument: PubDocument | null;
  selectedObject: PubShape | null;
  clipboardContents: PubShape | null;
  newDocumentModalVisible: boolean;
  openDocumentModalVisible: boolean;
  startModalVisible: boolean;
  layersPanelVisible: boolean;
  loginModalVisible: boolean;
  newAccountModalVisible: boolean;
  aboutModalVisible: boolean;
  zoom: number;
}

export default class DocumentsView extends React.Component<Props, State> {
  state = {
    documents: [],
    currentDocument: null,
    selectedObject: null,
    clipboardContents: null,
    newDocumentModalVisible: false,
    openDocumentModalVisible: false,
    startModalVisible: true,
    layersPanelVisible: false,
    loginModalVisible: false,
    newAccountModalVisible: false,
    aboutModalVisible: false,
    zoom: 1,
  };

  getActions = (): PubActions => ({
    addObject: this.addObject,
    deleteObject: this.deleteObject,
    createUser: this.props.createUser,
    deleteDocument: this.deleteDocument,
    handleClipboardAction: this.handleClipboardAction,
    handleCreateNewDocument: this.handleCreateNewDocument,
    logout: this.logOut,
    login: this.props.login,
    refetchCurrentUser: this.props.refetchCurrentUser,
    getDocument: this.getDocument,
    saveDocument: this.saveDocument,
    setZoom: this.setZoom,
    showNewDocumentModal: this.showNewDocumentModal,
    hideNewDocumentModal: this.hideNewDocumentModal,
    showOpenDocumentModal: this.showOpenDocumentModal,
    hideOpenDocumentModal: this.hideOpenDocumentModal,
    toggleLayersPanel: this.toggleLayersPanel,
    updateSelectedObject: this.updateSelectedObject,
    adjustObjectLayer: this.adjustObjectLayer,
    toggleLoginDialog: this.showLoginModal,
    hideStartModal: this.hideStartModal,
    showNewAccountModal: this.showNewAccountModal,
    hideNewAccountModal: this.hideNewAccountModal,
    showLoginModal: this.showLoginModal,
    hideLoginModal: this.hideLoginModal,
    showAboutModal: this.showAboutModal,
    hideAboutModal: this.hideAboutModal,
  });

  getCurrentContextState = (): PubAppState => ({
    actions: this.getActions(),
    clipboardContents: this.state.clipboardContents,
    currentDocument: this.state.currentDocument,
    dataLoaded: this.props.dataLoaded,
    documents: this.props.documents,
    layersPanelVisible: this.state.layersPanelVisible,
    selectedObject: this.state.selectedObject,
    user: this.props.user,
    zoom: this.state.zoom,
    startModalVisible: this.state.startModalVisible,
    loginModalVisible: this.state.loginModalVisible,
    newAccountModalVisible: this.state.newAccountModalVisible,
    openDocumentModalVisible: this.state.openDocumentModalVisible,
    aboutModalVisible: this.state.aboutModalVisible,
    newDocumentModalVisible: this.state.newDocumentModalVisible,
  });

  /**
   * Display Actions
   */

  hideStartModal = () => this.setState({ startModalVisible: false });
  showNewAccountModal = () => this.setState({ newAccountModalVisible: true });
  hideNewAccountModal = () => this.setState({ newAccountModalVisible: false });
  showNewDocumentModal = () => this.setState({ newDocumentModalVisible: true });
  hideNewDocumentModal = () =>
    this.setState({ newDocumentModalVisible: false });
  showOpenDocumentModal = () =>
    this.setState({ openDocumentModalVisible: true });
  hideOpenDocumentModal = () =>
    this.setState({ openDocumentModalVisible: false });
  showLoginModal = () => this.setState({ loginModalVisible: true });
  hideLoginModal = () => this.setState({ loginModalVisible: false });
  showAboutModal = () => this.setState({ aboutModalVisible: true });
  hideAboutModal = () => this.setState({ aboutModalVisible: false });
  toggleLayersPanel = () =>
    this.setState(prevState => ({
      layersPanelVisible: !prevState.layersPanelVisible,
    }));

  /**
   * Data Actions
   */

  logOut = async () => {
    await this.saveDocument();
    window.localStorage.removeItem("authorization_token");
    this.setState({
      currentDocument: null,
      selectedObject: null,
      layersPanelVisible: false,
      zoom: 1,
    });
    return await this.props.refetchCurrentUser({ skipCache: true });
  };

  getDocument = (id: string) => {
    const doc = this.props.documents.filter(d => d.id === id)[0];
    this.setCurrentDocument(doc);
  };

  saveDocument = async (document?: PubDocument) => {
    if (!this.state.currentDocument && !document) {
      return;
    }
    const documentToSave = document || this.state.currentDocument;
    /**
     * If there is both a document passed as a param and currentDocument in
     * state then it’s being renamed. All we need to do is update the name.
     */
    if (document && this.state.currentDocument) {
      this.setState(prevState => ({
        currentDocument: {
          ...prevState.currentDocument,
          name: document.name,
        },
      }));
    }
    return this.props.saveDocument({
      document: {
        ...packageDocumentToJson(documentToSave),
        id: get("id")(documentToSave),
      },
    });
  };

  deleteDocument = async (id: string | number) => {
    if (this.state.currentDocument.id === id) {
      this.setState({
        currentDocument: null,
        selectedObject: null,
      });
    }
    return await this.props.deleteDocument({ id });
  };

  /**
   * Editor Actions
   */

  updateSelectedObject = (sender: PubShapeChanges) =>
    this.setState(
      (prevState: State): Pick<State, never> => {
        const updatedState = updatedDocumentStateForObjectChanges(
          sender,
          prevState.selectedObject!,
          prevState.currentDocument!
        );
        return updatedState;
      }
    );

  setZoom = (zoom: number = 1) => this.setState({ zoom });

  setCurrentDocument = (doc: PubDocument | null) =>
    this.setState(
      (prevState: State): Pick<State, never> => {
        const currentDocumentId = (prevState.currentDocument || { id: -1 }).id;
        const documentId = (doc || { id: -2 }).id;
        if (currentDocumentId === documentId) {
          return { currentDocument: doc, layersPanelVisible: true };
        } else {
          return {
            currentDocument: doc,
            layersPanelVisible: true,
            selectedObject: null,
            zoom: 1,
          };
        }
      },
      () => {
        if (doc && "id" in doc) {
          window.localStorage.setItem("current_document_id", doc.id!);
        }
      }
    );

  addObject = (sender: PubShape) => {
    const currentDocument = this.state.currentDocument as PubDocument | null;
    if (!currentDocument) {
      return;
    }
    const newObject = {
      ...sender,
      z: currentDocument.pages[0].shapes.length + 1,
      id: shortid.generate(),
    };
    this.setState(
      (prevState: State): Pick<State, never> => ({
        currentDocument: {
          ...prevState.currentDocument,
          pages: [
            {
              ...prevState.currentDocument.pages[0],
              shapes: [...prevState.currentDocument.pages[0].shapes, newObject],
            },
          ],
        },
        selectedObject: newObject,
      })
    );
  };

  deleteObject = (sender?: PubShape) =>
    this.setState(
      (prevState: State): Pick<State, never> =>
        updatedDocumentStateForDeleteAction(
          sender || prevState.selectedObject,
          prevState.currentDocument
        )
    );

  adjustObjectLayer = (sender: LayerMutationDelta) =>
    this.setState(
      (prevState: State): Pick<State, never> =>
        updatedDocumentStateForLayerChanges(sender, prevState.currentDocument)
    );

  handleClipboardAction = (action: ClipboardAction) =>
    this.setState(
      (prevState: State): Pick<State, never> =>
        updatedDocumentStateForClipboardAction(action, prevState)
    );

  handleCreateNewDocument = async (sender: {
    name: string;
    width: number;
    height: number;
  }) => {
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
    if (this.props.user) {
      try {
        const { saveDocument } = await this.props.saveDocument({
          document: payload,
        } as any);
        if (this.state.currentDocument) {
          await this.saveDocument();
        }
        this.setCurrentDocument(saveDocument);
        return;
      } catch (e) {
        return;
      }
    }
    this.setCurrentDocument(payload as any);
  };

  render() {
    return (
      <StateContext.Provider value={this.getCurrentContextState()}>
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
  }
}
