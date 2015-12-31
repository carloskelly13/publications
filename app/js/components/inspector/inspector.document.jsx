import React, {Component, PropTypes} from 'react'

import InspectorDocumentProperties from './inspector.document.properties'
import InspectorDocumentLayers from './inspector.document.layers'
import InspectorDocumentAdd from './inspector.document.add'

export default class InspectorDocument extends Component {
  render() {
    return (
      <div className="inspector-pane inspector-pane-document">
        <InspectorDocumentAdd
          addNewShape={this.props.addNewShape}
        />
        <InspectorDocumentProperties
          inputValueChanged={::this.inputValueChanged}
          {...this.props}
        />
        <InspectorDocumentLayers
          selectedShape={this.props.shape}
          inputValueChanged={::this.inputValueChanged}
          updateSelectedCanvasObject={this.props.updateSelectedCanvasObject}
          {...this.props}
        />
      </div>
    );
  }

  inputValueChanged(event) {
    const {doc, updateDocument} = this.props
    updateDocument(doc.set(event.target.name, event.target.value))
  }
}
