import React, { Component } from "react"
import { TextInput } from "../ui/inputs"
import { MediumText, InputLabelText } from "../ui/text"
import { ContentContainer } from "../ui/containers"
import { AppColors } from "../../util/constants"

export default class MetricInput extends Component {
  static defaultProps = {
    mini: false,
    small: false
  }

  constructor() {
    super(...arguments)
    this.updateValue = this.updateValue.bind(this)
    this.validateInput = this.validateInput.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.state = { presentedValue: this.props.value }
  }

  componentWillReceiveProps(nextProps) {
    const { value = "" } = nextProps
    this.setState({
      presentedValue: value
    })
  }

  updateValue(event) {
    this.setState({ presentedValue: event.target.value })
  }

  validateInput() {
    const parsedValue = parseFloat(this.state.presentedValue)
    const { property, onChange } = this.props
    if (!isNaN(parsedValue)) {
      this.setState({ presentedValue: parsedValue })
      onChange({ [property]: parsedValue })
    } else {
      this.setState({ presentedValue: this.props.value })
    }
  }

  handleKeyPress(event) {
    if (event.key === "Enter") {
      this.validateInput()
    }
  }

  render() {
    const {
      label,
      unit,
      small,
      mini
    } = this.props
    return (
      <ContentContainer
        verticalAlign
        style={{ marginRight: "0.75em" }}
      >
        <MediumText
          center
          color={AppColors.DarkGray}
          size="0.75em"
          mr="0.33em"
        >
          { label }
        </MediumText>
        <ContentContainer verticalAlign>
          <TextInput
            withLabel
            alignRight
            small={small}
            mini={mini}
            id={label}
            onChange={this.updateValue}
            onBlur={this.validateInput}
            onKeyPress={this.handleKeyPress}
            value={this.state.presentedValue}
          />
          <InputLabelText
            size="0.8em"
            htmlFor={label}
          >
            { unit }
          </InputLabelText>
        </ContentContainer>
      </ContentContainer>
    )
  }
}
