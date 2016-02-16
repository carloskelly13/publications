import React, {Component, PropTypes} from 'react'

import InputColor from '../ui/input.color'
import InputText from '../ui/input.text'

export default class InspectorShapeColor extends Component {
  render() {
    const {inputValueChanged, shape} = this.props

    return (
      <div className="inspector-content-section">
        <h1>Color</h1>
        <InputColor
          displayName="Fill"
          name="fill"
          style="half left"
          validator='isHexColor'
          value={shape.fill}
          valueChanged={inputValueChanged} />
        <InputColor
          displayName="Border"
          name="stroke"
          style="half right"
          validator='isHexColor'
          value={shape.stroke}
          valueChanged={inputValueChanged} />
        <InputText
          displayName="Fill Opacity"
          name="fillOpacity"
          style="half left"
          type="number"
          validator='isFloat'
          validatorOptions={{step: 0.01, min: 0.0, max: 1.0}}
          value={shape.fillOpacity}
          valueChanged={inputValueChanged} />
        <InputText
          displayName="Border Opacity"
          name="strokeOpacity"
          style="half right"
          type="number"
          validator='isFloat'
          validatorOptions={{step: 0.01, min: 0.0, max: 1.0}}
          value={shape.strokeOpacity}
          valueChanged={inputValueChanged} />
      </div>
    )
  }
}
