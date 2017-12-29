import React from "react";
import { LayersSidebarContainer } from "./container";
import { LayerItem } from "./layer-item";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import "react-motion";
import get from "lodash/get";

export default ({
  visible,
  currentDocument,
  adjustObjectLayer,
  updateSelectedObject,
  selectedObject,
}) => (
  <LayersSidebarContainer visible={visible}>
    <DragDropContext onDragEnd={adjustObjectLayer}>
      <Droppable droppableId="droppable">
        {provided => (
          <div ref={provided.innerRef}>
            {currentDocument &&
              currentDocument.shapes.map(shape => (
                <LayerItem
                  selected={shape.id === get(selectedObject, "id")}
                  handleOnClick={() => updateSelectedObject(shape)}
                  shape={shape}
                  key={shape.id}
                />
              ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  </LayersSidebarContainer>
);
