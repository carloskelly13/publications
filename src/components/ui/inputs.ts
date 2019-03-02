import styled from "styled-components";
import { Colors, appFont } from "../../util/constants";

interface Props {
  small?: boolean;
  mini?: boolean;
  large?: boolean;
  alignRight?: boolean;
  alignCenter?: boolean;
}

export const TextInput = styled.input<Props>`
  border: none;
  border-radius: 2px;
  padding: 0 4px;
  color: ${Colors.FormInput.Text};
  background: ${Colors.FormInput.MetricBackground};
  border: 1px solid hsla(0, 0%, 100%, 0.25);
  font-family: ${appFont};
  font-size: ${props => {
    if (props.small || props.mini) {
      return "12px";
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

  &:disabled {
    cursor: default;
  }
  &:focus {
    border-radius: 1px;
    box-shadow: 0 0 0 2px ${Colors.FormInput.FocusOutline};
  }
  width: 40px;
`;
