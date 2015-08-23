import React, {Component, PropTypes} from 'react';

import InputColor from '../ui/input.color';
import InputText from '../ui/input.text';

export default class InspectorShapeText extends Component {
  render() {
    let {
      inputValueChanged,
      shape,
      theme
    } = this.props;

    return (
      <div className="inspector-content-section">
        <h1>Text</h1>
        <div className="input-container input-container-full">
          <InputText
            displayName="Font"
            name="fontFamily"
            theme={theme}
            value={shape.fontFamily}
            valueChanged={inputValueChanged} />
        </div>
        <div className="input-container input-container-half">
          <InputText
            displayName="Font Size"
            name="fontSize"
            theme={theme}
            type="number"
            unit="pt"
            validator='isInt'
            validatorOptions={{step: 1, min: 1, max: 512}}
            value={shape.fontSize}
            valueChanged={inputValueChanged} />
        </div>
        <div className="input-container input-container-half">
          <InputColor
            displayName="Color"
            name="color"
            theme={theme}
            validator='isHexColor'
            value={shape.color}
            valueChanged={inputValueChanged} />
        </div>
      </div>
    );
  }
}
