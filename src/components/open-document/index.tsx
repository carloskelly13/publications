import React from "react";
import Button from "../ui/framed-button";
import FileBrowser from "./file-browser";
import { OpenDocumentContainer } from "./components";
import { ModalButtonContainer } from "../ui/button-container";
import { PubDocument } from "../../types/pub-objects";

interface Props {
  documents: Array<PubDocument>;
  onDismiss(): void;
  onOpenDocument(id: string): Promise<any>;
}

interface State {
  selectedId: string;
}

export default class extends React.Component<Props, State> {
  state = {
    selectedId: "",
  };

  handleFileClicked = (id: string) => this.setState(() => ({ selectedId: id }));

  handleOpenButtonClicked = () => {
    this.props.onDismiss();
    this.props.onOpenDocument(this.state.selectedId);
  };

  render() {
    const {
      props: { onDismiss, documents },
      state: { selectedId },
    } = this;
    return (
      <OpenDocumentContainer>
        <FileBrowser
          documents={documents}
          selectedFileId={selectedId}
          handleFileClicked={this.handleFileClicked}
        />
        <ModalButtonContainer>
          <Button
            marginRight
            disabled={selectedId === ""}
            onClick={this.handleOpenButtonClicked}
          >
            Open Document
          </Button>
          <Button onClick={onDismiss}>Close</Button>
        </ModalButtonContainer>
      </OpenDocumentContainer>
    );
  }
}
