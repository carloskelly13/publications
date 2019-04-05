import styled from "styled-components";
import { Colors } from "../../util/constants";

export const ColorPickerButton = styled.button<{
  color: string;
  disabled?: boolean;
}>`
  width: 100%;
  height: 17px;
  border-radius: 2px;
  border: 1px solid
    hsla(0, 0%, 100%, ${({ disabled }) => (disabled ? 0.2 : 0.5)});
  background: ${({ color }) => color || Colors.FormInput.MetricBackground};
  outline: none;
  margin: 0;
`;
