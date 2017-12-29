// @flow
import React from "react";
import ResizeMoveFrame from "./frame";

type Props = {
  renderShape: React.Node,
  shape: Object,
  selectedShapeId?: string,
  selectable: boolean,
  setActiveDraftJSEditor: Function,
  onChange: Function,
  zoom: number,
  dpi: number,
};
export default (props: Props) => {
  const { selectable, shape, onChange, renderShape, selectedShapeId } = props;
  const isSelected = selectable && selectedShapeId === shape.id;

  return (
    <g onClick={selectable ? () => onChange(shape) : null}>
      {renderShape}
      {isSelected && <ResizeMoveFrame {...props} />}
    </g>
  );
};
