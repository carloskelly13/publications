import React from "react";
import LogoBanner from "../ui/logo-banner";
import Button from "../ui/framed-button";
import DocumentIcon from "../ui/icons/document";
import UserLockIcon from "../ui/icons/user-lock";
import UserBadgeIcon from "../ui/icons/user-badge";
import { StateContext } from "../../contexts";
import { ModalButtonContainer } from "../ui/button-container";
import { Colors } from "../../util/constants";
import {
  ButtonDescription,
  ButtonTextContainer,
  ButtonTitle,
  Container,
  StartButton,
  StartButtonContainer,
  StartModalContent,
} from "./styles";

export default () => (
  <StateContext.Consumer>
    {({
      actions: {
        hideStartModal,
        showNewDocumentModal,
        toggleLoginDialog,
        showNewAccountModal,
      },
    }) => (
      <StartModalContent>
        <Container>
          <LogoBanner backgroundColor={Colors.Modal.ModalBackground} />
        </Container>
        <StartButtonContainer>
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
          <StartButton
            onClick={() => {
              hideStartModal();
              setTimeout(toggleLoginDialog, 250);
            }}
          >
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
          <StartButton
            onClick={() => {
              hideStartModal();
              setTimeout(showNewAccountModal, 250);
            }}
          >
            <UserBadgeIcon />
            <ButtonTextContainer>
              <ButtonTitle>Sign Up</ButtonTitle>
              <ButtonDescription>
                Create a free Publications account so you can save your
                documents.
              </ButtonDescription>
            </ButtonTextContainer>
          </StartButton>
        </StartButtonContainer>
        <ModalButtonContainer>
          <Button marginRight onClick={hideStartModal}>
            Close
          </Button>
        </ModalButtonContainer>
      </StartModalContent>
    )}
  </StateContext.Consumer>
);
