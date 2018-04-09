import styled, { css } from "styled-components";

export const CanvasSVG = styled.svg`
  margin: 0;
  border-radius: ${props => (props.thumbnail ? "1px" : "0")};
  overflow: hidden;
  box-shadow: 1px 1px 3px hsla(0, 0%, 0%, 0.25);

  ${props =>
    !props.thumbnail &&
    css`
      margin: 25px 1em 1em 25px;
    `};

  @media print {
    margin: 0mm;
    border: none;
  }
`;
