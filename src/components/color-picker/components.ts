import styled from "styled-components";
import { Colors } from "../../util/constants";

export const ColorPickerButton = styled.button<{ color: string }>`
  width: 14px;
  height: 14px;
  background: ${Colors.FormInput.MetricBackground};
  border-radius: 50%;
  border: none;
  box-shadow: 0 0 0 1px hsla(0, 0%, 0%, 0.5), 0 0 0 2px hsla(0, 0%, 100%, 0.5);
  background: ${({ color }) => color};
  outline: none;
  margin: 0;
  &:focus {
    box-shadow: inset 0 0 0 1px hsla(0, 0%, 0%, 0.5),
      0 0 0 2px ${Colors.FormInput.FocusOutline};
  }
`;

export const PickerContents = styled.div`
  position: absolute;
  top: 19px;
  left: 0;
`;
