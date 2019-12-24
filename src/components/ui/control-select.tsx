import * as React from "react";
import { ContentContainer } from "./containers";
import styled, { css } from "styled-components";
import { Colors } from "../../util/constants";
import { ControlInputLabel } from "./control-input";

let Select = styled.select`
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  background: ${Colors.FormInput.MetricBackground};
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23e5e5e5%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-position: right 0.5em top 50%;
  background-repeat: no-repeat;
  background-size: 0.65em auto;
  border: 1px solid ${Colors.FormInput.Border};
  border-radius: 2px;
  box-shadow: inset 0 1px 0 hsla(0, 0%, 0%, 0.1), 0 1px 0 hsla(0, 0%, 100%, 0.1);
  color: ${Colors.FormInput.Text};
  font-size: 11px;
  margin: 0;
  outline: none;
  padding: 0 4px;
  width: 100%;

  &:focus {
    border-radius: 2px;
    box-shadow: 0 0 0 2px ${Colors.FormInput.FocusOutline};
  }

  &:disabled {
    color: ${Colors.FormInput.DisabledText};
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23555555%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  }
`;

let labelCSS = css`
  width: 19%;
`;

interface Props {
  disabled?: boolean;
  label: string;
  options: Array<{ value: string; label: string }>;
  onChange(event: React.ChangeEvent<HTMLSelectElement>): void;
}

let ControlSelect: React.FC<Props> = props => {
  return (
    <ContentContainer verticalAlign>
      <ControlInputLabel
        css={labelCSS}
        disabled={props.disabled}
        label={props.label}
      />
      <Select disabled={props.disabled} onChange={props.onChange}>
        {props.options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </ContentContainer>
  );
};

export default ControlSelect;
