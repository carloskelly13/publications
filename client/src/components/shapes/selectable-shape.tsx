import React from "react";
import ResizeMoveFrame from "./frame";
import { IPubShape } from "../../types/pub-objects";

interface IProps {
  renderShape: React.ReactNode;
  shape?: IPubShape;
  selectedShapeId?: string;
  selectable: boolean;
  zoom: number;
  dpi: number;
  updateSelectedObject(sender?: IPubShape): void;
  setActiveDraftJSEditor(id: string | null): void;
}

const SelectableShape: React.StatelessComponent<IProps> = props => {
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
        {isSelected &&
          shape && (
            <ResizeMoveFrame
              dpi={dpi}
              zoom={zoom}
              renderShape={renderShape}
              selectable={selectable}
              selectedShapeId={selectedShapeId}
              setActiveDraftJSEditor={setActiveDraftJSEditor}
              updateSelectedObject={updateSelectedObject}
              shape={shape}
            />
          )}
      </>
    </g>
  );
};

export default SelectableShape;
