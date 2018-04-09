import styled from "styled-components";
import { AppColors, appFont } from "../../util/constants";

export const TextInput = styled.input`
  border: 1px solid #7d7373;
  border-radius: 2px;
  padding: 0 4px;
  color: ${AppColors.White};
  background: #4b4545;
  font-family: ${appFont};
  font-size: ${props => {
    if (props.small || props.mini) {
      return "11px";
    } else if (props.large) {
      return "16px";
    }
    return "14px";
  }};
  outline: none;
  text-align: ${props => {
    if (props.alignRight) {
      return "right";
    } else if (props.alignCenter) {
      return "center";
    }
    return "left";
  }};
  width: ${props => {
    if (props.mini) {
      return "20px";
    } else if (props.small) {
      return "35px";
    }
    return "auto";
  }};

  &:disabled {
    background: ${AppColors.DarkGray};
    border-color: ${AppColors.ReallyDarkGray};
    cursor: default;
    color: ${AppColors.MediumGray};
  }
  &:focus {
    border-color ${AppColors.Highlight};
    box-shadow: 0 0 0 1px ${AppColors.Highlight};
  }
`;
