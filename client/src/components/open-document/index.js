// @flow
import type { OpenDocProps, OpenDocState } from "./types";
import React from "react";
import Button from "../ui/framed-button";
import FileBrowser, { FileBrowserLoadingContainer } from "./file-browser";
import AsyncViewContent from "../async-content";
import { HeaderContainer, OpenDocumentContainer } from "./components";
import { ModalButtonContainer } from "../ui/button-container";
import { Spinner } from "../ui/spinner";
import { Header } from "../ui/text";

export default class extends React.Component<OpenDocProps, OpenDocState> {
  state = {
    selectedId: "",
  };

  componentDidMount() {
    this.props.getDocuments();
  }

  handleFileClicked = (id: string) => this.setState(() => ({ selectedId: id }));

  handleOpenButtonClicked = () => {
    this.props.onDismiss();
    this.props.replaceRoute(`/documents/${this.state.selectedId}`);
  };

  render() {
    const { props: { onDismiss, documents }, state: { selectedId } } = this;
    return (
      <OpenDocumentContainer>
        <HeaderContainer>
          <Header>Open Document</Header>
        </HeaderContainer>
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
