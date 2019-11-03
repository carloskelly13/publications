import styled from "styled-components";
import { Colors } from "../../util/constants";

export const ColorPickerButton = styled.button<{
  color: string;
  disabled?: boolean;
}>`
  width: 100%;
  height: 17px;
  border-radius: 2px;
  background: ${({ color }) => color || Colors.FormInput.MetricBackground};
  border: 1px solid ${Colors.FormInput.Border};
  box-shadow: inset 1px 1px 0 hsla(0, 0%, 0%, 0.1),
    0 1px 0 hsla(0, 0%, 100%, 0.1);
  outline: none;
  margin: 0;
`;
