import styled from "styled-components";
import { AppColors, Colors, appFont } from "../../util/constants";

export const Header = styled.h1`
  font-weight: 600;
  font-size: 1.1em;
  margin: 0 0 5px;
`;

export const ModalHeader = styled(Header)`
  color: ${Colors.Modal.TitleText};
  font-size: 1.25em;
  font-weight: 700;
  margin: 1em 1em 1.1em;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  span {
    margin-left: 0.5em;
  }
`;

interface MarginTextProps {
  mr?: string;
  mt?: string;
  mb?: string;
  ml?: string;
}
export const MarginText = styled.span<MarginTextProps>`
  margin: ${({ mr, ml, mt, mb }) =>
    `${mt || 0} ${mr || 0} ${mb || 0} ${ml || 0}`};
`;

interface TextProps {
  size?: string;
  center?: boolean;
  right?: boolean;
  block?: boolean;
  white?: boolean;
  uppercase?: boolean;
}
export const Text = styled(MarginText)<TextProps>`
  font-size: ${({ size }) => size || "1em"};
  font-family: ${appFont};
  text-align: ${props => {
    if (props.center) {
      return "center";
    } else if (props.right) {
      return "right";
    }
    return "left";
  }};
  display: ${({ block }) => (block ? "block" : "inline-block")};
  font-weight: 400;
  color: ${props => {
    if (props.color) {
      return props.color;
    } else if (props.white) {
      return "#fff";
    }
    return AppColors.DarkGray;
  }};
  text-transform: ${props => {
    if (props.uppercase) {
      return "uppercase";
    }
    return "none";
  }};
`;

interface InputLabelTextProps {
  disabled?: boolean;
  size?: string;
}
export const InputLabelText = styled.label<InputLabelTextProps>`
  border-left: none;
  padding: 1px 0 1px 0.25em;
  color: ${({ disabled }) =>
    disabled ? AppColors.DisabledGray : AppColors.LightGray};
  font-size: ${({ size }) => size || "1em"};
`;
