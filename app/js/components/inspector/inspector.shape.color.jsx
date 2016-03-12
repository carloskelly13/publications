import React, { Component } from 'react'

import InputColor from 'components/ui/input.color'
import InputText from 'components/ui/input.text'
import InputFloat from 'components/ui/input.float'

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
        <InputFloat
          displayName="Fill Opacity"
          property="fillOpacity"
          style="half left"
          validatorOptions={{step: 0.01, min: 0.0, max: 1.0}}
          value={shape.fillOpacity}
          valueChanged={inputValueChanged} />
        <InputFloat
          displayName="Border Opacity"
          property="strokeOpacity"
          style="half right"
          validatorOptions={{step: 0.01, min: 0.0, max: 1.0}}
          value={shape.strokeOpacity}
          valueChanged={inputValueChanged} />
      </div>
    )
  }
}
