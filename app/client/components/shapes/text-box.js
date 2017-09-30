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
  box-shadow: ${({ readOnly }) => {
    if (readOnly) {
      return "none"
    }
    return "0 0 0 1px hsla(0, 0%, 0%, 0.5)"
  }};
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
    zoom, dpi, isEditing, onChange
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
        readOnly={!isEditing}
        onChange={({ target }) => onChange({ text: target.value })}
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
