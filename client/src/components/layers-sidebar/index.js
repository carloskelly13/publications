// @flow
import type { PubDocument, PubShape } from "../../util/types";
import React from "react";
import "react-motion";
import get from "lodash/get";
import { LayersSidebarContainer, Title } from "./components";
import { LayerItem } from "./layer-item";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { StateContext } from "../../contexts";

type Props = {
  currentDocument: ?PubDocument,
  selectedObject: ?PubShape,
  adjustObjectLayer: (sender: PubShape) => void,
  updateSelectedObject: (sender: ?Object) => void,
};

export const LayersSidebar = ({
  currentDocument,
  selectedObject,
  adjustObjectLayer,
  updateSelectedObject,
}: Props) => (
  <LayersSidebarContainer visible={!!currentDocument}>
    <Title>Layers</Title>
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

export default () => (
  <StateContext.Consumer>
    {({
      actions: { adjustObjectLayer, updateSelectedObject },
      currentDocument,
      selectedObject,
    }) => (
      <LayersSidebar
        adjustObjectLayer={adjustObjectLayer}
        updateSelectedObject={updateSelectedObject}
        currentDocument={currentDocument}
        selectedObject={selectedObject}
      />
    )}
  </StateContext.Consumer>
);
