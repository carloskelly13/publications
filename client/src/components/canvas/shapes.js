// @flow
import * as React from "react";
import shapeNodes from "../shapes";
import SelectableShape from "../shapes/selectable-shape";
import get from "lodash/fp/get";
import type { PubShape } from "../../util/types";

const getShapeId = get("id");

type Props = {
  sortedShapes: PubShape[],
  dpi: number,
  zoom: number,
  allowsEditing: boolean,
  selectedShape: ?PubShape,
  activeDraftJSEditor: ?string,
  setActiveDraftJSEditor: (id: string | null) => void,
  updateSelectedObject: (sender: ?Object) => void,
};

const Shapes: React.ComponentType<Props> = props => {
  const {
    sortedShapes,
    dpi,
    zoom,
    allowsEditing,
    selectedShape,
    setActiveDraftJSEditor,
    activeDraftJSEditor,
    updateSelectedObject,
  } = props;
  return sortedShapes.map(shape => {
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
        setActiveDraftJSEditor={setActiveDraftJSEditor}
        updateSelectedObject={updateSelectedObject}
      />
    );
  });
};

export default Shapes;
