// @flow
import React from "react";
import LogoBanner from "../ui/logo-banner";
import Button from "../ui/framed-button";
import TextButton from "../ui/text-button";
import styled from "styled-components";
import DocumentIcon from "../ui/icons/document";
import UserLockIcon from "../ui/icons/user-lock";
import UserBadgeIcon from "../ui/icons/user-badge";
import { ActionsContext } from "../../contexts";
import { ModalButtonContainer } from "../ui/button-container";
import { ModalContent } from "../modal";
import { Colors } from "../../util/constants";

const Container = styled.div`
  display: flex;
  padding: 2em;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
`;

const StartModalContent = styled(ModalContent)`
  width: 600px;
`;

const StartButton = styled(TextButton)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const ButtonTextContainer = styled.div`
  flex: 1;
  text-align: left;
  margin: 0 0 0 8px;
`;

const ButtonTitle = styled.div`
  font-weight: bold;
  font-size: 1.25em;
  margin-bottom: 0.2em;
  color: ${Colors.StartModal.ButtonText};
`;

const ButtonDescription = styled.div`
  color: ${Colors.StartModal.ButtonText};
`;

export default () => (
  <ActionsContext.Consumer>
    {({ hideStartModal, showNewDocumentModal }) => (
      <StartModalContent>
        <Container>
          <LogoBanner backgroundColor={Colors.Modal.ModalBackground} />
        </Container>
        <StartButton
          onClick={() => {
            hideStartModal();
            setTimeout(showNewDocumentModal, 250);
          }}
        >
          <DocumentIcon />
          <ButtonTextContainer>
            <ButtonTitle>New Document</ButtonTitle>
            <ButtonDescription>
              Start with a new portrait or landscape document.
            </ButtonDescription>
          </ButtonTextContainer>
        </StartButton>
        <StartButton onClick={() => {}}>
          <UserLockIcon />
          <ButtonTextContainer>
            <ButtonTitle>Log In</ButtonTitle>
            <ButtonDescription>
              Log into Publications to save and open existing documents.
            </ButtonDescription>
          </ButtonTextContainer>
        </StartButton>
        <ModalButtonContainer>
          <Button marginRight onClick={hideStartModal}>
            Close
          </Button>
        </ModalButtonContainer>
        <StartButton onClick={() => {}}>
          <UserBadgeIcon />
          <ButtonTextContainer>
            <ButtonTitle>Sign Up</ButtonTitle>
            <ButtonDescription>
              Create a free Publications account so you can save your documents.
            </ButtonDescription>
          </ButtonTextContainer>
        </StartButton>
        <ModalButtonContainer>
          <Button marginRight onClick={hideStartModal}>
            Close
          </Button>
        </ModalButtonContainer>
      </StartModalContent>
    )}
  </ActionsContext.Consumer>
);
