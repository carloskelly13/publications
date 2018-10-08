import React, { KeyboardEvent, ChangeEvent } from "react";
import { TextInput } from "../ui/inputs";
import { Text, InputLabelText } from "../ui/text";
import { ContentContainer } from "../ui/containers";
import { AppColors } from "../../util/constants";

interface Props {
  value: number | null;
  label: string;
  property: string;
  unit: string;
  small?: boolean;
  mini?: boolean;
  disabled?: boolean;
  onChange(changes: Object | null): void;
}

interface State {
  presentedValue: string;
}

export default class MetricInput extends React.PureComponent<Props, State> {
  static defaultProps = {
    mini: false,
    small: false,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      presentedValue: (props.value !== null ? props.value : "").toString(),
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const { value } = nextProps;
    this.setState({ presentedValue: (value !== null ? value : "").toString() });
  }

  updateValue = (event: ChangeEvent<HTMLInputElement>) => {
    const parsedValue = event.currentTarget.value;
    this.setState({ presentedValue: parsedValue });
  };

  validateInput = () => {
    const presentedValue = parseFloat(this.state.presentedValue);
    const { property, onChange } = this.props;
    if (presentedValue !== null && !isNaN(presentedValue)) {
      this.setState({ presentedValue: presentedValue.toString() });
      onChange({ [property]: presentedValue });
    } else {
      this.setState({ presentedValue: (this.props.value || "").toString() });
    }
  };

  handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      this.validateInput();
    }
  };

  render() {
    const { label, unit, small, mini, disabled } = this.props;
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
            onChange={this.updateValue}
            onBlur={this.validateInput}
            onKeyPress={this.handleKeyPress}
            value={
              this.state.presentedValue !== null
                ? this.state.presentedValue
                : ""
            }
          />
          <InputLabelText size="0.8em" disabled={disabled} htmlFor={label}>
            {unit}
          </InputLabelText>
        </ContentContainer>
      </ContentContainer>
    );
  }
}
