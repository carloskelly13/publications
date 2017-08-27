import React from "react"
import styled from "styled-components"
import { AppColors } from "../../util/constants"

const Button = styled.button`
  margin: 0;
  height: 100%;
  padding: 0 1.5em;
  border: none;
  font-size: 0.85em;
  background: transparent;
  border-right: 1px solid ${AppColors.Border};
  color: ${AppColors.DarkGray};
  outline: none;

  &:active {
    background: hsla(0, 0%, 0%, 0.05);
  }

  &:focus {
    box-shadow: inset 0 0 0 3px #b8b7b8;
  }

  &:disabled {
    background: transparent;
    color: ${AppColors.DisabledGray};
  }
`

export default ({ onClick, disabled, children }) => (
  <Button
    onClick={onClick}
    disabled={disabled}
  >
    { children }
  </Button>
)
