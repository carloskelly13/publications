import styled from "styled-components";
import { AppColors, appFont } from "../../util/constants";

export const TextButton = styled.button`
  background: transparent;
  border: none;
  box-sizing: border-box;
  cursor: pointer;
  color: ${AppColors.White};
  display: inline-block;
  font-family: ${appFont};
  font-size: ${({ size }) => size || "0.90em"};
  font-weight: 500;
  outline: none;
  padding: 0.25em 0.75em;
  border-radius: 0;
  text-align: center;

  &:disabled {
    color: ${AppColors.White4};
  }
`;

export default TextButton;
