import React from 'react'
import shapeFrame from 'decorators/shapeFrame'
import ShapeBase from 'components/canvas/shape.base'

export default class ShapeRect extends ShapeBase {

  @shapeFrame
  render() {
    const { dpi, selectable, shape, updateShape, zoom } = this.props

    return <rect
      onClick={selectable ? this.shapeSelected : null}
      x={shape.x * dpi * zoom}
      y={shape.y * dpi * zoom}
      rx={shape.r * zoom}
      ry={shape.r * zoom}
      width={shape.width * dpi * zoom}
      height={shape.height * dpi * zoom}
      fill={shape.fill}
      stroke={shape.stroke}
      fillOpacity={shape.fillOpacity}
      strokeOpacity={shape.strokeOpacity}
      strokeWidth={shape.strokeWidth * zoom} />
  }
}
