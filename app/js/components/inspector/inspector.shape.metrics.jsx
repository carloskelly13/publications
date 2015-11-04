import React, {Component, PropTypes} from 'react';

import InputText from '../ui/input.text';

export default class InspectorShapeMetrics extends Component {
  render() {
    let {
      inputValueChanged,
      shape,
      theme
    } = this.props;

    return (
      <div className="inspector-content-section">
        <h1>Metrics</h1>
        <div className="input-container input-container-half">
          <InputText
            displayName="X"
            name="x"
            theme={theme}
            type="number"
            unit="in"
            validator='isFloat'
            validatorOptions={{step: 0.05, min: -64.0, max: 64.0}}
            value={shape.x}
            valueChanged={inputValueChanged} />
        </div>
        <div className="input-container input-container-half">
          <InputText
            displayName="Y"
            name="y"
            theme={theme}
            type="number"
            unit="in"
            validator='isFloat'
            validatorOptions={{step: 0.05, min: -64.0, max: 64.0}}
            value={shape.y}
            valueChanged={inputValueChanged} />
        </div>
        <div className="input-container input-container-half">
          <InputText
            displayName="Width"
            name="width"
            theme={theme}
            type="number"
            unit="in"
            validator='isFloat'
            validatorOptions={{step: 0.05, min: 1.0, max: 64.0}}
            value={shape.width}
            valueChanged={inputValueChanged} />
        </div>
        <div className="input-container input-container-half">
          <InputText
            displayName="Height"
            name="height"
            theme={theme}
            type="number"
            unit="in"
            validator='isFloat'
            validatorOptions={{step: 0.05, min: 1.0, max: 64.0}}
            value={shape.height}
            valueChanged={inputValueChanged} />
        </div>
      </div>
    );
  }
}
