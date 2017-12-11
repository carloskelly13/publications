import React from "react";
import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";
import LayerInfo from "./layer-info";
import { AppColors } from "../../util/constants";

const getItemStyle = draggableStyle => ({
  userSelect: "none",
  cursor: "move",
  padding: "0",
  ...draggableStyle,
});

const backgroundColorForState = ({ selected }) => {
  if (selected) {
    return AppColors.ActiveDark;
  }
  return "transparent";
};

const LayerItemContent = styled.div`
  background: ${props => backgroundColorForState(props)};
  padding: 10px 6px;
  border-bottom: 1px solid ${AppColors.Border};
`;

export const LayerItem = ({ shape, handleOnClick, selected }) => (
  <Draggable key={shape.id} draggableId={shape.id}>
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
            <LayerInfo shape={shape} selected={selected} />
          </LayerItemContent>
        </div>
        {provided.placeholder}
      </div>
    )}
  </Draggable>
);
