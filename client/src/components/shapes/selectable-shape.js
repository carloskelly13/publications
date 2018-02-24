// @flow
import type { Node } from "react";
import PropTypes from "prop-types";
import React from "react";
import ResizeMoveFrame from "./frame";

type Props = {
  renderShape: Node,
  shape: Object,
  selectedShapeId?: string,
  selectable: boolean,
  setActiveDraftJSEditor: Function,
  zoom: number,
  dpi: number,
};
export default class extends React.Component<Props> {
  static contextTypes = {
    actions: PropTypes.object.isRequired,
  };

  render() {
    const { selectable, shape, renderShape, selectedShapeId } = this.props;
    const isSelected = selectable && selectedShapeId === shape.id;
    const { updateSelectedObject } = this.context.actions;

    return (
      <g onClick={selectable ? () => updateSelectedObject(shape) : null}>
        {renderShape}
        {isSelected && <ResizeMoveFrame {...this.props} />}
      </g>
    );
  }
}
