import React, {Component, PropTypes} from 'react'

import InputFloat from 'components/ui/input.float'

export default class InspectorShapeMetrics extends Component {
  render() {
    const {inputValueChanged, shape} = this.props

    return (
      <div className="inspector-content-section">
        <h1>Metrics</h1>
        <InputFloat
          displayName="X"
          property="x"
          style="half left"
          unit="in"
          validatorOptions={{step: 0.05, min: -64.0, max: 64.0}}
          value={shape.x}
          valueChanged={inputValueChanged} />
        <InputFloat
          displayName="Y"
          property="y"
          style="half right"
          unit="in"
          validatorOptions={{step: 0.05, min: -64.0, max: 64.0}}
          value={shape.y}
          valueChanged={inputValueChanged} />
        <InputFloat
          displayName="Width"
          property="width"
          style="half left"
          unit="in"
          validatorOptions={{step: 0.05, min: 1.0, max: 64.0}}
          value={shape.width}
          valueChanged={inputValueChanged} />
        <InputFloat
          displayName="Height"
          property="height"
          style="half right"
          unit="in"
          validatorOptions={{step: 0.05, min: 1.0, max: 64.0}}
          value={shape.height}
          valueChanged={inputValueChanged} />
      </div>
    )
  }
}
