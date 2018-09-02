import styled, { css } from "styled-components";

interface Props {
  verticalAlign?: boolean;
  column?: string;
}
export const ContentContainer = styled.div<Props>`
  display: flex;
  flex-direction: ${({ column }) => (column ? "column" : "row")};
  ${({ verticalAlign }) =>
    verticalAlign &&
    css`
      align-items: center;
    `};
`;
