import React from 'react';

const InputSelect = ({
  displayName, name, style, value, options, onChange
}) => <div className={`input-picker ${style || 'full'}`}>
  <select
    name={ name }
    value={ value }
    onChange={ onChange }>
    { options.map((opt, idx) => <option key={`${ name }-option-${ idx }`} value={ opt }>{ opt }</option>) }
  </select>
  <label htmlFor={ name }>
    { displayName }
  </label>
</div>

export default InputSelect
