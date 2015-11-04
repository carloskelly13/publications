import React, {Component, PropTypes} from 'react';

import InputColor from '../ui/input.color';
import InputText from '../ui/input.text';

export default class InspectorShapeColor extends Component {
  render() {
    let {
      inputValueChanged,
      shape,
      theme
    } = this.props;

    return (
      <div className="inspector-content-section">
        <h1>Color</h1>
        <div className="input-container input-container-half">
          <InputColor
            displayName="Fill"
            name="fill"
            theme={theme}
            validator='isHexColor'
            value={shape.fill}
            valueChanged={inputValueChanged} />
        </div>
        <div className="input-container input-container-half">
          <InputColor
            displayName="Border"
            name="stroke"
            theme={theme}
            validator='isHexColor'
            value={shape.stroke}
            valueChanged={inputValueChanged} />
        </div>
        <div className="input-container input-container-half">
          <InputText
            displayName="Fill Opacity"
            name="fillOpacity"
            theme={theme}
            type="number"
            validator='isFloat'
            validatorOptions={{step: 0.01, min: 0.0, max: 1.0}}
            value={shape.fillOpacity}
            valueChanged={inputValueChanged} />
        </div>
        <div className="input-container input-container-half">
          <InputText
            displayName="Border Opacity"
            name="strokeOpacity"
            theme={theme}
            type="number"
            validator='isFloat'
            validatorOptions={{step: 0.01, min: 0.0, max: 1.0}}
            value={shape.strokeOpacity}
            valueChanged={inputValueChanged} />
        </div>
      </div>
    );
  }
}
