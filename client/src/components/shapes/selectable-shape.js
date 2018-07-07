// @flow
import * as React from "react";
import ResizeMoveFrame from "./frame";
import type { PubShape } from "../../util/types";

type Props = {
  renderShape: React.Node,
  shape: ?PubShape,
  selectedShapeId?: string,
  selectable: boolean,
  zoom: number,
  dpi: number,
  updateSelectedObject: (sender: ?Object) => void,
  setActiveDraftJSEditor: (id: string | null) => void,
};

const SelectableShape: React.ComponentType<Props> = props => {
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
    <g onClick={selectable ? () => updateSelectedObject(shape) : null}>
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
