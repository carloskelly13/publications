import React, {Component, PropTypes} from 'react';

import InputText from '../ui/input.text';

export default class InspectorShapeBorder extends Component {
  render() {
    let {
      inputValueChanged,
      shape,
      theme
    } = this.props;

    return (
      <div className="inspector-content-section">
        <h1>Border</h1>
        <div className="input-container input-container-half">
          <InputText
            displayName="Width"
            name="strokeWidth"
            theme={theme}
            type="number"
            unit="pt"
            validator='isInt'
            validatorOptions={{step: 1, min: 0, max: 32}}
            value={shape.strokeWidth}
            valueChanged={inputValueChanged} />
        </div>
        <div className="input-container input-container-half">
          <InputText
            displayName="Corner Radius"
            name="r"
            theme={theme}
            type="number"
            unit="pt"
            validator='isInt'
            validatorOptions={{step: 1, min: 0, max: 100}}
            value={shape.r}
            valueChanged={inputValueChanged} />
        </div>
      </div>
    );
  }
}
