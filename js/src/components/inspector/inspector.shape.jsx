import React, {Component, PropTypes} from 'react';

import InputColor from '../ui/input.color';
import InputText from '../ui/input.text';

export default class InspectorShape extends Component {
  constructor(props, context) {
    super(props);
  }

  render() {
    let {
      shape,
      theme
    } = this.props;

    return (
      <div className="inspector-pane inspector-pane-document">
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
            valueChanged={e => this.inputValueChanged(e)} />
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
            valueChanged={e => this.inputValueChanged(e)} />
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
            valueChanged={e => this.inputValueChanged(e)} />
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
            valueChanged={e => this.inputValueChanged(e)} />
        </div>
        <div className="input-container input-container-half">
          <InputColor
            displayName="Fill Color"
            name="fill"
            theme={theme}
            validator='isHexColor'
            value={shape.fill}
            valueChanged={e => this.inputValueChanged(e)} />
        </div>
        <div className="input-container input-container-half">
          <InputColor
            displayName="Stroke Color"
            name="stroke"
            theme={theme}
            validator='isHexColor'
            value={shape.stroke}
            valueChanged={e => this.inputValueChanged(e)} />
        </div>
      </div>
    );
  }

  inputValueChanged(event) {
    let {
      shape,
      updateShape
    } = this.props;

    shape[event.target.name] = event.target.value;
    updateShape(shape);
  }
}
