import styled from "styled-components";
import { Colors, appFont } from "../../util/constants";

const FormInput = styled.input<{ label?: boolean | string }>`
  border: none;
  border-radius: ${({ label }) => (label ? "4px 0 0 4px" : "4px")};
  box-sizing: border-box;
  background: ${Colors.FormInput.Background};
  box-shadow: inset 1px 1px 0 hsla(0, 0%, 0%, 0.4),
    inset -1px -1px 0 hsla(0, 0%, 100%, 0.1);
  color: ${Colors.FormInput.Text};
  display: block;
  font-family: ${appFont};
  font-size: 1.1em;
  line-height: 1em;
  margin: 0 0 1em;
  padding: 0.5em;
  width: 100%;
  outline: none;

  &:focus {
    box-shadow: 0 0 0 2px ${Colors.FormInput.FocusOutline};
  }

  ::placeholder {
    color: ${Colors.FormInput.Placeholder};
  }

  ::-ms-input-placeholder {
    color: ${Colors.FormInput.Placeholder};
  }
`;

FormInput.displayName = "FormInput";
export default FormInput;
