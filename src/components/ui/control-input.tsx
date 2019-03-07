import React, { KeyboardEvent, ChangeEvent } from "react";
import { TextInput } from "./inputs";
import { Text, InputLabelText } from "./text";
import { ContentContainer } from "./containers";
import { AppColors } from "../../util/constants";
import { PubShape } from "../../types/pub-objects";
import styled, { css, InterpolationValue } from "styled-components";
import tinycolor from "tinycolor2";

export const InputLabel = styled(Text)<{ css?: InterpolationValue[] }>`
  width: 35%;
  text-align: right;
  ${({ css }) => css};
`;

const InputContent = styled(ContentContainer).attrs({ verticalAlign: true })<{
  css?: InterpolationValue[];
}>`
  width: 65%;
  ${({ css }) => css};
`;

interface LabelProps {
  label: string;
  disabled?: boolean;
  css?: InterpolationValue[];
}
export function ControlInputLabel(props: LabelProps) {
  return (
    <InputLabel
      center
      css={props.css}
      color={props.disabled ? AppColors.DisabledGray : AppColors.LightGray}
      size="0.75em"
      mr="0.33em"
    >
      {props.label}:
    </InputLabel>
  );
}

export type InspectorChanges = Partial<PubShape> | { fontSize: string } | null;
interface Props {
  value: number | null;
  label: string;
  property: string;
  unit?: string;
  small?: boolean;
  mini?: boolean;
  disabled?: boolean;
  isHEX?: boolean;
  isString?: boolean;
  labelCSS?: InterpolationValue[];
  inputCSS?: InterpolationValue[];
  inputContainerCSS?: InterpolationValue[];
  onChange(changes: InspectorChanges): void;
}
export default function ControlInput(props: Props) {
  const { label, unit, disabled } = props;
  const [presentedValue, setPresentedValue] = React.useState<string>(
    (props.value !== null ? props.value : "").toString()
  );
  const updateValue = React.useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      setPresentedValue(event.currentTarget.value),
    [setPresentedValue]
  );
  const validateInput = React.useCallback(
    () => {
      const { property, onChange } = props;
      if (props.isString) {
        const proposedString = presentedValue.trim();
        if (proposedString.length > 0) {
          setPresentedValue(proposedString);
          onChange({ [property]: proposedString });
          return;
        }
        setPresentedValue((props.value || "").toString());
        return;
      } else if (props.isHEX) {
        const proposedColor = tinycolor(presentedValue);
        if (proposedColor.isValid()) {
          setPresentedValue(proposedColor.toHexString());
          onChange({ [property]: proposedColor.toHexString() });
          return;
        }
        setPresentedValue((props.value || "").toString());
        return;
      }
      const presentedValueFloat = parseFloat(presentedValue);

      if (presentedValueFloat !== null && !isNaN(presentedValueFloat)) {
        setPresentedValue(presentedValueFloat.toString());
        onChange({ [property]: presentedValueFloat });
      } else {
        setPresentedValue((props.value || "").toString());
      }
    },
    [presentedValue, setPresentedValue, props]
  );
  const handleKeyPress = React.useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        validateInput();
      }
    },
    [validateInput]
  );

  React.useEffect(
    () =>
      setPresentedValue((props.value !== null ? props.value : "").toString()),
    [setPresentedValue, props.value]
  );

  return (
    <ContentContainer verticalAlign>
      <ControlInputLabel
        css={props.labelCSS}
        disabled={props.disabled}
        label={label}
      />
      <InputContent css={props.inputContainerCSS}>
        <TextInput
          alignRight
          small
          disabled={disabled}
          id={label}
          onChange={updateValue}
          onBlur={validateInput}
          onKeyPress={handleKeyPress}
          value={presentedValue}
          css={css`
            width: ${unit ? 40 : 55}px;
            ${props.inputCSS};
          `}
        />
        {unit && (
          <InputLabelText size="0.8em" disabled={disabled} htmlFor={label}>
            {unit}
          </InputLabelText>
        )}
      </InputContent>
    </ContentContainer>
  );
}

ControlInput.defaultProps = {
  mini: false,
  small: false,
};
