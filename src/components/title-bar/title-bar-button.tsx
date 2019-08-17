import * as React from "react";
import styled, { css } from "styled-components";
import { appFont, Colors } from "../../util/constants";

const TitleBarButton = styled.button<{ noLabel?: boolean; active?: boolean }>`
  display: flex;
  background: transparent;
  border: none;
  font-family: ${appFont};
  font-weight: 500;
  padding: 0 8px;
  height: 24px;
  font-size: 12px;
  margin: 0;
  outline: none;
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

  ${({ active }) =>
    active &&
    css`
      background-color: ${Colors.Button.ActiveBackground};
    `};

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &.focus-visible:focus {
    box-shadow: inset 0 0 0 2px ${Colors.Button.Outline};
  }
`;

interface Props {
  disabled?: boolean;
  noLabel?: boolean;
  children?: React.ReactNode;
  active?: boolean;
  onClick?(): void;
}

export default TitleBarButton;
