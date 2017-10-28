import styled, { css } from "styled-components"
import { AppColors } from "../../util/constants"

export const CanvasSVG = styled.svg`
  border: 1px solid ${AppColors.Gray40};
  margin: 0;
  border-radius: ${props => props.thumbnail ? "1px" : "0"};
  overflow: hidden;

  ${props => !props.thumbnail && css`
    margin: 25px 1em 1em 24px;
  `};
`
