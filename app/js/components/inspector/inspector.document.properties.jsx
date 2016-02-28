import React, {Component, PropTypes} from 'react'

import InputText from 'components/ui/input.text'
import InputFloat from 'components/ui/input.float'

export default class InspectorDocumentProperties extends Component {
  constructor() {
    super(...arguments)
  }

  shouldComponentUpdate(nextProps) {
    const {doc} = this.props
    const shouldUpdate =
      doc.width !== nextProps.doc.width ||
      doc.height !== nextProps.doc.height ||
      doc.name !== nextProps.doc.name

    return shouldUpdate
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
          value={doc.name}
          valueChanged={inputValueChanged} />
        <InputFloat
          displayName="Width"
          property="width"
          style="half left"
          unit="in"
          validatorOptions={{step: 0.25, min: 1.0, max: 64.0}}
          value={doc.width}
          valueChanged={inputValueChanged} />
        <InputFloat
          displayName="Height"
          property="height"
          style="half right"
          unit="in"
          validatorOptions={{step: 0.25, min: 1.0, max: 64.0}}
          value={doc.height}
          valueChanged={inputValueChanged} />
      </div>
    )
  }
}
