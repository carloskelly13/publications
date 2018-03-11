import styled from "styled-components";
import { AppColors } from "../../util/constants";
import { TextButton } from "../ui/text-button";

export const Header = styled(TextButton)`
  color: ${AppColors.Highlight};
  padding: 0.25em 0.75em 0.25em 0;
  cursor: default;
`;
