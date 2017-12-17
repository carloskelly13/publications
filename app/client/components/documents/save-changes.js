// @flow
import React from "react";
import styled from "styled-components";
import FramedButton from "../ui/framed-button";
import { ModalButtonContainer } from "../ui/button-container";
import { Header, Message } from "../ui/text";
import { ModalContent } from "../modal";

const SaveChangesContainer = styled(ModalContent)`
  width: 400px;
`;

type SaveChangesProps = {
  handleRouteChange: Function,
  saveDocument: Function,
  hideModal: Function,
  currentDocument?: Object,
};
export default class extends React.Component<SaveChangesProps> {
  renderNewDocumentContent() {
    return (
      <div>
        <Header>Save</Header>
        <Message>Do you want to save changes to your new document?</Message>
      </div>
    );
  }

  renderExistingDocumentContent() {
    const { currentDocument } = this.props;
    return (
      <div>
        <Header>Save Changes</Header>
        <Message>
          Do you want to save changes to {currentDocument.name}?
        </Message>
      </div>
    );
  }

  render() {
    const { currentDocument, dispatch } = this.props;
    return (
      <SaveChangesContainer>
        {currentDocument.new
          ? this.renderNewDocumentContent()
          : this.renderExistingDocumentContent()}
        <ModalButtonContainer>
          <FramedButton
            primary
            marginRight
            onClick={() => dispatch({ type: "CONFIRM_SAVE_ACTION" })}
          >
            Save{currentDocument.new ? "" : " Changes"}
          </FramedButton>
          <FramedButton
            marginRight
            onClick={() => dispatch({ type: "CONFIRM_DISCARD_ACTION" })}
          >
            Discard{currentDocument.new ? "" : " Changes"}
          </FramedButton>
          <FramedButton onClick={() => dispatch({ type: "HIDE_MODAL" })}>
            Cancel
          </FramedButton>
        </ModalButtonContainer>
      </SaveChangesContainer>
    );
  }
}
