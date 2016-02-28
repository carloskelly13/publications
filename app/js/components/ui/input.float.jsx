import React, {Component, PropTypes} from 'react'
import {autobind} from 'core-decorators'
import {isFloat} from 'validator'

export default class InputFloat extends Component {
  static propTypes = {
    value: PropTypes.number.isRequired,
    valueChanged: PropTypes.func.isRequired
  };

  constructor() {
    super(...arguments)

    this.state = {
      value: this.props.value,
      previousValue: this.props.value
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
      this.setState({previousValue: value})
      this.props.valueChanged(event)
    }

    this.setState({value})
  }

  @autobind
  onBlur(event) {
    const value = event.target.value

    if (!isFloat(value, this.props.validatorOptions || {})) {
      this.setState({value: this.state.previousValue})
    }
  }

  render() {
    const {
      displayName,
      property,
      style,
      unit,
      validatorOptions,
    } = this.props

    const {value} = this.state

    const unitLabel = () => typeof unit !== 'undefined' ?
      <span className="unit-marker">{unit}</span> : undefined

    return <div className={`input-text ${style || 'full'}`}>
      <input
        className={typeof unit !== 'undefined' ? 'has-unit' : undefined}
        type="number"
        name={property}
        value={value}
        onChange={this.onChange}
        onBlur={this.onBlur}
        {...validatorOptions} />
      {unitLabel()}
      <label htmlFor={property}>
        {displayName}
      </label>
    </div>
  }
}