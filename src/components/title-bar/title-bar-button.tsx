import * as React from "react";
import styled, { css } from "styled-components";
import { appFont, Colors } from "../../util/constants";

const Button = styled.button<{ noLabel?: boolean }>`
  display: flex;
  background: transparent;
  border: none;
  font-family: ${appFont};
  font-weight: bold;
  font-size: 12px;
  margin: 0;
  color: ${Colors.Button.Text};
  align-items: center;
  justify-content: flex-start;

  svg {
    margin-right: 0.33em;
    ${({ noLabel }) =>
      noLabel &&
      css`
        margin-right: 0;
      `};
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

interface Props {
  disabled?: boolean;
  noLabel?: boolean;
  children?: React.ReactNode;
  onPress?(): void;
}
export default function TitleBarButton(props: Props) {
  return (
    <Button
      disabled={props.disabled}
      noLabel={props.noLabel}
      onClick={props.onPress}
    >
      {props.children}
    </Button>
  );
}
