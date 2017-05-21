import React from "react"
import styled from "styled-components"
import selectable from "./selectable"

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

const TextBox = props => {
  const {
    shape: {
      x, y, width, height, color, text, fontSize,
      fontFamily, fontStyle, fontWeight, textAlign
    },
    zoom, dpi
  } = props
  const valueForLayout = value => value * dpi * zoom
  return (
    <foreignObject
      x={valueForLayout(x)}
      y={valueForLayout(y)}
      width={valueForLayout(width)}
      height={valueForLayout(height)}
    >
      <TextArea
        readOnly
        onChange={null}
        value={text}
        style={{
          color,
          fontFamily,
          fontStyle,
          fontSize: `${fontSize * zoom}px`,
          fontWeight,
          textAlign
        }}
      />
    </foreignObject>
  )
}

export default selectable(TextBox)
