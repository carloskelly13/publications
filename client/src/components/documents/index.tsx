import React, { Component } from "react";
import Toolbar from "../toolbar";
import EditorView from "../editor";
import MetricsBar from "../metrics-bar";
import LayersSidebar from "../layers-sidebar";
import OpenDocumentDialog from "../open-document";
import LoginDialog from "../login";
import NewAccountDialog, { NewAccount } from "../new-account";
import NewDocumentDialog from "../new-document";
import Modal from "../modal";
import to from "await-to-js";
import getOr from "lodash/fp/getOr";
import { clearCsrfHeaders, apiRequest, RestMethod } from "../../util/api";
import { ViewContainer, DocumentView } from "./components";
import { metrics } from "../../util/constants";
import StartModal from "../start-modal";

import {
  documentsWithEditorState,
  addEditorStateToDocument,
  packageDocumentToJson,
} from "../../util/documents";
import {
  updatedDocumentStateForObjectChanges,
  updatedDocumentStateForLayerChanges,
  updatedDocumentStateForClipboardAction,
  updatedDocumentStateForDeleteAction,
  ClipboardAction,
  LayerMutationDelta,
} from "./editor-actions";
import shortid from "shortid";
import { StateContext } from "../../contexts";
import {
  PubUser,
  PubDocument,
  PubShape,
  PubShapeChanges,
} from "../../types/pub-objects";

interface Props {
  user: PubUser | null;
  setAppUser(user: PubUser | null): void;
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
  zoom: number;
}

export default class DocumentsView extends Component<Props, State> {
  state = {
    documents: [],
    currentDocument: null,
    selectedObject: null,
    clipboardContents: null,
    newDocumentModalVisible: false,
    openDocumentModalVisible: false,
    startModalVisible: false,
    layersPanelVisible: false,
    loginModalVisible: false,
    newAccountModalVisible: false,
    zoom: 1,
  };

  getActions = () => ({
    addObject: this.addObject,
    deleteObject: this.deleteObject,
    handleClipboardAction: this.handleClipboardAction,
    logout: this.logOut,
    getDocument: this.getDocument,
    saveDocument: this.saveDocument,
    setZoom: this.setZoom,
    showNewDocumentModal: this.showNewDocumentModal,
    showOpenDocumentModal: this.showOpenDocumentModal,
    toggleLayersPanel: this.toggleLayersPanel,
    updateSelectedObject: this.updateSelectedObject,
    adjustObjectLayer: this.adjustObjectLayer,
    toggleLoginDialog: this.showLoginModal,
    hideStartModal: this.hideStartModal,
    showNewAccountModal: this.showNewAccountModal,
    showLoginModal: this.showLoginModal,
    hideLoginModal: this.hideLoginModal,
  });

  componentDidMount() {
    if (!this.props.user) {
      this.getCurrentUser();
    }
  }

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
  toggleLayersPanel = () =>
    this.setState(prevState => ({
      layersPanelVisible: !prevState.layersPanelVisible,
    }));

  /**
   * Data Actions
   */

  logOut = async () => {
    await to(apiRequest(RestMethod.DELETE, "users/logout"));
    clearCsrfHeaders();
    this.props.setAppUser(null);
    window.localStorage.removeItem("currentDocumentId");

    if (!this.state.currentDocument) {
      this.setState({ startModalVisible: true });
    }
  };

  createAccount = async (account: NewAccount) => {
    const [error, user] = await to<PubUser | null>(
      apiRequest(RestMethod.POST, "users", account)
    );
    if (error || !user) {
      return "There was an error creating your account. Verify the email address is not already in use.";
    }
    this.props.setAppUser(user);
    return null;
  };

  getCurrentUser = async () => {
    const [err, user] = await to<PubUser | null>(
      apiRequest(RestMethod.GET, "users/current")
    );
    if (!err && user) {
      this.props.setAppUser(user);

      const lastViewedDocumentId = window.localStorage.getItem(
        "currentDocumentId"
      );
      if (lastViewedDocumentId) {
        this.getDocument(lastViewedDocumentId);
      }

      return;
    }
    const savedLocalDocumentJSON = window.localStorage.getItem(
      "saved-local-document"
    );
    if (savedLocalDocumentJSON) {
      try {
        const savedLocalDocument = JSON.parse(savedLocalDocumentJSON);
        this.setCurrentDocument(addEditorStateToDocument(savedLocalDocument));
      } catch (e) {
        this.setState({ startModalVisible: true });
      }
      return;
    }
    this.setState({ startModalVisible: true });
  };

  getDocuments = async () => {
    const [err, documents] = await to<Array<PubDocument> | null>(
      apiRequest(RestMethod.GET, "documents")
    );
    if (err || !documents) {
      this.setState({ documents: [] });
      return;
    }
    this.setState({
      documents: documentsWithEditorState(documents),
      selectedObject: null,
    });
  };

  getDocument = async (id: string) => {
    if (!this.props.user) {
      return;
    }
    const [err, doc] = await to<PubDocument | null>(
      apiRequest(RestMethod.GET, `documents/${id}`)
    );
    if (err || !doc) {
      return;
    }
    this.setCurrentDocument(addEditorStateToDocument(doc));
  };

  saveDocument = async () => {
    if (!this.state.currentDocument) {
      return;
    }
    const packagedDocument = packageDocumentToJson(this.state.currentDocument);
    const id = getOr(null, "id")(this.state.currentDocument);

    if (!this.props.user) {
      window.localStorage.setItem(
        "saved-local-document",
        JSON.stringify(packagedDocument)
      );
      return;
    }

    if (id) {
      const [err] = await to<PubDocument | null>(
        apiRequest(RestMethod.PUT, `documents/${id}`, packagedDocument)
      );
      if (err) {
        return;
      }
      return;
    }
    const [err, doc] = await to<PubDocument | null>(
      apiRequest(RestMethod.POST, "documents", packagedDocument)
    );
    if (err || !doc) {
      return;
    }
    this.setCurrentDocument(doc);
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
          window.localStorage.setItem("currentDocumentId", doc.id);
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
      z: currentDocument.shapes.length + 1,
      id: shortid.generate(),
    };
    this.setState(
      (prevState: State): Pick<State, never> => ({
        currentDocument: {
          ...prevState.currentDocument,
          shapes: [
            ...(prevState.currentDocument || { shapes: [] }).shapes,
            newObject,
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
    orientation: string;
  }) => {
    const payload = {
      name: sender.name,
      ...metrics[sender.orientation],
      shapes: [],
    };
    if (this.props.user) {
      const [err, doc] = await to<PubDocument | null>(
        apiRequest(RestMethod.POST, "documents", payload)
      );
      if (err || !doc) {
        return;
      }
      if (this.state.currentDocument) {
        await this.saveDocument();
      }
      this.setCurrentDocument(doc);
      return;
    }
    this.setCurrentDocument(payload);
  };

  /**
   * Render
   */

  render() {
    const { currentDocument } = this.state;
    const currentState = {
      actions: this.getActions(),
      currentDocument,
      user: this.props.user,
      selectedObject: this.state.selectedObject,
      clipboardContents: this.state.clipboardContents,
      zoom: this.state.zoom,
      layersPanelVisible: this.state.layersPanelVisible,
    };
    return (
      <StateContext.Provider value={currentState}>
        <ViewContainer>
          <Modal
            renderContent={<StartModal />}
            visible={this.state.startModalVisible}
          />
          <Modal
            renderContent={
              <LoginDialog
                onLogin={this.props.setAppUser}
                onDismiss={this.hideLoginModal}
              />
            }
            visible={this.state.loginModalVisible}
          />
          <Modal
            renderContent={
              <NewAccountDialog
                onCreateAccount={this.createAccount}
                onDismiss={this.hideNewAccountModal}
              />
            }
            visible={this.state.newAccountModalVisible}
          />
          <Modal
            renderContent={
              <OpenDocumentDialog
                documents={this.state.documents}
                getDocuments={this.getDocuments}
                onOpenDocument={this.getDocument}
                onDismiss={this.hideOpenDocumentModal}
              />
            }
            visible={this.state.openDocumentModalVisible}
          />
          <Modal
            renderContent={
              <NewDocumentDialog
                onDismiss={this.hideNewDocumentModal}
                didCreateDocument={this.handleCreateNewDocument}
              />
            }
            visible={this.state.newDocumentModalVisible}
          />
          <Toolbar />
          <MetricsBar />
          <DocumentView>
            <EditorView />
            <LayersSidebar />
          </DocumentView>
        </ViewContainer>
      </StateContext.Provider>
    );
  }
}
