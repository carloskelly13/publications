import React from "react";
import PropTypes from "prop-types";
import { LayersSidebarContainer } from "./container";
import { LayerItem } from "./layer-item";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import "react-motion";
import get from "lodash/get";

export default class extends React.Component {
  static contextTypes = {
    actions: PropTypes.object.isRequired,
  };

  render() {
    const { visible, currentDocument, selectedObject } = this.props;
    const { adjustObjectLayer, updateSelectedObject } = this.context.actions;
    return (
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
  }
}
