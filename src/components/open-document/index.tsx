import React from "react";
import Button from "../ui/framed-button";
import FileBrowser from "./file-browser";
import {
  OpenDocumentContainer,
  DeleteConfirmationBar,
  DeleteWarning,
} from "./components";
import { ModalButtonContainer } from "../ui/button-container";
import { PubDocument } from "../../types/pub-objects";
import posed from "react-pose";
import FormInput from "../ui/form-input";
import styled from "styled-components";
import { Colors } from "../../util/constants";
import { StateContext } from "../../contexts";

const AnimatedActionBar = posed(DeleteConfirmationBar)({
  show: { top: 0 },
  hide: { top: -70 },
});

const AnimatedModalButtonContainer = posed(ModalButtonContainer)({
  show: { bottom: 0 },
  hide: { bottom: -51 },
});

const RenameInputContainer = styled.div`
  flex: 1;
  padding: 0 1em 0 0;
  input {
    margin: 0;
    background: ${Colors.FormInput.MetricBackground};
  }
`;

interface Props {
  documents: Array<PubDocument>;
  onDismiss(): void;
  onOpenDocument(id: string | number): void;
  onDeleteDocument(id: string | number): void;
  onRenameDocument(doc: PubDocument): void;
}

interface State {
  selectedDocument: PubDocument | null;
  showDeleteConfirmBar: boolean;
  showRenameActionBar: boolean;
  potentialNewDocumentName: string;
}

class OpenDocumentDialog extends React.Component<Props, State> {
  readonly state: State = {
    selectedDocument: null,
    showDeleteConfirmBar: false,
    showRenameActionBar: false,
    potentialNewDocumentName: "",
  };

  renameInputRef: HTMLInputElement;

  handleFileClicked = (doc: PubDocument) =>
    this.setState(() => ({ selectedDocument: doc }));

  handleOpenButtonClicked = () => {
    this.props.onDismiss();
    this.props.onOpenDocument(this.state.selectedDocument.id);
  };

  handleDeleteButtonClicked = () => {
    this.setState({ showDeleteConfirmBar: true });
  };

  handleRenameDocumentClicked = () => {
    this.setState(prevState => ({
      showRenameActionBar: true,
      potentialNewDocumentName: prevState.selectedDocument!.name,
    }));
    this.renameInputRef.focus();
  };

  handleCancelDeleteDocumentButtonClicked = () =>
    this.setState({ showDeleteConfirmBar: false });

  handleCancelRenameDocumentButtonClicked = () =>
    this.setState({ showRenameActionBar: false });

  handleConfirmDeleteDocumentButtonClicked = async () => {
    await this.props.onDeleteDocument(this.state.selectedDocument!.id);
    this.setState({ showDeleteConfirmBar: false });
  };

  handleConfirmRenameButtonClicked = async () => {
    if (this.state.potentialNewDocumentName.trim().length) {
      this.props.onRenameDocument({
        ...this.state.selectedDocument,
        name: this.state.potentialNewDocumentName,
      });
      this.setState({
        showRenameActionBar: false,
        potentialNewDocumentName: "",
      });
    }
  };

  render() {
    const {
      props: { onDismiss, documents },
      state: { selectedDocument, showDeleteConfirmBar, showRenameActionBar },
    } = this;
    const selectedId = (selectedDocument && selectedDocument.id) || "";
    return (
      <OpenDocumentContainer>
        <FileBrowser
          documents={documents}
          selectedFileId={selectedId}
          disabled={showDeleteConfirmBar || showRenameActionBar}
          handleFileClicked={this.handleFileClicked}
        />
        <AnimatedModalButtonContainer
          pose={showDeleteConfirmBar || showRenameActionBar ? "hide" : "show"}
        >
          <Button
            marginRight
            disabled={selectedId === ""}
            onClick={this.handleOpenButtonClicked}
          >
            Open Document
          </Button>
          <Button
            marginRight
            disabled={selectedId === ""}
            onClick={this.handleRenameDocumentClicked}
          >
            Rename Document…
          </Button>
          <Button
            marginRight
            disabled={selectedId === ""}
            onClick={this.handleDeleteButtonClicked}
          >
            Delete Document…
          </Button>
          <Button onClick={onDismiss}>Close</Button>
        </AnimatedModalButtonContainer>
        <AnimatedActionBar
          pose={this.state.showDeleteConfirmBar ? "show" : "hide"}
        >
          <span>
            Are you sure you want to delete{" "}
            {(this.state.selectedDocument || { name: "" }).name || ""}?
            <DeleteWarning>This operation cannot be undone.</DeleteWarning>
          </span>
          <div>
            <Button
              destructive
              marginRight
              onClick={this.handleConfirmDeleteDocumentButtonClicked}
            >
              Delete
            </Button>
            <Button onClick={this.handleCancelDeleteDocumentButtonClicked}>
              Cancel
            </Button>
          </div>
        </AnimatedActionBar>
        <AnimatedActionBar
          pose={this.state.showRenameActionBar ? "show" : "hide"}
        >
          <RenameInputContainer>
            <FormInput
              innerRef={i => (this.renameInputRef = i)}
              placeholder="Document Name"
              name="name"
              onChange={({ target }) =>
                this.setState({ potentialNewDocumentName: target.value })
              }
              value={this.state.potentialNewDocumentName}
            />
          </RenameInputContainer>
          <div>
            <Button
              marginRight
              disabled={this.state.potentialNewDocumentName.trim().length === 0}
              onClick={this.handleConfirmRenameButtonClicked}
            >
              Rename
            </Button>
            <Button onClick={this.handleCancelRenameDocumentButtonClicked}>
              Cancel
            </Button>
          </div>
        </AnimatedActionBar>
      </OpenDocumentContainer>
    );
  }
}

export default () => (
  <StateContext.Consumer>
    {({ documents, actions }) => (
      <OpenDocumentDialog
        documents={documents}
        onOpenDocument={actions.getDocument}
        onDeleteDocument={actions.deleteDocument}
        onRenameDocument={actions.saveDocument}
        onDismiss={actions.hideOpenDocumentModal}
      />
    )}
  </StateContext.Consumer>
);
