// @flow
import type { PubDocument, PubShape } from "../../util/types";
import React from "react";
import "react-motion";
import get from "lodash/get";
import { LayersSidebarContainer, Title } from "./components";
import { LayerItem } from "./layer-item";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { ActionsContext } from "../../contexts";

type Props = {
  visible: boolean,
  currentDocument: ?PubDocument,
  selectedObject: ?PubShape,
};
export default ({ visible, currentDocument, selectedObject }: Props) => (
  <ActionsContext.Consumer>
    {({ adjustObjectLayer, updateSelectedObject }) => (
      <LayersSidebarContainer visible={visible}>
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
    )}
  </ActionsContext.Consumer>
);
