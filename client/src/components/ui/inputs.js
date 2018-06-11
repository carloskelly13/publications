import styled from "styled-components";
import { Colors, appFont } from "../../util/constants";

export const TextInput = styled.input`
  border: none;
  border-radius: 0;
  padding: 0 4px;
  color: ${Colors.FormInput.Text};
  background: ${Colors.FormInput.MetricBackground};
  box-shadow: inset 1px 1px 0 hsla(0, 0%, 0%, 0.4),
    inset -1px -1px 0 hsla(0, 0%, 100%, 0.1);
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
    cursor: default;
  }
  &:focus {
    border-radius: 1px;
    box-shadow: 0 0 0 2px ${Colors.FormInput.FocusOutline};
  }
`;
