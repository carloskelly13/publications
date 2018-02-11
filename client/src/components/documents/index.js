// @flow
import type { PubDocument, PubShape } from "../../util/types";
import React, { Component } from "react";
import PropTypes from "prop-types";
import Route from "react-router-dom/Route";
import Toolbar from "../toolbar";
import EditorView from "../editor";
import LoadingView from "./loading";
import AsyncViewContent from "../async-content";
import MetricsBar from "../metrics-bar";
import LayersSidebar from "../layers-sidebar/index";
import OpenDocumentDialog from "../open-document";
import NewDocumentDialog from "../new-document";
import Modal from "../modal";
import to from "await-to-js";
import getOr from "lodash/fp/getOr";
import Api, { clearCsrfHeaders } from "../../util/api";
import { ViewContainer, ViewContent } from "./styled-components";
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
} from "./editor-actions";
import shortid from "shortid";

type DocumentState = {
  user: ?Object,
  documents: PubDocument[],
  currentDocument: ?PubDocument,
  selectedObject: ?PubShape,
  clipboardContents: ?PubShape,
  newDocumentModalVisible: boolean,
  openDocumentModalVisible: boolean,
  layersPanelVisible: boolean,
  zoom: number,
};

export default class DocumentsView extends Component<{}, DocumentState> {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  state = {
    user: null,
    documents: [],
    currentDocument: null,
    selectedObject: null,
    clipboardContents: null,
    newDocumentModalVisible: false,
    openDocumentModalVisible: false,
    layersPanelVisible: false,
    zoom: 1,
  };

  componentDidMount() {
    this.getCurrentUser();
  }

  /**
   * Display Actions
   */

  toggleVisibility = (identifier: string) => {
    const key = `${identifier}Visible`;
    this.setState(prevState => ({
      [key]: !prevState[key],
    }));
  };

  toggleNewDocument = this.toggleVisibility.bind(this, "newDocumentModal");
  toggleOpenDocument = this.toggleVisibility.bind(this, "openDocumentModal");
  toggleLayersPanel = this.toggleVisibility.bind(this, "layersPanel");

  /**
   * Data Actions
   */

  logOut = async () => {
    await to(Api.DELETE("users/logout"));
    clearCsrfHeaders();
    this.context.router.history.replace("/");
  };

  getCurrentUser = async () => {
    const [err, user] = await to(Api.GET("users/current"));
    if (err) {
      this.context.router.history.replace("/");
      return;
    }
    this.setState({ user });
  };

  getDocuments = async () => {
    const [err, documents] = await to(Api.GET("documents"));
    if (err) {
      this.setState({ documents: [] });
      return;
    }
    this.setState({
      documents: documentsWithEditorState(documents),
      selectedObject: null,
    });
  };

  getDocument = async (id: string) => {
    const [err, doc] = await to(Api.GET(`documents/${id}`));
    if (err) {
      this.context.router.history.replace("/documents");
      return;
    }
    this.setState({
      currentDocument: addEditorStateToDocument(doc),
      selectedObject: null,
      zoom: 1,
    });
  };

  saveDocument = async () => {
    if (!this.state.currentDocument) {
      return;
    }
    const { id } = this.state.currentDocument;
    const [err] = await to(
      Api.PUT(
        `documents/${id}`,
        packageDocumentToJson(this.state.currentDocument)
      )
    );
    if (err) {
      return;
    }
    console.log("Saved Document."); // eslint-disable-line no-console
  };

  /**
   * Editor Actions
   */

  updateSelectedObject = (sender: ?Object) =>
    this.setState(prevState =>
      updatedDocumentStateForObjectChanges(
        sender,
        prevState.selectedObject,
        prevState.currentDocument
      )
    );

  setZoom = (zoom: number = 1) => this.setState({ zoom });

  addObject = (sender: Object) => {
    if (!this.state.currentDocument) {
      return;
    }
    const newObject = {
      ...sender,
      z: this.state.currentDocument.shapes.length + 1,
      id: shortid.generate(),
    };
    this.setState(prevState => ({
      currentDocument: {
        ...prevState.currentDocument,
        shapes: [...getOr("currentDocument.shapes", [])(prevState), newObject],
      },
      selectedObject: newObject,
    }));
  };

  deleteObject = (sender: ?Object) =>
    this.setState(prevState =>
      updatedDocumentStateForDeleteAction(
        sender || prevState.selectedObject,
        prevState.currentDocument
      )
    );

  adjustObjectLayer = (sender: Object) =>
    this.setState(prevState =>
      updatedDocumentStateForLayerChanges(sender, prevState.currentDocument)
    );

  handleClipboardAction = (action: string) =>
    this.setState(prevState =>
      updatedDocumentStateForClipboardAction(action, prevState)
    );

  /**
   * Render
   */

  render() {
    const {
      state: {
        user,
        documents,
        currentDocument,
        selectedObject,
        openDocumentModalVisible,
        newDocumentModalVisible,
        layersPanelVisible,
        clipboardContents,
      },
    } = this;
    return (
      <ViewContainer>
        <Modal
          renderContent={
            <OpenDocumentDialog
              documents={documents}
              getDocuments={this.getDocuments}
              replaceRoute={this.context.router.history.replace}
              onDismiss={this.toggleOpenDocument}
            />
          }
          visible={openDocumentModalVisible}
        />
        <Modal
          renderContent={
            <NewDocumentDialog onDismiss={this.toggleNewDocument} />
          }
          visible={newDocumentModalVisible}
        />
        <Toolbar
          user={user}
          selectedObject={selectedObject}
          currentDocument={currentDocument}
          clipboardContents={clipboardContents}
          layersPanelVisible={layersPanelVisible}
          zoom={this.state.zoom}
          actions={{
            addObject: this.addObject,
            deleteObject: this.deleteObject,
            handleClipboardAction: this.handleClipboardAction,
            logOut: this.logOut,
            saveDocument: this.saveDocument,
            setZoom: this.setZoom,
            showNewDocumentModal: this.toggleNewDocument,
            showOpenDocumentModal: this.toggleOpenDocument,
            toggleLayersPanel: this.toggleLayersPanel,
          }}
        />
        <MetricsBar
          shape={selectedObject}
          updateSelectedObject={this.updateSelectedObject}
        />
        <ViewContent>
          <AsyncViewContent
            waitFor={user}
            renderLoading={<LoadingView />}
            renderContent={
              <Route
                path="/documents/:id"
                render={props => (
                  <div>
                    <LayersSidebar
                      visible={layersPanelVisible}
                      currentDocument={currentDocument}
                      selectedObject={selectedObject}
                      adjustObjectLayer={this.adjustObjectLayer}
                      updateSelectedObject={this.updateSelectedObject}
                    />
                    <EditorView
                      {...props}
                      selectedObject={selectedObject}
                      currentDocument={currentDocument}
                      getDocument={this.getDocument}
                      updateSelectedObject={this.updateSelectedObject}
                      zoom={this.state.zoom}
                    />
                  </div>
                )}
              />
            }
          />
        </ViewContent>
      </ViewContainer>
    );
  }
}
