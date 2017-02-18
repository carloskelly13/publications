import React from "react"
import styled from "styled-components"
import CanvasBackground from "./canvas.background"
import ShapeEllipse from "./shape.ellipse"
import ShapeRect from "./shape.rect"
import ShapeText from "./shape.text"
import { appColor } from "../../core/constants"

const CanvasContainer = styled.div`
  overflow: ${
    ({ isThumbnail }) => isThumbnail ? "inherit" : "scroll"
  };
  position: ${
    ({ isThumbnail }) => isThumbnail ? "relative" : "absolute"
  };
  top: ${
    ({ isThumbnail }) => isThumbnail ? "0" : "40px"
  };
  bottom: 0;
  left: 0;
  right: 0;
  margin: ${
    ({ isThumbnail }) => isThumbnail ? "auto" : "0 280px 15px 0"
  };
`

const CanvasSVG = styled.svg`
  border: ${
    ({ selected }) => selected ? `1px solid ${appColor}` : "1px solid #bbb"
  };
  box-shadow: ${
    ({ selected }) => selected ? `0 0 0 3px ${appColor}` : ""
  };
  margin: ${
    ({ selectable }) => selectable ? "26px 15px 15px 25px" : "0"
  };
  border-radius: ${
    ({ selectable }) => selectable ? "0" : "4px"
  };
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

const Canvas = ({
  doc, dpi = 72, selectedShape, zoom, updateShape,
  selected = false,
  allowsEditing = false
}) => {
  const shapeProps = {
    selectedShapeId: !!selectedShape ? selectedShape.id : -1,
    dpi,
    selectable: allowsEditing,
    updateShape,
    zoom
  }
  return (
    <CanvasContainer
      isThumbnail={!allowsEditing}
      id="svg-canvas-container"
    >
      <CanvasSVG
        selectable={allowsEditing}
        selected={selected}
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
    </CanvasContainer>
  )
}

export default Canvas
