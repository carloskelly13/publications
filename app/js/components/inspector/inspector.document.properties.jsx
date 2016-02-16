import React, {Component, PropTypes} from 'react'

import InputText from '../ui/input.text'

export default class InspectorDocumentProperties extends Component {
  constructor(props, context) {
    super(props)
  }

  render() {
    const {doc, inputValueChanged} = this.props

    return (
      <div className="inspector-content-section">
        <h1>Properties</h1>
        <InputText
          displayName="Name"
          name="name"
          style="full"
          validator='isLength'
          validatorOptions={1}
          value={doc.get('name')}
          valueChanged={inputValueChanged} />
        <InputText
          displayName="Width"
          name="width"
          style="half left"
          type="number"
          unit="in"
          validator='isFloat'
          validatorOptions={{step: 0.25, min: 1.0, max: 64.0}}
          value={doc.get('width')}
          valueChanged={inputValueChanged} />
        <InputText
          displayName="Height"
          name="height"
          style="half right"
          type="number"
          unit="in"
          validator='isFloat'
          validatorOptions={{step: 0.25, min: 1.0, max: 64.0}}
          value={doc.get('height')}
          valueChanged={inputValueChanged} />
      </div>
    )
  }
}
