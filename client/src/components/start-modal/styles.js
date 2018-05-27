import TextButton from "../ui/text-button";
import { Colors } from "../../util/constants";
import { ModalContent } from "../modal";
import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  padding: 2em;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
`;

export const StartModalContent = styled(ModalContent)`
  width: 600px;
`;

export const StartButtonContainer = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column;

  > button {
    margin-bottom: 0.5em;
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

export const StartButton = styled(TextButton)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 10px;
  flex: 1;
  border-radius: 4px;

  &:hover {
    box-shadow: 0 0 0 2px ${Colors.StartModal.ButtonActiveBorder};
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus {
    box-shadow: 0 0 0 2px ${Colors.StartModal.ButtonActiveBorder};
  }
`;

export const ButtonTextContainer = styled.div`
  flex: 1;
  text-align: left;
  margin: 0 0 0 15px;
`;

export const ButtonTitle = styled.div`
  font-weight: bold;
  font-size: 1.25em;
  margin-bottom: 0.2em;
  color: ${Colors.StartModal.ButtonText};
`;

export const ButtonDescription = styled.div`
  color: ${Colors.StartModal.ButtonText};
`;
