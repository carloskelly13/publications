import React from "react";
import get from "lodash/get";
import { LayersSidebarContainer, Title } from "./components";
import { LayerItem } from "./layer-item";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { StateContext } from "../../contexts";
import { PubDocument, PubShape } from "../../types/pub-objects";
import { LayerMutationDelta } from "../documents/editor-actions";

interface Props {
  currentDocument: PubDocument | null;
  selectedObject: PubShape | null;
  adjustObjectLayer: (sender: LayerMutationDelta) => void;
  updateSelectedObject: (sender: Object | null) => void;
}

export const LayersSidebar: React.SFC<Props> = ({
  currentDocument,
  selectedObject,
  adjustObjectLayer,
  updateSelectedObject,
}) => (
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
