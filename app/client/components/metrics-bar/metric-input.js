import React, { Component } from "react"
import { TextInput } from "../ui/inputs"
import { Text } from "../ui/text"
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
  }

  state = {
    presentedValue: ""
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
      enabled,
      unit,
      small,
      mini
    } = this.props
    return (
      <ContentContainer verticalAlign>
        <Text
          color={enabled ? AppColors.DarkGray : AppColors.DisabledGray}
          size="0.8em"
          mr="0.33em"
        >
          { label }
        </Text>
        <TextInput
          small={small}
          mini={mini}
          alignRight
          onChange={this.updateValue}
          onBlur={this.validateInput}
          disabled={!enabled}
          onKeyPress={this.handleKeyPress}
          value={this.state.presentedValue}
        />
        <Text
          color={enabled ? AppColors.DarkGray : AppColors.DisabledGray}
          size="0.8em"
          ml="0.25em"
          mr="1em"
        >
          { unit }
        </Text>
      </ContentContainer>
    )
  }
}
