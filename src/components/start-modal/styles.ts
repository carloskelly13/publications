import TextButton from "../ui/text-button";
import { Colors } from "../../util/constants";
import { ModalContent } from "../modal";
import styled, { css } from "styled-components";

export const Container = styled.div`
  display: flex;
  padding: 2em;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  background: ${Colors.Modal.HeaderBackground};
  border-bottom: 1px solid hsla(0, 0%, 100%, 0.15);
  border-radius: 4px 4px 0 0;
  box-shadow: inset 1px 1px 0 hsla(0, 0%, 100%, 0.15),
    inset -1px 0 0 hsla(0, 0%, 100%, 0.075), inset 0 -1px 0 hsla(0, 0%, 0%, 0.4);
`;

export const RightContent = styled.div`
  color: #fff;
  padding-left: 32px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex: 1;
  flex-direction: column;
`;

export const Description = styled.div`
  margin-top: 6px;
  font-size: 13px;
`;

export const Title = styled.div`
  font-weight: bold;
  font-size: 24px;
`;

export const StartModalContent = styled(ModalContent)`
  width: 600px;
`;

export const StartButtonContainer = styled.div`
  padding: 15px 20px 0;
  display: flex;
  flex-direction: column;

  > button {
    margin-bottom: 0.5em;
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

export const StartButton = styled(TextButton)<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 10px;
  flex: 1;
  border-radius: 4px;
  transition: opacity ease-in-out 250ms;
  opacity: 1;

  &:hover {
    box-shadow: 0 0 0 2px ${Colors.StartModal.ButtonActiveBorder};
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus {
    box-shadow: 0 0 0 2px ${Colors.StartModal.ButtonActiveBorder};
  }

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0;
    `};
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
