import React from "react";
import Button from "../ui/framed-button";
import FileBrowser from "./file-browser";
import { OpenDocumentContainer, DeleteConfirmationBar } from "./components";
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
  onOpenDocument(id: string): void;
}

interface State {
  selectedDocument: PubDocument | null;
  showDeleteConfirmBar: boolean;
}

export default class extends React.Component<Props, State> {
  state = {
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
          Are you sure you want to delete{" "}
          {(this.state.selectedDocument || {}).name || ""}? This operation
          cannot be undone.
          <div>
            <Button
              marginRight
              onClick={this.handleCancelDeleteDocumentButtonClicked}
            >
              Cancel
            </Button>
            <Button onClick={() => {}}>Close</Button>
          </div>
        </AnimatedDeleteConfirmationBar>
      </OpenDocumentContainer>
    );
  }
}
