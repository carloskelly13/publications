import React, {Component} from 'react'
import {omit} from 'lodash'

import CanvasBackground from './canvas.background'
import ShapeEllipse from './shape.ellipse'
import ShapeRect from './shape.rect'
import ShapeText from './shape.text'

export default class Canvas extends Component {
  render() {
    const { doc, dpi, selectable, selectedShape, showInspector, zoom } = this.props

    const canvasSelectors = `
      canvas-container ${showInspector ? 'canvas-container-expanded' : ''}
      ${selectable ? '' : 'canvas-no-select'}
    `

    const shapeProps = {
      selectedShapeId: !!selectedShape ? selectedShape.id : -1,
      dpi,
      selectable,
      updateShape: this.props.updateShape,
      updateSelectedCanvasObject: this.props.updateSelectedCanvasObject,
      zoom
    }

    const shapeElements = doc.shapes
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
          return <g key={idx} />
        }
      })

    return <div
      id="svg-canvas-container"
      className={canvasSelectors}>
      <svg
        width={doc.width * dpi * zoom}
        height={doc.height * dpi * zoom}
        class="canvas-svg"
        xmlns="http://www.w3.org/2000/svg"
        version="1.1">
        <g><CanvasBackground {...this.props} /></g>
        <g>{shapeElements}</g>
      </svg>
    </div>
  }
}
