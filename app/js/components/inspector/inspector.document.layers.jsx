import React, {Component, PropTypes} from 'react'
import {eq} from 'lodash'
import InspectorDocumentLayerItem from './inspector.document.layer.item'

export default class InspectorDocumentLayers extends Component {
  constructor(props, context) {
    super(props)
  }

  render() {
    const {
      shapes,
      inputValueChanged,
      theme,
      updateSelectedCanvasObject
    } = this.props

    const shapeLayers = shapes
      .sort((lhs, rhs) => lhs.z - rhs.z)
      .map((shape, idx) => (
        <InspectorDocumentLayerItem
          isSelected={shape.id === (this.props.selectedShape || {}).id}
          key={`inspector-layer-item-${idx}`}
          shape={shape}
          updateSelectedCanvasObject={updateSelectedCanvasObject}/>
      ))

    return (
      <div className="inspector-content-section">
        <h1>Layers</h1>
        <ul className="inspector-layers">{shapeLayers}</ul>
      </div>
    )
  }
}
