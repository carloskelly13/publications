// @flow
import React from "react"
import ResizeMoveFrame from "./frame"
import get from "lodash.get"

type Props = {
  renderShape: React.Node,
  shape: Object,
  selectedShape?: Object,
  selectable: boolean,
  setEditingTextBox: Function,
  onChange: Function,
  zoom: number,
  dpi: number
}
export default (props: Props) => {
  const { selectable, shape, onChange, renderShape } = props
  const isSelected = selectable &&
    get(props, "selectedShape.id", -1) === shape.id

  return (
    <g
      onClick={selectable ? () => onChange(shape) : null}
    >
      {renderShape}
      {isSelected && <ResizeMoveFrame {...props} />}
    </g>
  )
}
