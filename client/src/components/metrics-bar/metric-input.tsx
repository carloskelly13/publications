import React, { UIEvent, KeyboardEvent } from "react";
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
  presentedValue: number | null;
}

export default class MetricInput extends React.PureComponent<Props, State> {
  static defaultProps = {
    mini: false,
    small: false,
  };

  constructor(props: Props) {
    super(props);
    this.state = { presentedValue: props.value };
  }

  static getDerivedStateFromProps(nextProps: Props) {
    return { presentedValue: nextProps.value };
  }

  updateValue = (event: UIEvent<HTMLInputElement>) => {
    const parsedValue = parseFloat(event.currentTarget.value);
    this.setState({ presentedValue: parsedValue });
  };

  validateInput = () => {
    const { presentedValue } = this.state;
    const { property, onChange } = this.props;
    if (presentedValue !== null && !isNaN(presentedValue)) {
      this.setState({ presentedValue: presentedValue });
      onChange({ [property]: presentedValue });
    } else {
      this.setState({ presentedValue: this.props.value });
    }
  };

  handleKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
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
            withLabel
            alignRight
            disabled={disabled}
            small={small}
            mini={mini}
            id={label}
            onChange={this.updateValue}
            onBlur={this.validateInput}
            onKeyPress={this.handleKeyPress}
            value={this.state.presentedValue || ""}
          />
          <InputLabelText size="0.8em" disabled={disabled} htmlFor={label}>
            {unit}
          </InputLabelText>
        </ContentContainer>
      </ContentContainer>
    );
  }
}
