import React, {Component, PropTypes} from 'react'

import InputText from '../ui/input.text'
import InputNumber from 'components/ui/input.number'

export default class InspectorShapeMetrics extends Component {
  render() {
    const {inputValueChanged, shape} = this.props

    return (
      <div className="inspector-content-section">
        <h1>Metrics</h1>
        <InputText
          displayName="X"
          name="x"
          style="half left"
          type="number"
          unit="in"
          validator='isFloat'
          validatorOptions={{step: 0.05, min: -64.0, max: 64.0}}
          value={shape.x}
          valueChanged={inputValueChanged} />
        <InputNumber
          displayName="X"
          property="x"
          validatorOptions={{step: 0.05, min: -64.0, max: 64.0}}
          value={shape.x}
          valueChanged={inputValueChanged}
         />
        <InputText
          displayName="Y"
          name="y"
          style="half right"
          type="number"
          unit="in"
          validator='isFloat'
          validatorOptions={{step: 0.05, min: -64.0, max: 64.0}}
          value={shape.y}
          valueChanged={inputValueChanged} />
        <InputText
          displayName="Width"
          name="width"
          style="half left"
          type="number"
          unit="in"
          validator='isFloat'
          validatorOptions={{step: 0.05, min: 1.0, max: 64.0}}
          value={shape.width}
          valueChanged={inputValueChanged} />
        <InputText
          displayName="Height"
          name="height"
          style="half right"
          type="number"
          unit="in"
          validator='isFloat'
          validatorOptions={{step: 0.05, min: 1.0, max: 64.0}}
          value={shape.height}
          valueChanged={inputValueChanged} />
      </div>
    )
  }
}
