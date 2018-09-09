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

const AnimatedDeleteConfirmationBar = posed(DeleteConfirmationBar)({
  show: { top: 0 },
  hide: { top: -70 },
});

const AnimatedModalButtonContainer = posed(ModalButtonContainer)({
  show: { bottom: 0 },
  hide: { bottom: -51 },
});

interface Props {
  documents: Array<PubDocument>;
  onDismiss(): void;
  onOpenDocument(id: string | number): void;
  onDeleteDocument(id: string | number): void;
}

interface State {
  selectedDocument: PubDocument | null;
  showDeleteConfirmBar: boolean;
}

export default class extends React.Component<Props, State> {
  readonly state: State = {
    selectedDocument: null,
    showDeleteConfirmBar: false,
  };

  handleFileClicked = (doc: PubDocument) =>
    this.setState(() => ({ selectedDocument: doc }));

  handleOpenButtonClicked = () => {
    this.props.onDismiss();
    this.props.onOpenDocument(this.state.selectedDocument.id);
  };

  handleDeleteButtonClicked = () => {
    this.setState({ showDeleteConfirmBar: true });
  };

  handleCancelDeleteDocumentButtonClicked = () =>
    this.setState({ showDeleteConfirmBar: false });

  handleConfirmDeleteDocumentButtonClicked = async () => {
    await this.props.onDeleteDocument(this.state.selectedDocument!.id);
    this.setState({ showDeleteConfirmBar: false });
  };

  render() {
    const {
      props: { onDismiss, documents },
      state: { selectedDocument },
    } = this;
    const selectedId = (selectedDocument && selectedDocument.id) || "";
    return (
      <OpenDocumentContainer>
        <FileBrowser
          documents={documents}
          selectedFileId={selectedId}
          disabled={this.state.showDeleteConfirmBar}
          handleFileClicked={this.handleFileClicked}
        />
        <AnimatedModalButtonContainer
          pose={this.state.showDeleteConfirmBar ? "hide" : "show"}
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
            onClick={this.handleDeleteButtonClicked}
          >
            Delete Document…
          </Button>
          <Button onClick={onDismiss}>Close</Button>
        </AnimatedModalButtonContainer>
        <AnimatedDeleteConfirmationBar
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
        </AnimatedDeleteConfirmationBar>
      </OpenDocumentContainer>
    );
  }
}
