import styled from "styled-components";
import { Colors } from "../../util/constants";
import { TextButton } from "../ui/text-button";

export const Header = styled(TextButton)`
  color: ${Colors.App.Tint};
  padding-left: 0;
  margin: 0;
  cursor: default;
`;

export const LogoContainer = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 5px;
`;
