import React from "react"
import { CanvasBackground } from "./background"
import { Rectangle, Ellipse, TextBox } from "../shapes"
import { CanvasSVG } from "./canvas-svg"

const renderShape = ({ shapeProps, editingTextBoxId }) => {
  const { type } = shapeProps.shape
  if (type === "ellipse") {
    return <Ellipse {...shapeProps} />
  } else if (type === "rect") {
    return <Rectangle {...shapeProps} />
  } else if (type === "text") {
    return (
      <TextBox
        isEditing={editingTextBoxId === shapeProps.shape.id}
        {...shapeProps}
      />
    )
  }
  return null
}

const zoomForDocumentSize = ({ width, height }) => {
  if (width >= 32 || height >= 32) {
    return 0.075
  } if (width >= 15 || height >= 15) {
    return 0.1
  } else if (width >= 10 || height >= 10) {
    return 0.15
  }
  return 0.2
}

export const Canvas = ({
  dpi, zoom, allowsEditing, thumbnail, selected, sortedShapes,
  documentMetrics, updateSelectedShape, backgroundGridLineRanges,
  editingTextBoxId, selectedShape, setEditingTextBox
}) => {
  if (thumbnail) {
    zoom = zoomForDocumentSize(documentMetrics)
  }

  const shapes = sortedShapes.map((shape, index) => renderShape({
    shapeProps: {
      shape, zoom, dpi, selectable: allowsEditing,
      key: index, onChange: updateSelectedShape,
      selectedShape, setEditingTextBox
    },
    editingTextBoxId
  }))

  return (
    <CanvasSVG
      thumbnail={thumbnail}
      selected={selected}
      allowsEditing={allowsEditing}
      width={documentMetrics.width * dpi * zoom}
      height={documentMetrics.height * dpi * zoom}
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
    >
      <g>
        <CanvasBackground
          selectable={allowsEditing}
          width={documentMetrics.width}
          height={documentMetrics.height}
          dpi={dpi}
          zoom={zoom}
          gridLineRanges={backgroundGridLineRanges}
          handleBackgroundClicked={() => updateSelectedShape(null)}
        />
      </g>
      <g>{shapes}</g>
    </CanvasSVG>
  )
}

Canvas.defaultProps = {
  dpi: 72,
  allowsEditing: false,
  isSelected: false
}

export default Canvas
