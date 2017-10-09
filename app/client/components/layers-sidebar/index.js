import React from "react"
import { connect } from "react-redux"
import { LayersSidebarContainer } from "./container"
import { LayerItem } from "./layer-item"
import {
  sortedShapesSelector, selectedShapeSelector, updateSelectedShape
} from "../../modules/document"
import { DragDropContext, Droppable } from "react-beautiful-dnd"
import "react-motion"
import get from "lodash.get"

export const LayersSidebar = ({
  visible, shapes, moveShapeLayer, updateSelectedShape, selectedShape
}) => (
  <LayersSidebarContainer visible={visible}>
    <DragDropContext onDragEnd={moveShapeLayer}>
      <Droppable droppableId="droppable">
        {provided => (
          <div ref={provided.innerRef}>
            {shapes.map(shape => (
              <LayerItem
                selected={shape.id === get(selectedShape, "id")}
                handleOnClick={() => updateSelectedShape(shape)}
                shape={shape}
                key={shape.id}
              />
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  </LayersSidebarContainer>
)

export default connect(
  state => ({
    shapes: sortedShapesSelector(state),
    selectedShape: selectedShapeSelector(state)
  }), {
    moveShapeLayer: () => {},
    updateSelectedShape
  })(LayersSidebar)
