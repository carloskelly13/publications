import React from "react";
import Button from "../ui/framed-button";
import DocumentIcon from "../ui/icons/document";
import UserLockIcon from "../ui/icons/user-lock";
import UserBadgeIcon from "../ui/icons/user-badge";
import OpenDocumentIcon from "../ui/icons/open-document";
import { ModalButtonContainer } from "../ui/button-container";
import {
  ButtonDescription,
  ButtonTextContainer,
  ButtonTitle,
  Container,
  StartButton,
  StartButtonContainer,
  StartModalContent,
  RightContent,
  Title,
  Description,
} from "./styles";
import LogoBadge from "../ui/icons/logo-badge";
import { Colors } from "../../util/constants";
import { PubUser } from "../../types/pub-objects";
import { StateContext } from "../../contexts";

interface Props {
  loaded: boolean;
  user: PubUser | null;
  hideStartModal(): void;
  showNewDocumentModal(): void;
  showOpenDocumentModal(): void;
  showLoginDialog(): void;
  showNewAccountModal(): void;
}

function StartModal(props: Props) {
  const {
    showNewAccountModal,
    hideStartModal,
    showNewDocumentModal,
    showLoginDialog,
    showOpenDocumentModal,
    loaded,
    user,
  } = props;
  return (
    <StartModalContent>
      <Container>
        <LogoBadge backgroundColor={Colors.Modal.HeaderBackground} size={90} />
        <RightContent>
          <Title>Publications</Title>
          <Description>An app for page and print design.</Description>
        </RightContent>
      </Container>
      <StartButtonContainer>
        <StartButton
          disabled={!loaded}
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
        {user ? (
          <StartButton
            disabled={!loaded}
            onClick={() => {
              hideStartModal();
              setTimeout(showOpenDocumentModal, 250);
            }}
          >
            <OpenDocumentIcon />
            <ButtonTextContainer>
              <ButtonTitle>View all Documents</ButtonTitle>
              <ButtonDescription>
                Open, rename, or delete an existing saved document.
              </ButtonDescription>
            </ButtonTextContainer>
          </StartButton>
        ) : (
          <StartButton
            disabled={!loaded}
            onClick={() => {
              hideStartModal();
              setTimeout(showLoginDialog, 250);
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
        )}
        <StartButton
          disabled={!loaded || user !== null}
          onClick={() => {
            hideStartModal();
            setTimeout(showNewAccountModal, 250);
          }}
        >
          <UserBadgeIcon />
          <ButtonTextContainer>
            <ButtonTitle>Sign Up</ButtonTitle>
            <ButtonDescription>
              Create a free Publications account so you can save your documents.
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
  );
}

export default () => (
  <StateContext.Consumer>
    {({ user, dataLoaded, actions }) => (
      <StartModal
        user={user}
        loaded={dataLoaded}
        showLoginDialog={actions.showLoginModal}
        showNewDocumentModal={actions.showNewDocumentModal}
        showOpenDocumentModal={actions.showOpenDocumentModal}
        hideStartModal={actions.hideStartModal}
        showNewAccountModal={actions.showNewAccountModal}
      />
    )}
  </StateContext.Consumer>
);
