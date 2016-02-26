import React, {Component, PropTypes} from 'react';
import InputBase from './input.base';

export default class InputColor extends InputBase {
  render() {
    let {
      displayName,
      name,
      style,
      type,
      validator,
      validatorOptions,
      unit
    } = this.props,
    spanStyle = {background: this.state.value};

    return (
      <div className={`input-text ${style || 'full'}`}>
        <div>
          <input
            className="has-unit"
            id={name}
            max={validatorOptions ? validatorOptions.max : null}
            min={validatorOptions ? validatorOptions.min : null}
            onBlur={this.onComponentDefocus}
            onChange={this.valueChanged}
            name={name}
            step={validatorOptions ? validatorOptions.step : null}
            type={type || 'text'}
            value={this.state.value} />
          <span className="unit-marker unit-marker-color" style={spanStyle}></span>
        </div>
        <label htmlFor={name}>
          {displayName}
        </label>
      </div>);
  }
}
