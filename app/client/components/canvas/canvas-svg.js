import styled from "styled-components"
import { AppColors } from "../../util/constants"

export const CanvasSVG = styled.svg`
  border: 1px solid #a5a5a5;
  margin: ${props => {
    if (props.thumbnail) {
      return "0"
    }
    return "25px 1em 1em 24px"
  }};
  box-shadow: ${props => {
    if (props.selected) {
      return `0 0 0 2px #fff, 0 0 0 4px ${AppColors.Active}`
    }
    return "none"
  }};
  border-radius: ${props => {
    if (props.thumbnail) {
      return "1px"
    }
    return "0"
  }};
  overflow: hidden;
`
