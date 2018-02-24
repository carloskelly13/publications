import React from "react";
import shapeNodes from "../shapes";
import SelectableShape from "../shapes/selectable-shape";
import get from "lodash/fp/get";

const getShapeId = get("id");

export default ({
  sortedShapes,
  dpi,
  zoom,
  allowsEditing,
  selectedShape,
  activeDraftJSEditor,
}) =>
  sortedShapes.map(shape => {
    let shapeProps = { shape, zoom, dpi };
    if (shape.type === "text") {
      shapeProps = { ...shapeProps, activeDraftJSEditor };
    }
    const shapeNode = React.createElement(shapeNodes[shape.type], shapeProps);

    return (
      <SelectableShape
        key={`cs-${shape.id}`}
        dpi={dpi}
        zoom={zoom}
        selectedShapeId={getShapeId(selectedShape)}
        shape={shape}
        selectable={allowsEditing}
        renderShape={shapeNode}
      />
    );
  });
