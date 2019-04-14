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
import { StateContext } from "../../contexts/documents-provider";

interface Props {
  loaded: boolean;
  user: PubUser | null;
  setStartModalVisible(visible: boolean): void;
  setNewDocumentModalVisible(visible: boolean): void;
  setOpenDocumentModalVisible(visible: boolean): void;
  setLoginModalVisible(visible: boolean): void;
  setNewAccountModalVisible(visible: boolean): void;
}

const StartModal: React.FunctionComponent<Props> = props => {
  const {
    setLoginModalVisible,
    setNewAccountModalVisible,
    setNewDocumentModalVisible,
    setOpenDocumentModalVisible,
    setStartModalVisible,
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
            setStartModalVisible(false);
            setTimeout(() => setNewDocumentModalVisible(true), 250);
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
              setStartModalVisible(false);
              setTimeout(() => setOpenDocumentModalVisible(true), 250);
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
              setStartModalVisible(false);
              setTimeout(() => setLoginModalVisible(true), 250);
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
            setStartModalVisible(false);
            setTimeout(() => setNewAccountModalVisible(true), 250);
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
        <Button marginRight onClick={() => setStartModalVisible(false)}>
          Close
        </Button>
      </ModalButtonContainer>
    </StartModalContent>
  );
};

export default () => (
  <StateContext.Consumer>
    {({ user, dataLoaded, actions }) => (
      <StartModal
        user={user}
        loaded={dataLoaded}
        setLoginModalVisible={actions.setLoginModalVisible}
        setNewAccountModalVisible={actions.setNewAccountModalVisible}
        setNewDocumentModalVisible={actions.setNewDocumentModalVisible}
        setOpenDocumentModalVisible={actions.setOpenDocumentModalVisible}
        setStartModalVisible={actions.setStartModalVisible}
      />
    )}
  </StateContext.Consumer>
);
