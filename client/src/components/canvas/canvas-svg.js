import styled, { css } from "styled-components";

export const CanvasSVG = styled.svg`
  margin: 0;
  border-radius: ${props => (props.thumbnail ? "1px" : "0")};
  overflow: hidden;

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
