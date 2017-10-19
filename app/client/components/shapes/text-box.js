import React from "react"
import { Editor } from "draft-js"
import selectable from "./selectable"

class TextBox extends React.PureComponent {
  render() {
    const {
      shape: { x, y, width, height, editorState },
      zoom, dpi, onChange, isEditing
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
          onChange={state => onChange({ editorState: state })}
          readOnly={!isEditing}
        />
      </foreignObject>
    )
  }
}

export default selectable(TextBox)
