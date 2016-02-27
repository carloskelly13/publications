import React, {Component, PropTypes} from 'react'
import {autobind} from 'core-decorators'
import {isFloat} from 'validator'

export default class InputNumber extends Component {
  static propTypes = {
    value: PropTypes.number.isRequired,
    valueChanged: PropTypes.func.isRequired
  }

  constructor() {
    super(...arguments)

    this.state = {
      value: this.props.value
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({value: nextProps.value})
    }
  }

  @autobind
  onChange(event) {
    const value = event.target.value

    if (isFloat(value, this.props.validatorOptions || {})) {
      this.props.valueChanged(event)
    }

    this.setState({value})
  }

  render() {
    return <div>
      <input
        type="number"
        name={this.props.property}
        value={this.state.value}
        onChange={this.onChange}
        {...this.props.validatorOptions} />
    </div>
  }
}