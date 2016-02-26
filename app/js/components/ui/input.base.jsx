import React, {Component, PropTypes} from 'react'
import validator from 'validator'
import {autobind} from 'core-decorators'

export default class InputBase extends Component {
  constructor() {
    super(...arguments)

    this.state = {
      value: this.props.value,
      previousValue: this.props.value
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value,
      previousValue: nextProps.value
    })
  }

  @autobind
  valueChanged(event) {
    this.setState({value: event.target.value})

    if (this.validate(event)) {
      this.props.valueChanged(event)
    }
  }

  @autobind
  onComponentDefocus(event) {
    if (!this.validate(event)) {
      this.setState({value: this.state.previousValue})
    }
  }

  validate(event) {
    let validatorMethod = this.props.validator;

    console.log(validatorMethod)

    if (!validatorMethod) {
      return true;
    } else {
      if (validator[validatorMethod].apply(validator, [
        event.target.value,
        this.props.validatorOptions
      ])) {
        return true;
      } else {
        return false;
      }
    }
  }
}
