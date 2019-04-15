import * as React from "react";
import get from "lodash/get";
import { LayerItem } from "./layer-item";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { StateContext } from "../../contexts/documents-provider";

export default function LayersTab() {
  const {
    actions: { adjustObjectLayer, updateSelectedObject },
    currentDocument,
    selectedObject,
  } = React.useContext(StateContext);
  return (
    <DragDropContext onDragEnd={adjustObjectLayer}>
      <Droppable droppableId="droppable">
        {provided => (
          <div ref={provided.innerRef}>
            {currentDocument &&
              currentDocument.pages[0].shapes.map(shape => (
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
  );
}
