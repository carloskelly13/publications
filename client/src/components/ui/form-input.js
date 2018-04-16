import styled from "styled-components";
import { Colors, appFont } from "../../util/constants";

const FormInput = styled.input`
  border: 1px solid ${Colors.FormInput.Border};
  border-radius: ${({ label }) => (label ? "4px 0 0 4px" : "4px")};
  box-sizing: border-box;
  color: ${Colors.FormInput.Text};
  display: block;
  font-family: ${appFont};
  font-size: 1.1em;
  line-height: 1em;
  margin: 0 0 1em;
  padding: 0.5em;
  vertical-align: middle;
  width: 100%;
  outline: none;

  &:focus {
    box-shadow: 0 0 0 2px ${Colors.FormInput.FocusOutline};
    border-color: ${Colors.FormInput.FocusBorder};
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
