import React, { createElement } from "react";
import shapeNodes from "../shapes";
import SelectableShape from "../shapes/selectable-shape";
import getOr from "lodash/fp/getOr";

const getShapeId = getOr("id", null);

export default ({
  sortedShapes,
  dpi,
  zoom,
  updateSelectedShape,
  allowsEditing,
  selectedShape,
  activeDraftJSEditor,
  setActiveDraftJSEditor,
}) => sortedShapes.map(shape => {
  let shapeProps = { shape, zoom, dpi };
  if (shape.type === "text") {
    shapeProps = { ...shapeProps, updateSelectedShape, activeDraftJSEditor };
  }
  const shapeNode = createElement(shapeNodes[shape.type], shapeProps);

  return (
    <SelectableShape
      key={`cs-${shape.id}`}
      dpi={dpi}
      zoom={zoom}
      selectedShapeId={getShapeId(selectedShape)}
      shape={shape}
      onChange={updateSelectedShape}
      setActiveDraftJSEditor={setActiveDraftJSEditor}
      selectable={allowsEditing}
      renderShape={shapeNode}
    />
  );
})
