import React, {Component, PropTypes} from 'react';
import InspectorDocumentLayerItem from './inspector.document.layer.item';

export default class InspectorDocumentLayers extends Component {
  constructor(props, context) {
    super(props);
  }

  render() {
    let {
      doc,
      inputValueChanged,
      theme,
      updateSelectedCanvasObject
    } = this.props;

    let shapes = doc.get('shapes');

    return (
      <div className="inspector-content-section">
        <h1>Layers</h1>
        <ul className="inspector-layers">
          { shapes.map((shape, idx) => <InspectorDocumentLayerItem
            key={`inspector-layer-item-${idx}`}
            shape={shape}
            updateSelectedCanvasObject={updateSelectedCanvasObject}/>) }
        </ul>
      </div>
    );
  }
}
