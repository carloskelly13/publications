import React from "react";
import styled from "styled-components";
import { ModalContent } from "../modal";
import Button from "../ui/framed-button";
import FileBrowser, { FileBrowserLoadingContainer } from "./file-browser";
import AsyncViewContent from "../async-content";
import { ModalButtonContainer } from "../ui/button-container";
import { Spinner } from "../ui/spinner";
import { Header } from "../ui/text";
import { AppColors } from "../../util/constants";

const OpenDocumentContainer = styled(ModalContent)`
  min-width: 630px;
  width: 85%;
  padding: 0 0 40px;
`;

const HeaderContainer = styled.div`
  padding: 1.5em 1.5em 1em;
  border-bottom: 1px solid ${AppColors.Gray};
`;

type Props = {
  documents?: Array,
  onDismiss: Function,
  replaceRoute: Function,
  getDocuments: Function,
};
type State = {
  selectedId: string,
};
export default class OpenDocument extends React.Component<Props, State> {
  state = {
    selectedId: "",
  };

  componentDidMount() {
    this.props.getDocuments();
  }

  handleFileClicked = id => this.setState(() => ({ selectedId: id }));

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
          waitFor={documents}
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
