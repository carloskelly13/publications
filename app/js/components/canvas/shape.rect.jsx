import React, {Component} from 'react'

import ShapeFrame from './shape.frame'
import ShapeBase from './shape.base'

export default class ShapeRect extends ShapeBase {
  render() {
    const {
      dpi,
      selectable,
      shape,
      updateShape,
      zoom
    } = this.props

    const shapeFrame = () => super.isShapeSelected() ?
      <ShapeFrame {...this.props} /> : null

    return <g>
      <rect
        onClick={selectable ? this.shapeSelected : null}
        x={shape.x * dpi * zoom}
        y={shape.y * dpi * zoom}
        rx={shape.r * zoom}
        ry={shape.r * zoom}
        width={shape.width * dpi * zoom}
        height={shape.height * dpi * zoom}
        fill={shape.fill}
        stroke={shape.stroke}
        fill-opacity={shape.fillOpacity}
        stroke-opacity={shape.strokeOpacity}
        stroke-width={shape.strokeWidth * zoom}
      />
      {shapeFrame()}
    </g>
  }
}
