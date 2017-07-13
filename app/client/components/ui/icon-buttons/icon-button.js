import styled from "styled-components"

export const IconButton = styled.button`
  background: transparent;
  border: none;
  border-radius: 2px;
  box-sizing: border-box;
  cursor: pointer;
  display: inline-block;
  margin: 0 ${({ margin }) => margin ? "1.5em" : 0} 0 0;
  padding: 3px 4px;
  outline: none;
  text-align: center;
  opacity: ${({ disabled }) => disabled ? 0.33 : 1};

  &:active:not([disabled]) {
    transform: scale(0.95);
  }

  &:focus {
    background: hsla(0, 0%, 0%, 0.15);
  }
`
