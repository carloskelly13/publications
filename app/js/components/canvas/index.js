import React, { PropTypes } from "react"
import styled from "styled-components"
import CanvasBackground from "./canvas.background"
import ShapeEllipse from "./shape.ellipse"
import ShapeRect from "./shape.rect"
import ShapeText from "./shape.text"
import { connect } from "react-redux"
import get from "lodash.get"
import {
  selectedShapeSelector, currentDocumentSelector
} from "../../selectors"
import { updateSelectedShape as updateShapeAction } from "../../actions/document"

const CanvasSVG = styled.svg`
  border: 1px solid #a5a5a5;
  margin: 25px 1em 1em 25px;
  overflow: hidden;
`

const shapeElements = (shapeProps, doc) => doc.shapes
  .sort((lhs, rhs) => lhs.z - rhs.z)
  .map((shape, idx) => {
    switch (shape.type) {
      case "rect":
        return <ShapeRect {...shapeProps} key={idx} shape={shape} />

      case "ellipse":
        return <ShapeEllipse {...shapeProps} key={idx} shape={shape} />

      case "text":
        return <ShapeText {...shapeProps} key={idx} shape={shape} />

      default: return null
    }
  })

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

const Canvas = ({
  doc, dpi, zoom, selectedShape, updateShape, selected,
  allowsEditing, thumbnail, currentDocument
}) => {
  if (thumbnail) {
    zoom = zoomForDocumentSize(doc)
  }

  const shapeProps = {
    selectedShapeId: !!selectedShape ? selectedShape.id : -1,
    dpi,
    selectable: allowsEditing,
    updateShape,
    zoom
  }

  const isCurrentDocument = get(currentDocument, "id", -1) === doc.id

  return (
    <div
      style={{
        width: `${doc.width * dpi * zoom}px`,
        height: `${doc.height * dpi * zoom}px`
      }}
    >
      <CanvasSVG
        currentDocument={isCurrentDocument}
        allowsEditing={allowsEditing}
        width={doc.width * dpi * zoom}
        height={doc.height * dpi * zoom}
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
      >
        <g>
          <CanvasBackground
            updateShape={updateShape}
            selectable={allowsEditing}
            doc={doc}
            dpi={dpi}
            zoom={zoom}
          />
        </g>
        <g>{ shapeElements(shapeProps, doc) }</g>
      </CanvasSVG>
    </div>
  )
}

Canvas.propTypes = {
  doc: PropTypes.object.isRequired,
  thumbnail: PropTypes.bool
}

Canvas.defaultProps = {
  zoom: 1.0,
  dpi: 72,
  allowsEditing: false
}

const mapStateToProps = state => ({
  selectedShape: selectedShapeSelector(state),
  currentDocument: currentDocumentSelector(state)
})

const mapDispatchToProps = {
  updateShape: updateShapeAction
}

export default connect(mapStateToProps, mapDispatchToProps)(Canvas)
