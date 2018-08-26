import React from "react";
import shapeNodes from "../shapes";
import SelectableShape from "../shapes/selectable-shape";
import get from "lodash/fp/get";
import { PubShape } from "../../types/pub-objects";

const getShapeId = get("id");

interface Props {
  sortedShapes: Array<PubShape>;
  dpi: number;
  zoom: number;
  allowsEditing: boolean;
  selectedShape: PubShape | null;
  activeDraftJSEditor: string | null;
  setActiveDraftJSEditor(id: string | null): void;
  updateSelectedObject(sender: Object | null): void;
}

interface ShapeProps {
  shape: PubShape;
  zoom: number;
  dpi: number;
  activeDraftJSEditor?: string | null;
  updateSelectedObject?(sender?: Object | null): void;
}

const Shapes: React.StatelessComponent<Props> = props => {
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
  return (
    <>
      {sortedShapes.map(shape => {
        let shapeProps: ShapeProps = { shape, zoom, dpi };
        if (shape.type === "text") {
          shapeProps = {
            ...shapeProps,
            activeDraftJSEditor,
            updateSelectedObject,
          };
        }
        const shapeNode = React.createElement(
          shapeNodes[shape.type],
          shapeProps
        );
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
      })}
    </>
  );
};

export default Shapes;
