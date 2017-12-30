import styled from "styled-components";
import { AppColors, appFont } from "../../util/constants";

export const Header = styled.h1`
  font-weight: 500;
  font-size: 1.2em;
  margin: 0 0 5px;
`;

export const Message = styled.p`
  font-size: 1em;
  margin: 0 0 2em;
`;

export const MarginText = styled.span`
  margin: ${({ mr, ml, mt, mb }) =>
    `${mt || 0} ${mr || 0} ${mb || 0} ${ml || 0}`};
`;

export const Text = styled(MarginText)`
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

export const StrongText = styled(Text)`
  font-weight: 600;
`;

export const MediumText = styled(Text)`
  font-weight: 500;
`;

export const LightText = styled(Text)`
  font-weight: 300;
`;

export const InputLabelText = styled.label`
  border-left: none;
  padding: 1px 0.25em 1px;
  color: ${({ disabled }) =>
    disabled ? AppColors.DisabledGray : AppColors.DarkGray};
  font-size: ${({ size }) => size || "1em"};
`;
