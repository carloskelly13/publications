// @flow
import type { PubDocument } from "../../util/types";
import React from "react";
import PropTypes from "prop-types";
import Button from "../ui/framed-button";
import FileBrowser from "./file-browser";
import AsyncViewContent from "../async-content";
import {
  OpenDocumentContainer,
  FileBrowserLoadingContainer,
} from "./components";
import { ModalButtonContainer } from "../ui/button-container";
import { Spinner } from "../ui/spinner";

type Props = {
  documents: PubDocument[],
  onDismiss: () => void,
  getDocuments: () => Promise<void>,
};
type State = {
  selectedId: string,
};

export default class extends React.Component<Props, State> {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  state = {
    selectedId: "",
  };

  componentDidMount() {
    this.props.getDocuments();
  }

  handleFileClicked = (id: string) => this.setState(() => ({ selectedId: id }));

  handleOpenButtonClicked = () => {
    this.props.onDismiss();
    this.context.router.history.push(`/documents/${this.state.selectedId}`);
  };

  render() {
    const { props: { onDismiss, documents }, state: { selectedId } } = this;
    return (
      <OpenDocumentContainer>
        <AsyncViewContent
          waitFor={documents.length !== 0}
          renderLoading={
            <FileBrowserLoadingContainer>
              <Spinner />
            </FileBrowserLoadingContainer>
          }
          renderContent={
            <FileBrowser
              documents={documents}
              selectedFileId={selectedId}
              handleFileClicked={this.handleFileClicked}
            />
          }
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
