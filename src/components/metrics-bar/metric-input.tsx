import React, { KeyboardEvent, ChangeEvent } from "react";
import { TextInput } from "../ui/inputs";
import { Text, InputLabelText } from "../ui/text";
import { ContentContainer } from "../ui/containers";
import { AppColors } from "../../util/constants";
import { PubShape } from "../../types/pub-objects";
import styled from "styled-components";
import tinycolor from "tinycolor2";

export const InputLabel = styled(Text)`
  width: 35%;
  text-align: right;
`;

const InputInput = styled(ContentContainer).attrs({ verticalAlign: true })`
  width: 65%;
`;

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
  onChange(changes: InspectorChanges): void;
}

interface State {
  presentedValue: string;
}

const MetricInput: React.FunctionComponent<Props> = props => {
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
      if (props.isHEX) {
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
      <InputLabel
        center
        color={disabled ? AppColors.DisabledGray : AppColors.LightGray}
        size="0.75em"
        mr="0.33em"
      >
        {label}:
      </InputLabel>
      <InputInput>
        <TextInput
          alignRight
          small
          disabled={disabled}
          id={label}
          onChange={updateValue}
          onBlur={validateInput}
          onKeyPress={handleKeyPress}
          value={presentedValue}
        />
        {unit && (
          <InputLabelText size="0.8em" disabled={disabled} htmlFor={label}>
            {unit}
          </InputLabelText>
        )}
      </InputInput>
    </ContentContainer>
  );
};

MetricInput.defaultProps = {
  mini: false,
  small: false,
};

export default MetricInput;
