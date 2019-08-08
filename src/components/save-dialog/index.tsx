import * as React from "react";
import styled from "styled-components";
import { ModalContent } from "../modal";
import { StateContext } from "../../contexts/app-state";
import Button from "../ui/framed-button";
import { ModalButtonContainer } from "../ui/button-container";
import { Colors } from "../../util/constants";
import { navigate } from "@reach/router";

export const SaveDialogContent = styled(ModalContent)`
  width: 400px;
`;

const Content = styled.div`
  padding: 1.25em 1.25em 0.5em;
  color: ${Colors.Dialog.TextColor};
`;

const SaveDialog: React.FC = () => {
  const { actions, currentDocument } = React.useContext(StateContext);
  const handleSaveChangesButtonSelected = React.useCallback(async () => {
    await actions.saveDocument();
    actions.setSaveDialogVisible(false);
    await navigate("/");
    actions.setCurrentDocument(null);
  }, [actions]);
  const handleDiscardChangesButtonSelected = React.useCallback(async () => {
    actions.setSaveDialogVisible(false);
    await navigate("/");
    actions.setCurrentDocument(null);
  }, [actions]);

  return (
    <SaveDialogContent>
      <Content>
        Before closing “{currentDocument.name}”, do you wish to save any changes
        you’ve made?
      </Content>
      <ModalButtonContainer>
        <Button marginRight onClick={handleSaveChangesButtonSelected}>
          Save
        </Button>
        <Button marginRight onClick={handleDiscardChangesButtonSelected}>
          Discard
        </Button>
        <Button marginRight onClick={() => actions.setSaveDialogVisible(false)}>
          Keep Editing
        </Button>
      </ModalButtonContainer>
    </SaveDialogContent>
  );
};

export default SaveDialog;
