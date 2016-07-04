import React, { Component } from 'react'
import InputBase from './input.base'
import { ColorPicker } from '../ui/colorPicker'
import { autobind } from 'core-decorators'

export default class InputColor extends InputBase {
  state = {
    colorPickerVisible: false
  }

  @autobind
  toggleColorPicker() {
    this.setState({ colorPickerVisible: !this.state.colorPickerVisible })
  }

  render() {
    const { displayName, name, style, type, validator, validatorOptions, unit } = this.props
    const { value: color, colorPickerVisible } = this.state

    return <div className={ `input-text ${style || 'full'}` }>
      <div>
        <input
          className="has-unit"
          id={ name }
          max={ validatorOptions ? validatorOptions.max : null }
          min={ validatorOptions ? validatorOptions.min : null }
          onBlur={ this.onComponentDefocus }
          onChange={ this.valueChanged }
          name={ name}
          step={ validatorOptions ? validatorOptions.step : null }
          type={ type || 'text' }
          value={ this.state.value } />
        <span
          onClick={ this.toggleColorPicker }
          className="unit-marker unit-marker-color"
          style={ { background: color } }>
        </span>
      </div>
      <label htmlFor={ name }>
        { displayName }
      </label>
    </div>
  }
}
