import React from "react"
import styled from "styled-components"
import { CanvasBackground } from "./background"
import { connect } from "react-redux"
import {
  selectedShapeSelector, zoomSelector, sortedShapesSelector,
  documentMetricsSelector, backgroundGridLineRangesSelector
} from "../../state/selectors"
import {
  updateSelectedShape as updateSelectedShapeAction
} from "../../state/actions/document"

import {
  Rectangle, Ellipse, TextBox
} from "../shapes"

const CanvasSVG = styled.svg`
  border: 1px solid #a5a5a5;
  margin: ${props => {
    if (props.thumbnail) {
      return "0"
    }
    return "25px 1em 1em 24px"
  }};
  overflow: hidden;
`

const renderShape = props => {
  let ShapeComponent
  switch (props.shape.type) {
  case "ellipse":
    ShapeComponent = Ellipse
    break
  case "text":
    ShapeComponent = TextBox
    break
  default:
    ShapeComponent = Rectangle
  }
  return <ShapeComponent {...props} />
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
  dpi, zoom, allowsEditing, thumbnail, isSelected, sortedShapes,
  documentMetrics, updateSelectedShape, backgroundGridLineRanges
}) => {
  if (thumbnail) {
    zoom = zoomForDocumentSize(documentMetrics)
  }

  const shapes = sortedShapes.map((shape, index) => renderShape({
    shape, zoom, dpi, selectable: allowsEditing, key: index
  }))

  return (
    <div
      style={{
        width: `${documentMetrics.width * dpi * zoom}px`,
        height: `${documentMetrics.height * dpi * zoom}px`
      }}
    >
      <CanvasSVG
        thumbnail={thumbnail}
        isSelected={isSelected}
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
        <g>{ shapes }</g>
      </CanvasSVG>
    </div>
  )
}

Canvas.defaultProps = {
  dpi: 72,
  allowsEditing: false,
  isSelected: false
}

const mapStateToProps = state => ({
  selectedShape: selectedShapeSelector(state),
  zoom: zoomSelector(state),
  documentMetrics: documentMetricsSelector(state),
  sortedShapes: sortedShapesSelector(state),
  backgroundGridLineRanges: backgroundGridLineRangesSelector(state)
})

const mapDispatchToProps = {
  updateSelectedShape: updateSelectedShapeAction
}

export default connect(mapStateToProps, mapDispatchToProps)(Canvas)
