import * as React from "react";
import styled from "styled-components";
import { ModalContent } from "../modal";
import { StateContext } from "../../contexts/app-state";
import Button from "../ui/framed-button";
import { ModalButtonContainer } from "../ui/button-container";
import { Colors } from "../../util/constants";
import { PubDocument } from "../../types/pub-objects";
import GarbageIcon from "../ui/icons/garbage";

export const DeleteDocumentDialogContent = styled(ModalContent)`
  width: 400px;
`;

const Content = styled.div`
  padding: 1.25em 1.75em 0.5em;
  color: ${Colors.Dialog.TextColor};
  display: flex;
  align-items: center;
  justify-content: flex-start;

  span {
    margin-left: 1.25em;
  }
`;

interface DeleteDocumentDialogProps {
  doc?: PubDocument;
  onDocumentDelete(): void;
}

const DeleteDocumentDialog: React.FC<DeleteDocumentDialogProps> = props => {
  const { actions } = React.useContext(StateContext);
  const handleDeleteButtonSelected = React.useCallback(async () => {
    await actions.deleteDocument(props.doc.id);
    actions.setDeleteDocumentDialogVisible(false);
    props.onDocumentDelete();
  }, [actions, props]);
  const handleKeepButtonSelected = React.useCallback(() => {
    actions.setDeleteDocumentDialogVisible(false);
  }, [actions]);

  if (!props.doc) {
    return null;
  }

  return (
    <DeleteDocumentDialogContent>
      <Content>
        <GarbageIcon size={48} />
        <span>
          Are you sure you want to delete “{props.doc.name}”? This action cannot
          be undone.
        </span>
      </Content>
      <ModalButtonContainer>
        <Button marginRight onClick={handleDeleteButtonSelected}>
          Delete
        </Button>
        <Button marginRight onClick={handleKeepButtonSelected}>
          Keep
        </Button>
      </ModalButtonContainer>
    </DeleteDocumentDialogContent>
  );
};

export default DeleteDocumentDialog;
