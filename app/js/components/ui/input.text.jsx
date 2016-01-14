import React, {Component, PropTypes} from 'react';
import InputBase from './input.base';

export default class InputText extends InputBase {
  render() {
    let {
      displayName,
      name,
      theme,
      type,
      validator,
      validatorOptions,
      placeholder,
      unit
    } = this.props,
    unitLabel,
    value = this.state.value;

    if (validator && validator === 'isFloat') {
      value = parseFloat(value).toFixed(2);
    }

    if (unit !== undefined) {
      unitLabel = <span className="unit-marker">{unit}</span>;
    }

    const label = displayName ? <label htmlFor={name}>
      {displayName}
    </label> : null

    return (
      <div className={`input-text ${theme}`}>
        <div>
          <input
            className={unit !== undefined ? 'has-unit' : ''}
            id={name}
            max={validatorOptions ? validatorOptions.max : null}
            min={validatorOptions ? validatorOptions.min : null}
            onBlur={e => this.onComponentDefocus(e)}
            onChange={e => this.valueChanged(e)}
            name={name}
            placeholder={placeholder || null}
            step={validatorOptions ? validatorOptions.step : null}
            type={type || 'text'}
            value={value} />
          {unitLabel}
        </div>
        {label}
      </div>);
  }
}
