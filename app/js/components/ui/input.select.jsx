import React, {Component, PropTypes} from 'react';

export default class InputSelect extends Component {
  render() {
    let {
      displayName,
      name,
      theme,
      value,
      options,
      onChange
    } = this.props;

    return (
      <div className={`input-picker ${theme}`}>
        <select
          name={name}
          value={value}
          onChange={onChange}>
          {options.map((opt, idx) => <option key={`${name}-option-${idx}`} value={opt}>{opt}</option>)}
        </select>
        <label htmlFor={name}>
          {displayName}
        </label>
      </div>
    )
  }
}
