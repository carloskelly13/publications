import React, {Component} from 'react'

import ShapeFrame from './shape.frame'
import ShapeBase from './shape.base'

export default class ShapeText extends ShapeBase {
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
      <foreignObject
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
      {shapeFrame()}
    </g>
  }
}
