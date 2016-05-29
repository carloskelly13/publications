import React, { Component } from 'react'
import shapeFrame from 'decorators/shapeFrame'
import ShapeBase from 'components/canvas/shape.base'

export default class ShapeText extends ShapeBase {

  @shapeFrame
  render() {
    const { dpi, selectable, shape, updateShape, zoom } = this.props

    return <foreignObject
      onClick={selectable ? this.shapeSelected : null}
      x={shape.x * dpi * zoom} y={shape.y * dpi * zoom}
      width={shape.width * dpi * zoom} height={shape.height * dpi * zoom}>

      <textarea
        readOnly
        onChange={null}
        value={shape.text}
        className="shape-frame-textarea shape-frame-textarea-no-edit"
        style={{
          color: shape.color,
          fontFamily: shape.fontFamily,
          fontStyle: shape.fontStyle,
          fontSize: `${shape.fontSize * zoom}px`,
          fontWeight: shape.fontWeight,
          textAlign: shape.textAlign
        }} />

    </foreignObject>
  }
}
