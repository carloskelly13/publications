import styled, { FlattenSimpleInterpolation } from "styled-components";
import { Colors, appFont } from "../../util/constants";

interface Props {
  small?: boolean;
  mini?: boolean;
  large?: boolean;
  alignRight?: boolean;
  alignCenter?: boolean;
  css?: FlattenSimpleInterpolation;
}

export const TextInput = styled.input<Props>`
  border-radius: 2px;
  padding: 0 4px;
  color: ${Colors.FormInput.Text};
  background: ${Colors.FormInput.MetricBackground};
  border: 1px solid ${Colors.FormInput.Border};
  box-shadow: inset 0 1px 0 hsla(0, 0%, 0%, 0.1), 0 1px 0 hsla(0, 0%, 100%, 0.1);
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

  &:disabled {
    cursor: default;
  }
  &:focus {
    border-radius: 2px;
    box-shadow: 0 0 0 2px ${Colors.FormInput.FocusOutline};
  }
  ${({ css }) => css};
`;
