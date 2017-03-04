import React, { Component } from 'react'
import shapeFrame from 'decorators/shapeFrame'
import ShapeBase from 'components/canvas/shape.base'
import styled from "styled-components"

const TextArea = styled.textarea`
  height: 100%;
  resize: none;
  width: 100%;
  padding: 0;
  margin: 0;
  border: none;
  user-select: none;
  outline: none;
  background: transparent;
`

export default class ShapeText extends ShapeBase {

  @shapeFrame
  render() {
    const { dpi, selectable, shape, updateShape, zoom } = this.props

    return <foreignObject
      onClick={selectable ? this.shapeSelected : null}
      x={shape.x * dpi * zoom} y={shape.y * dpi * zoom}
      width={shape.width * dpi * zoom} height={shape.height * dpi * zoom}>

      <TextArea
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
