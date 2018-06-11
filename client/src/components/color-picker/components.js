import styled from "styled-components";
import { Colors } from "../../util/constants";

export const ColorPickerButton = styled.button`
  width: 14px;
  height: 14px;
  background: ${Colors.FormInput.MetricBackground};
  box-shadow: inset 1px 1px 0 hsla(0, 0%, 100%, 0.2),
    1px 1px 0 hsla(0, 0%, 0%, 0.2);
  border-radius: 50%;
  border: none;
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
