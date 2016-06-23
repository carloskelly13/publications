import React, { Component, PropTypes } from 'react'
import InspectorDocumentLayerItem from './inspector.document.layer.item'

export default class InspectorDocumentLayers extends Component {
  render() {
    const {
      shapes,
      inputValueChanged,
      theme,
      updateShape
    } = this.props

    const shapeLayers = shapes
      .sort((lhs, rhs) => lhs.z - rhs.z)
      .map((shape, idx) => (
        <InspectorDocumentLayerItem
          isSelected={shape.id === (this.props.selectedShape || {}).id}
          key={`inspector-layer-item-${idx}`}
          shape={shape}
          updateShape={updateShape}/>
      ))

    return <div className="inspector-content-section">
      <h1>Layers</h1>
      <ul className="inspector-layers">{shapeLayers}</ul>
    </div>
  }
}
