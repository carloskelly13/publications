import React from 'react'

import CanvasBackground from './canvas.background'
import ShapeEllipse from './shape.ellipse'
import ShapeRect from './shape.rect'
import ShapeText from './shape.text'

const shapeElements = (shapeProps, doc) => doc.shapes
  .sort((lhs, rhs) => lhs.z - rhs.z)
  .map((shape, idx) => {
    switch (shape.type) {
      case 'rect':
        return <ShapeRect {...shapeProps} key={idx} shape={shape} />

      case 'ellipse':
        return <ShapeEllipse {...shapeProps} key={idx} shape={shape} />

      case 'text':
        return <ShapeText {...shapeProps} key={idx} shape={shape} />

      default:
        return undefined
    }
  })

const Canvas = ({
  doc, dpi, selectable, selectedShape, showInspector, zoom, updateShape
}) => {
  const canvasSelectors = `
      canvas-container ${showInspector ? 'canvas-container-expanded' : ''}
      ${selectable ? '' : 'canvas-no-select'}
    `

  const shapeProps = {
    selectedShapeId: !!selectedShape ? selectedShape.id : -1,
    dpi,
    selectable,
    updateShape,
    zoom
  }

  return <div
    id="svg-canvas-container"
    className={canvasSelectors}>
    <svg
      width={doc.width * dpi * zoom}
      height={doc.height * dpi * zoom}
      className="canvas-svg"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1">
      <g>
        <CanvasBackground
          updateShape={updateShape}
          selectable={selectable}
          doc={doc}
          dpi={dpi}
          zoom={zoom} />
      </g>
      <g>{ shapeElements(shapeProps, doc) }</g>
    </svg>
  </div>
}

export default Canvas
