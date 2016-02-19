import React, {Component, PropTypes} from 'react'
import {eq} from 'lodash'
import {autobind} from 'core-decorators'

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
        updateSelectedCanvasObject={this.props.updateSelectedCanvasObject}
        shapes={this.props.doc.shapes} />
    </div>
  }

  @autobind
  inputValueChanged(event) {
    const {updateDocument} = this.props

    let delta = {}
    delta[event.target.name] = event.target.value

    updateDocument(delta)
  }
}
