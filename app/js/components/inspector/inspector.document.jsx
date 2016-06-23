import React, { Component, PropTypes } from 'react'
import { autobind } from 'core-decorators'
import { isFloat } from 'validator'

import InspectorDocumentProperties from './inspector.document.properties'
import InspectorDocumentLayers from './inspector.document.layers'
import InspectorDocumentAdd from './inspector.document.add'

export default class InspectorDocument extends Component {
  render() {
    return <div className="inspector-pane inspector-pane-document">
      <InspectorDocumentAdd
        addNewShape={this.props.addNewShape} />
      <InspectorDocumentProperties
        inputValueChanged={this.inputValueChanged}
        doc={this.props.doc} />
      <InspectorDocumentLayers
        selectedShape={this.props.shape}
        inputValueChanged={this.inputValueChanged}
        updateShape={this.props.updateShape}
        shapes={this.props.doc.shapes} />
    </div>
  }

  @autobind
  inputValueChanged(event) {
    const {updateDocument} = this.props

    let value = event.target.value

    if (isFloat(value)) {
      value = parseFloat(parseFloat(value).toFixed(2))
    }

    let delta = {}
    delta[event.target.name] = value

    updateDocument(delta)
  }
}
