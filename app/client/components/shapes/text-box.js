import React from "react"
import { Editor } from "draft-js"

class TextBox extends React.PureComponent {
  render() {
    const {
      shape: { x, y, width, height, editorState, id },
      zoom, dpi, updateSelectedShape, editingTextBoxId
    } = this.props
    const valueForLayout = value => value * dpi * zoom
    return (
      <foreignObject
        x={valueForLayout(x)}
        y={valueForLayout(y)}
        width={valueForLayout(width)}
        height={valueForLayout(height)}
      >
        <Editor
          editorState={editorState}
          onChange={state => updateSelectedShape({ editorState: state })}
          readOnly={!editingTextBoxId !== id}
        />
      </foreignObject>
    )
  }
}

export default TextBox
