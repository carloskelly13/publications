import React from "react";
import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";
import LayerInfo from "./layer-info";
import { Colors } from "../../util/constants";

const getItemStyle = draggableStyle => ({
  userSelect: "none",
  cursor: "move",
  padding: "0",
  ...draggableStyle,
});

const backgroundColorForState = (selected: boolean): string => {
  if (selected) {
    return Colors.LayersSidebar.ItemSelectedBackground;
  }
  return "transparent";
};

const LayerItemInnerContainer = styled.div`
  &:hover {
    background: hsla(0, 0%, 100%, 0.1);
  }
`;

const LayerItemContainer = styled.div`
  border-top: 1px ${Colors.LayersSidebar.ItemBorder} solid;

  &:last-child {
    border-bottom: 1px ${Colors.LayersSidebar.ItemBorder} solid;
  }
`;

const LayerItemContent = styled.div<{ selected: boolean; isDragging: boolean }>`
  background: ${props => backgroundColorForState(props.selected)};
  padding: 3px 0;
`;

export const LayerItem = ({ shape, handleOnClick, selected }) => (
  <Draggable key={shape.id} draggableId={shape.id}>
    {(provided, snapshot) => (
      <LayerItemContainer onClick={handleOnClick}>
        <LayerItemInnerContainer
          innerRef={provided.innerRef}
          style={getItemStyle(provided.draggableStyle)}
          {...provided.dragHandleProps}
        >
          <LayerItemContent
            selected={selected}
            isDragging={snapshot.isDragging}
          >
            <LayerInfo shape={shape} selected={selected} />
          </LayerItemContent>
        </LayerItemInnerContainer>
        {provided.placeholder}
      </LayerItemContainer>
    )}
  </Draggable>
);
