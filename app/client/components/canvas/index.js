import React from "react"
import styled from "styled-components"
import CanvasBackground from "./background"
import { connect } from "react-redux"
import get from "lodash.get"
import {
  selectedShapeSelector, currentDocumentSelector, zoomSelector
} from "../../state/selectors"
import { updateSelectedShape as updateShapeAction } from "../../state/actions/document"

import {
  Rectangle, Ellipse
} from "../shapes"

const CanvasSVG = styled.svg`
  border: 1px solid #a5a5a5;
  margin: 25px 1em 1em 24px;
  overflow: hidden;
`

const renderShape = props => {
  if (props.shape.type === "rect") {
    return <Rectangle {...props} />
  } else if (props.shape.type === "ellipse") {
    return <Ellipse {...props} />
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

const Canvas = ({
  doc, dpi, zoom, allowsEditing, thumbnail, currentDocument
}) => {
  if (thumbnail) {
    zoom = zoomForDocumentSize(doc)
  }

  const isCurrentDocument = get(currentDocument, "id", -1) === doc.id
  const shapes = doc.shapes
    .sort((lhs, rhs) => lhs.z - rhs.z)
    .map((shape, index) => renderShape({
      shape, zoom, dpi, selectable: allowsEditing, key: index
    }))

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
            selectable={allowsEditing}
            doc={doc}
            dpi={dpi}
            zoom={zoom}
          />
        </g>
        <g>{ shapes }</g>
      </CanvasSVG>
    </div>
  )
}

Canvas.defaultProps = {
  dpi: 72,
  allowsEditing: false
}

const mapStateToProps = state => ({
  selectedShape: selectedShapeSelector(state),
  currentDocument: currentDocumentSelector(state),
  zoom: zoomSelector(state)
})

const mapDispatchToProps = {
  updateShape: updateShapeAction
}

export default connect(mapStateToProps, mapDispatchToProps)(Canvas)
