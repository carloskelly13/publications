import React, {Component, PropTypes} from 'react'

import InputText from '../ui/input.text'

export default class InspectorShapeBorder extends Component {
  render() {
    const {inputValueChanged, shape} = this.props

    return (
      <div className="inspector-content-section">
        <h1>Border</h1>
        <InputText
          displayName="Width"
          name="strokeWidth"
          style="half left"
          type="number"
          unit="pt"
          validator='isInt'
          validatorOptions={{step: 1, min: 0, max: 32}}
          value={shape.strokeWidth}
          valueChanged={inputValueChanged} />
        <InputText
          displayName="Corner Radius"
          name="r"
          style="half right"
          type="number"
          unit="pt"
          validator='isInt'
          validatorOptions={{step: 1, min: 0, max: 100}}
          value={shape.r}
          valueChanged={inputValueChanged} />
      </div>
    )
  }
}
