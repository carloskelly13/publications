import React, { KeyboardEvent, ChangeEvent } from "react";
import { TextInput } from "../ui/inputs";
import { Text, InputLabelText } from "../ui/text";
import { ContentContainer } from "../ui/containers";
import { AppColors } from "../../util/constants";
import { PubShape } from "../../types/pub-objects";

export type InspectorChanges = Partial<PubShape> | { fontSize: string } | null;
interface Props {
  value: number | null;
  label: string;
  property: string;
  unit: string;
  small?: boolean;
  mini?: boolean;
  disabled?: boolean;
  onChange(changes: InspectorChanges): void;
}

interface State {
  presentedValue: string;
}

const MetricInput: React.FunctionComponent<Props> = props => {
  const { label, unit, small, mini, disabled } = props;
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
      const presentedValueFloat = parseFloat(presentedValue);
      const { property, onChange } = props;
      if (presentedValueFloat !== null && !isNaN(presentedValueFloat)) {
        setPresentedValue(presentedValueFloat.toString());
        onChange({ [property]: presentedValueFloat });
      } else {
        setPresentedValue((props.value || "").toString());
      }
    },
    [presentedValue, setPresentedValue]
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
    <ContentContainer verticalAlign style={{ marginRight: "0.75em" }}>
      <Text
        center
        color={disabled ? AppColors.DisabledGray : AppColors.LightGray}
        size="0.75em"
        mr="0.33em"
      >
        {label}:
      </Text>
      <ContentContainer verticalAlign>
        <TextInput
          alignRight
          disabled={disabled}
          small={small}
          mini={mini}
          id={label}
          onChange={updateValue}
          onBlur={validateInput}
          onKeyPress={handleKeyPress}
          value={presentedValue}
        />
        <InputLabelText size="0.8em" disabled={disabled} htmlFor={label}>
          {unit}
        </InputLabelText>
      </ContentContainer>
    </ContentContainer>
  );
};

MetricInput.defaultProps = {
  mini: false,
  small: false,
};

export default MetricInput;
