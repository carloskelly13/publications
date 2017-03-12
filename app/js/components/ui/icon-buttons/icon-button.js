import styled from "styled-components"

export const IconButton = styled.button`
  background: transparent;
  border: none;
  box-sizing: border-box;
  cursor: pointer;
  display: inline-block;
  height: 25px;
  width: 25px;
  margin: 0 ${({ margin }) => margin ? "1.5em" : 0} 0 0;
  padding: 0;
  outline: none;

  &:active {
    transform: scale(0.95);
  }
`
