import styled from "styled-components"
import { AppColors, appFont } from "../../util/constants"

export const TextInput = styled.input`
  border: 1px solid #aaa;
  padding: 2px;
  border-radius: 2px;
  outline: none;
  color: ${AppColors.DarkGray};
  background: #fff;
  font-family: ${appFont};
  font-size: ${props => {
    if (props.small) return "11px"
    else if (props.large) return "16px"
    return "14px"
  }};
  text-align: ${ props => {
    if (props.alignRight) return "right";
    else if (props.alignCenter) return "center";
    return "left"
  }};
  width: ${props => {
    if (props.small) return "40px";
    return "auto";
  }};

  &:disabled {
    background: ${AppColors.MediumGray};
  }
`
