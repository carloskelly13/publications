import React from "react"
import styled from "styled-components"
import { Draggable } from "react-beautiful-dnd"
import LayerInfo from "./layer-info"
import { AppColors } from "../../util/constants"

const getItemStyle = draggableStyle => ({
  userSelect: "none",
  cursor: "move",
  padding: "0 4px",
  ...draggableStyle
})

const backgroundColorForState = ({ isDragging, selected }) => {
  if (isDragging) {
    return "green"
  } else if (selected) {
    return "red"
  }
  return "transparent"
}

const LayerItemContent = styled.div`
  background: ${props => backgroundColorForState(props)};
  padding: 10px 6px;
  border-bottom: 1px dashed ${AppColors.Border};
`

export const LayerItem = ({ shape, handleOnClick, selected }) => (
  <Draggable
    key={shape.id}
    draggableId={shape.id}
  >
    {(provided, snapshot) => (
      <div onClick={handleOnClick}>
        <div
          ref={provided.innerRef}
          style={getItemStyle(provided.draggableStyle)}
          {...provided.dragHandleProps}
        >
          <LayerItemContent
            selected={selected}
            isDragging={snapshot.isDragging}
          >
            <LayerInfo shape={shape} />
          </LayerItemContent>
        </div>
        { provided.placeholder }
      </div>
    )}
  </Draggable>
)
