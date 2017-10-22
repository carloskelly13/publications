import React from "react"
import { Editor } from "draft-js"

class TextBox extends React.PureComponent {
  render() {
    const {
      shape, zoom, dpi, updateSelectedShape, editingTextBoxId
    } = this.props

    const readOnly = editingTextBoxId !== shape.id
    const metrics = {
      x: dpi * shape.x,
      y: dpi * shape.y,
      width: dpi * 1 * shape.width,
      height: dpi * 1 * shape.height
    }
    const transform = `scale(${zoom})`

    return (
      <g>
        {!readOnly && (
          <rect
            {...metrics}
            strokeWidth={1}
            stroke="hsla(0, 0%, 0%, 0.5)"
            fill="transparent"
            style={{ transform }}
          />
        )}
        <foreignObject
          {...metrics}
          style={{ transform }}
        >
          <Editor
            editorState={shape.editorState}
            onChange={state => updateSelectedShape({ editorState: state })}
            readOnly={readOnly}
          />
        </foreignObject>
      </g>
    )
  }
}

export default TextBox
