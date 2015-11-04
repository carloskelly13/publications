import React, {Component} from 'react';

import ShapeFrame from './shape.frame';
import ShapeBase from './shape.base';

export default class ShapeRect extends ShapeBase {
  render() {
    let {
      dpi,
      selectable,
      shape,
      updateShape,
      zoom
    } = this.props,
    shapeFrame;

    if (super.isShapeSelected()) {
      shapeFrame = (
        <ShapeFrame {...this.props} />
      );
    }

    return (
      <g>
        <rect
          onClick={selectable ? this.shapeSelected : null}
          x={shape.x * dpi * zoom} y={shape.y * dpi * zoom}
          rx={shape.r * zoom} ry={shape.r * zoom}
          width={shape.width * dpi * zoom} height={shape.height * dpi * zoom}
          fill={shape.fill} stroke={shape.stroke}
          fillOpacity={shape.fillOpacity} strokeOpacity={shape.strokeOpacity}
          strokeWidth={shape.strokeWidth * zoom}
        />
        {shapeFrame}
      </g>
    );
  }
}
