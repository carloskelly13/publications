import React, { createElement } from "react";
import { Rectangle, Ellipse, TextBox } from "../shapes";
import SelectableShape from "../shapes/selectable-shape";
import get from "lodash/get";

const shapeNodes = { text: TextBox, ellipse: Ellipse, rect: Rectangle };

export const renderShapes = props => {
  const {
    sortedShapes,
    dpi,
    zoom,
    editingTextBoxId,
    setEditingTextBox,
    updateSelectedShape,
    allowsEditing,
    selectedShape,
  } = props;

  return sortedShapes.map(shape => {
    let shapeProps = { shape, zoom, dpi };
    if (shape.type === "text") {
      shapeProps = { ...shapeProps, editingTextBoxId, updateSelectedShape };
    }
    const shapeNode = createElement(shapeNodes[shape.type], shapeProps);

    return (
      <SelectableShape
        key={`cs-${shape.id}`}
        dpi={dpi}
        zoom={zoom}
        selectedShapeId={get(selectedShape, "id", null)}
        shape={shape}
        onChange={updateSelectedShape}
        selectable={allowsEditing}
        setEditingTextBox={setEditingTextBox}
        renderShape={shapeNode}
      />
    );
  });
};
