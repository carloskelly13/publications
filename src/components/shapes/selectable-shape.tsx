import React from "react";
// import ResizeMoveFrame from "./frame";
import { PubShape } from "../../types/pub-objects";
import ShapeFrame from "./shape-frame";

interface SelectableShapeProps {
  renderShape: React.ReactNode;
  shape: PubShape;
  selectedShapeId?: string;
  selectable: boolean;
  zoom: number;
  dpi: number;
  updateSelectedObject(sender: PubShape | null): void;
  setActiveDraftJSEditor(id: string | null): void;
}

const SelectableShape: React.SFC<SelectableShapeProps> = props => {
  const {
    selectable,
    shape,
    renderShape,
    selectedShapeId,
    updateSelectedObject,
    dpi,
    setActiveDraftJSEditor,
    zoom,
  } = props;
  const isSelected = selectable && shape && selectedShapeId === shape.id;
  return (
    <g onClick={selectable ? () => updateSelectedObject(shape) : undefined}>
      <>
        {renderShape}
        {isSelected && shape && (
          <ShapeFrame
            dpi={dpi}
            zoom={zoom}
            updateSelectedObject={updateSelectedObject}
            shape={shape}
          />
        )}
      </>
    </g>
  );
};

export default SelectableShape;
