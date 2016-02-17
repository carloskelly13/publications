import React, {Component, PropTypes} from 'react';
import InspectorDocumentLayerItem from './inspector.document.layer.item';

export default class InspectorDocumentLayers extends Component {
  constructor(props, context) {
    super(props);
  }

  render() {
    const {
      doc,
      inputValueChanged,
      theme,
      updateSelectedCanvasObject
    } = this.props

    const shapes = doc.shapes.sort((lhs, rhs) => lhs.z - rhs.z)

    const shapeLayers = shapes.map((shape, idx) => <InspectorDocumentLayerItem
      isSelected={shape === this.props.selectedShape}
      key={`inspector-layer-item-${idx}`}
      shape={shape}
      updateSelectedCanvasObject={updateSelectedCanvasObject}/>)

    return (
      <div className="inspector-content-section">
        <h1>Layers</h1>
        <ul className="inspector-layers">{shapeLayers}</ul>
      </div>
    )
  }
}
