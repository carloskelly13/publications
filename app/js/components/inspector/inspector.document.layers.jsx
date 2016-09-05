import React from 'react'
import InspectorDocumentLayerItem from './inspector.document.layer.item'

export default function InspectorDocumentLayers({
  shapes, updateShape, selectedShape
}) {

  const deselectButton = !!selectedShape ?
    <button
      onClick={() => updateShape(null)}
      className="btn btn--deselect"
    >
      Deselect
    </button> : undefined

  const shapeLayers = shapes
    .sort((lhs, rhs) => lhs.z - rhs.z)
    .map((shape, idx) => (
      <InspectorDocumentLayerItem
        isSelected={shape.id === (selectedShape || {}).id}
        key={`inspector-layer-item-${idx}`}
        shape={shape}
        updateShape={updateShape} />
    ))

  return <div className="inspector-content-section section--layers">
    <h1>
      Layers
      { deselectButton }
    </h1>
    <ul className="inspector-layers">{shapeLayers}</ul>
  </div>
}
