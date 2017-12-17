import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
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
import Api from "../../util/api";
import {
  documentsWithEditorState,
  addEditorStateToDocument,
} from "../../util/documents";
import { newStateForChanges } from "./editor-actions";

const ViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ViewContent = styled.div`
  display: flex;
  flex: 1 0 calc(100% - 85px);
`;

export default class DocumentsView extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  state = {
    user: null,
    documents: null,
    currentDocument: null,
    selectedObject: null,
    newDocumentModalVisible: false,
    openDocumentModalVisible: false,
  };

  componentDidMount() {
    this.getCurrentUser();
  }

  toggleModal = identifier => {
    const key = `${identifier}ModalVisible`;
    this.setState(prevState => ({
      [key]: !prevState[key],
    }));
  };

  toggleNewDocument = this.toggleModal.bind(this, "newDocument");
  toggleOpenDocument = this.toggleModal.bind(this, "openDocument");

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
      this.setState({ documents: null });
      return;
    }
    this.setState({
      documents: documentsWithEditorState(documents),
      selectedObject: null,
    });
  };

  getDocument = async id => {
    const [err, doc] = await to(Api.GET(`documents/${id}`));
    if (err) {
      return;
    }
    this.setState({
      currentDocument: addEditorStateToDocument(doc),
      selectedObject: null,
    });
  };

  updateSelectedObject = sender =>
    this.setState(prevState =>
      newStateForChanges(
        sender,
        prevState.selectedObject,
        prevState.currentDocument
      )
    );

  render() {
    const {
      props: { sidePanelVisible = false },
      state: {
        user,
        documents,
        currentDocument,
        selectedObject,
        openDocumentModalVisible,
        newDocumentModalVisible,
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
          showNewDocumentModal={this.toggleNewDocument}
          showOpenDocumentModal={this.toggleOpenDocument}
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
              <div>
                <LayersSidebar
                  visible={sidePanelVisible}
                  currentDocument={currentDocument}
                  selectedObject={selectedObject}
                  adjustShapeLayer={() => {}}
                  updateSelectedObject={this.updateSelectedObject}
                />
                <Route
                  path="/documents/:id"
                  render={props => (
                    <EditorView
                      {...props}
                      selectedObject={selectedObject}
                      currentDocument={currentDocument}
                      getDocument={this.getDocument}
                      updateSelectedObject={this.updateSelectedObject}
                    />
                  )}
                />
              </div>
            }
          />
        </ViewContent>
      </ViewContainer>
    );
  }
}
